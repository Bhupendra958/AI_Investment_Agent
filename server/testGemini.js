const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function run() {

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Say Hello",
  });

  console.log(response.text);
}

run();