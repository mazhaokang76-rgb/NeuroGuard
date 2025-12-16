import React, { useState, useRef, useEffect } from 'react';
import { WebSpeechRecognition } from '../services/webSpeechService';

interface Props {
  onComplete: (text: string) => void;
  isProcessing: boolean;
}

export const VoiceInput: React.FC<Props> = ({ onComplete, isProcessing }) => {
  // 三个状态：idle(初始), recording(录音中), completed(录音完成)
  const [stage, setStage] = useState<'idle' | 'recording' | 'completed'>('idle');
  const [recognizedText, setRecognizedText] = useState('');
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [browserSupport, setBrowserSupport] = useState<{
    supported: boolean;
    browser: string;
    message: string;
  }>({ supported: true, browser: '', message: '' });

  const recognitionRef = useRef<WebSpeechRecognition | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const support = WebSpeechRecognition.checkSupport();
    setBrowserSupport(support);

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // 开始录音
  const startRecording = () => {
    setError(null);
    setRecognizedText('');
    setDuration(0);
    setStage('recording');

    recognitionRef.current = new WebSpeechRecognition({
      lang: 'zh-CN',
      continuous: true,
      interimResults: false
    });

    const started = recognitionRef.current.start(
      (result) => {
        // 保存最终识别结果
        if (result.isFinal && result.text) {
          console.log('🎤 识别到文本:', result.text);
          setRecognizedText(result.text);
        }
      },
      (errorMsg) => {
        console.error('❌ 识别错误:', errorMsg);
        setError(errorMsg);
        setStage('idle');
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      },
      (finalText) => {
        // 录音自然结束
        console.log('🎤 录音结束，最终文本:', finalText);
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
        if (finalText && finalText.trim()) {
          setRecognizedText(finalText);
          setStage('completed');
        } else {
          setError('未识别到语音内容');
          setStage('idle');
        }
      },
      () => {
        // 录音开始
        console.log('🎤 开始录音');
        timerRef.current = setInterval(() => {
          setDuration(prev => prev + 1);
        }, 1000);
      }
    );

    if (!started) {
      setError('启动录音失败');
      setStage('idle');
    }
  };

  // 停止录音
  const stopRecording = () => {
    console.log('🛑 用户停止录音');
    if (recognitionRef.current) {
      const finalText = recognitionRef.current.stop();
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      console.log('🎤 停止后获取的文本:', finalText);
      console.log('🎤 当前已识别文本:', recognizedText);

      // 使用已识别的文本或最终文本
      const textToUse = recognizedText || finalText;

      if (textToUse && textToUse.trim().length > 0) {
        setRecognizedText(textToUse);
        setStage('completed');
        console.log('✅ 录音完成，等待用户确认');
      } else {
        setError('未识别到语音内容，请重试');
        setStage('idle');
      }
    }
  };

  // 重新录音
  const retry = () => {
    console.log('🔄 重新录音');
    setRecognizedText('');
    setError(null);
    setStage('idle');
    // 立即开始新的录音
    setTimeout(() => startRecording(), 100);
  };

  // 确认提交
  const confirm = () => {
    console.log('✅ 用户确认提交:', recognizedText);
    if (recognizedText && recognizedText.trim()) {
      onComplete(recognizedText.trim());
    } else {
      setError('识别结果为空，请重新录音');
      setStage('idle');
    }
  };

  // 浏览器不支持
  if (!browserSupport.supported) {
    return (
      <div className="flex flex-col items-center gap-4 py-6 w-full">
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg max-w-md w-full">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div className="flex-1">
              <p className="font-semibold text-red-900 text-sm mb-2">浏览器不支持语音识别</p>
              <p className="text-xs text-red-700 mb-2">
                当前：{browserSupport.browser}
              </p>
              <div className="bg-white p-2 rounded text-xs">
                <p className="font-semibold mb-1">请使用：</p>
                <ul className="list-disc list-inside space-y-0.5">
                  <li>Chrome 浏览器（推荐）</li>
                  <li>Edge 或 Safari</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 py-4 w-full">
      {/* 错误提示 */}
      {error && stage === 'idle' && (
        <div className="w-full max-w-md bg-orange-50 border border-orange-300 p-3 rounded-lg">
          <p className="text-sm text-orange-800">{error}</p>
        </div>
      )}

      {/* 阶段1: 初始状态 - 显示"开始录音"按钮 */}
      {stage === 'idle' && (
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={startRecording}
            disabled={isProcessing}
            className={`flex items-center gap-3 px-8 py-4 rounded-xl font-bold transition-all text-base shadow-lg ${
              isProcessing 
                ? 'bg-gray-300 cursor-not-allowed text-gray-500' 
                : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-xl'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
            <span>开始录音</span>
          </button>
          <p className="text-xs text-gray-500">点击按钮后开始说话</p>
        </div>
      )}

      {/* 阶段2: 录音中 - 显示"停止录音"按钮 */}
      {stage === 'recording' && (
        <div className="flex flex-col items-center gap-4">
          {/* 录音动画 */}
          <div className="flex items-center gap-2 h-12">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-2 bg-red-500 rounded-full animate-pulse"
                style={{
                  height: `${20 + (i % 2) * 15}px`,
                  animationDelay: `${i * 0.15}s`,
                  animationDuration: '0.8s'
                }}
              />
            ))}
          </div>

          {/* 录音时长 */}
          <div className="flex items-center gap-2 bg-red-50 px-4 py-2 rounded-full border border-red-200">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-base font-bold text-red-600">
              {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}
            </span>
          </div>

          {/* 停止录音按钮 */}
          <button
            onClick={stopRecording}
            className="flex items-center gap-2 px-8 py-4 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold shadow-lg transition-all"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="6" width="12" height="12" rx="2" />
            </svg>
            <span>停止录音</span>
          </button>
          
          <p className="text-xs text-gray-600">说完后点击"停止录音"</p>
        </div>
      )}

      {/* 阶段3: 录音完成 - 显示识别结果、重试和确认按钮 */}
      {stage === 'completed' && (
        <div className="flex flex-col items-center gap-4 w-full max-w-md">
          {/* 识别结果显示 */}
          <div className="w-full bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-5 shadow-lg">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-bold text-green-900">识别结果</span>
            </div>
            
            <div className="bg-white p-4 rounded-lg border-2 border-green-100">
              <p className="text-gray-900 text-xl font-medium text-center">
                {recognizedText}
              </p>
            </div>
            
            <div className="flex items-center justify-center mt-3 text-xs text-gray-600">
              <span>{recognizedText.length} 字符</span>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-3 w-full">
            {/* 重试按钮 */}
            <button
              onClick={retry}
              disabled={isProcessing}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all border-2 ${
                isProcessing
                  ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
                  : 'bg-white border-orange-300 text-orange-600 hover:bg-orange-50 hover:border-orange-400'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>重试</span>
            </button>

            {/* 确认按钮 */}
            <button
              onClick={confirm}
              disabled={isProcessing}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-lg ${
                isProcessing
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 text-white hover:shadow-xl'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>确认</span>
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            如识别不准确请点击"重试"，确认无误后点击"确认"
          </p>
        </div>
      )}
    </div>
  );
};

export default VoiceInput;
