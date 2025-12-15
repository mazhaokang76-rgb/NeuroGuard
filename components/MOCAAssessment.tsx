import React, { useState } from 'react';
import { PatientForm } from './PatientForm';
import { QuestionDisplay } from './QuestionDisplay';
import { RealtimeVoiceRecorder } from './RealtimeVoiceRecorder';
import { ImageUploader } from './ImageUploader';
import { MOCAReport } from './MOCAReport';
import { MOCA_QUESTIONS } from '../constants/mocaQuestions';
import { PatientInfo, AssessmentState, QuestionInputType } from '../types';
import { evaluateResponse } from '../services/grokService';
import {AudioRecorder} from '../services/AudioRecorder';
import { scoreMocaSerialSubtraction } from '../services/serialSubtractionScoring';
import { ArrowLeft } from 'lucide-react';

interface Props {
  onComplete: () => void;
  onBack: () => void;
}

export default function MOCAAssessment({ onComplete, onBack }: Props) {
  const [patient, setPatient] = useState<PatientInfo | null>(null);
  const [state, setState] = useState<AssessmentState>({
    currentStep: 0,
    answers: {},
    scores: {},
    aiFeedback: {},
    isProcessing: false
  });

  const currentQuestion = MOCA_QUESTIONS[state.currentStep];
  const isComplete = state.currentStep >= MOCA_QUESTIONS.length;

  const handlePatientSubmit = (info: PatientInfo) => {
    setPatient(info);
  };

  const processAnswer = async (answer: any, type: QuestionInputType) => {
    setState(prev => ({ ...prev, isProcessing: true }));

    let score = 0;
    let feedback = "";
    
    // 特殊处理：MoCA 连续减7（语音输入，答案已是文本）
    if (currentQuestion.id === 'moca_attention_serial7') {
      const result = scoreMocaSerialSubtraction(answer);
      score = result.score;
      feedback = result.reasoning;
    }
    // 其他题目：使用 AI 评分
    else if (currentQuestion.grokPrompt) {
      const evaluation = await evaluateResponse(
        currentQuestion.grokPrompt,
        type === QuestionInputType.TEXT || type === QuestionInputType.AUDIO ? answer : undefined,
        type === QuestionInputType.DRAWING ? answer : undefined,
        undefined
      );
      score = evaluation.score;
      feedback = evaluation.reasoning;
    } else {
      score = currentQuestion.maxScore;
      feedback = "已记录回答";
    }

    setState(prev => ({
      ...prev,
      isProcessing: false,
      answers: { ...prev.answers, [currentQuestion.id]: answer },
      scores: { ...prev.scores, [currentQuestion.id]: score },
      aiFeedback: { ...prev.aiFeedback, [currentQuestion.id]: feedback },
      currentStep: prev.currentStep + 1
    }));
  };

  if (!patient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-3xl">
          <button
            onClick={onBack}
            className="mb-6 flex items-center gap-2 text-teal-700 hover:text-teal-900 transition-colors"
          >
            <ArrowLeft size={20} />
            返回首页
          </button>
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-teal-700 tracking-tight">MoCA 评估</h1>
            <p className="text-gray-500 mt-2">蒙特利尔认知评估量表</p>
          </div>
          <PatientForm onComplete={handlePatientSubmit} />
        </div>
      </div>
    );
  }

  if (isComplete) {
    return <MOCAReport patient={patient} state={state} onRestart={onComplete} />;
  }

  const progress = (state.currentStep / MOCA_QUESTIONS.length) * 100;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm p-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="text-gray-600 hover:text-gray-900">
              <ArrowLeft size={24} />
            </button>
            <span className="font-bold text-teal-700 text-xl">MoCA 评估</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>{patient.name}</span>
            <span className="bg-teal-100 text-teal-800 px-2 py-1 rounded font-medium">
              {state.currentStep + 1}/{MOCA_QUESTIONS.length}
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
                className="h-full bg-teal-600 transition-all duration-500 ease-out" 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <QuestionDisplay question={currentQuestion}>
            {state.isProcessing ? (
              <div className="text-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-700 mx-auto mb-4"></div>
                <p className="text-gray-600 animate-pulse">AI 正在分析您的回答...</p>
              </div>
            ) : (
              <div className="w-full">
                {currentQuestion.inputType === QuestionInputType.TEXT && (
                  <div className="flex gap-2">
                    <input 
                      id="text-answer"
                      autoFocus 
                      placeholder="请输入您的回答..." 
                      className="flex-grow p-4 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-teal-700 focus:outline-none"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const input = e.currentTarget as HTMLInputElement;
                          if (input.value) {
                            processAnswer(input.value, QuestionInputType.TEXT);
                            input.value = '';
                          }
                        }
                      }}
                    />
                    <button 
                      onClick={() => {
                        const input = document.getElementById('text-answer') as HTMLInputElement;
                        if (input?.value) {
                          processAnswer(input.value, QuestionInputType.TEXT);
                          input.value = '';
                        }
                      }}
                      className="bg-teal-700 text-white px-8 rounded-lg font-bold hover:bg-teal-800 transition-colors"
                    >
                      确认
                    </button>
                  </div>
                )}

                {currentQuestion.inputType === QuestionInputType.CHOICE && (
                  <div className="grid grid-cols-1 gap-3">
                    {currentQuestion.options?.map(opt => (
                      <button
                        key={opt}
                        onClick={() => processAnswer(opt, QuestionInputType.CHOICE)}
                        className="text-left p-4 border border-gray-200 rounded-lg hover:border-teal-700 hover:bg-teal-50 transition-all text-lg font-medium"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}

                {currentQuestion.inputType === QuestionInputType.AUDIO && (
                  <AudioRecorder 
                    isProcessing={state.isProcessing} 
                    onRecordingComplete={(blob) => processAnswer(blob, QuestionInputType.AUDIO)} 
                  />
                )}

                {currentQuestion.inputType === QuestionInputType.DRAWING && (
                  <ImageUploader 
                    onImageSelected={(file) => processAnswer(file, QuestionInputType.DRAWING)} 
                  />
                )}
              </div>
            )}
          </QuestionDisplay>
        </div>
      </main>
    </div>
  );
}
