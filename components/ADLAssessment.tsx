import React, { useState } from 'react';
import { PatientForm } from './PatientForm';
import { QuestionDisplay } from './QuestionDisplay';
import { ADLReport } from './ADLReport';
import { ADL_QUESTIONS } from '../constants/adlQuestions';
import { PatientInfo, AssessmentState, QuestionInputType } from '../types';
import { ArrowLeft } from 'lucide-react';

interface Props {
  onComplete: () => void;
  onBack: () => void;
}

export default function ADLAssessment({ onComplete, onBack }: Props) {
  const [patient, setPatient] = useState<PatientInfo | null>(null);
  const [state, setState] = useState<AssessmentState>({
    currentStep: 0,
    answers: {},
    scores: {},
    aiFeedback: {},
    isProcessing: false
  });

  const currentQuestion = ADL_QUESTIONS[state.currentStep];
  const isComplete = state.currentStep >= ADL_QUESTIONS.length;

  const handlePatientSubmit = (info: PatientInfo) => {
    setPatient(info);
  };

  const processAnswer = (answer: string) => {
    // ADL量表直接从选项中提取分数（1-4）
    const scoreValue = parseInt(answer.charAt(0));
    
    setState(prev => ({
      ...prev,
      answers: { ...prev.answers, [currentQuestion.id]: answer },
      scores: { ...prev.scores, [currentQuestion.id]: scoreValue },
      aiFeedback: { ...prev.aiFeedback, [currentQuestion.id]: '自我评估' },
      currentStep: prev.currentStep + 1
    }));
  };

  if (!patient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-3xl">
          <button
            onClick={onBack}
            className="mb-6 flex items-center gap-2 text-amber-600 hover:text-amber-800 transition-colors"
          >
            <ArrowLeft size={20} />
            返回首页
          </button>
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-amber-600 tracking-tight">ADL 评估</h1>
            <p className="text-gray-500 mt-2">日常生活活动能力量表</p>
          </div>
          <PatientForm onComplete={handlePatientSubmit} />
        </div>
      </div>
    );
  }

  if (isComplete) {
    return <ADLReport patient={patient} state={state} onRestart={onComplete} />;
  }

  const progress = (state.currentStep / ADL_QUESTIONS.length) * 100;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm p-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="text-gray-600 hover:text-gray-900">
              <ArrowLeft size={24} />
            </button>
            <span className="font-bold text-amber-600 text-xl">ADL 评估</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>{patient.name}</span>
            <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded font-medium">
              {state.currentStep + 1}/{ADL_QUESTIONS.length}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-3xl">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>评估进度</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-amber-500 transition-all duration-500 ease-out" 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <QuestionDisplay question={currentQuestion}>
            <div className="w-full">
              <div className="mb-4 bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                <p className="text-sm text-blue-900">
                  <strong>评分说明：</strong>
                  1=自己可以做（正常），2=有些困难，3=需要帮助，4=根本无法做
                </p>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                {currentQuestion.options?.map((opt, index) => {
                  const scoreNum = index + 1;
                  let colorClass = '';
                  if (scoreNum === 1) colorClass = 'border-green-300 hover:bg-green-50 hover:border-green-500';
                  else if (scoreNum === 2) colorClass = 'border-yellow-300 hover:bg-yellow-50 hover:border-yellow-500';
                  else if (scoreNum === 3) colorClass = 'border-orange-300 hover:bg-orange-50 hover:border-orange-500';
                  else colorClass = 'border-red-300 hover:bg-red-50 hover:border-red-500';

                  return (
                    <button
                      key={opt}
                      onClick={() => processAnswer(opt)}
                      className={`text-left p-4 border-2 rounded-lg transition-all text-lg font-medium ${colorClass}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          </QuestionDisplay>
        </div>
      </main>
    </div>
  );
}
