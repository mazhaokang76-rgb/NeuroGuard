import React, { useState } from 'react';
import { PatientInfo } from '../types';

interface Props {
  onComplete: (info: PatientInfo) => void;
}

export const PatientForm: React.FC<Props> = ({ onComplete }) => {
  const [info, setInfo] = useState<PatientInfo>({
    name: '',
    age: 65,
    educationYears: 12,
    gender: 'male',
    idNumber: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(info);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-bold text-primary mb-6 border-b pb-4">患者信息登记 (Patient Registration)</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">姓名 (Name)</label>
            <input
              required
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              value={info.name}
              onChange={e => setInfo({ ...info, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">身份证号/病历号 (ID)</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              value={info.idNumber}
              onChange={e => setInfo({ ...info, idNumber: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">年龄 (Age)</label>
            <input
              required
              type="number"
              min="1"
              max="120"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              value={info.age}
              onChange={e => setInfo({ ...info, age: parseInt(e.target.value) })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">受教育年限 (Years of Education)</label>
            <input
              required
              type="number"
              min="0"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              value={info.educationYears}
              onChange={e => setInfo({ ...info, educationYears: parseInt(e.target.value) })}
            />
            <p className="text-xs text-gray-500 mt-1">注: ≤12年教育可能影响MoCA评分标准。</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">性别 (Gender)</label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              value={info.gender}
              onChange={e => setInfo({ ...info, gender: e.target.value as 'male' | 'female' })}
            >
              <option value="male">男 (Male)</option>
              <option value="female">女 (Female)</option>
            </select>
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-primary hover:bg-teal-800 text-white font-bold py-4 rounded-lg transition-colors shadow-md text-lg"
          >
            开始评估 (Start Assessment)
          </button>
        </div>
      </form>
    </div>
  );
};