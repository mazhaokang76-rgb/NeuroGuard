import React, { useState, useRef, useEffect } from 'react';
import { FreeSpeechRecognition } from '../services/freeSpeechRecognition';

interface Props {
  onRecordingComplete: (text: string) => void;
  isProcessing: boolean;
}

export const RealtimeVoiceRecorder: React.FC<Props> = ({ onRecordingComplete, isProcessing }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [interimText, setInterimText] = useState('');
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);

  const recognitionRef = useRef<FreeSpeechRecognition | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // 检查浏览器支持
    setIsSupported(FreeSpeechRecognition.isSupported());
    
    if (!FreeSpeechRecognition.isSupported()) {
      setError('您的浏览器不支持语音识别。请使用 Chrome、Edge 或 Safari 浏览器。');
    }

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
    setRecognizedText('');
    setInterimText('');
    setDuration(0);

    recognitionRef.current = new FreeSpeechRecognition();

    const started = recognitionRef.current.start(
      (result) => {
        // 实时更新识别结果
        if (result.isFinal) {
          setRecognizedText(result.text);
          setInterimText('');
        } else {
          // 显示临时结果（灰色）
          const final = result.text.split(' ').slice(0, -1).join(' ');
          const interim = result.text.split(' ').slice(-1)[0] || '';
          setRecognizedText(final);
          setInterimText(interim);
        }
      },
      (errorMsg) => {
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
      }
    );

    if (started) {
      setIsRecording(true);
      
      // 启动计时器
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      const finalText = recognitionRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      if (finalText && finalText.trim().length > 0) {
        onRecordingComplete(finalText);
      } else {
        setError('未识别到语音内容，请重试');
      }
    }
  };

  if (!isSupported) {
    return (
      <div className="flex flex-col items-center gap-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded max-w-md">
          <div className="flex items-center gap-3 mb-3">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="font-bold text-red-900">浏览器不支持</p>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
          <div className="bg-white p-3 rounded border border-red-200 text-sm">
            <p className="font-semibold text-gray-900 mb-2">解决方案：</p>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>使用 Google Chrome 浏览器（推荐）</li>
              <li>使用 Microsoft Edge 浏览器</li>
              <li>使用 Safari 浏览器（Mac/iOS）</li>
              <li>或改用文字输入</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 py-4 w-full">
      {/* 错误提示 */}
      {error && (
        <div className="w-full max-w-md bg-orange-50 border-l-4 border-orange-500 p-3 rounded">
          <p className="text-sm text-orange-800">{error}</p>
        </div>
      )}

      {/* 识别结果显示 */}
      {(recognizedText || interimText) && (
        <div className="w-full max-w-md bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-sm font-bold text-blue-900">识别结果</span>
          </div>
          <div className="bg-white p-3 rounded border border-blue-100 min-h-[60px]">
            <p className="text-gray-900 text-lg">
              {recognizedText}
              {interimText && (
                <span className="text-gray-400 italic"> {interimText}</span>
              )}
              {isRecording && <span className="inline-block w-1 h-5 bg-blue-600 animate-pulse ml-1"></span>}
            </p>
          </div>
          {!isRecording && recognizedText && (
            <p className="text-xs text-gray-500 mt-2">
              ✓ 识别完成，共 {recognizedText.length} 个字符
            </p>
          )}
        </div>
      )}

      {/* 录音控制按钮 */}
      {!isRecording ? (
        <button
          onClick={startRecording}
          disabled={isProcessing}
          className={`flex items-center gap-3 px-8 py-4 rounded-full font-bold transition-all text-lg ${
            isProcessing 
              ? 'bg-gray-300 cursor-not-allowed text-gray-500' 
              : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl'
          }`}
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
          {recognizedText ? '重新录音' : '开始录音'}
        </button>
      ) : (
        <div className="flex flex-col items-center gap-4">
          {/* 录音波形动画 */}
          <div className="flex items-center gap-2 h-16">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-2 bg-red-500 rounded-full animate-pulse"
                style={{
                  height: `${20 + Math.random() * 40}px`,
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: '0.6s'
                }}
              />
            ))}
          </div>

          {/* 录音信息 */}
          <div className="text-center">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-xl font-bold text-red-600">
                正在录音 {duration}s
              </span>
            </div>
            <p className="text-sm text-gray-600">请清晰地说出您的回答</p>
          </div>

          {/* 停止按钮 */}
          <button
            onClick={stopRecording}
            className="flex items-center gap-2 px-8 py-4 rounded-full bg-red-500 hover:bg-red-600 text-white font-bold shadow-lg transition-all text-lg"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="6" width="12" height="12" rx="2" />
            </svg>
            停止录音
          </button>
        </div>
      )}

      {/* 使用说明 */}
      <div className="max-w-md">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-gray-700">
              <p className="font-semibold mb-2">使用提示：</p>
              <ul className="space-y-1 text-xs">
                <li>• 点击"开始录音"后直接说话</li>
                <li>• 识别结果会实时显示在上方</li>
                <li>• 说完后点击"停止录音"</li>
                <li>• 如果识别不准确，可重新录音</li>
                <li>• 需要安静的环境和清晰的发音</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 免费提示 */}
      <div className="text-center">
        <p className="text-xs text-green-600 font-medium">
          ✓ 完全免费 · 无需 API Key · 浏览器原生支持
        </p>
      </div>
    </div>
  );
};

export default RealtimeVoiceRecorder;
