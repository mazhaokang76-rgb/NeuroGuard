import { PatientInfo, AssessmentState } from '../types';

const SUPABASE_URL = 'https://ngietzlzwskrmnyuqeop.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5naWV0emx6d3Nrcm1ueXVxZW9wIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTI0NjgwOSwiZXhwIjoyMDgwODIyODA5fQ.mICW9lJG8Q1KFrLlFIhlMNdLRroFABTfHw5UHkjfAmc';

export interface AssessmentRecord {
  patient_name: string;
  patient_age: number;
  patient_education_years: number;
  patient_gender: string;
  patient_id_number: string;
  mmse_score: number;
  moca_score: number;
  adl_score: number;
  mmse_interpretation: string;
  moca_interpretation: string;
  adl_interpretation: string;
  answers: any;
  scores: any;
  ai_feedback: any;
}

export const saveAssessment = async (
  patient: PatientInfo,
  state: AssessmentState,
  mmseScore: number,
  mocaScore: number,
  adlScore: number,
  mmseInterpretation: string,
  mocaInterpretation: string,
  adlInterpretation: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const record: AssessmentRecord = {
      patient_name: patient.name,
      patient_age: patient.age,
      patient_education_years: patient.educationYears,
      patient_gender: patient.gender,
      patient_id_number: patient.idNumber || '',
      mmse_score: mmseScore,
      moca_score: mocaScore,
      adl_score: adlScore,
      mmse_interpretation: mmseInterpretation,
      moca_interpretation: mocaInterpretation,
      adl_interpretation: adlInterpretation,
      answers: state.answers,
      scores: state.scores,
      ai_feedback: state.aiFeedback
    };

    const response = await fetch(`${SUPABASE_URL}/rest/v1/assessments`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(record)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Supabase Error:', errorText);
      throw new Error(`Failed to save: ${response.status}`);
    }

    const data = await response.json();
    console.log('Assessment saved successfully:', data);
    return { success: true };

  } catch (error) {
    console.error('Save assessment error:', error);
    return { 
      success: false, 
      error: (error as Error).message 
    };
  }
};

export const getAssessments = async (patientName?: string): Promise<any[]> => {
  try {
    let url = `${SUPABASE_URL}/rest/v1/assessments?select=*&order=created_at.desc`;
    
    if (patientName) {
      url += `&patient_name=eq.${encodeURIComponent(patientName)}`;
    }

    const response = await fetch(url, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    return await response.json();

  } catch (error) {
    console.error('Get assessments error:', error);
    return [];
  }
};
