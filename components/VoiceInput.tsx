import React, { useState, useRef, useEffect } from 'react';
import { WebSpeechRecognition } from '../services/webSpeechService';

interface Props {
  onComplete: (text: string) => void;
  isProcessing: boolean;
  placeholder?: string;
}

export const VoiceInput: React.FC<Props> = ({ 
  onComplete, 
  isProcessing,
  placeholder = '点击开始录音' 
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [interimText, setInterimText] = useState('');
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
    // 检查浏览器支持
    const support = WebSpeechRecognition.checkSupport();
    setBrowserSupport(support);

    return () => {
      // 清理
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
    setRecognizedText('');
    setInterimText('');
    setDuration(0);

    recognitionRef.current = new WebSpeechRecognition({
      lang: 'zh-CN',
      continuous: true,
      interimResults: true
    });

    const started = recognitionRef.current.start(
      (result) => {
        // 实时更新识别结果
        if (result.isFinal) {
          setRecognizedText(result.text);
          setInterimText('');
        } else {
          // 分离最终文本和临时文本
          const words = result.text.split(' ');
          if (words.length > 1) {
            setRecognizedText(words.slice(0, -1).join(' '));
            setInterimText(words[words.length - 1]);
          } else {
            setInterimText(result.text);
          }
        }
      },
      (errorMsg) => {
        setError(errorMsg);
        setIsRecording(false);
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      },
      (finalText) => {
        setIsRecording(false);
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      },
      () => {
        setIsRecording(true);
        // 启动计时器
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

      if (finalText && finalText.trim().length > 0) {
        onComplete(finalText);
      } else {
        setError('未识别到语音内容，请重试');
      }
    }
  };

  const retryRecording = () => {
    setRecognizedText('');
    setInterimText('');
    setError(null);
  };

  // 浏览器不支持
  if (!browserSupport.supported) {
    return (
      <div className="flex flex-col items-center gap-4 py-8 w-full">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg max-w-lg w-full">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div className="flex-1">
              <p className="font-bold text-red-900 mb-1">浏览器不支持语音识别</p>
              <p className="text-sm text-red-700 mb-3">
                当前浏览器：<span className="font-semibold">{browserSupport.browser}</span>
              </p>
              <div className="bg-white p-3 rounded border border-red-200">
                <p className="font-semibold text-gray-900 text-sm mb-2">💡 解决方案：</p>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                  <li><strong>推荐：</strong>使用 Google Chrome 浏览器</li>
                  <li>使用 Microsoft Edge 浏览器</li>
                  <li>使用 Safari 浏览器（Mac/iOS）</li>
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
      {error && (
        <div className="w-full max-w-lg bg-orange-50 border-l-4 border-orange-500 p-3 rounded-lg animate-fadeIn">
          <div className="flex items-center justify-between">
            <p className="text-sm text-orange-800 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </p>
            <button 
              onClick={retryRecording}
              className="text-xs text-orange-700 hover:text-orange-900 font-medium"
            >
              重试
            </button>
          </div>
        </div>
      )}

      {/* 识别结果显示 */}
      {(recognizedText || interimText || isRecording) && (
        <div className="w-full max-w-lg bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-5 shadow-lg animate-fadeIn">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-sm font-bold text-blue-900">识别结果</span>
            {isRecording && (
              <span className="ml-auto flex items-center gap-1 text-xs text-blue-600">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                录音中
              </span>
            )}
          </div>
          
          <div className="bg-white p-4 rounded-lg border-2 border-blue-100 min-h-[80px] relative">
            <p className="text-gray-900 text-lg leading-relaxed">
              {recognizedText || placeholder}
              {interimText && (
                <span className="text-gray-400 italic"> {interimText}</span>
              )}
              {isRecording && (
                <span className="inline-block w-0.5 h-6 bg-blue-600 animate-pulse ml-1 align-middle"></span>
              )}
            </p>
          </div>
          
          {!isRecording && recognizedText && (
            <div className="flex items-center justify-between mt-3 text-xs text-gray-600">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                识别完成
              </span>
              <span>{recognizedText.length} 字符</span>
            </div>
          )}
        </div>
      )}

      {/* 录音控制按钮 */}
      <div className="flex flex-col items-center gap-3">
        {!isRecording ? (
          <button
            onClick={startRecording}
            disabled={isProcessing}
            className={`flex items-center gap-3 px-10 py-5 rounded-2xl font-bold transition-all text-lg shadow-xl ${
              isProcessing 
                ? 'bg-gray-300 cursor-not-allowed text-gray-500' 
                : 'bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 hover:from-blue-600 hover:via-blue-700 hover:to-indigo-700 text-white hover:shadow-2xl hover:scale-105'
            }`}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
            <span>{recognizedText ? '重新录音' : '开始录音'}</span>
          </button>
        ) : (
          <div className="flex flex-col items-center gap-4">
            {/* 录音波形动画 */}
            <div className="flex items-end gap-1.5 h-20">
              {[...Array(7)].map((_, i) => (
                <div
                  key={i}
                  className="w-2.5 bg-gradient-to-t from-red-500 to-red-400 rounded-full"
                  style={{
                    height: `${30 + Math.sin(Date.now() / 200 + i) * 25}px`,
                    animation: `pulse ${0.5 + i * 0.1}s ease-in-out infinite alternate`,
                  }}
                />
              ))}
            </div>

            {/* 录音信息 */}
            <div className="text-center bg-red-50 px-6 py-3 rounded-full border-2 border-red-200">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-xl font-bold text-red-600">
                    {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}
                  </span>
                </div>
                <span className="text-sm text-red-700 border-l-2 border-red-300 pl-3">
                  请清晰说话
                </span>
              </div>
            </div>

            {/* 停止按钮 */}
            <button
              onClick={stopRecording}
              className="flex items-center gap-3 px-10 py-5 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold shadow-xl transition-all text-lg hover:scale-105"
            >
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="6" width="12" height="12" rx="2" />
              </svg>
              <span>停止录音</span>
            </button>
          </div>
        )}
      </div>

      {/* 使用说明 */}
      <div className="max-w-lg w-full">
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1 text-sm text-gray-700">
              <p className="font-semibold mb-2 text-gray-900">💡 使用提示</p>
              <ul className="space-y-1.5 text-xs leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">1.</span>
                  <span>点击"开始录音"后即可说话，识别结果会实时显示</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">2.</span>
                  <span>说完后点击"停止录音"，系统自动评分</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">3.</span>
                  <span>如识别不准确可点击"重新录音"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">4.</span>
                  <span>建议：安静环境 + 清晰发音 + 标准普通话</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 免费标识 */}
      <div className="flex items-center gap-2 text-xs text-green-600 font-medium bg-green-50 px-4 py-2 rounded-full border border-green-200">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <span>完全免费 · 浏览器原生支持 · 无需 API Key</span>
      </div>
    </div>
  );
};

export default VoiceInput;
