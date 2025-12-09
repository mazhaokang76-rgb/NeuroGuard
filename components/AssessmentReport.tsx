import React, { useEffect, useState } from 'react';
import { AssessmentState, PatientInfo, AssessmentType, ScaleResult } from '../types';
import { ADL_CUTOFF, QUESTIONS } from '../constants';
import { saveAssessment } from '../services/supabaseService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

interface Props {
  patient: PatientInfo;
  state: AssessmentState;
  onRestart: () => void;
}

export const AssessmentReport: React.FC<Props> = ({ patient, state, onRestart }) => {
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [saveMessage, setSaveMessage] = useState('');

  const calculateTotal = (type: AssessmentType): ScaleResult => {
    let score = 0;
    let max = 0;
    
    QUESTIONS.filter(q => q.assessmentType === type).forEach(q => {
      const questionScore = state.scores[q.id] || 0;
      score += questionScore;
      max += q.maxScore;
    });

    // 特殊处理ADL：选项1-4，越低越好
    if (type === AssessmentType.ADL) {
       score = 0;
       QUESTIONS.filter(q => q.assessmentType === type).forEach(q => {
          const answer = state.answers[q.id];
          if (answer) {
             const val = parseInt(answer.charAt(0));
             score += isNaN(val) ? 1 : val; 
          } else {
            score += 1;
          }
       });
       max = QUESTIONS.filter(q => q.assessmentType === type).length * 4;
    }

    let interpretation = "正常 (Normal)";
    
    if (type === AssessmentType.MMSE) {
      if (score < 27) interpretation = "认知功能障碍 (Cognitive Impairment)";
    }
    
    if (type === AssessmentType.MOCA) {
        let finalScore = score;
        // 教育程度校正：≤12年教育且得分<30，加1分
        if (patient.educationYears <= 12 && score < 30) {
          finalScore += 1;
        }
        score = Math.min(finalScore, 30);
        if (score < 26) interpretation = "认知功能障碍可能 (Possible Cognitive Impairment)";
    }
    
    if (type === AssessmentType.ADL) {
        // 总分≤26分为完全正常；>26分提示有不同程度的功能下降
        if (score > 26) {
          interpretation = "功能下降 (Functional Decline)";
        }
        // 凡有2项或2项以上≥3分，或总分≥22分，提示有明显功能障碍
        const severeItems = QUESTIONS.filter(q => q.assessmentType === AssessmentType.ADL)
          .filter(q => {
            const answer = state.answers[q.id];
            if (answer) {
              const val = parseInt(answer.charAt(0));
              return val >= 3;
            }
            return false;
          }).length;
        
        if (severeItems >= 2 || score >= 22) {
          interpretation = "明显功能障碍 (Significant Functional Impairment)";
        }
    }

    return { rawScore: score, maxScore: max, interpretation };
  };

  const mmseResult = calculateTotal(AssessmentType.MMSE);
  const mocaResult = calculateTotal(AssessmentType.MOCA);
  const adlResult = calculateTotal(AssessmentType.ADL);

  // 自动保存到数据库
  useEffect(() => {
    const saveToDatabase = async () => {
      setSaveStatus('saving');
      const result = await saveAssessment(
        patient,
        state,
        mmseResult.rawScore,
        mocaResult.rawScore,
        adlResult.rawScore,
        mmseResult.interpretation,
        mocaResult.interpretation,
        adlResult.interpretation
      );
      
      if (result.success) {
        setSaveStatus('success');
        setSaveMessage('✓ 评估结果已保存到数据库');
      } else {
        setSaveStatus('error');
        setSaveMessage('⚠ 保存失败: ' + (result.error || '未知错误'));
      }
    };

    saveToDatabase();
  }, []);

  const data = [
    { name: 'MMSE', value: mmseResult.rawScore, max: mmseResult.maxScore, fill: '#0f766e' },
    { name: 'MoCA', value: mocaResult.rawScore, max: mocaResult.maxScore, fill: '#0d9488' },
    { name: 'ADL', value: adlResult.rawScore, max: adlResult.maxScore, fill: '#f59e0b' },
  ];

  const currentDate = new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 shadow-2xl print:shadow-none min-h-screen">
      {/* 保存状态提示 */}
      {saveStatus !== 'idle' && (
        <div className={`mb-6 p-4 rounded-lg ${
          saveStatus === 'saving' ? 'bg-blue-50 text-blue-700' :
          saveStatus === 'success' ? 'bg-green-50 text-green-700' :
          'bg-red-50 text-red-700'
        }`}>
          {saveStatus === 'saving' && '正在保存评估结果...'}
          {saveStatus === 'success' && saveMessage}
          {saveStatus === 'error' && saveMessage}
        </div>
      )}

      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">卒中后认知障碍评估报告</h1>
          <p className="text-gray-500">Post-Stroke Cognitive Impairment Assessment Report</p>
        </div>
        <div className="text-right">
          <p className="font-semibold text-lg">{patient.name}</p>
          <p className="text-sm text-gray-500">评估日期: {currentDate}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-bold text-gray-700 mb-4">患者信息 (Patient Information)</h3>
          <ul className="space-y-2">
            <li><span className="font-medium">姓名:</span> {patient.name}</li>
            <li><span className="font-medium">性别:</span> {patient.gender === 'male' ? '男' : '女'}</li>
            <li><span className="font-medium">年龄:</span> {patient.age} 岁</li>
            <li><span className="font-medium">教育年限:</span> {patient.educationYears} 年</li>
            {patient.idNumber && (
              <li><span className="font-medium">病历号:</span> {patient.idNumber}</li>
            )}
          </ul>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg">
           <h3 className="text-lg font-bold text-gray-700 mb-4">评估摘要 (Summary)</h3>
           <ul className="space-y-3">
             <li className="flex justify-between items-center border-b border-gray-200 pb-2">
               <span>MMSE 得分:</span>
               <span className={`font-bold ${mmseResult.interpretation.includes('障碍') ? 'text-red-600' : 'text-green-600'}`}>
                 {mmseResult.rawScore} / {mmseResult.maxScore}
               </span>
             </li>
             <li className="flex justify-between items-center border-b border-gray-200 pb-2">
               <span>MoCA 得分:</span>
               <span className={`font-bold ${mocaResult.interpretation.includes('障碍') || mocaResult.interpretation.includes('可能') ? 'text-red-600' : 'text-green-600'}`}>
                 {mocaResult.rawScore} / {mocaResult.maxScore}
               </span>
             </li>
             <li className="flex justify-between items-center border-b border-gray-200 pb-2">
               <span>ADL 总分:</span>
               <span className={`font-bold ${adlResult.interpretation.includes('下降') || adlResult.interpretation.includes('障碍') ? 'text-red-600' : 'text-green-600'}`}>
                 {adlResult.rawScore} / {adlResult.maxScore}
               </span>
             </li>
           </ul>
        </div>
      </div>

      {/* 评估结果解读 */}
      <div className="mb-8 p-6 bg-blue-50 border-l-4 border-blue-500 rounded">
        <h3 className="text-lg font-bold text-blue-900 mb-3">评估结果解读</h3>
        <div className="space-y-2 text-sm">
          <p><strong>MMSE:</strong> {mmseResult.interpretation} 
            {mmseResult.rawScore < 27 && ' (得分<27提示认知功能障碍)'}</p>
          <p><strong>MoCA:</strong> {mocaResult.interpretation}
            {mocaResult.rawScore < 26 && ' (得分<26提示认知功能障碍)'}
            {patient.educationYears <= 12 && ' (已应用教育程度校正+1分)'}</p>
          <p><strong>ADL:</strong> {adlResult.interpretation}
            {adlResult.rawScore <= 26 ? ' (总分≤26为正常)' : ' (总分>26提示功能下降)'}</p>
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
                  <Bar dataKey="value" name="得分" barSize={30} radius={[0, 4, 4, 0]} />
                </BarChart>
             </ResponsiveContainer>
        </div>
      </div>

      {/* 详细项分析 */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4 border-l-4 border-teal-700 pl-3">详细题目分析</h3>
        
        {/* MMSE 详情 */}
        <div className="mb-6">
          <h4 className="font-bold text-lg text-teal-700 mb-2">MMSE - 简易认知状态评价量表</h4>
          <div className="space-y-3">
            {QUESTIONS.filter(q => q.assessmentType === AssessmentType.MMSE).map((q) => {
              const score = state.scores[q.id] || 0;
              const feedback = state.aiFeedback[q.id];
              
              return (
                <div key={q.id} className="bg-gray-50 p-3 rounded">
                  <div className="flex justify-between">
                     <span className="font-medium text-sm text-gray-700">{q.category}: {q.text}</span>
                     <span className="font-mono font-bold text-teal-700">{score}/{q.maxScore}</span>
                  </div>
                  {feedback && (
                    <div className="mt-1 text-xs text-gray-600 italic">
                      AI分析: {feedback}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* MoCA 详情 */}
        <div className="mb-6">
          <h4 className="font-bold text-lg text-teal-700 mb-2">MoCA - 蒙特利尔认知评估量表</h4>
          <div className="space-y-3">
            {QUESTIONS.filter(q => q.assessmentType === AssessmentType.MOCA).map((q) => {
              const score = state.scores[q.id] || 0;
              const feedback = state.aiFeedback[q.id];
              
              return (
                <div key={q.id} className="bg-gray-50 p-3 rounded">
                  <div className="flex justify-between">
                     <span className="font-medium text-sm text-gray-700">{q.category}: {q.text}</span>
                     <span className="font-mono font-bold text-teal-700">{score}/{q.maxScore}</span>
                  </div>
                  {feedback && (
                    <div className="mt-1 text-xs text-gray-600 italic">
                      AI分析: {feedback}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ADL 详情 */}
        <div className="mb-6">
          <h4 className="font-bold text-lg text-amber-600 mb-2">ADL - 日常生活活动能力量表</h4>
          <p className="text-sm text-gray-600 mb-3">
            评分标准: 1=自己可以做, 2=有些困难, 3=需要帮助, 4=根本无法做
          </p>
          <div className="space-y-2">
            {QUESTIONS.filter(q => q.assessmentType === AssessmentType.ADL).map((q) => {
              const answer = state.answers[q.id];
              const val = answer ? parseInt(answer.charAt(0)) : 1;
              
              return (
                <div key={q.id} className="flex justify-between items-center bg-gray-50 p-2 rounded text-sm">
                  <span className="text-gray-700">{q.text}</span>
                  <span className={`font-bold ${val >= 3 ? 'text-red-600' : val === 2 ? 'text-yellow-600' : 'text-green-600'}`}>
                    {answer || '1. 自己可以做'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 专业建议 */}
      <div className="mb-8 p-6 bg-yellow-50 border-l-4 border-yellow-500 rounded">
        <h3 className="text-lg font-bold text-yellow-900 mb-2">专业建议</h3>
        <p className="text-sm text-gray-700">
          本评估为筛查工具，不能作为临床诊断依据。如评估结果提示认知功能障碍或日常生活能力下降，
          建议尽快前往神经内科或康复科就诊，进行全面的神经心理学评估和影像学检查。
          早期发现、早期干预对改善预后至关重要。
        </p>
      </div>

      <div className="flex justify-center gap-4 mt-12 no-print">
        <button 
          onClick={() => window.print()} 
          className="bg-gray-800 text-white px-8 py-3 rounded-lg hover:bg-gray-900 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          打印报告 (Print Report)
        </button>
        <button 
          onClick={onRestart} 
          className="bg-white border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors"
        >
          重新评估 (New Assessment)
        </button>
      </div>

      <div className="text-center text-xs text-gray-400 mt-12 print-only border-t pt-4">
        <p>Generated by NeuroGuard AI Assessment System | {currentDate}</p>
        <p>This is a screening tool and not a substitute for professional medical diagnosis.</p>
      </div>
    </div>
  );
};
