import React, { useState } from 'react';
import { Clock, Brain, Activity } from 'lucide-react';

const AssessmentCard = ({ title, subtitle, description, icon: Icon, color, onStart }) => (
  <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all border-t-4" style={{ borderColor: color }}>
    <div className="flex items-center mb-4">
      <div className="p-3 rounded-full" style={{ backgroundColor: `${color}20` }}>
        <Icon size={32} style={{ color }} />
      </div>
      <div className="ml-4">
        <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
    </div>
    <p className="text-gray-600 mb-6 leading-relaxed">{description}</p>
    <button
      onClick={onStart}
      className="w-full py-3 rounded-lg font-bold text-white transition-colors"
      style={{ backgroundColor: color }}
    >
      开始评估
    </button>
  </div>
);

export default function Home({ onSelectAssessment }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
            卒中后认知障碍评估系统
          </h1>
          <p className="text-xl text-gray-600">
            Post-Stroke Cognitive Impairment Assessment System
          </p>
          <p className="text-sm text-gray-500 mt-2">
            基于AI的智能化多维度认知功能评估
          </p>
        </div>

        {/* 患者信息提示 */}
        <div className="bg-blue-100 border-l-4 border-blue-500 p-4 mb-8 rounded">
          <p className="text-blue-900">
            <strong>提示：</strong>请根据患者实际情况选择相应的评估量表。每个量表评估完成后会生成独立报告。
          </p>
        </div>

        {/* Assessment Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <AssessmentCard
            title="MMSE"
            subtitle="简易精神状态检查"
            description="评估定向力、记忆力、注意力、语言能力等基本认知功能。适用于快速筛查认知障碍。30分制，<27分提示认知功能障碍。"
            icon={Brain}
            color="#0f766e"
            onStart={() => onSelectAssessment('MMSE')}
          />
          
          <AssessmentCard
            title="MoCA"
            subtitle="蒙特利尔认知评估"
            description="更全面的认知功能评估，包含视空间、执行功能、抽象思维等。对轻度认知障碍更敏感。30分制，<26分提示认知功能障碍。"
            icon={Activity}
            color="#0d9488"
            onStart={() => onSelectAssessment('MOCA')}
          />
          
          <AssessmentCard
            title="ADL"
            subtitle="日常生活能力量表"
            description="评估患者日常生活自理能力，包括基本生活活动和工具性日常活动。80分制，>26分提示功能下降。"
            icon={Clock}
            color="#f59e0b"
            onStart={() => onSelectAssessment('ADL')}
          />
        </div>

        {/* 使用说明 */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">使用说明</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-teal-700 mb-2">评估流程</h3>
              <ol className="list-decimal list-inside space-y-1 text-gray-600">
                <li>选择适合的评估量表</li>
                <li>填写患者基本信息</li>
                <li>按顺序完成所有题目</li>
                <li>AI自动评分并生成报告</li>
                <li>可打印或保存评估报告</li>
              </ol>
            </div>
            <div>
              <h3 className="font-bold text-teal-700 mb-2">注意事项</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>确保安静的评估环境</li>
                <li>按照题目要求如实作答</li>
                <li>支持语音、文字、图片输入</li>
                <li>结果仅供参考，非诊断依据</li>
                <li>建议咨询专业医生</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>© 2025 上海智缘益慷科技有限公司</p>
        </div>
      </div>
    </div>
  );
}
