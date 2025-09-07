import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";

dotenv.config();

const app = express();
app.use(express.json());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello World Gemini");
});

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function generate(content) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: content }], 
        },
      ],
    });

    console.log("AI Response:", response.text);
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
}


app.get("/api/content", async (req, res) => {
  try {
    console.log("Incoming body:", req.body); 
    const data = req.body.question;
    console.log("Extracted question:", data); 

    if (!data) {
      return res.status(400).send({ error: "question is required in body" });
    }

    const result = await generate(data);
    res.send({ result });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});


app.listen(3000, () => {
  console.log("Server is UP and Running on Port 3000");
});

