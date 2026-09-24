require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { GoogleGenAI } = require("@google/genai");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

async function askGemini(message, retries = 3) {
    try {
        const response = await ai.models.generateContent({
          model: "gemini-3.6-flash",
            contents: message
        });

        return response.text;

    } catch (error) {
        console.log("Gemini error:", error.status || error.message);

        if (retries > 0 && error.status === 503) {
            console.log("Gemini temporarily unavailable. Retrying...");
            
            await new Promise(resolve => setTimeout(resolve, 2000));

            return askGemini(message, retries - 1);
        }

        throw error;
    }
}

app.post("/chat", async (req, res) => {
    try {
        const message = req.body.message;

        if (!message) {
            return res.status(400).json({
                error: "Message missing."
            });
        }

        const reply = await askGemini(message);

        res.json({
            reply: reply
        });

    } catch (error) {
        console.error("Final error:", error);

        res.status(500).json({
            error: "AI response nahi aa rahi. Thori dair baad dobara try karo."
        });
    }
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Saim AI server running on http://localhost:3000");
});