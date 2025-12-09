import { GoogleGenAI, SchemaType } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to convert Blob to Base64
export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

interface EvaluationResult {
  score: number;
  reasoning: string;
}

export const evaluateResponse = async (
  prompt: string,
  textInput?: string,
  imageBlob?: Blob,
  audioBlob?: Blob
): Promise<EvaluationResult> => {
  if (!apiKey) {
    console.warn("No API Key provided. Returning mock score.");
    return { score: 1, reasoning: "API Key missing. Mock pass." };
  }

  try {
    const model = 'gemini-2.5-flash';
    const parts: any[] = [];

    // System instruction implicitly via prompt for this simpler implementation
    let fullPrompt = `
      You are a strict medical assistant grading a cognitive assessment test.
      Task: ${prompt}
      
      Output JSON format only:
      {
        "score": number,
        "reasoning": "short explanation in Chinese"
      }
    `;

    if (textInput) {
      fullPrompt += `\nUser Answer: "${textInput}"`;
    }

    parts.push({ text: fullPrompt });

    if (imageBlob) {
      const base64Data = await blobToBase64(imageBlob);
      parts.push({
        inlineData: {
          mimeType: imageBlob.type,
          data: base64Data
        }
      });
    }

    if (audioBlob) {
      const base64Data = await blobToBase64(audioBlob);
      // Gemini Flash handles audio in the 'inlineData' as well usually, 
      // but specific mime types are important.
      parts.push({
        inlineData: {
          mimeType: audioBlob.type.includes('wav') ? 'audio/wav' : 'audio/mp3',
          data: base64Data
        }
      });
    }

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        role: 'user',
        parts: parts
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            score: { type: SchemaType.NUMBER },
            reasoning: { type: SchemaType.STRING }
          }
        }
      }
    });

    const resultText = response.text;
    if (!resultText) throw new Error("No response from AI");

    return JSON.parse(resultText) as EvaluationResult;

  } catch (error) {
    console.error("Gemini Evaluation Error:", error);
    return { score: 0, reasoning: "AI evaluation failed. Please check connection or API key." };
  }
};