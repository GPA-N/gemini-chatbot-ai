import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';

const app = express();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const GEMINI_MODEL = "gemini-2.5-flash-lite";

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;

app.post('/api/chat', async (req, res) => {
    const { conversation } = req.body;

    try {
        if (!Array.isArray(conversation.messages)) {
            throw new Error('Messages must be an array!');
        }

        const contents = conversation.messages.map(({ role, text }) => ({
            role,
            parts: [{ text: text }]
        }));

        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: contents,
        });

        res.status(200).json({ result: response.text });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server ready on http://localhost:${PORT}`);
});