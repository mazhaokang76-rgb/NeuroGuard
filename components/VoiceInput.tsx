import React, { useState, useRef, useEffect } from 'react';
import { WebSpeechRecognition } from '../services/webSpeechService';

interface Props {
  onComplete: (text: string) => void;
  isProcessing: boolean;
}

export const VoiceInput: React.FC<Props> = ({ onComplete, isProcessing }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedText, setRecordedText] = useState('');
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

  const startRecording = () => {
    setError(null);
    setRecordedText('');
    setDuration(0);

    recognitionRef.current = new WebSpeechRecognition({
      lang: 'zh-CN',
      continuous: true,
      interimResults: false  // 不显示临时结果，保持简洁
    });

    const started = recognitionRef.current.start(
      (result) => {
        // 只保存最终结果
        if (result.isFinal && result.text) {
          setRecordedText(result.text);
        }
      },
      (errorMsg) => {
        console.error('识别错误:', errorMsg);
        setError(errorMsg);
        setIsRecording(false);
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      },
      () => {
        setIsRecording(false);
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      },
      () => {
        setIsRecording(true);
        timerRef.current = setInterval(() => {
          setDuration(prev => prev + 1);
        }, 1000);
      }
    );

    if (!started) {
      setError('启动录音失败');
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      const finalText = recognitionRef.current.stop();
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      // 使用已记录的文本或最终文本
      const textToSubmit = recordedText || finalText;

      if (textToSubmit && textToSubmit.trim().length > 0) {
        console.log('识别结果:', textToSubmit);
        // 立即提交，不等待用户确认
        onComplete(textToSubmit);
      } else {
        setError('未识别到语音内容');
        setIsRecording(false);
      }
    }
  };

  const retryRecording = () => {
    setRecordedText('');
    setError(null);
    startRecording();
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
                当前浏览器：<span className="font-semibold">{browserSupport.browser}</span>
              </p>
              <div className="bg-white p-2 rounded text-xs">
                <p className="font-semibold text-gray-900 mb-1">解决方案：</p>
                <ul className="list-disc list-inside space-y-0.5 text-gray-700">
                  <li>使用 Chrome 浏览器（推荐）</li>
                  <li>使用 Edge 或 Safari</li>
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
      {/* 错误提示 - 精简版 */}
      {error && (
        <div className="w-full max-w-md bg-orange-50 border border-orange-300 p-3 rounded-lg">
          <div className="flex items-center justify-between">
            <p className="text-sm text-orange-800">{error}</p>
            <button 
              onClick={retryRecording}
              className="text-xs text-orange-700 hover:text-orange-900 font-medium underline"
            >
              重试
            </button>
          </div>
        </div>
      )}

      {/* 录音控制 */}
      {!isRecording ? (
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
          
          {/* 仅在有错误或重新录音时显示提示 */}
          {!error && (
            <p className="text-xs text-gray-500">点击按钮后请清晰说出答案</p>
          )}
        </div>
      ) : (
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

          {/* 停止按钮 */}
          <button
            onClick={stopRecording}
            className="flex items-center gap-2 px-8 py-4 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold shadow-lg transition-all"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="6" width="12" height="12" rx="2" />
            </svg>
            <span>停止录音</span>
          </button>
          
          <p className="text-xs text-gray-600">说完后请点击"停止录音"</p>
        </div>
      )}
    </div>
  );
};

export default VoiceInput;
