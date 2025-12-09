// Grok AI Service
const GROK_API_KEY = import.meta.env.VITE_GROK_API_KEY || 'xai-vfPmbYaxu92AMqslSz8N1eVvRyK9XJVv1X8Fq3TWd29lMhFVMZO9HLJV6VmpVDCHV5VW9YXwzm4XBWWA';

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
  if (!GROK_API_KEY) {
    console.warn("No Grok API Key provided. Returning mock score.");
    return { score: 1, reasoning: "API Key 缺失，使用模拟评分。" };
  }

  try {
    const messages: any[] = [];
    const content: any[] = [];
    
    let fullPrompt = `You are a medical AI grading a cognitive assessment.
Task: ${prompt}

Return ONLY valid JSON in this exact format:
{"score": <number>, "reasoning": "brief Chinese explanation"}

Important: 
- For questions asking to count items, return the exact count as score
- For yes/no questions, return 1 for correct, 0 for incorrect
- For multi-point questions, return the earned points (e.g., 0-3 or 0-5)`;

    if (textInput) {
      fullPrompt += `\n\nUser Text Answer: "${textInput}"`;
    }
    
    content.push({ type: 'text', text: fullPrompt });

    // Add image if provided
    if (imageBlob) {
      const base64Data = await blobToBase64(imageBlob);
      content.push({
        type: 'image_url',
        image_url: {
          url: `data:${imageBlob.type};base64,${base64Data}`
        }
      });
    }

    // Add audio if provided (Grok supports audio analysis)
    if (audioBlob) {
      const base64Data = await blobToBase64(audioBlob);
      // For audio, we describe it as a file in the prompt
      content.push({
        type: 'text',
        text: `[Audio file provided - transcribe and analyze the speech]`
      });
      // Note: Full audio support may require different API endpoint
      // For now, we'll process it as best as possible
    }

    messages.push({ role: 'user', content });

    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'grok-2-vision-1212',
        messages,
        temperature: 0.3,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Grok API Error:', errorText);
      throw new Error(`Grok API failed: ${response.status}`);
    }

    const data = await response.json();
    const resultText = data.choices[0]?.message?.content || '{"score":0,"reasoning":"评估失败"}';
    
    // Clean up markdown code blocks if present
    const cleaned = resultText.replace(/```json\n?|\n?```/g, '').trim();
    
    const result = JSON.parse(cleaned) as EvaluationResult;
    return result;

  } catch (error) {
    console.error('Grok Evaluation Error:', error);
    return { 
      score: 0, 
      reasoning: 'AI评估失败，请重试。Error: ' + (error as Error).message 
    };
  }
};
