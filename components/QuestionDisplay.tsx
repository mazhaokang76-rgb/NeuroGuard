import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Eye, EyeOff } from 'lucide-react';

interface Props {
  question: {
    text: string;
    subText?: string;
    imageReference?: string;
    answerKey?: string;
    category: string;
  };
  children: React.ReactNode;
}

export const QuestionDisplay: React.FC<Props> = ({ question, children }) => {
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden min-h-[500px] flex flex-col">
      {/* Question Header */}
      <div className="bg-teal-700 p-6 text-white">
        <div className="uppercase tracking-wide text-xs font-bold opacity-80 mb-2">
          {question.category}
        </div>
        <h2 className="text-2xl font-bold leading-relaxed">{question.text}</h2>
        {question.subText && (
          <p className="mt-2 opacity-90 text-sm bg-white bg-opacity-10 p-2 rounded">
            {question.subText}
          </p>
        )}
      </div>

      {/* Reference Image (if exists) */}
      {question.imageReference && (
        <div className="p-6 bg-gray-50 border-b">
          <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm max-w-md mx-auto">
            <img 
              src={question.imageReference} 
              alt="参考图片" 
              className="w-full object-contain max-h-80"
            />
          </div>
          <p className="text-center text-sm text-gray-500 mt-2">
            ↑ 参考图片
          </p>
        </div>
      )}

      {/* Answer Key Toggle */}
      {question.answerKey && (
        <div className="px-6 pt-4">
          <button
            onClick={() => setShowAnswer(!showAnswer)}
            className="flex items-center gap-2 text-sm text-teal-700 hover:text-teal-900 font-medium transition-colors"
          >
            {showAnswer ? <EyeOff size={16} /> : <Eye size={16} />}
            {showAnswer ? '隐藏答案' : '查看正确答案'}
            {showAnswer ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          
          {showAnswer && (
            <div className="mt-2 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded animate-fadeIn">
              <p className="text-sm font-semibold text-yellow-800">
                正确答案: {question.answerKey}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Question Content */}
      <div className="p-8 flex-grow flex flex-col justify-center">
        {children}
      </div>
    </div>
  );
};
