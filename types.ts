// 完整替换文件内容
export enum AssessmentType {
  MMSE = 'MMSE',
  MOCA = 'MOCA',
  ADL = 'ADL'
}

export enum QuestionInputType {
  CHOICE = 'CHOICE',
  TEXT = 'TEXT',
  AUDIO = 'AUDIO',
  DRAWING = 'DRAWING'
}

export interface Question {
  id: string;
  assessmentType: AssessmentType;
  text: string;
  subText?: string;
  inputType: QuestionInputType;
  options?: string[];
  maxScore: number;
  geminiPrompt?: string;  // 改为 geminiPrompt
  category: string;
  imageReference?: string;
}

export interface PatientInfo {
  name: string;
  age: number;
  educationYears: number;
  gender: 'male' | 'female';
  idNumber: string;
}

export interface AssessmentState {
  currentStep: number;
  answers: Record<string, any>;
  scores: Record<string, number>;
  aiFeedback: Record<string, string>;
  isProcessing: boolean;
}

export interface ScaleResult {
  rawScore: number;
  maxScore: number;
  interpretation: string;
}
