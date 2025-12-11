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

// 清理 JSON 响应
function cleanJsonResponse(text: string): string {
  // 移除 markdown 代码块标记
  let cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  
  // 尝试提取 JSON 对象
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    cleaned = jsonMatch[0];
  }
  
  return cleaned;
}

// 解析响应，更严格的错误处理
function parseGrokResponse(text: string): EvaluationResult {
  try {
    const cleaned = cleanJsonResponse(text);
    const parsed = JSON.parse(cleaned);
    
    // 验证必需字段
    if (typeof parsed.score === 'undefined' || typeof parsed.reasoning === 'undefined') {
      throw new Error('Missing required fields');
    }
    
    return {
      score: Number(parsed.score),
      reasoning: String(parsed.reasoning)
    };
  } catch (error) {
    console.error('Failed to parse Grok response:', text);
    console.error('Parse error:', error);
    
    // 尝试从文本中提取分数
    const scoreMatch = text.match(/score["\s:]+(\d+)/i);
    const score = scoreMatch ? parseInt(scoreMatch[1]) : 0;
    
    return {
      score,
      reasoning: `解析失败，使用默认评分。原始响应: ${text.substring(0, 100)}...`
    };
  }
}

export const evaluateResponse = async (
  prompt: string,
  textInput?: string,
  imageBlob?: Blob,
  audioBlob?: Blob
): Promise<EvaluationResult> => {
  if (!GROK_API_KEY) {
    console.warn("No Grok API Key provided.");
    return { score: 0, reasoning: "API Key 缺失" };
  }

  try {
    const messages: any[] = [];
    const content: any[] = [];
    
    // 强化 prompt，要求严格 JSON 格式
    let fullPrompt = `You are a medical AI evaluating cognitive assessment responses.

CRITICAL: You MUST respond with ONLY a valid JSON object, no other text before or after.

${prompt}

Required response format (NOTHING else):
{"score": <number>, "reasoning": "<brief explanation in Chinese>"}`;

    if (textInput) {
      fullPrompt += `\n\nUser's text answer: "${textInput}"`;
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

    // Note: Grok vision model may have limited audio support
    // For audio, we'll note it in the prompt
    if (audioBlob) {
      fullPrompt += `\n\n[Note: User provided audio response - transcription may be needed]`;
      content[0].text = fullPrompt;
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
        temperature: 0.1, // 降低温度以获得更一致的输出
        max_tokens: 500,
        response_format: { type: "json_object" } // 强制 JSON 模式
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Grok API Error:', errorText);
      throw new Error(`Grok API failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const resultText = data.choices[0]?.message?.content;
    
    if (!resultText) {
      throw new Error('No response content from Grok');
    }

    console.log('Grok raw response:', resultText); // 调试日志
    
    return parseGrokResponse(resultText);

  } catch (error) {
    console.error('Grok Evaluation Error:', error);
    const errorMsg = error instanceof Error ? error.message : '未知错误';
    
    return { 
      score: 0, 
      reasoning: `AI评估失败: ${errorMsg}` 
    };
  }
};
