const MODEL_CANDIDATES = [
    process.env.GEMINI_MODEL,
    "gemini-2.0-flash",
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite"
].filter(Boolean);

function normalizeText(value) {
    return String(value || "")
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function getQuestionList(items) {
    if (!Array.isArray(items)) {
        return [];
    }

    return items
        .map((item) => item?.question || item?.skill || item)
        .filter(Boolean)
        .map((text) => String(text).trim())
        .filter(Boolean);
}

function dedupeQuestions(items) {
    const seen = new Set();

    return items.filter((item) => {
        const key = normalizeText(item.question);

        if (!key || seen.has(key)) {
            return false;
        }

        seen.add(key);
        return true;
    });
}

function buildQuestionPlan({
    title,
    jobDescription,
    technicalQuestions,
    behavioralQuestions,
    skillGaps
}) {
    const plan = [];
    const role = title || "target";

    plan.push({
        type: "intro",
        question: `Can you briefly introduce yourself and explain why your background fits the ${role} role?`
    });

    getQuestionList(technicalQuestions).forEach((question) => {
        plan.push({ type: "technical", question });
    });

    getQuestionList(behavioralQuestions).forEach((question) => {
        plan.push({ type: "behavioral", question });
    });

    getQuestionList(skillGaps).forEach((skill) => {
        plan.push({
            type: "skill-gap",
            question: `What are you doing to improve your ${skill} skills for this role?`
        });
    });

    if (jobDescription && plan.length < 4) {
        plan.push({
            type: "role-fit",
            question: `Which part of this job description matches your strongest experience, and how have you applied it in real work or projects?`
        });
    }

    plan.push({
        type: "closing",
        question: `What value would you bring to the team in your first 90 days if you were selected for this ${role} role?`
    });

    return dedupeQuestions(plan);
}

function getNextQuestion(plan, history) {
    const normalizedHistory = normalizeText(history);

    for (const item of plan) {
        if (!normalizedHistory.includes(normalizeText(item.question))) {
            return item;
        }
    }

    return null;
}

function buildFeedback(questionType) {
    switch (questionType) {
        case "technical":
            return "Good start. Try to keep your answer structured with the problem, your approach, and the result.";
        case "behavioral":
            return "Nice direction. Use a clear situation, action, and outcome so the story feels stronger.";
        case "skill-gap":
            return "That works. Be specific about what you are practicing and how you are closing the gap.";
        default:
            return "Good answer. Keep the next response concise and role-focused.";
    }
}

function buildFallbackReply({
    message,
    history,
    title,
    jobDescription,
    technicalQuestions,
    behavioralQuestions,
    skillGaps
}) {
    const plan = buildQuestionPlan({
        title,
        jobDescription,
        technicalQuestions,
        behavioralQuestions,
        skillGaps
    });

    const nextQuestion = getNextQuestion(plan, history);

    if (!message) {
        return `Welcome to your mock interview. I will ask questions based on your profile and target role. ${nextQuestion?.question || "Can you introduce yourself briefly?"}`;
    }

    if (nextQuestion) {
        return `${buildFeedback(nextQuestion.type)} Next question: ${nextQuestion.question}`;
    }

    return "Good work. We have covered the main areas for this role. Final question: why should the hiring team choose you over other candidates?";
}

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
                            temperature: 0.4,
                            maxOutputTokens: 500
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
    behavioralQuestions,
    skillGaps
}) {
    try {
        const technicalQuestionText = getQuestionList(technicalQuestions);
        const behavioralQuestionText = getQuestionList(behavioralQuestions);
        const skillGapText = getQuestionList(skillGaps);
        const questionPlan = buildQuestionPlan({
            title,
            jobDescription,
            technicalQuestions,
            behavioralQuestions,
            skillGaps
        });
        const askedQuestions = questionPlan
            .filter((item) => normalizeText(history).includes(normalizeText(item.question)))
            .map((item) => item.question);

        const prompt = `
You are a professional mock interview agent.

Interview role:
${title || "Target job role"}

Job description:
${jobDescription || "Not provided"}

Candidate resume/profile:
${resume || "Not provided"}

Technical questions available:
${technicalQuestionText.length > 0 ? technicalQuestionText.map((item, index) => `${index + 1}. ${item}`).join("\n") : "Not provided"}

Behavioral questions available:
${behavioralQuestionText.length > 0 ? behavioralQuestionText.map((item, index) => `${index + 1}. ${item}`).join("\n") : "Not provided"}

Skill gaps to probe:
${skillGapText.length > 0 ? skillGapText.join(", ") : "Not provided"}

Recommended interview sequence:
${questionPlan.map((item, index) => `${index + 1}. [${item.type}] ${item.question}`).join("\n")}

Previously asked questions. Do not repeat these or ask close paraphrases:
${askedQuestions.length > 0 ? askedQuestions.map((item, index) => `${index + 1}. ${item}`).join("\n") : "None yet"}

Conversation so far:
${history || "No conversation yet."}

Candidate latest answer:
${message || "Start the interview."}

Rules:
- Ask only one question at a time.
- Start with a short welcome if this is the first turn.
- After the candidate answers, give brief feedback in 1 or 2 sentences.
- Then ask the next unused question from the recommended interview sequence.
- Use both technical and behavioral questions where available.
- Prioritize questions that fit the candidate profile and target role.
- Never repeat a question that was already asked.
- Keep the tone natural, supportive, and interviewer-like.
`;

        return await callGemini(prompt);
    } catch (error) {
        console.error("AGENT ERROR:", error.message);
        return buildFallbackReply({
            message,
            history,
            title,
            jobDescription,
            technicalQuestions,
            behavioralQuestions,
            skillGaps
        });
    }
}

module.exports = { voiceInterviewAgent };
