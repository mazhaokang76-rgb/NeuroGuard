// ==================== 基础类型定义 ====================

export interface PatientInfo {
  name: string;
  age: number;
  educationYears: number;
  gender: 'male' | 'female';
  idNumber?: string;
}

export interface AssessmentState {
  currentStep: number;
  answers: Record<string, any>;
  scores: Record<string, number>;
  aiFeedback: Record<string, string>;
  isProcessing: boolean;
}

// ==================== 量表类型 ====================

export enum AssessmentType {
  MMSE = 'MMSE',
  MOCA = 'MOCA',
  ADL = 'ADL'
}

export enum QuestionInputType {
  TEXT = 'TEXT',
  AUDIO = 'AUDIO',
  DRAWING = 'DRAWING',
  CHOICE = 'CHOICE',
  SERIAL7 = 'serial7',
}

// ==================== 题目定义 ====================

export interface Question {
  id: string;
  assessmentType: AssessmentType;
  category: string;
  text: string;
  subText?: string;
  imageReference?: string;
  answerKey?: string;
  audioSrc?: string;
  inputType: QuestionInputType;
  options?: string[];
  maxScore: number;
  grokPrompt?: string;
}

// ==================== 评估结果 ====================

export interface ScaleResult {
  rawScore: number;
  maxScore: number;
  interpretation: string;
}
