import React, { useEffect, useState } from 'react';
import { PatientInfo, AssessmentState, AssessmentType } from '../types';
import { MOCA_QUESTIONS, MOCA_MAX_SCORE } from '../constants/mocaQuestions';
import { saveAssessment } from '../services/supabaseService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { CheckCircle, XCircle, AlertCircle, Home } from 'lucide-react';

interface Props {
  patient: PatientInfo;
  state: AssessmentState;
  onRestart: () => void;
}

export function MOCAReport({ patient, state, onRestart }: Props) {
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  // 计算总分
  const rawScore = MOCA_QUESTIONS.reduce((sum, q) => sum + (state.scores[q.id] || 0), 0);
  
  // 教育程度校正
  let finalScore = rawScore;
  if (patient.educationYears <= 12 && rawScore < 30) {
    finalScore = Math.min(rawScore + 1, 30);
  }

  // 判定结果
  const interpretation = finalScore >= 26 ? '认知功能正常' : '可能存在认知功能障碍';
  const isNormal = finalScore >= 26;

  // 按类别统计得分
  const categoryScores = MOCA_QUESTIONS.reduce((acc, q) => {
    const cat = q.category;
    if (!acc[cat]) {
      acc[cat] = { earned: 0, total: 0 };
    }
    acc[cat].earned += state.scores[q.id] || 0;
    acc[cat].total += q.maxScore;
    return acc;
  }, {} as Record<string, { earned: number; total: number }>);

  const chartData = Object.entries(categoryScores).map(([name, data]) => ({
    name,
    score: data.earned,
    max: data.total,
    percentage: Math.round((data.earned / data.total) * 100)
  }));

  // 保存到数据库
  useEffect(() => {
    const save = async () => {
      setSaveStatus('saving');
      const result = await saveAssessment(
        patient,
        state,
        0, // MMSE score (not applicable)
        finalScore,
        0, // ADL score (not applicable)
        '',
        interpretation,
        ''
      );
      setSaveStatus(result.success ? 'success' : 'error');
    };
    save();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 p-8 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">MoCA 评估报告</h1>
              <p className="text-teal-100">蒙特利尔认知评估量表 (Montreal Cognitive Assessment)</p>
            </div>
            <div className="text-right">
              <p className="text-teal-100 text-sm">患者姓名</p>
              <p className="text-2xl font-bold">{patient.name}</p>
            </div>
          </div>
        </div>

        {/* 保存状态 */}
        {saveStatus === 'saving' && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 m-6">
            <p className="text-blue-900">正在保存评估结果...</p>
          </div>
        )}
        {saveStatus === 'success' && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 m-6 flex items-center gap-2">
            <CheckCircle className="text-green-600" size={20} />
            <p className="text-green-900 font-medium">评估结果已成功保存到数据库</p>
          </div>
        )}

        {/* 总分展示 */}
        <div className="p-8">
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <p className="text-gray-600 text-sm mb-2">原始得分</p>
              <p className="text-4xl font-bold text-gray-900">{rawScore}</p>
              <p className="text-gray-500 text-sm mt-1">/ {MOCA_MAX_SCORE}</p>
            </div>
            <div className="bg-teal-50 p-6 rounded-lg text-center">
              <p className="text-teal-700 text-sm mb-2">校正后得分</p>
              <p className="text-4xl font-bold text-teal-700">{finalScore}</p>
              <p className="text-teal-600 text-sm mt-1">/ {MOCA_MAX_SCORE}</p>
              {finalScore !== rawScore && (
                <p className="text-xs text-teal-600 mt-2">已应用教育程度校正 +1分</p>
              )}
            </div>
            <div className={`${isNormal ? 'bg-green-50' : 'bg-red-50'} p-6 rounded-lg text-center`}>
              <p className="text-gray-600 text-sm mb-2">评估结果</p>
              <div className="flex items-center justify-center gap-2">
                {isNormal ? (
                  <CheckCircle className="text-green-600" size={24} />
                ) : (
                  <AlertCircle className="text-red-600" size={24} />
                )}
                <p className={`text-lg font-bold ${isNormal ? 'text-green-700' : 'text-red-700'}`}>
                  {interpretation}
                </p>
              </div>
            </div>
          </div>

          {/* 判定说明 */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8">
            <h3 className="font-bold text-blue-900 mb-2">评分说明</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• 总分30分，≥26分为认知功能正常</li>
               <li>• 教育年限≤12年且得分&lt;30分，加1分校正</li>
               <li>• &lt;26分提示可能存在认知功能障碍</li>
              <li>• MoCA对轻度认知障碍(MCI)检测更敏感</li>
            </ul>
          </div>

          {/* 分类得分图表 */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">各项能力得分</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="score" name="得分">
                    {chartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.percentage >= 80 ? '#10b981' : entry.percentage >= 60 ? '#f59e0b' : '#ef4444'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 详细题目分析 */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">详细题目分析</h2>
            <div className="space-y-4">
              {MOCA_QUESTIONS.map((q) => {
                const score = state.scores[q.id] || 0;
                const feedback = state.aiFeedback[q.id];
                const isCorrect = score === q.maxScore;
                const isPartial = score > 0 && score < q.maxScore;

                return (
                  <div key={q.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {isCorrect ? (
                          <CheckCircle className="text-green-500" size={20} />
                        ) : isPartial ? (
                          <AlertCircle className="text-yellow-500" size={20} />
                        ) : (
                          <XCircle className="text-red-500" size={20} />
                        )}
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2 py-1 rounded">
                              {q.category}
                            </span>
                            <p className="font-medium text-gray-800 mt-1">{q.text}</p>
                          </div>
                          <span className={`font-mono font-bold text-lg ${
                            isCorrect ? 'text-green-600' : isPartial ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {score}/{q.maxScore}
                          </span>
                        </div>
                        {feedback && feedback !== "已记录回答" && (
                          <div className="mt-2 bg-gray-50 border-l-4 border-teal-500 p-3 rounded">
                            <p className="text-xs font-bold text-teal-700 mb-1">Grok AI 分析:</p>
                            <p className="text-sm text-gray-700">{feedback}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 专业建议 */}
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded mb-8">
            <h3 className="font-bold text-yellow-900 mb-2 flex items-center gap-2">
              <AlertCircle size={20} />
              专业建议
            </h3>
            <div className="text-sm text-yellow-800 space-y-2">
              {!isNormal && (
                <>
                  <p className="font-medium">本次评估结果提示可能存在认知功能障碍，建议：</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>尽快前往神经内科或记忆门诊就诊</li>
                    <li>进行全面的神经心理学评估</li>
                    <li>完善头部影像学检查(CT/MRI)</li>
                    <li>排查可逆性因素(如维生素缺乏、甲状腺功能等)</li>
                    <li>早期干预和康复训练</li>
                  </ul>
                </>
              )}
              {isNormal && (
                <>
                  <p>本次评估结果显示认知功能正常，建议：</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>保持健康的生活方式</li>
                    <li>定期进行认知功能监测</li>
                    <li>如有卒中史，注意二级预防</li>
                  </ul>
                </>
              )}
              <p className="mt-3 font-medium text-red-700">
                ⚠️ 注意：本评估仅为筛查工具，不能作为临床诊断依据。请咨询专业医生。
              </p>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => window.print()}
              className="bg-gray-700 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              打印报告
            </button>
            <button
              onClick={onRestart}
              className="bg-teal-600 text-white px-8 py-3 rounded-lg hover:bg-teal-700 transition-colors font-medium flex items-center gap-2"
            >
              <Home size={20} />
              返回首页
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
