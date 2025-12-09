export enum AssessmentType {
  MMSE = 'MMSE',
  MOCA = 'MOCA',
  ADL = 'ADL'
}

export enum QuestionInputType {
  CHOICE = 'CHOICE', // Single select
  TEXT = 'TEXT', // Typed answer
  AUDIO = 'AUDIO', // Voice recording
  DRAWING = 'DRAWING', // Canvas or file upload
  INSTRUCTION = 'INSTRUCTION' // Just reading
}

export interface Question {
  id: string;
  assessmentType: AssessmentType;
  text: string;
  subText?: string; // Additional instructions
  inputType: QuestionInputType;
  options?: string[]; // For CHOICE
  maxScore: number;
  geminiPrompt?: string; // Specific instructions for AI grading
  category: string; // e.g., "Orientation", "Memory"
  imageReference?: string; // URL for naming tasks
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
  answers: Record<string, any>; // questionId -> answer (string, number, blob, etc.)
  scores: Record<string, number>; // questionId -> calculated score
  aiFeedback: Record<string, string>; // questionId -> Gemini reasoning
  isProcessing: boolean;
}

export interface ScaleResult {
  rawScore: number;
  maxScore: number;
  interpretation: string;
}