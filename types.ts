enum AssessmentType {
  MMSE = 'MMSE',
  MOCA = 'MOCA',
  ADL = 'ADL'
}

enum QuestionInputType {
  CHOICE = 'CHOICE',
  TEXT = 'TEXT',
  AUDIO = 'AUDIO',
  DRAWING = 'DRAWING'
}

interface Question {
  id: string;
  assessmentType: AssessmentType;
  text: string;
  subText?: string;
  inputType: QuestionInputType;
  options?: string[];
  maxScore: number;
  grokPrompt?: string;
  category: string;
  imageReference?: string;
}

interface PatientInfo {
  name: string;
  age: number;
  educationYears: number;
  gender: 'male' | 'female';
  idNumber: string;
}

interface AssessmentState {
  currentStep: number;
  answers: Record<string, any>;
  scores: Record<string, number>;
  aiFeedback: Record<string, string>;
  isProcessing: boolean;
}
