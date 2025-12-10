import React, { useEffect, useState } from 'react';
import { PatientInfo, AssessmentState } from '../types';
import { MMSE_QUESTIONS, MMSE_MAX_SCORE, MMSE_NORMAL_CUTOFF } from '../constants/mmseQuestions';
import { saveAssessment } from '../services/supabaseService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { CheckCircle, XCircle, AlertCircle, Home } from 'lucide-react';

interface Props {
  patient: PatientInfo;
  state: AssessmentState;
  onRestart: () => void;
}

export function MMSEReport({ patient, state, onRestart }: Props) {
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  // 计算总分
  const totalScore = MMSE_QUESTIONS.reduce((sum, q) => sum + (state.scores[q.id] || 0), 0);

  // 判定结果
  let interpretation = '';
  let severity = '';
  
  if (totalScore >= MMSE_NORMAL_CUTOFF) {
    interpretation = '认知功能正常';
  } else {
    interpretation = '认知功能障碍';
    if (totalScore >= 21) {
      severity = '轻度';
    } else if (totalScore >= 10) {
      severity = '中度';
    } else {
      severity = '重度';
    }
  }

  const isNormal = totalScore >= MMSE_NORMAL_CUTOFF;

  // 按类别统计得分
  const categoryScores = MMSE_QUESTIONS.reduce((acc, q) => {
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
        totalScore,
        0,
        0,
        severity ? `${interpretation}(${severity})` : interpretation,
        '',
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
              <h1 className="text-3xl font-bold mb-2">MMSE 评估报告</h1>
              <p className="text-teal-100">简易精神状态检查 (Mini-Mental State Examination)</p>
            </div>
            <div className="text-right">
              <p className="text-teal-100 text-sm">患者姓名</p>
              <p className="text-2xl font-bold">{patient.name}</p>
            </div>
          </div>
        </div>

        {/* 保存状态 */}
        {saveStatus === 'success' && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 m-6 flex items-center gap-2">
            <CheckCircle className="text-green-600" size={20} />
            <p className="text-green-900 font-medium">评估结果已成功保存到数据库</p>
          </div>
        )}

        {/* 总分展示 */}
        <div className="p-8">
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-teal-50 p-6 rounded-lg text-center col-span-2">
              <p className="text-teal-700 text-sm mb-2">总得分</p>
              <p className="text-5xl font-bold text-teal-700">{totalScore}</p>
              <p className="text-teal-600 text-sm mt-1">/ {MMSE_MAX_SCORE}</p>
            </div>
            <div className={`${isNormal ? 'bg-green-50' : 'bg-red-50'} p-6 rounded-lg text-center`}>
              <p className="text-gray-600 text-sm mb-2">评估结果</p>
              <div className="flex flex-col items-center justify-center gap-2">
                {isNormal ? (
                  <CheckCircle className="text-green-600" size={32} />
                ) : (
                  <AlertCircle className="text-red-600" size={32} />
                )}
                <p className={`text-lg font-bold ${isNormal ? 'text-green-700' : 'text-red-700'}`}>
                  {interpretation}
                </p>
                {severity && (
                  <span className="text-sm font-semibold text-red-600 bg-red-100 px-3 py-1 rounded-full">
                    {severity}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 判定说明 */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8">
            <h3 className="font-bold text-blue-900 mb-2">判定标准</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <strong>正常:</strong> 27-30分</li>
              <li>• <strong>认知功能障碍:</strong> 得分 &lt; 27分</li>
              <li>• <strong>痴呆严重程度分级:</strong></li>
              <li className="ml-6">- 轻度: MMSE ≥ 21分</li>
              <li className="ml-6">- 中度: MMSE 10-20分</li>
              <li className="ml-6">- 重度: MMSE ≤ 9分</li>
            </ul>
          </div>

          {/* 分类得分图表 */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">各项能力得分</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={120} />
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
              {MMSE_QUESTIONS.map((q) => {
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
                  <p className="font-medium">本次MMSE评估结果提示{interpretation}{severity && `(${severity})`}，建议：</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>立即前往神经内科就诊</li>
                    <li>进行全面的认知功能评估和神经心理学检查</li>
                    <li>完善头部影像学检查(CT/MRI)</li>
                    <li>检查血液生化指标，排查可逆性因素</li>
                    <li>根据医生建议制定治疗和康复方案</li>
                    {severity === '重度' && <li className="text-red-700 font-bold">重度认知障碍，需要专业医疗照护</li>}
                  </ul>
                </>
              )}
              {isNormal && (
                <>
                  <p>本次MMSE评估结果显示认知功能正常，建议：</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>保持健康的生活方式</li>
                    <li>定期进行认知功能监测(建议每年一次)</li>
                    <li>如有卒中史，注意控制危险因素</li>
                    <li>保持适度的脑力和体力活动</li>
                  </ul>
                </>
              )}
              <p className="mt-3 font-medium text-red-700">
                ⚠️ 注意：MMSE是快速筛查工具，不能作为临床诊断依据。请咨询专业医生进行全面评估。
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
