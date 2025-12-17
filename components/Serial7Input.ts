import React, { useState, useRef, useEffect } from 'react';
import { Check, AlertCircle } from 'lucide-react';

interface Serial7InputProps {
  onComplete: (answers: string) => void; // 返回逗号分隔的字符串
  isProcessing: boolean;
}

export const Serial7Input: React.FC<Serial7InputProps> = ({ onComplete, isProcessing }) => {
  const [answers, setAnswers] = useState<string[]>(['', '', '', '', '']);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleInputChange = (index: number, value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    
    const newAnswers = [...answers];
    newAnswers[index] = numericValue;
    setAnswers(newAnswers);

    if (numericValue && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !answers[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    const allFilled = answers.every(answer => answer.trim() !== '');
    
    if (!allFilled) {
      alert('请填写所有5个答案');
      return;
    }

    // 转换为逗号分隔的字符串
    const answersString = answers.join(', ');
    onComplete(answersString);
  };

  const allFilled = answers.every(answer => answer.trim() !== '');

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto">
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-blue-900 mb-2">连续减7测试</h3>
            <p className="text-blue-800 text-sm leading-relaxed">
              从 <span className="font-bold text-lg">100</span> 开始，每次减去 <span className="font-bold text-lg">7</span>，依次填写5个答案
            </p>
            <p className="text-blue-600 text-xs mt-2">
              例如：100 - 7 = 93，93 - 7 = 86...
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border-2 border-gray-200 p-8 shadow-lg">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="bg-teal-100 text-teal-800 px-6 py-3 rounded-lg font-bold text-2xl">
              100
            </div>
            <span className="text-2xl text-gray-400">−7 →</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {answers.map((answer, index) => (
              <div key={index} className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-600 text-center">
                  第 {index + 1} 个
                </label>
                <input
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={3}
                  value={answer}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onFocus={() => setFocusedIndex(index)}
                  disabled={isProcessing}
                  placeholder="?"
                  className={`w-full h-16 text-center text-2xl font-bold rounded-lg border-2 transition-all
                    ${isProcessing ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
                    ${focusedIndex === index && !isProcessing
                      ? 'border-teal-600 ring-4 ring-teal-100'
                      : answer
                      ? 'border-green-400 bg-green-50'
                      : 'border-gray-300 hover:border-gray-400'
                    }
                    focus:outline-none
                  `}
                />
              </div>
            ))}
          </div>

          <div className="mt-4 text-center">
            <div className="inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
              <div className="flex gap-1">
                {answers.map((answer, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all ${
                      answer ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-700">
                {answers.filter(a => a).length} / 5
              </span>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!allFilled || isProcessing}
        className={`flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${
          !allFilled || isProcessing
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-teal-600 hover:bg-teal-700 text-white hover:shadow-xl transform hover:scale-105'
        }`}
      >
        <Check className="w-6 h-6" />
        <span>{isProcessing ? '处理中...' : '提交答案'}</span>
      </button>

      <div className="text-center text-sm text-gray-500">
        提示：填写完成后按 <kbd className="px-2 py-1 bg-gray-200 rounded">Enter</kbd> 键快速提交
      </div>
    </div>
  );
};

export default Serial7Input;
