// components/AudioRecorder.tsx - 增强版
import React, { useState, useRef } from 'react';

interface Props {
  onRecordingComplete: (blob: Blob) => void;
  isProcessing: boolean;
}

export const AudioRecorder: React.FC<Props> = ({ onRecordingComplete, isProcessing }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    setErrorMessage(null);
    setRecordingDuration(0);
    
    try {
      // 请求麦克风权限
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      });

      // 检测浏览器支持的 MIME 类型
      let mimeType = 'audio/webm';
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        mimeType = 'audio/webm;codecs=opus';
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        mimeType = 'audio/mp4';
      } else if (MediaRecorder.isTypeSupported('audio/wav')) {
        mimeType = 'audio/wav';
      }

      console.log('使用音频格式:', mimeType);

      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType });
      chunksRef.current = [];

      // 收集音频数据
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
          console.log('收到音频片段，大小:', e.data.size, 'bytes');
        }
      };

      // 录音结束处理
      mediaRecorderRef.current.onstop = () => {
        console.log('录音停止，总片段数:', chunksRef.current.length);
        
        if (chunksRef.current.length === 0) {
          setErrorMessage('❌ 录音失败：没有收到音频数据');
          stream.getTracks().forEach(track => track.stop());
          return;
        }

        const blob = new Blob(chunksRef.current, { type: mimeType });
        console.log('音频 Blob 创建成功，大小:', blob.size, 'bytes, 类型:', blob.type);
        
        // 检查音频大小
        if (blob.size < 1000) {
          setErrorMessage('⚠️ 音频太短或为空，请重新录制');
          stream.getTracks().forEach(track => track.stop());
          return;
        }

        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        onRecordingComplete(blob);
        
        // 停止所有音轨
        stream.getTracks().forEach(track => track.stop());
      };

      // 开始录音（每秒触发一次 dataavailable）
      mediaRecorderRef.current.start(1000);
      setIsRecording(true);

      // 计时器
      timerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);

    } catch (err) {
      console.error("麦克风访问错误:", err);
      setErrorMessage('❌ 无法访问麦克风，请检查权限设置');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      console.log('停止录音...');
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 py-4 w-full">
      {/* 错误提示 */}
      {errorMessage && (
        <div className="w-full max-w-md bg-red-50 border-l-4 border-red-500 p-3 rounded">
          <p className="text-sm text-red-700">{errorMessage}</p>
        </div>
      )}

      {/* 音频播放器 */}
      {audioUrl && (
        <div className="w-full max-w-md">
          <audio src={audioUrl} controls className="w-full mb-2" />
          <p className="text-xs text-center text-gray-500">
            录音时长: {recordingDuration} 秒
          </p>
        </div>
      )}
      
      {/* 录音按钮 */}
      {!isRecording ? (
        <button
          onClick={startRecording}
          disabled={isProcessing}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all ${
            isProcessing ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
          }`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
          {audioUrl ? '重新录音 (Re-record)' : '开始录音 (Start Recording)'}
        </button>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-lg font-bold text-red-600">
              正在录音... {recordingDuration}s
            </span>
          </div>
          <button
            onClick={stopRecording}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-red-500 hover:bg-red-600 text-white font-semibold shadow-lg"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="6" width="12" height="12" />
            </svg>
            停止录音 (Stop)
          </button>
        </div>
      )}
      
      {/* 提示信息 */}
      <p className="text-sm text-center text-gray-500 max-w-md">
        {isRecording ? (
          <span className="text-blue-600 font-medium">🎤 正在录音，请清晰说话...</span>
        ) : audioUrl ? (
          <span className="text-green-600">✓ 录音完成，可以播放试听或重新录制</span>
        ) : (
          "点击按钮开始录音回答"
        )}
      </p>

      {/* 最小录音时长提示 */}
      {isRecording && recordingDuration < 2 && (
        <p className="text-xs text-orange-600">
          💡 建议录音至少2秒以确保音频质量
        </p>
      )}
    </div>
  );
};
