import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Ensure body is an object even if parsing fails (e.g., raw string)
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
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
      You are an expert linguist and value investor, acting as a tutor for a Chinese student learning from Warren Buffett's shareholder letters.

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
      - If the text is short, focus on the specific words. If it's long, focus on the overall message.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean up markdown code blocks if present
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();

    let data;
    try {
      data = JSON.parse(jsonStr);
    } catch (parseErr) {
      console.error('Failed to parse Gemini response JSON:', parseErr);
      return res.status(500).json({ message: 'Invalid response format from Gemini API' });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ message: 'Error analyzing text', error: error.message });
  }
}
