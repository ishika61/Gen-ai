const fetch = require("node-fetch");

async function voiceInterviewAgent({ message, history, resume, jobDescription }) {
  try {
    const prompt = `
You are a professional AI interviewer.

Context:
Resume: ${resume || "Not provided"}
Job Description: ${jobDescription || "Not provided"}

Rules:
- Start interview if empty
- Ask ONE question at a time
- Give short feedback
- Ask next question
- Be natural like real interviewer

Conversation:
${history || ""}

User: ${message || "Start interview"}
`;

    console.log("PROMPT:", prompt);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GOOGLE_GENAI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    console.log("AI RESPONSE:", data);

    if (!data.candidates) {
      throw new Error("Invalid AI response");
    }

    return data.candidates[0].content.parts[0].text;

  } catch (error) {
    console.error("AGENT ERROR:", error);
    return "AI service error. Please try again.";
  }
}

module.exports = { voiceInterviewAgent };