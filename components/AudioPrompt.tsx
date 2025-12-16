import React, { useState, useRef } from 'react';
import { VoiceInput } from './VoiceInput';
import { Volume2, Eye, EyeOff } from 'lucide-react';

interface AudioPromptProps {
  audioSrc: string;
  promptText: string;
  onComplete: (text: string) => void;
  isProcessing: boolean;
}

export const AudioPrompt: React.FC<AudioPromptProps> = ({ 
  audioSrc, 
  promptText, 
  onComplete, 
  isProcessing 
}) => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [audioPlayed, setAudioPlayed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const playAudio = () => {
    if (audioRef.current) {
      setIsPlaying(true);
      audioRef.current.play().catch(err => {
        console.error('播放音频失败:', err);
        setIsPlaying(false);
        setAudioPlayed(true); // 即使播放失败也允许继续
      });
    }
  };

  const handleAudioEnd = () => {
    setIsPlaying(false);
    setAudioPlayed(true);
  };

  const handleAudioError = () => {
    console.error('音频加载失败，允许继续评估');
    setIsPlaying(false);
    setAudioPlayed(true); // 音频失败时也允许继续
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* 音频播放器 */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 shadow-lg">
        <audio
          ref={audioRef}
          src={audioSrc}
          onEnded={handleAudioEnd}
          onError={handleAudioError}
        />
        
        <div className="flex flex-col items-center gap-4">
          <div className="text-center">
            <h3 className="text-lg font-bold text-blue-900 mb-2">请先听语音提示</h3>
            <p className="text-sm text-blue-700">点击播放按钮收听题目</p>
          </div>

          <button
            onClick={playAudio}
            disabled={isPlaying}
            className={`flex items-center gap-3 px-8 py-4 rounded-xl font-bold transition-all text-base shadow-lg ${
              isPlaying
                ? 'bg-blue-300 cursor-not-allowed text-blue-700'
                : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-xl'
            }`}
          >
            <Volume2 className={`w-6 h-6 ${isPlaying ? 'animate-pulse' : ''}`} />
            <span>{isPlaying ? '播放中...' : '播放语音'}</span>
          </button>

          {/* 文字提示（隐藏/显示） */}
          <div className="w-full">
            <button
              onClick={() => setShowPrompt(!showPrompt)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-blue-300 text-blue-700 hover:bg-blue-50 transition-colors text-sm font-medium mx-auto"
            >
              {showPrompt ? (
                <>
                  <EyeOff className="w-4 h-4" />
                  <span>隐藏文字提示</span>
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  <span>显示文字提示</span>
                </>
              )}
            </button>

            {showPrompt && (
              <div className="mt-3 bg-white p-4 rounded-lg border-2 border-blue-100">
                <p className="text-gray-800 text-center">{promptText}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 录音区域（听完语音后才显示） */}
      {audioPlayed && (
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">请重复您听到的内容</h3>
          <VoiceInput 
            onComplete={onComplete} 
            isProcessing={isProcessing}
            hideResult={true}
          />
        </div>
      )}
    </div>
  );
};

export default AudioPrompt;
