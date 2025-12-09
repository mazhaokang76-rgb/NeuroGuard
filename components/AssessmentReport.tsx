import React from 'react';
import { AssessmentState, PatientInfo, AssessmentType, ScaleResult } from '../types';
import { ADL_CUTOFF, QUESTIONS } from '../constants';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface Props {
  patient: PatientInfo;
  state: AssessmentState;
  onRestart: () => void;
}

export const AssessmentReport: React.FC<Props> = ({ patient, state, onRestart }) => {
  
  const calculateTotal = (type: AssessmentType): ScaleResult => {
    let score = 0;
    let max = 0;
    
    // Simple filter and sum
    QUESTIONS.filter(q => q.assessmentType === type).forEach(q => {
      score += state.scores[q.id] || 0;
      max += q.maxScore;
    });

    // Special logic for ADL: The prompt implies selection 1-4.
    // Score 1 is normal, 2-4 is impairment.
    // The provided manual says > 26 total is impairment. 
    // Here we have limited questions, so we will scale it or just use raw for demo.
    // Let's implement the specific logic:
    // If type is ADL, the score stored in state.scores is strictly the POINTS (1-4).
    if (type === AssessmentType.ADL) {
       // Recalculate based on answers because generic scoring might just give 0 or 1.
       score = 0;
       QUESTIONS.filter(q => q.assessmentType === type).forEach(q => {
          // In choice input, we store the selected index or text.
          // Assuming answer format "1. ...."
          const answer = state.answers[q.id];
          if (answer) {
             const val = parseInt(answer.charAt(0));
             score += isNaN(val) ? 1 : val; 
          } else {
            score += 1; // Default to normal if skipped
          }
       });
       // Max score for ADL in this demo is 4 * num_questions
       max = QUESTIONS.filter(q => q.assessmentType === type).length * 4;
    }

    let interpretation = "正常 (Normal)";
    if (type === AssessmentType.MMSE && score < 27) interpretation = "认知障碍可能 (Possible Impairment)";
    if (type === AssessmentType.MOCA) {
        // Education correction
        let finalScore = score;
        if (patient.educationYears <= 12 && score < 30) finalScore += 1;
        score = Math.min(finalScore, 30); // Cap at 30
        if (score < 26) interpretation = "认知障碍可能 (Possible Impairment)";
    }
    if (type === AssessmentType.ADL) {
        // Scale cutoff for demo subset. 
        // Full scale: 20 items, cutoff 26. (20 * 1 = 20 is perfect).
        // Demo: 3 items. Perfect is 3. Impairment is > 3.9 (ratio 26/20 = 1.3 avg)
        const avg = score / QUESTIONS.filter(q => q.assessmentType === AssessmentType.ADL).length;
        if (avg > 1.3) interpretation = "功能下降 (Functional Decline)";
    }

    return { rawScore: score, maxScore: max, interpretation };
  };

  const mmseResult = calculateTotal(AssessmentType.MMSE);
  const mocaResult = calculateTotal(AssessmentType.MOCA);
  const adlResult = calculateTotal(AssessmentType.ADL);

  const data = [
    { name: 'MMSE', value: mmseResult.rawScore, max: mmseResult.maxScore, fill: '#0f766e' },
    { name: 'MoCA', value: mocaResult.rawScore, max: mocaResult.maxScore, fill: '#0d9488' },
    { name: 'ADL (Inv)', value: adlResult.rawScore, max: adlResult.maxScore, fill: '#f59e0b' },
  ];

  const currentDate = new Date().toLocaleDateString('zh-CN');

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 shadow-2xl print:shadow-none min-h-screen">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">卒中后认知障碍评估报告</h1>
          <p className="text-gray-500">PSCI Assessment Report</p>
        </div>
        <div className="text-right">
          <p className="font-semibold text-lg">{patient.name}</p>
          <p className="text-sm text-gray-500">Date: {currentDate}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-surface p-6 rounded-lg">
          <h3 className="text-lg font-bold text-gray-700 mb-4">患者信息 (Patient)</h3>
          <ul className="space-y-2">
            <li><span className="font-medium">性别:</span> {patient.gender === 'male' ? '男' : '女'}</li>
            <li><span className="font-medium">年龄:</span> {patient.age} 岁</li>
            <li><span className="font-medium">教育年限:</span> {patient.educationYears} 年</li>
            <li><span className="font-medium">ID:</span> {patient.idNumber || 'N/A'}</li>
          </ul>
        </div>
        <div className="bg-surface p-6 rounded-lg">
           <h3 className="text-lg font-bold text-gray-700 mb-4">评估摘要 (Summary)</h3>
           <ul className="space-y-3">
             <li className="flex justify-between items-center border-b border-gray-200 pb-2">
               <span>MMSE 得分:</span>
               <span className={`font-bold ${mmseResult.interpretation.includes('可能') ? 'text-red-600' : 'text-green-600'}`}>
                 {mmseResult.rawScore} / {mmseResult.maxScore}
               </span>
             </li>
             <li className="flex justify-between items-center border-b border-gray-200 pb-2">
               <span>MoCA 得分:</span>
               <span className={`font-bold ${mocaResult.interpretation.includes('可能') ? 'text-red-600' : 'text-green-600'}`}>
                 {mocaResult.rawScore} / {mocaResult.maxScore}
               </span>
             </li>
             <li className="flex justify-between items-center border-b border-gray-200 pb-2">
               <span>ADL 指数:</span>
               <span className="font-bold">{adlResult.rawScore} (越低越好)</span>
             </li>
           </ul>
        </div>
      </div>

      {/* Charts Section */}
      <div className="mb-10 no-print">
        <h3 className="text-xl font-bold text-gray-800 mb-4">可视化分析</h3>
        <div className="h-64 w-full bg-white border rounded-lg p-4">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 'dataMax']} />
                  <YAxis dataKey="name" type="category" width={80} />
                  <Tooltip />
                  <Bar dataKey="value" name="Score" barSize={30} radius={[0, 4, 4, 0]} />
                </BarChart>
             </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Analysis Section */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4 border-l-4 border-primary pl-3">详细项分析 (Detail)</h3>
        <div className="space-y-6">
          {QUESTIONS.map((q) => {
            const score = state.scores[q.id];
            const feedback = state.aiFeedback[q.id];
            const answer = state.answers[q.id];
            
            // Skip showing items with no score if appropriate, but usually we show all
            if (q.assessmentType === AssessmentType.ADL) return null; // Summarize ADL separately if needed

            return (
              <div key={q.id} className="break-inside-avoid mb-4">
                <div className="flex justify-between">
                   <h4 className="font-semibold text-gray-700">{q.category}: {q.text.substring(0, 30)}...</h4>
                   <span className="font-mono font-bold text-primary">{score}/{q.maxScore}</span>
                </div>
                {feedback && (
                  <div className="mt-2 text-sm bg-yellow-50 p-3 rounded text-gray-700 border-l-2 border-yellow-400">
                    <span className="font-bold text-xs text-yellow-600 uppercase block mb-1">AI Analysis</span>
                    {feedback}
                  </div>
                )}
                {!feedback && answer && typeof answer === 'string' && (
                    <div className="mt-1 text-sm text-gray-500 italic">User Answer: {answer}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-center gap-4 mt-12 no-print">
        <button 
          onClick={() => window.print()} 
          className="bg-gray-800 text-white px-8 py-3 rounded-lg hover:bg-gray-900 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
          打印报告 (Print)
        </button>
        <button 
          onClick={onRestart} 
          className="bg-white border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors"
        >
          重新评估 (Restart)
        </button>
      </div>

      <div className="text-center text-xs text-gray-400 mt-12 print-only">
        Generated by NeuroGuard AI System. This is a screening tool, not a diagnosis.
      </div>
    </div>
  );
};