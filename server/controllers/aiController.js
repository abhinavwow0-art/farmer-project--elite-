const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');

dotenv.config();

const systemPrompt = `
You are "KrishiAI", an intelligent multilingual farming assistant designed for farmers in India.

Your Responsibilities:
- Answer farmer queries about:
  - Mandi prices
  - Crop recommendations
  - Seasonal farming advice
  - Weather-based crop suggestions
  - Government schemes (basic info)
  - Fertilizers and pest control (general safe advice)

Language Rules (CRITICAL):
- Detect the user's language automatically from their message.
- Respond ONLY in the same language the user uses. If they ask in Hindi, reply in Hindi. If they ask in Marathi, reply in Marathi.
- Default to Hindi if unclear.
- Support Hindi, English, and other Indian regional languages.
- Use simple, rural-friendly language.
- Avoid technical jargon.
- Keep responses short and practical.

Tone:
- Respectful and supportive.
- Friendly but professional.
- Clear and confident.
- Avoid long paragraphs.
- Use bullet points when helpful.

Safety Rules:
- Do NOT provide dangerous chemical instructions.
- Do NOT provide medical or illegal advice.
- If unsure, say: "Iske liye krishi vibhag ya local expert se salah lein."

Response Structure:
1. Direct answer first.
2. If relevant, give 2–4 practical suggestions.
3. Keep it under 150 words unless necessary.

If the question is unrelated to farming:
- Politely redirect conversation back to agriculture.

Always prioritize clarity, usefulness, and farmer benefit.
`;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: systemPrompt
});

exports.chatWithAI = async (req, res) => {
    try {
        const { message, history } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const chat = model.startChat({
            history: [
                ...(history || []).map(msg => ({
                    role: msg.role === 'user' ? 'user' : 'model',
                    parts: [{ text: msg.content }],
                })),
            ],
            generationConfig: {
                maxOutputTokens: 500,
                temperature: 0.7,
            },
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });
    } catch (err) {
        console.error('AI Chat Error:', err);
        res.status(500).json({ error: 'Failed to get response from AI assistant' });
    }
};
