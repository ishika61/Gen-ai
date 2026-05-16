const MODEL_CANDIDATES = [
    process.env.GEMINI_MODEL,
    "gemini-2.0-flash",
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite"
].filter(Boolean);

const COMMON_TECH_KEYWORDS = [
    "javascript", "typescript", "react", "next.js", "node.js", "express", "mongodb",
    "postgresql", "mysql", "redis", "docker", "kubernetes", "aws", "gcp", "azure",
    "python", "java", "spring", "go", "rest", "graphql", "jwt", "oauth", "ci/cd",
    "llm", "rag", "prompt engineering", "langchain", "openai", "gemini", "machine learning"
];

function normalizeText(value) {
    return String(value || "")
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function uniqueStrings(values = []) {
    const seen = new Set();

    return values.filter((value) => {
        const key = normalizeText(value);
        if (!key || seen.has(key)) {
            return false;
        }
        seen.add(key);
        return true;
    });
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

function extractTopLines(text, regex, limit = 4) {
    const lines = String(text || "")
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);

    return lines.filter((line) => regex.test(line)).slice(0, limit);
}

function inferExperienceLevel(resumeText = "") {
    const text = normalizeText(resumeText);

    if (/senior|lead|architect|principal|7 years|8 years|9 years|10 years/.test(text)) {
        return "senior";
    }
    if (/mid|intermediate|3 years|4 years|5 years|6 years/.test(text)) {
        return "mid";
    }
    return "junior";
}

function inferRoleTrack({ title, jobDescription }) {
    const source = normalizeText(`${title || ""} ${jobDescription || ""}`);

    if (/ai|ml|machine learning|llm|data scientist|genai/.test(source)) return "ai";
    if (/frontend|react|ui|javascript|web/.test(source)) return "frontend";
    if (/backend|node|api|server|microservice|database/.test(source)) return "backend";
    if (/full stack|fullstack/.test(source)) return "fullstack";
    if (/devops|platform|sre|cloud/.test(source)) return "devops";
    return "general";
}

function extractResumeInsights(resume = "") {
    const resumeText = String(resume || "");
    const normalized = normalizeText(resumeText);
    const technologies = COMMON_TECH_KEYWORDS.filter((tech) => normalized.includes(normalizeText(tech)));

    const projects = extractTopLines(resumeText, /project|built|developed|implemented|created/i, 5);
    const education = extractTopLines(resumeText, /b\.?tech|m\.?tech|bachelor|master|degree|university|college/i, 2);

    return {
        technologies: uniqueStrings(technologies),
        projects,
        education,
        experienceLevel: inferExperienceLevel(resumeText)
    };
}

function buildQuickSelfIntro({ title, resumeInsights }) {
    const role = title || "this role";
    const topTech = resumeInsights.technologies.slice(0, 3).join(", ");
    const projectHighlight = resumeInsights.projects[0] || "hands-on development projects";

    if (!topTech) {
        return `I am a ${resumeInsights.experienceLevel}-level candidate preparing for ${role}, with practical experience in ${projectHighlight}.`;
    }

    return `I am a ${resumeInsights.experienceLevel}-level candidate targeting ${role}, experienced with ${topTech}, and I have applied these in ${projectHighlight}.`;
}

function buildRoleSpecificTechnicalSeeds(roleTrack) {
    switch (roleTrack) {
        case "frontend":
            return [
                "How do you optimize React rendering performance in a large application?",
                "How would you design reusable component architecture for a growing React codebase?",
                "How do you handle authentication and route protection in a React app?"
            ];
        case "backend":
            return [
                "How would you design a secure and scalable Node.js authentication flow?",
                "How do you approach database indexing and query optimization for high-traffic APIs?",
                "How would you design error handling and observability for production backend services?"
            ];
        case "ai":
            return [
                "How would you design an AI feature from prompt design to production monitoring?",
                "How do you reduce hallucinations and improve reliability in LLM-based workflows?",
                "How would you evaluate and iterate on model performance using real user feedback?"
            ];
        case "devops":
            return [
                "How would you design CI/CD for safe and frequent production deployments?",
                "How do you handle scaling, monitoring, and incident response in cloud environments?",
                "How would you balance reliability, cost, and performance in distributed systems?"
            ];
        default:
            return [
                "How do you design reliable systems when requirements are ambiguous?",
                "How do you debug a production issue that affects many users?",
                "How do you balance code quality and delivery speed in real projects?"
            ];
    }
}

function buildPersonalizedTechnicalQuestions({
    title,
    jobDescription,
    technicalQuestions,
    skillGaps,
    resumeInsights
}) {
    const roleTrack = inferRoleTrack({ title, jobDescription });
    const baseQuestions = getQuestionList(technicalQuestions);
    const gapList = getQuestionList(skillGaps);
    const roleSeeds = buildRoleSpecificTechnicalSeeds(roleTrack);
    const techBasedQuestions = resumeInsights.technologies.slice(0, 4).map((tech) =>
        `In your projects, how have you used ${tech}, and what trade-offs did you consider?`
    );
    const gapQuestions = gapList.slice(0, 3).map((gap) =>
        `For the ${title || "target"} role, how are you improving your ${gap} skills in practical terms?`
    );

    const levelByIndex = (index) => {
        if (index < 2) return "easy";
        if (index < 5) return "medium";
        return "hard";
    };

    return uniqueStrings([...baseQuestions, ...techBasedQuestions, ...roleSeeds, ...gapQuestions]).map(
        (question, index) => ({
            type: "technical",
            difficulty: levelByIndex(index),
            question
        })
    );
}

function buildPersonalizedBehavioralQuestions({ behavioralQuestions, resumeInsights, title }) {
    const baseQuestions = getQuestionList(behavioralQuestions);
    const projectReference = resumeInsights.projects[0] || "one of your recent projects";

    const generated = [
        `Tell me about a time you worked with a team under a tight deadline. What was your contribution and outcome?`,
        `Describe a challenge you faced in ${projectReference}. How did you resolve it?`,
        `Share an example where communication helped you prevent or solve a project issue.`,
        `Tell me about a decision where you showed ownership or leadership in a technical task.`,
        `Describe a time you received critical feedback. What did you change after that?`,
        `For ${title || "this role"}, how do you prioritize tasks when multiple urgent requests arrive together?`
    ];

    return uniqueStrings([...baseQuestions, ...generated]).map((question, index) => ({
        type: "behavioral",
        difficulty: index < 2 ? "easy" : "medium",
        question
    }));
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
    resume,
    title,
    jobDescription,
    technicalQuestions,
    behavioralQuestions,
    skillGaps
}) {
    const plan = [];
    const role = title || "target";
    const resumeInsights = extractResumeInsights(resume);

    plan.push({
        type: "intro",
        difficulty: "easy",
        question: `Can you briefly introduce yourself and explain why your background fits the ${role} role?`
    });

    const technicalPlan = buildPersonalizedTechnicalQuestions({
        title,
        jobDescription,
        technicalQuestions,
        skillGaps,
        resumeInsights
    });
    const behavioralPlan = buildPersonalizedBehavioralQuestions({
        behavioralQuestions,
        resumeInsights,
        title
    });

    // Alternate technical and behavioral blocks to keep the flow natural.
    const maxLen = Math.max(technicalPlan.length, behavioralPlan.length);
    for (let i = 0; i < maxLen; i++) {
        if (technicalPlan[i]) plan.push(technicalPlan[i]);
        if (behavioralPlan[i]) plan.push(behavioralPlan[i]);
    }

    if (jobDescription && plan.length < 4) {
        plan.push({
            type: "role-fit",
            difficulty: "medium",
            question: `Which part of this job description matches your strongest experience, and how have you applied it in real work or projects?`
        });
    }

    plan.push({
        type: "closing",
        difficulty: "hard",
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

function buildRoadmap({ title, jobDescription, resumeInsights, skillGaps }) {
    const role = title || "target role";
    const missingSkills = uniqueStrings([
        ...getQuestionList(skillGaps),
        ...(jobDescription ? ["Role-specific requirements from job description"] : [])
    ]);
    const strengths = resumeInsights.technologies.length > 0
        ? resumeInsights.technologies.slice(0, 4)
        : ["Project ownership", "Learning mindset"];

    const roadmapSteps = [
        "Week 1-2: Strengthen fundamentals and revise core interview patterns.",
        "Week 3-4: Build one focused project that demonstrates role-specific depth.",
        "Week 5-6: Practice timed mock interviews and refine weak areas.",
        "Week 7+: Create a revision loop using feedback from each practice session."
    ];

    return [
        "Interview wrap-up:",
        `- Target role: ${role}`,
        `- Strengths: ${strengths.join(", ")}`,
        `- Weaknesses / gaps: ${missingSkills.length > 0 ? missingSkills.join(", ") : "Need deeper examples and measurable impact stories"}`,
        `- Recommended technologies to learn: ${missingSkills.slice(0, 4).join(", ") || "System design basics, testing, and observability"}`,
        "- Improvement roadmap:",
        ...roadmapSteps.map((step) => `  ${step}`),
        "- Interview tips: answer with STAR, quantify impact, and explain trade-offs clearly."
    ].join("\n");
}

function getAskedQuestionCount(plan, history) {
    const normalizedHistory = normalizeText(history);

    return plan.filter((item) => normalizedHistory.includes(normalizeText(item.question))).length;
}

function buildFallbackReply({
    message,
    history,
    resume,
    title,
    jobDescription,
    technicalQuestions,
    behavioralQuestions,
    skillGaps
}) {
    const resumeInsights = extractResumeInsights(resume);
    const plan = buildQuestionPlan({
        resume,
        title,
        jobDescription,
        technicalQuestions,
        behavioralQuestions,
        skillGaps
    });
    const askedCount = getAskedQuestionCount(plan, history);
    const nextQuestion = getNextQuestion(plan, history);
    const quickIntro = buildQuickSelfIntro({ title, resumeInsights });

    if (!message) {
        return `Welcome to your personalized mock interview. Quick intro you can use: "${quickIntro}"\nFirst question: ${nextQuestion?.question || "Can you introduce yourself briefly?"}`;
    }

    if (nextQuestion) {
        return `${buildFeedback(nextQuestion.type)} Difficulty: ${nextQuestion.difficulty || "medium"}. Next question: ${nextQuestion.question}`;
    }

    if (askedCount >= Math.max(6, Math.min(plan.length, 10))) {
        return buildRoadmap({ title, jobDescription, resumeInsights, skillGaps });
    }

    return "Good work. We have covered key areas. Final question: why should the hiring team choose you over other candidates?";
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
        const resumeInsights = extractResumeInsights(resume);
        const roleTrack = inferRoleTrack({ title, jobDescription });
        const technicalQuestionText = getQuestionList(technicalQuestions);
        const behavioralQuestionText = getQuestionList(behavioralQuestions);
        const skillGapText = getQuestionList(skillGaps);
        const questionPlan = buildQuestionPlan({
            resume,
            title,
            jobDescription,
            technicalQuestions,
            behavioralQuestions,
            skillGaps
        });
        const askedQuestions = questionPlan
            .filter((item) => normalizeText(history).includes(normalizeText(item.question)))
            .map((item) => item.question);
        const quickIntro = buildQuickSelfIntro({ title, resumeInsights });
        const askedCount = askedQuestions.length;
        const shouldEndInterview = askedCount >= Math.max(6, Math.min(questionPlan.length, 10));
        const roadmapPreview = buildRoadmap({ title, jobDescription, resumeInsights, skillGaps });

        const prompt = `
You are a professional, realistic, and supportive AI mock interviewer.

Interview role:
${title || "Target job role"}

Detected role track:
${roleTrack}

Job description:
${jobDescription || "Not provided"}

Candidate resume/profile:
${resume || "Not provided"}

Resume analysis:
- Experience level: ${resumeInsights.experienceLevel}
- Technologies: ${resumeInsights.technologies.join(", ") || "Not clearly found"}
- Project highlights: ${resumeInsights.projects.join(" | ") || "Not clearly found"}
- Education: ${resumeInsights.education.join(" | ") || "Not clearly found"}

Generated quick self-introduction:
${quickIntro}

Technical questions available:
${technicalQuestionText.length > 0 ? technicalQuestionText.map((item, index) => `${index + 1}. ${item}`).join("\n") : "Not provided"}

Behavioral questions available:
${behavioralQuestionText.length > 0 ? behavioralQuestionText.map((item, index) => `${index + 1}. ${item}`).join("\n") : "Not provided"}

Skill gaps to probe:
${skillGapText.length > 0 ? skillGapText.join(", ") : "Not provided"}

Recommended interview sequence:
${questionPlan.map((item, index) => `${index + 1}. [${item.type} | ${item.difficulty || "medium"}] ${item.question}`).join("\n")}

Previously asked questions. Do not repeat these or ask close paraphrases:
${askedQuestions.length > 0 ? askedQuestions.map((item, index) => `${index + 1}. ${item}`).join("\n") : "None yet"}

Conversation so far:
${history || "No conversation yet."}

Candidate latest answer:
${message || "Start the interview."}

Interview stage:
- Asked questions count: ${askedCount}
- End interview now and produce roadmap: ${shouldEndInterview ? "YES" : "NO"}

Roadmap template reference (use only when ending interview):
${roadmapPreview}

Rules:
- Ask only one question at a time.
- Start with a short welcome if this is the first turn.
- After the candidate answers, give brief feedback in 1 or 2 sentences.
- Then ask the next unused question from the recommended interview sequence, increasing difficulty gradually.
- Use both technical and behavioral questions where available.
- Prioritize questions that fit the candidate profile and target role.
- Never repeat a question that was already asked.
- Keep question wording concise and natural.
- If end interview flag is YES, do NOT ask another question. Instead provide:
  1) strengths, 2) weaknesses, 3) missing skills, 4) improvement roadmap,
  5) recommended technologies, and 6) interview prep tips.
- Keep the tone natural, supportive, and interviewer-like.
`;

        return await callGemini(prompt);
    } catch (error) {
        console.error("AGENT ERROR:", error.message);
        return buildFallbackReply({
            message,
            history,
            resume,
            title,
            jobDescription,
            technicalQuestions,
            behavioralQuestions,
            skillGaps
        });
    }
}

module.exports = { voiceInterviewAgent };
