// services/freeSpeechRecognition.ts
/**
 * 完全免费的语音识别方案
 * 使用浏览器原生 Web Speech API
 * 支持 Chrome、Edge、Safari
 * 无需 API Key，完全免费
 */

export interface RecognitionResult {
  success: boolean;
  text: string;
  error?: string;
  isFinal: boolean;
}

export class FreeSpeechRecognition {
  private recognition: any = null;
  private isSupported: boolean = false;
  private isListening: boolean = false;
  private finalTranscript: string = '';
  private interimTranscript: string = '';
  
  // 回调函数
  private onResultCallback?: (result: RecognitionResult) => void;
  private onErrorCallback?: (error: string) => void;
  private onEndCallback?: () => void;

  constructor() {
    // 检查浏览器支持
    const SpeechRecognition = 
      (window as any).SpeechRecognition || 
      (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      this.isSupported = true;
      this.recognition = new SpeechRecognition();
      this.setupRecognition();
    } else {
      console.warn('浏览器不支持 Web Speech API');
    }
  }

  private setupRecognition() {
    if (!this.recognition) return;

    // 配置识别参数
    this.recognition.lang = 'zh-CN'; // 中文识别
    this.recognition.continuous = true; // 持续识别
    this.recognition.interimResults = true; // 显示临时结果
    this.recognition.maxAlternatives = 1; // 只要最佳结果

    // 识别结果事件
    this.recognition.onresult = (event: any) => {
      this.interimTranscript = '';
      
      // 处理所有识别结果
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        const confidence = event.results[i][0].confidence;
        
        if (event.results[i].isFinal) {
          // 最终结果
          this.finalTranscript += transcript;
          console.log('最终识别:', transcript, '置信度:', confidence);
          
          if (this.onResultCallback) {
            this.onResultCallback({
              success: true,
              text: this.finalTranscript.trim(),
              isFinal: true
            });
          }
        } else {
          // 临时结果（实时显示）
          this.interimTranscript += transcript;
          
          if (this.onResultCallback) {
            this.onResultCallback({
              success: true,
              text: (this.finalTranscript + this.interimTranscript).trim(),
              isFinal: false
            });
          }
        }
      }
    };

    // 错误事件
    this.recognition.onerror = (event: any) => {
      console.error('语音识别错误:', event.error);
      
      let errorMessage = '识别失败';
      switch (event.error) {
        case 'no-speech':
          errorMessage = '没有检测到语音，请重试';
          break;
        case 'audio-capture':
          errorMessage = '无法访问麦克风';
          break;
        case 'not-allowed':
          errorMessage = '麦克风权限被拒绝';
          break;
        case 'network':
          errorMessage = '网络错误，请检查网络连接';
          break;
        case 'aborted':
          errorMessage = '识别被中止';
          break;
        default:
          errorMessage = `识别错误: ${event.error}`;
      }
      
      if (this.onErrorCallback) {
        this.onErrorCallback(errorMessage);
      }
    };

    // 识别结束事件
    this.recognition.onend = () => {
      console.log('识别结束');
      this.isListening = false;
      
      if (this.onEndCallback) {
        this.onEndCallback();
      }
    };

    // 识别开始事件
    this.recognition.onstart = () => {
      console.log('开始识别');
      this.isListening = true;
      this.finalTranscript = '';
      this.interimTranscript = '';
    };
  }

  /**
   * 开始识别
   */
  public start(
    onResult: (result: RecognitionResult) => void,
    onError?: (error: string) => void,
    onEnd?: () => void
  ): boolean {
    if (!this.isSupported) {
      const error = '您的浏览器不支持语音识别，请使用 Chrome、Edge 或 Safari';
      if (onError) onError(error);
      return false;
    }

    if (this.isListening) {
      console.warn('已经在识别中');
      return false;
    }

    this.onResultCallback = onResult;
    this.onErrorCallback = onError;
    this.onEndCallback = onEnd;

    try {
      this.recognition.start();
      return true;
    } catch (error) {
      console.error('启动识别失败:', error);
      if (onError) onError('启动识别失败');
      return false;
    }
  }

  /**
   * 停止识别
   */
  public stop(): string {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
    return this.finalTranscript.trim();
  }

  /**
   * 中止识别
   */
  public abort() {
    if (this.recognition && this.isListening) {
      this.recognition.abort();
      this.isListening = false;
    }
  }

  /**
   * 检查是否支持
   */
  public static isSupported(): boolean {
    return !!(
      (window as any).SpeechRecognition || 
      (window as any).webkitSpeechRecognition
    );
  }

  /**
   * 获取当前识别文本
   */
  public getCurrentText(): string {
    return (this.finalTranscript + this.interimTranscript).trim();
  }

  /**
   * 检查是否正在识别
   */
  public isRecognizing(): boolean {
    return this.isListening;
  }
}

/**
 * 简化的一次性识别函数
 */
export async function recognizeSpeech(
  timeoutSeconds: number = 10
): Promise<RecognitionResult> {
  return new Promise((resolve) => {
    if (!FreeSpeechRecognition.isSupported()) {
      resolve({
        success: false,
        text: '',
        error: '浏览器不支持语音识别，请使用 Chrome、Edge 或 Safari',
        isFinal: true
      });
      return;
    }

    const recognition = new FreeSpeechRecognition();
    let finalResult = '';
    let timeoutId: NodeJS.Timeout;

    // 设置超时
    timeoutId = setTimeout(() => {
      const text = recognition.stop();
      if (text) {
        resolve({
          success: true,
          text,
          isFinal: true
        });
      } else {
        resolve({
          success: false,
          text: '',
          error: '识别超时，未检测到语音',
          isFinal: true
        });
      }
    }, timeoutSeconds * 1000);

    recognition.start(
      (result) => {
        if (result.isFinal && result.text) {
          finalResult = result.text;
        }
      },
      (error) => {
        clearTimeout(timeoutId);
        resolve({
          success: false,
          text: '',
          error,
          isFinal: true
        });
      },
      () => {
        clearTimeout(timeoutId);
        if (finalResult) {
          resolve({
            success: true,
            text: finalResult,
            isFinal: true
          });
        } else {
          resolve({
            success: false,
            text: '',
            error: '未识别到语音内容',
            isFinal: true
          });
        }
      }
    );
  });
}
