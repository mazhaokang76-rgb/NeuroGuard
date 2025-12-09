import React, { useState } from 'react';
import { PatientForm } from './components/PatientForm';
import { AudioRecorder } from './components/AudioRecorder';
import { ImageUploader } from './components/ImageUploader';
import { AssessmentReport } from './components/AssessmentReport';
import { QUESTIONS } from './constants';
import { PatientInfo, AssessmentState, QuestionInputType, AssessmentType } from './types';
import { evaluateResponse } from './services/geminiService';

const App: React.FC = () => {
  const [patient, setPatient] = useState<PatientInfo | null>(null);
  const [state, setState] = useState<AssessmentState>({
    currentStep: 0,
    answers: {},
    scores: {},
    aiFeedback: {},
    isProcessing: false
  });

  const currentQuestion = QUESTIONS[state.currentStep];
  const isComplete = state.currentStep >= QUESTIONS.length;

  const handlePatientSubmit = (info: PatientInfo) => {
    setPatient(info);
  };

  const processAnswer = async (answer: any, type: QuestionInputType) => {
    setState(prev => ({ ...prev, isProcessing: true }));

    let score = 0;
    let feedback = "";
    
    // Auto-calculate ADL choice (Direct mapping)
    if (currentQuestion.assessmentType === AssessmentType.ADL) {
       // Answer is string "1. ...", "2. ..."
       // We parse the first char number. 
       const val = parseInt(answer.charAt(0));
       score = isNaN(val) ? 1 : val; 
       feedback = "自我报告。";
    } 
    // AI Evaluation for others
    else if (currentQuestion.geminiPrompt) {
      const evaluation = await evaluateResponse(
        currentQuestion.geminiPrompt,
        type === QuestionInputType.TEXT ? answer : undefined,
        type === QuestionInputType.DRAWING ? answer : undefined,
        type === QuestionInputType.AUDIO ? answer : undefined
      );
      score = evaluation.score;
      feedback = evaluation.reasoning;
    } 
    // Fallback manual logic if no prompt
    else {
      score = 1; // Default pass for demo
      feedback = "默认通过。";
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

  const restart = () => {
    setPatient(null);
    setState({
      currentStep: 0,
      answers: {},
      scores: {},
      aiFeedback: {},
      isProcessing: false
    });
  };

  // Render Logic
  if (!patient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full">
           <div className="text-center mb-10">
             <h1 className="text-4xl font-extrabold text-teal-700 tracking-tight">NeuroGuard</h1>
             <p className="text-gray-500 mt-2">Post-Stroke Cognitive Impairment Self-Assessment</p>
           </div>
           <PatientForm onComplete={handlePatientSubmit} />
        </div>
      </div>
    );
  }

  if (isComplete) {
    return <AssessmentReport patient={patient} state={state} onRestart={restart} />;
  }

  const progress = ((state.currentStep) / QUESTIONS.length) * 100;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm p-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
           <span className="font-bold text-teal-700 text-xl">NeuroGuard Evaluation</span>
           <div className="flex items-center gap-4 text-sm text-gray-500">
             <span>{patient.name}</span>
             <span className="bg-gray-200 px-2 py-1 rounded">{currentQuestion.assessmentType}</span>
           </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-3xl">
          
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-amber-500 transition-all duration-500 ease-out" 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden min-h-[400px] flex flex-col">
            <div className="bg-teal-700 p-6 text-white">
              <div className="uppercase tracking-wide text-xs font-bold opacity-80 mb-2">
                {currentQuestion.category}
              </div>
              <h2 className="text-2xl font-bold leading-relaxed">{currentQuestion.text}</h2>
              {currentQuestion.subText && (
                <p className="mt-2 opacity-90 text-sm bg-white/10 p-2 rounded">{currentQuestion.subText}</p>
              )}
            </div>

            <div className="p-8 flex-grow flex flex-col justify-center items-center">
              
              {currentQuestion.imageReference && (
                <div className="mb-6 rounded-lg overflow-hidden border border-gray-200 shadow-inner">
                   <img src={currentQuestion.imageReference} alt="Visual Task" className="max-h-64 object-cover" />
                </div>
              )}

              {state.isProcessing ? (
                 <div className="text-center py-10">
                   <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-700 mx-auto mb-4"></div>
                   <p className="text-gray-600 animate-pulse">AI is analyzing your response...</p>
                 </div>
              ) : (
                <div className="w-full">
                  {currentQuestion.inputType === QuestionInputType.TEXT && (
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const val = (e.currentTarget.elements.namedItem('answer') as HTMLInputElement).value;
                      if(val) processAnswer(val, QuestionInputType.TEXT);
                    }} className="flex gap-2">
                      <input 
                        name="answer" 
                        autoFocus 
                        placeholder="请输入您的回答..." 
                        className="flex-grow p-4 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-teal-700 focus:outline-none"
                      />
                      <button type="submit" className="bg-teal-700 text-white px-8 rounded-lg font-bold hover:bg-teal-800">
                        确认
                      </button>
                    </form>
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
            </div>
            
            <div className="bg-gray-50 p-4 border-t text-center text-sm text-gray-400">
               Question {state.currentStep + 1} of {QUESTIONS.length}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
