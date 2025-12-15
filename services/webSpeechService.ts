// services/webSpeechService.ts
/**
 * 基于浏览器原生 Web Speech API 的语音识别服务
 * 完全免费，无需任何 API Key
 * 支持 Chrome、Edge、Safari
 */

export interface SpeechRecognitionResult {
  success: boolean;
  text: string;
  confidence: number;
  isFinal: boolean;
  error?: string;
}

export interface SpeechRecognitionOptions {
  lang?: string;              // 语言代码，默认 'zh-CN'
  continuous?: boolean;       // 是否连续识别
  interimResults?: boolean;   // 是否返回临时结果
  maxAlternatives?: number;   // 最大备选结果数
}

/**
 * 语音识别管理器
 */
export class WebSpeechRecognition {
  private recognition: any = null;
  private isSupported: boolean = false;
  private isRecognizing: boolean = false;
  private finalTranscript: string = '';
  private interimTranscript: string = '';
  
  // 事件回调
  private onResultCallback?: (result: SpeechRecognitionResult) => void;
  private onErrorCallback?: (error: string) => void;
  private onEndCallback?: (finalText: string) => void;
  private onStartCallback?: () => void;

  constructor(options: SpeechRecognitionOptions = {}) {
    // 检查浏览器支持
    const SpeechRecognition = 
      (window as any).SpeechRecognition || 
      (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.warn('浏览器不支持 Web Speech API');
      this.isSupported = false;
      return;
    }

    this.isSupported = true;
    this.recognition = new SpeechRecognition();
    
    // 配置识别参数
    this.recognition.lang = options.lang || 'zh-CN';
    this.recognition.continuous = options.continuous !== false;
    this.recognition.interimResults = options.interimResults !== false;
    this.recognition.maxAlternatives = options.maxAlternatives || 1;

    this.setupEventHandlers();
  }

  /**
   * 设置事件处理器
   */
  private setupEventHandlers() {
    if (!this.recognition) return;

    // 识别开始
    this.recognition.onstart = () => {
      console.log('🎤 语音识别已启动');
      this.isRecognizing = true;
      this.finalTranscript = '';
      this.interimTranscript = '';
      
      if (this.onStartCallback) {
        this.onStartCallback();
      }
    };

    // 识别结果
    this.recognition.onresult = (event: any) => {
      this.interimTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript;
        const confidence = result[0].confidence;

        if (result.isFinal) {
          // 最终结果
          this.finalTranscript += transcript;
          console.log('✅ 最终识别:', transcript, '置信度:', confidence);
          
          if (this.onResultCallback) {
            this.onResultCallback({
              success: true,
              text: this.finalTranscript.trim(),
              confidence: confidence,
              isFinal: true
            });
          }
        } else {
          // 临时结果
          this.interimTranscript += transcript;
          
          if (this.onResultCallback) {
            this.onResultCallback({
              success: true,
              text: (this.finalTranscript + this.interimTranscript).trim(),
              confidence: confidence,
              isFinal: false
            });
          }
        }
      }
    };

    // 识别错误
    this.recognition.onerror = (event: any) => {
      console.error('❌ 识别错误:', event.error);
      
      let errorMessage = '语音识别失败';
      
      switch (event.error) {
        case 'no-speech':
          errorMessage = '没有检测到语音，请重试';
          break;
        case 'audio-capture':
          errorMessage = '无法访问麦克风';
          break;
        case 'not-allowed':
          errorMessage = '麦克风权限被拒绝，请在浏览器设置中允许';
          break;
        case 'network':
          errorMessage = '网络错误，请检查网络连接';
          break;
        case 'aborted':
          errorMessage = '识别已中止';
          break;
        case 'service-not-allowed':
          errorMessage = '语音识别服务不可用';
          break;
        default:
          errorMessage = `识别错误: ${event.error}`;
      }
      
      if (this.onErrorCallback) {
        this.onErrorCallback(errorMessage);
      }
    };

    // 识别结束
    this.recognition.onend = () => {
      console.log('🛑 语音识别已结束');
      this.isRecognizing = false;
      
      if (this.onEndCallback) {
        this.onEndCallback(this.finalTranscript.trim());
      }
    };

    // 音频开始
    this.recognition.onaudiostart = () => {
      console.log('🎙️ 音频捕获开始');
    };

    // 音频结束
    this.recognition.onaudioend = () => {
      console.log('🎙️ 音频捕获结束');
    };

    // 语音开始
    this.recognition.onspeechstart = () => {
      console.log('🗣️ 检测到语音');
    };

    // 语音结束
    this.recognition.onspeechend = () => {
      console.log('🗣️ 语音结束');
    };
  }

  /**
   * 开始识别
   */
  public start(
    onResult?: (result: SpeechRecognitionResult) => void,
    onError?: (error: string) => void,
    onEnd?: (finalText: string) => void,
    onStart?: () => void
  ): boolean {
    if (!this.isSupported) {
      const error = '浏览器不支持语音识别，请使用 Chrome、Edge 或 Safari';
      if (onError) onError(error);
      return false;
    }

    if (this.isRecognizing) {
      console.warn('⚠️ 正在识别中，无法重复启动');
      return false;
    }

    this.onResultCallback = onResult;
    this.onErrorCallback = onError;
    this.onEndCallback = onEnd;
    this.onStartCallback = onStart;

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
    if (this.recognition && this.isRecognizing) {
      this.recognition.stop();
    }
    return this.finalTranscript.trim();
  }

  /**
   * 中止识别
   */
  public abort() {
    if (this.recognition && this.isRecognizing) {
      this.recognition.abort();
      this.isRecognizing = false;
    }
  }

  /**
   * 获取当前识别的完整文本
   */
  public getCurrentText(): string {
    return (this.finalTranscript + this.interimTranscript).trim();
  }

  /**
   * 检查是否正在识别
   */
  public isActive(): boolean {
    return this.isRecognizing;
  }

  /**
   * 检查浏览器是否支持
   */
  public static checkSupport(): { 
    supported: boolean; 
    browser: string;
    message: string;
  } {
    const SpeechRecognition = 
      (window as any).SpeechRecognition || 
      (window as any).webkitSpeechRecognition;
    
    const userAgent = navigator.userAgent;
    let browser = 'Unknown';
    
    if (userAgent.includes('Chrome')) browser = 'Chrome';
    else if (userAgent.includes('Safari')) browser = 'Safari';
    else if (userAgent.includes('Edge')) browser = 'Edge';
    else if (userAgent.includes('Firefox')) browser = 'Firefox';
    
    if (SpeechRecognition) {
      return {
        supported: true,
        browser,
        message: `✅ ${browser} 支持语音识别`
      };
    } else {
      return {
        supported: false,
        browser,
        message: `❌ ${browser} 不支持语音识别，建议使用 Chrome 或 Edge`
      };
    }
  }
}

/**
 * 简化的一次性识别函数
 */
export async function recognizeSpeech(
  timeoutSeconds: number = 10,
  lang: string = 'zh-CN'
): Promise<SpeechRecognitionResult> {
  return new Promise((resolve) => {
    const recognition = new WebSpeechRecognition({ lang });
    let finalResult = '';
    let hasResult = false;
    let timeoutId: NodeJS.Timeout;

    // 设置超时
    timeoutId = setTimeout(() => {
      const text = recognition.stop();
      if (text) {
        resolve({
          success: true,
          text,
          confidence: 1.0,
          isFinal: true
        });
      } else {
        resolve({
          success: false,
          text: '',
          confidence: 0,
          isFinal: true,
          error: '识别超时，未检测到语音'
        });
      }
    }, timeoutSeconds * 1000);

    recognition.start(
      (result) => {
        if (result.isFinal && result.text) {
          finalResult = result.text;
          hasResult = true;
        }
      },
      (error) => {
        clearTimeout(timeoutId);
        resolve({
          success: false,
          text: '',
          confidence: 0,
          isFinal: true,
          error
        });
      },
      (text) => {
        clearTimeout(timeoutId);
        if (text || hasResult) {
          resolve({
            success: true,
            text: text || finalResult,
            confidence: 1.0,
            isFinal: true
          });
        } else {
          resolve({
            success: false,
            text: '',
            confidence: 0,
            isFinal: true,
            error: '未识别到语音内容'
          });
        }
      }
    );
  });
}
