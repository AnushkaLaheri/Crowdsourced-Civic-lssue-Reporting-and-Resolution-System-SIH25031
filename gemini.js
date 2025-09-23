// gemini.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Gemini client initialize karo
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function getIssueTips(issue, location) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
    You are a civic issue assistant.
    Issue: ${issue}
    Location: ${location}
    Give 2-3 short practical tips (realistic, location-specific if possible).
    `;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I couldn't fetch tips right now.";
  }
}

module.exports = { getIssueTips };
