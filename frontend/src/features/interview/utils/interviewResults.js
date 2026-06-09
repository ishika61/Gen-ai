export const INTERVIEW_RESULTS_STORAGE_KEY = "interviewResultsById";
export const LATEST_INTERVIEW_RESULT_ID_KEY = "latestInterviewResultId";

export function saveInterviewResult(session) {
    const id = session.id || session.interviewId || `${Date.now()}-${Math.random().toString(16).slice(2)}`;

    const results = getAllInterviewResults();

    const result = {
        ...session,
        id,
        interviewId: id,
        createdAt: session.createdAt || new Date().toISOString()
    };

    results[id] = result;

    localStorage.setItem(INTERVIEW_RESULTS_STORAGE_KEY, JSON.stringify(results));
    localStorage.setItem(LATEST_INTERVIEW_RESULT_ID_KEY, id);

    return id;
}

export function getAllInterviewResults() {
    try {
        return JSON.parse(localStorage.getItem(INTERVIEW_RESULTS_STORAGE_KEY)) || {};
    } catch {
        return {};
    }
}

export function getInterviewResultById(id) {
    const results = getAllInterviewResults();
    return results[id] || null;
}

export function getLatestInterviewResult() {
    const latestId = localStorage.getItem(LATEST_INTERVIEW_RESULT_ID_KEY);

    if (!latestId) return null;

    return getInterviewResultById(latestId);
}

function clampScore(value) {
    return Math.max(1, Math.min(100, Math.round(value)));
}

function words(text = "") {
    return String(text).trim().split(/\s+/).filter(Boolean);
}

function lower(text = "") {
    return String(text).toLowerCase();
}

function candidateAnswers(transcript = []) {
    return transcript.filter((item) => item.sender === "You");
}

function aiQuestions(transcript = []) {
    return transcript.filter((item) => item.sender === "AI");
}

function pairQuestionAnswers(transcript = []) {
    const pairs = [];
    let currentQuestion = null;

    transcript.forEach((item) => {
        if (item.sender === "AI") {
            currentQuestion = item;
        }

        if (item.sender === "You" && currentQuestion) {
            pairs.push({ question: currentQuestion, answer: item });
            currentQuestion = null;
        }
    });

    return pairs;
}

function answerSignals(answer = "") {
    const text = lower(answer);
    const count = words(answer).length;

    return {
        wordCount: count,
        tooShort: count < 25,
        veryShort: count < 12,
        hasExample: /project|built|created|developed|implemented|designed|worked|internship|experience/.test(text),
        hasResult: /result|impact|improved|reduced|increased|optimized|faster|secure|scalable|completed/.test(text),
        hasStructure: /first|then|after|because|therefore|finally|approach|step/.test(text),
        hasTechDepth: /api|database|react|node|express|mongodb|jwt|auth|state|component|performance|security|architecture/.test(text),
        hasUncertainty: /maybe|i think|not sure|probably|kind of|sort of|i don't know/.test(text),
        hasConfidence: /i built|i implemented|i designed|i solved|i improved|i handled|my role/.test(text)
    };
}

function scoreAnswer(answer = "") {
    const s = answerSignals(answer);
    let score = 40;

    if (s.wordCount >= 25) score += 10;
    if (s.wordCount >= 55) score += 10;
    if (s.hasExample) score += 12;
    if (s.hasResult) score += 12;
    if (s.hasStructure) score += 10;
    if (s.hasTechDepth) score += 12;
    if (s.hasConfidence) score += 8;
    if (s.tooShort) score -= 12;
    if (s.veryShort) score -= 15;
    if (s.hasUncertainty) score -= 8;

    return clampScore(score);
}

function average(values) {
    if (!values.length) return 1;
    return clampScore(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function technicalScore(answers) {
    return average(answers.map((item) => {
        const s = answerSignals(item.text);
        let score = scoreAnswer(item.text);

        if (!s.hasTechDepth) score -= 15;
        if (!s.hasExample) score -= 8;

        return clampScore(score);
    }));
}

function communicationScore(answers) {
    return average(answers.map((item) => {
        const s = answerSignals(item.text);
        let score = 55;

        if (s.wordCount >= 25 && s.wordCount <= 120) score += 15;
        if (s.hasStructure) score += 18;
        if (s.hasExample) score += 8;
        if (s.tooShort) score -= 18;
        if (s.hasUncertainty) score -= 8;

        return clampScore(score);
    }));
}

function confidenceScore(answers) {
    return average(answers.map((item) => {
        const s = answerSignals(item.text);
        let score = 58;

        if (s.hasConfidence) score += 18;
        if (s.hasExample) score += 10;
        if (s.hasResult) score += 8;
        if (s.hasUncertainty) score -= 18;
        if (s.veryShort) score -= 14;

        return clampScore(score);
    }));
}

function problemSolvingScore(answers) {
    return average(answers.map((item) => {
        const s = answerSignals(item.text);
        const text = lower(item.text);
        let score = 52;

        if (s.hasStructure) score += 16;
        if (s.hasResult) score += 12;
        if (text.includes("debug") || text.includes("trade")) score += 10;
        if (!s.hasStructure) score -= 10;
        if (s.tooShort) score -= 12;

        return clampScore(score);
    }));
}

function behavioralScore(answers) {
    return average(answers.map((item) => {
        const text = lower(item.text);
        const s = answerSignals(item.text);
        let score = 50;

        if (/team|communication|feedback|deadline|challenge|ownership|responsibility|collaborat/.test(text)) score += 16;
        if (s.hasExample) score += 12;
        if (s.hasResult) score += 10;
        if (s.hasStructure) score += 8;
        if (s.tooShort) score -= 14;

        return clampScore(score);
    }));
}

function formatDuration(seconds = 0) {
    const minutes = Math.floor(seconds / 60);
    const rest = seconds % 60;
    return `${minutes}m ${rest}s`;
}

function recommendation(score) {
    if (score >= 85) return "Strong Candidate";
    if (score >= 72) return "Good Candidate";
    if (score >= 58) return "Needs Focused Preparation";
    if (score >= 42) return "Needs Improvement";
    return "Not Ready Yet";
}

function readiness(score) {
    if (score >= 85) return "Interview ready";
    if (score >= 72) return "Nearly ready";
    if (score >= 58) return "Needs focused preparation";
    return "Needs serious preparation";
}

function difficultyBreakdown(questions = []) {
    return questions.reduce(
        (acc, item, index) => {
            const difficulty = item.difficulty || (index < 2 ? "Easy" : index < 5 ? "Medium" : "Hard");
            acc[difficulty] = (acc[difficulty] || 0) + 1;
            return acc;
        },
        { Easy: 0, Medium: 0, Hard: 0 }
    );
}

function questionType(question = "") {
    const text = lower(question);

    if (/tell me|challenge|team|feedback|deadline|why|strength|weakness/.test(text)) return "behavioral";
    if (/debug|design|approach|solve|production|system/.test(text)) return "problem-solving";

    return "technical";
}

function idealAnswerFor(question = "", session = {}) {
    const type = questionType(question);
    const role = session.title || "this role";
    const skills = (session.skillGaps || [])
        .map((gap) => gap.skill || gap)
        .filter(Boolean)
        .slice(0, 3);

    if (type === "behavioral") {
        return `A strong answer should use the STAR method. Start with the situation, explain your task, describe the specific action you took, and end with the result. For ${role}, connect the story to teamwork, ownership, communication, and measurable impact.`;
    }

    if (type === "problem-solving") {
        return "A strong answer should explain your step-by-step approach. Clarify the problem, identify possible causes, explain how you would debug or design the solution, discuss trade-offs, and finish with how you would validate the result.";
    }

    return `A strong technical answer should directly answer the question, mention relevant concepts or tools, and include a real project example. For ${role}, connect your answer to ${skills.join(", ") || "the required technologies"}, explain trade-offs, and close with the impact of your approach.`;
}

function reviewPair(pair, index, session) {
    const answer = pair.answer?.text || "";
    const s = answerSignals(answer);
    const type = questionType(pair.question?.text);
    const mistakes = [];
    const missingPoints = [];
    const suggestions = [];

    if (s.tooShort) mistakes.push("The answer is too short for an interview setting.");
    if (!s.hasExample) missingPoints.push("A real project or work example is missing.");
    if (!s.hasResult) missingPoints.push("The answer does not explain measurable impact or outcome.");
    if (!s.hasStructure) mistakes.push("The answer needs clearer structure.");
    if (type === "technical" && !s.hasTechDepth) missingPoints.push("Technical depth and implementation details are missing.");
    if (s.hasUncertainty) mistakes.push("The answer sounds uncertain in places.");

    if (mistakes.length === 0) {
        mistakes.push("No major mistake, but the answer can be sharper and more specific.");
    }

    if (missingPoints.length === 0) {
        missingPoints.push("Could include clearer trade-offs, constraints, or measurable result.");
    }

    suggestions.push("Start with a direct answer.");
    suggestions.push("Add one specific example from your project or experience.");
    suggestions.push("End with impact, learning, or result.");

    if (type === "behavioral") suggestions.push("Use the STAR method.");
    if (type === "technical") suggestions.push("Mention tools, architecture, trade-offs, and why you chose that approach.");

    const answerScore = scoreAnswer(answer);

    return {
        number: index + 1,
        aiQuestion: pair.question?.text || "Question not available",
        candidateAnswer: answer || "No answer captured",
        difficulty: pair.question?.difficulty || (index < 2 ? "Easy" : index < 5 ? "Medium" : "Hard"),
        mistakes,
        missingPoints,
        idealAnswer: idealAnswerFor(pair.question?.text, session),
        aiFeedback: `This was a ${answerScore >= 70 ? "solid" : answerScore >= 50 ? "partial" : "weak"} answer. The candidate should improve specificity, structure, and role relevance.`,
        improvementSuggestions: suggestions
    };
}

export function buildInterviewAnalysis(session) {
    const transcript = session?.transcript || [];
    const answers = candidateAnswers(transcript);
    const questions = aiQuestions(transcript);
    const pairs = pairQuestionAnswers(transcript);

    const technical = technicalScore(answers);
    const communication = communicationScore(answers);
    const confidence = confidenceScore(answers);
    const problemSolving = problemSolvingScore(answers);
    const behavioral = behavioralScore(answers);

    const overall = clampScore(
        technical * 0.3 +
        communication * 0.2 +
        confidence * 0.15 +
        problemSolving * 0.2 +
        behavioral * 0.15
    );

    const breakdown = difficultyBreakdown(questions);

    return {
        scores: {
            overallScore: overall,
            technicalScore: technical,
            communicationScore: communication,
            confidenceScore: confidence,
            problemSolvingScore: problemSolving,
            behavioralScore: behavioral
        },
        summary: {
            duration: formatDuration(session?.durationSeconds || 0),
            totalQuestions: questions.length,
            easyQuestions: breakdown.Easy || 0,
            mediumQuestions: breakdown.Medium || 0,
            hardQuestions: breakdown.Hard || 0,
            recommendation: recommendation(overall),
            overview: `The candidate completed a mock interview for ${session?.title || "the target role"}. This report evaluates technical depth, communication clarity, confidence, problem solving, and hiring readiness.`
        },
        reviews: pairs.map((pair, index) => reviewPair(pair, index, session)),
        strengths: [
            overall >= 70 ? "Shows good potential for the target role." : "Completed the interview and attempted role-specific questions.",
            communication >= 70 ? "Communicates with reasonable clarity." : "Has a base communication style that can improve with structure.",
            technical >= 70 ? "Demonstrates useful technical understanding." : "Has technical fundamentals but needs deeper explanation."
        ],
        weaknesses: [
            technical < 70 ? "Needs deeper technical examples and implementation details." : "Can still improve depth in advanced technical topics.",
            communication < 70 ? "Answers need stronger structure and clearer examples." : "Communication is good, but can be more concise.",
            confidence < 70 ? "Confidence can improve by using more direct language." : "Confidence is acceptable, but stronger ownership language would help."
        ],
        improvementRoadmap: [
            "Prepare 3 project stories with problem, action, result, and tech stack.",
            "Practice STAR format for behavioral answers.",
            "Revise the technical skills mentioned in the job description.",
            "Practice explaining trade-offs and design decisions.",
            "Record mock answers and improve clarity, pace, and confidence."
        ],
        recommendedTechnologies: (session?.skillGaps || [])
            .map((gap) => gap.skill || gap)
            .filter(Boolean)
            .slice(0, 6),
        readinessLevel: readiness(overall)
    };
}
