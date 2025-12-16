import React, { useState, useRef, useEffect } from 'react';
import { WebSpeechRecognition } from '../services/webSpeechService';
import { Eye, EyeOff, RotateCcw, Check, Square, Mic } from 'lucide-react';

interface Props {
  onComplete: (text: string) => void;
  isProcessing: boolean;
  hideResult?: boolean; // 新增：是否默认隐藏识别结果
}

export const VoiceInput: React.FC<Props> = ({ onComplete, isProcessing, hideResult = false }) => {
  const [stage, setStage] = useState<'idle' | 'recording' | 'completed'>('idle');
  const [recognizedText, setRecognizedText] = useState('');
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(!hideResult); // 控制结果显示
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
    setRecognizedText('');
    setDuration(0);
    setStage('recording');
    setShowResult(!hideResult); // 重置显示状态

    recognitionRef.current = new WebSpeechRecognition({
      lang: 'zh-CN',
      continuous: true,
      interimResults: false
    });

    const started = recognitionRef.current.start(
      (result) => {
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

  const stopRecording = () => {
    console.log('🛑 用户停止录音');
    if (recognitionRef.current) {
      const finalText = recognitionRef.current.stop();
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

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

  const retry = () => {
    console.log('🔄 重新录音');
    setRecognizedText('');
    setError(null);
    setStage('idle');
    setShowResult(!hideResult);
    setTimeout(() => startRecording(), 100);
  };

  const confirm = () => {
    console.log('✅ 用户确认提交:', recognizedText);
    if (recognizedText && recognizedText.trim()) {
      onComplete(recognizedText.trim());
    } else {
      setError('识别结果为空，请重新录音');
      setStage('idle');
    }
  };

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
      {error && stage === 'idle' && (
        <div className="w-full max-w-md bg-orange-50 border border-orange-300 p-3 rounded-lg">
          <p className="text-sm text-orange-800">{error}</p>
        </div>
      )}

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
            <Mic className="w-6 h-6" />
            <span>开始录音</span>
          </button>
          <p className="text-xs text-gray-500">点击按钮后开始说话</p>
        </div>
      )}

      {stage === 'recording' && (
        <div className="flex flex-col items-center gap-4">
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

          <div className="flex items-center gap-2 bg-red-50 px-4 py-2 rounded-full border border-red-200">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-base font-bold text-red-600">
              {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}
            </span>
          </div>

          <button
            onClick={stopRecording}
            className="flex items-center gap-2 px-8 py-4 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold shadow-lg transition-all"
          >
            <Square className="w-5 h-5" fill="currentColor" />
            <span>停止录音</span>
          </button>
          
          <p className="text-xs text-gray-600">说完后点击"停止录音"</p>
        </div>
      )}

      {stage === 'completed' && (
        <div className="flex flex-col items-center gap-4 w-full max-w-md">
          <div className="w-full bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-600" />
                <span className="text-sm font-bold text-green-900">识别结果</span>
              </div>
              
              {hideResult && (
                <button
                  onClick={() => setShowResult(!showResult)}
                  className="flex items-center gap-1 px-3 py-1 rounded-lg bg-white border border-green-300 text-green-700 hover:bg-green-50 transition-colors text-xs font-medium"
                >
                  {showResult ? (
                    <>
                      <EyeOff className="w-4 h-4" />
                      <span>隐藏</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4" />
                      <span>显示</span>
                    </>
                  )}
                </button>
              )}
            </div>
            
            <div className="bg-white p-4 rounded-lg border-2 border-green-100">
              {showResult ? (
                <p className="text-gray-900 text-xl font-medium text-center">
                  {recognizedText}
                </p>
              ) : (
                <p className="text-gray-400 text-center text-sm py-2">
                  点击"显示"按钮查看识别结果
                </p>
              )}
            </div>
            
            {showResult && (
              <div className="flex items-center justify-center mt-3 text-xs text-gray-600">
                <span>{recognizedText.length} 字符</span>
              </div>
            )}
          </div>

          <div className="flex gap-3 w-full">
            <button
              onClick={retry}
              disabled={isProcessing}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all border-2 ${
                isProcessing
                  ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
                  : 'bg-white border-orange-300 text-orange-600 hover:bg-orange-50 hover:border-orange-400'
              }`}
            >
              <RotateCcw className="w-5 h-5" />
              <span>重试</span>
            </button>

            <button
              onClick={confirm}
              disabled={isProcessing}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-lg ${
                isProcessing
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 text-white hover:shadow-xl'
              }`}
            >
              <Check className="w-5 h-5" />
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
