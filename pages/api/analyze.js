// Volcengine (火山引擎) DeepSeek API for text analysis
// API Key format: UUID (get from https://ark.cn-beijing.volces.com/)

const API_KEY = process.env.VOLC_API_KEY;
const API_URL = 'https://ark.cn-beijing.volces.com/api/v3/responses';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Check if API key is configured
  if (!API_KEY) {
    console.error('VOLC_API_KEY is not configured');
    return res.status(500).json({ message: 'API configuration error - VOLC_API_KEY not set' });
  }

  // Parse request body
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (e) {
      body = {};
    }
  }
  const { selectedText, proficiency = 'Intermediate' } = body;

  if (!selectedText) {
    return res.status(400).json({ message: 'No text selected' });
  }

  try {
    const prompt = `You are an expert linguist and value investor, acting as a tutor for a Chinese student learning from Warren Buffett's shareholder letters.

Your task is to analyze the following excerpt from a shareholder letter.
Target Audience Proficiency: ${proficiency}

Excerpt: "${selectedText}"

Provide the analysis in strictly valid JSON format with the following structure:
{
  "LanguageLab": [
    {
      "term": "Word or Phrase",
      "type": "Idiom/Verb/Noun/Expression",
      "definition_cn": "Chinese definition",
      "example": "Example sentence (IELTS style if applicable)"
    }
  ],
  "Rhetoric": {
    "technique": "Rhetorical device used (e.g., Irony, Metaphor)",
    "tone": "Tone of the excerpt (e.g., Deadpan Humor, Cautious)",
    "analysis_cn": "Detailed analysis in Chinese explaining *how* the technique/tone is used and its effect."
  },
  "Wisdom": {
    "concept": "Key investment or business concept (e.g., Moat, Float)",
    "explanation_cn": "Deep explanation of the concept in Chinese, connecting it to the excerpt and Buffett's philosophy."
  }
}

Constraints:
- Output MUST be valid JSON.
- All explanations (definition_cn, analysis_cn, explanation_cn) MUST be in Chinese.
- For "Beginner", keep Chinese explanations simple and direct.
- For "Advanced", provide deeper nuance and context in the Chinese explanations.
- If the text is short, focus on the specific words. If it's long, focus on the overall message.`;

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'deepseek-v3-2-251201',
        stream: false,
        input: [
          {
            role: 'user',
            content: [
              {
                type: 'input_text',
                text: prompt
              }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Volc API Error:', response.status, errorText);
      return res.status(500).json({
        message: 'Volc API error',
        status: response.status,
        error: errorText
      });
    }

    const data = await response.json();

    // Extract content from Volc response format
    // Format: { output: [{ type: "message", role: "assistant", content: [{ type: "output_text", text: "..." }] }] }
    let content = '';
    if (data.output?.[0]?.content?.[0]?.text) {
      content = data.output[0].content[0].text;
    } else {
      console.error('Unexpected Volc response format:', JSON.stringify(data).substring(0, 500));
      return res.status(500).json({ message: 'Unexpected response format from Volc API' });
    }

    // Clean up markdown code blocks if present
    const jsonStr = content.replace(/```json/g, '').replace(/```/g, '').trim();

    let parsedData;
    try {
      parsedData = JSON.parse(jsonStr);
    } catch (parseErr) {
      console.error('Failed to parse Volc response JSON:', parseErr);
      console.error('Response text:', content.substring(0, 500));
      return res.status(500).json({
        message: 'Invalid response format from Volc API',
        rawResponse: content.substring(0, 500)
      });
    }

    res.status(200).json(parsedData);
  } catch (error) {
    console.error('Volc API Error:', error);
    res.status(500).json({
      message: 'Error analyzing text',
      error: error.message,
      type: error.constructor.name
    });
  }
}
