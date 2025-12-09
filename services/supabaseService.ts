const SUPABASE_URL = 'https://ngietzlzwskrmnyuqeop.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5naWV0emx6d3Nrcm1ueXVxZW9wIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTI0NjgwOSwiZXhwIjoyMDgwODIyODA5fQ.mICW9lJG8Q1KFrLlFIhlMNdLRroFABTfHw5UHkjfAmc';

const supabase = {
  async saveAssessment(data: any) {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/assessments`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(data)
    });
    return response.json();
  },
  
  async getAssessments() {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/assessments?select=*&order=created_at.desc`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });
    return response.json();
  }
};

// ===== GROK AI SERVICE =====
const GROK_API_KEY = 'xai-vfPmbYaxu92AMqslSz8N1eVvRyK9XJVv1X8Fq3TWd29lMhFVMZO9HLJV6VmpVDCHV5VW9YXwzm4XBWWA';

const blobToBase64 = (blob: Blob): Promise<string> => {
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

const evaluateWithGrok = async (
  prompt: string,
  textInput?: string,
  imageBlob?: Blob,
  audioBlob?: Blob
): Promise<{ score: number; reasoning: string }> => {
  try {
    const messages: any[] = [];
    const content: any[] = [];
    
    let fullPrompt = `You are a medical AI grading a cognitive assessment.
Task: ${prompt}

Return ONLY valid JSON in this exact format:
{"score": 0 or 1, "reasoning": "brief Chinese explanation"}`;

    if (textInput) {
      fullPrompt += `\n\nUser Answer: "${textInput}"`;
    }
    
    content.push({ type: 'text', text: fullPrompt });

    if (imageBlob) {
      const base64Data = await blobToBase64(imageBlob);
      content.push({
        type: 'image_url',
        image_url: {
          url: `data:${imageBlob.type};base64,${base64Data}`
        }
      });
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
        temperature: 0.3
      })
    });

    const data = await response.json();
    const resultText = data.choices[0]?.message?.content || '{"score":0,"reasoning":"评估失败"}';
    
    const cleaned = resultText.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(cleaned);

  } catch (error) {
    console.error('Grok Error:', error);
    return { score: 0, reasoning: 'AI评估失败，请重试' };
  }
};
