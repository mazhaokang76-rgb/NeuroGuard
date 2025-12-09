import { GoogleGenAI, Type } from "@google/genai";

// 从环境变量获取 API Key
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

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

export interface EvaluationResult {
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
    return { score: 1, reasoning: "API Key 缺失，使用模拟评分。" };
  }

  try {
    // 正确初始化 GoogleGenAI
    const ai = new GoogleGenAI({ apiKey });
    const model = 'gemini-2.5-flash';
    const parts: any[] = [];

    // 构建完整提示词
    let fullPrompt = `
      You are a strict medical assistant grading a cognitive assessment test.
      Task: ${prompt}
      
      Output JSON format only:
      {
        "score": number (0 or 1),
        "reasoning": "short explanation in Chinese"
      }
    `;

    if (textInput) {
      fullPrompt += `\nUser Answer: "${textInput}"`;
    }

    parts.push({ text: fullPrompt });

    // 添加图片数据
    if (imageBlob) {
      const base64Data = await blobToBase64(imageBlob);
      parts.push({
        inlineData: {
          mimeType: imageBlob.type,
          data: base64Data
        }
      });
    }

    // 添加音频数据
    if (audioBlob) {
      const base64Data = await blobToBase64(audioBlob);
      parts.push({
        inlineData: {
          mimeType: audioBlob.type.includes('wav') ? 'audio/wav' : 'audio/webm',
          data: base64Data
        }
      });
    }

    // 调用 Gemini API
    const response = await ai.models.generateContent({
      model: model,
      contents: [{
        role: 'user',
        parts: parts
      }],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            reasoning: { type: Type.STRING }
          },
          required: ['score', 'reasoning']
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No response from AI");
    }

    const result = JSON.parse(resultText) as EvaluationResult;
    return result;

  } catch (error) {
    console.error("Gemini Evaluation Error:", error);
    return { 
      score: 0, 
      reasoning: "AI 评估失败。请检查网络连接或 API 密钥。" 
    };
  }
};
