const MODEL_CANDIDATES = [
    process.env.GEMINI_MODEL,
    "gemini-2.0-flash",
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite"
].filter(Boolean);

async function callGemini(prompt) {
    const apiKey = process.env.GOOGLE_GENAI_API_KEY;

    if (!apiKey) {
        throw new Error("GOOGLE_GENAI_API_KEY is missing in .env");
    }

    let lastError = null;

    for (const model of MODEL_CANDIDATES) {
        try {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        contents: [
                            {
                                parts: [{ text: prompt }]
                            }
                        ],
                        generationConfig: {
                            temperature: 0.7,
                            maxOutputTokens: 600
                        }
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                lastError = data?.error?.message || `Gemini request failed for ${model}`;
                continue;
            }

            const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

            if (text) {
                return text;
            }

            lastError = `Empty Gemini response for ${model}`;
        } catch (error) {
            lastError = error.message;
        }
    }

    throw new Error(lastError || "All Gemini models failed");
}

async function voiceInterviewAgent({
    message,
    history,
    resume,
    jobDescription,
    title,
    technicalQuestions,
    skillGaps
}) {
    try {
        const technicalQuestionText = Array.isArray(technicalQuestions)
            ? technicalQuestions
                .map((item, index) => `${index + 1}. ${item.question}`)
                .join("\n")
            : "Not provided";

        const skillGapText = Array.isArray(skillGaps)
            ? skillGaps
                .map((item) => `${item.skill} (${item.severity})`)
                .join(", ")
            : "Not provided";

        const prompt = `
You are a professional mock interview agent.

Interview role:
${title || "Target job role"}

Job description:
${jobDescription || "Not provided"}

Candidate resume/profile:
${resume || "Not provided"}

Known technical question topics:
${technicalQuestionText || "Not provided"}

Skill gaps to test:
${skillGapText || "Not provided"}

Conversation so far:
${history || "No conversation yet."}

Candidate latest answer:
${message || "Start the interview."}

Instructions:
- If this is the start, greet the candidate briefly and ask the first interview question.
- Ask questions according to the job description and candidate profile.
- Ask only ONE question at a time.
- If the candidate answered, give short feedback first.
- Then ask the next question.
- Keep the tone professional and natural.
- Do not write long paragraphs.
- Do not list many questions together.
`;

        return await callGemini(prompt);
    } catch (error) {
        console.error("AGENT ERROR:", error.message);

        return "I could not connect to the AI model right now. Please check your Gemini API key or model name, then try again.";
    }
}

module.exports = { voiceInterviewAgent };
