import React, { useEffect, useState } from 'react';
import { PatientInfo, AssessmentState } from '../types';
import { ADL_QUESTIONS, ADL_MAX_SCORE, ADL_NORMAL_CUTOFF } from '../constants/adlQuestions';
import { saveAssessment } from '../services/supabaseService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { CheckCircle, AlertCircle, Home } from 'lucide-react';

interface Props {
  patient: PatientInfo;
  state: AssessmentState;
  onRestart: () => void;
}

export function ADLReport({ patient, state, onRestart }: Props) {
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  // 计算总分
  const totalScore = ADL_QUESTIONS.reduce((sum, q) => sum + (state.scores[q.id] || 1), 0);

  // 统计功能下降项目
  const impairedItems = ADL_QUESTIONS.filter(q => {
    const score = state.scores[q.id] || 1;
    return score >= 3; // 3分或4分表示需要帮助或无法完成
  }).length;

  // 判定结果
  let interpretation = '';
  let severity = '';
  
  if (totalScore <= ADL_NORMAL_CUTOFF) {
    interpretation = '日常生活能力完全正常';
  } else if (impairedItems >= 2 || totalScore >= 22) {
    interpretation = '明显功能障碍';
    severity = '严重';
  } else {
    interpretation = '不同程度功能下降';
    severity = '轻度';
  }

  const isNormal = totalScore <= ADL_NORMAL_CUTOFF;

  // 分组统计（基本ADL vs 工具性ADL）
  const basicADL = ADL_QUESTIONS.slice(5, 12); // 6-12项：吃饭、穿衣、梳洗、走路、上下楼、床椅转移
  const instrumentalADL = ADL_QUESTIONS.filter((_, i) => i < 5 || i >= 12); // 其他项

  const basicScore = basicADL.reduce((sum, q) => sum + (state.scores[q.id] || 1), 0);
  const instrumentalScore = instrumentalADL.reduce((sum, q) => sum + (state.scores[q.id] || 1), 0);

  const chartData = [
    { name: '基本生活活动', score: basicScore, max: basicADL.length * 4 },
    { name: '工具性日常活动', score: instrumentalScore, max: instrumentalADL.length * 4 }
  ];

  // 保存到数据库
  useEffect(() => {
    const save = async () => {
      setSaveStatus('saving');
      const result = await saveAssessment(
        patient,
        state,
        0,
        0,
        totalScore,
        '',
        '',
        severity ? `${interpretation}(${severity})` : interpretation
      );
      setSaveStatus(result.success ? 'success' : 'error');
    };
    save();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-8 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">ADL 评估报告</h1>
              <p className="text-amber-100">日常生活活动能力量表 (Activities of Daily Living)</p>
            </div>
            <div className="text-right">
              <p className="text-amber-100 text-sm">患者姓名</p>
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
            <div className="bg-amber-50 p-6 rounded-lg text-center">
              <p className="text-amber-700 text-sm mb-2">ADL 总分</p>
              <p className="text-5xl font-bold text-amber-600">{totalScore}</p>
              <p className="text-amber-500 text-sm mt-1">/ {ADL_MAX_SCORE}</p>
              <p className="text-xs text-gray-500 mt-2">分数越低越好</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <p className="text-gray-600 text-sm mb-2">功能下降项目</p>
              <p className="text-4xl font-bold text-gray-800">{impairedItems}</p>
              <p className="text-gray-500 text-sm mt-1">/ 20项</p>
              <p className="text-xs text-gray-500 mt-2">评分≥3分的项目</p>
            </div>
            <div className={`${isNormal ? 'bg-green-50' : 'bg-red-50'} p-6 rounded-lg text-center`}>
              <p className="text-gray-600 text-sm mb-2">评估结果</p>
              <div className="flex flex-col items-center justify-center gap-2">
                {isNormal ? (
                  <CheckCircle className="text-green-600" size={32} />
                ) : (
                  <AlertCircle className="text-red-600" size={32} />
                )}
                <p className={`text-base font-bold ${isNormal ? 'text-green-700' : 'text-red-700'}`}>
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
              <li>• <strong>完全正常:</strong> 总分 ≤ 26分（20项全选"自己可以做"为20分）</li>
              <li>• <strong>不同程度功能下降:</strong> 总分 &gt; 26分</li>
              <li>• <strong>明显功能障碍:</strong> 2项或以上≥3分，或总分≥22分</li>
              <li>• <strong>单项分:</strong> 1分=正常，2-4分=功能下降</li>
            </ul>
          </div>

          {/* 分类得分图表 */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">能力分类得分</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="score" name="得分" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm text-gray-500 text-center mt-2">
              注：分数越低表示功能越好。最低分为该类别项目数×1
            </p>
          </div>

          {/* 详细题目分析 */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">详细项目评分</h2>
            
            {/* 基本ADL */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-amber-700 mb-3 bg-amber-50 p-2 rounded">
                躯体生活自理能力 (PSMS)
              </h3>
              <div className="space-y-2">
                {basicADL.map((q) => {
                  const score = state.scores[q.id] || 1;
                  const answer = state.answers[q.id];
                  const isNormal = score === 1;
                  const isSevere = score >= 3;

                  return (
                    <div key={q.id} className={`flex justify-between items-center p-3 rounded ${
                      isNormal ? 'bg-green-50' : isSevere ? 'bg-red-50' : 'bg-yellow-50'
                    }`}>
                      <span className="text-gray-800">{q.text}</span>
                      <span className={`font-bold text-lg ${
                        isNormal ? 'text-green-600' : isSevere ? 'text-red-600' : 'text-yellow-600'
                      }`}>
                        {answer || '1. 自己可以做'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 工具性ADL */}
            <div>
              <h3 className="text-lg font-bold text-amber-700 mb-3 bg-amber-50 p-2 rounded">
                工具性日常生活能力 (IADL)
              </h3>
              <div className="space-y-2">
                {instrumentalADL.map((q) => {
                  const score = state.scores[q.id] || 1;
                  const answer = state.answers[q.id];
                  const isNormal = score === 1;
                  const isSevere = score >= 3;

                  return (
                    <div key={q.id} className={`flex justify-between items-center p-3 rounded ${
                      isNormal ? 'bg-green-50' : isSevere ? 'bg-red-50' : 'bg-yellow-50'
                    }`}>
                      <span className="text-gray-800">{q.text}</span>
                      <span className={`font-bold text-lg ${
                        isNormal ? 'text-green-600' : isSevere ? 'text-red-600' : 'text-yellow-600'
                      }`}>
                        {answer || '1. 自己可以做'}
                      </span>
                    </div>
                  );
                })}
              </div>
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
                  <p className="font-medium">本次ADL评估显示日常生活能力存在{interpretation}，建议：</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>咨询康复科医生，制定个性化康复方案</li>
                    <li>进行日常生活能力训练(ADL训练)</li>
                    <li>家庭环境适老化改造，减少跌倒风险</li>
                    <li>使用辅助器具(助行器、扶手等)</li>
                    <li>家属接受照护培训</li>
                    {severity === '严重' && (
                      <li className="text-red-700 font-bold">功能障碍明显，建议专业医疗照护或护理机构</li>
                    )}
                  </ul>
                </>
              )}
              {isNormal && (
                <>
                  <p>本次ADL评估显示日常生活能力完全正常，建议：</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>保持现有的生活状态</li>
                    <li>定期进行ADL评估(建议每6个月一次)</li>
                    <li>注意预防跌倒和意外伤害</li>
                    <li>保持适度的体力活动</li>
                  </ul>
                </>
              )}
              <p className="mt-3 font-medium text-red-700">
                ⚠️ 注意：ADL量表评估需结合患者实际情况。如评估时有家属协助，可能影响结果准确性。
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
              className="bg-amber-500 text-white px-8 py-3 rounded-lg hover:bg-amber-600 transition-colors font-medium flex items-center gap-2"
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
