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

    if (currentQuestion) {
        pairs.push({ question: currentQuestion, answer: { text: "" } });
    }

    return pairs;
}

function cleanInterviewQuestion(text = "") {
    let cleaned = String(text || "").replace(/\s+/g, " ").trim();

    cleaned = cleaned
        .replace(/^welcome to your mock interview[^.?!]*[.?!]\s*/i, "")
        .replace(/^let's start simple[.?!]\s*/i, "")
        .replace(/^good(?: start)?[^.?!]*[.?!]\s*/i, "")
        .replace(/^thanks[^.?!]*[.?!]\s*/i, "");

    const nextQuestion = cleaned.match(/next question:\s*(.+)$/i);
    if (nextQuestion) {
        return nextQuestion[1].trim();
    }

    const questionParts = cleaned.split(/(?<=[.?!])\s+/).filter((part) => part.includes("?"));
    if (questionParts.length > 0) {
        return questionParts[questionParts.length - 1].trim();
    }

    return cleaned;
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
        hasTechDepth: /api|database|react|node|express|mongodb|jwt|auth|token|route|middleware|flutter|dart|java|spring|firebase|websocket|architecture|backend|frontend/.test(text),
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

    if (/concise introduction|tell me about yourself|using your background|introduce yourself/.test(text)) return "intro";
    if (/which project|proves you are ready|best project|project from your background/.test(text)) return "project-fit";
    if (/why does|why.*interest|why should|motivat/.test(text)) return "motivation";
    if (/mongodb.*failed|debug.*step|root cause|production.*fail/.test(text)) return "problem-solving";
    if (/auth|jwt|login|security|protected routes/.test(text)) return "technical-auth";
    if (/walk me through|architecture|exact contribution|resume mentions/.test(text)) return "experience-deep";
    if (/team|feedback|deadline|strength|weakness|conflict|collaborat|stuck|challenge/.test(text)) return "behavioral";
    if (/challenging technical|technical problem|debug|design|approach|solve|production|system/.test(text)) return "problem-solving";

    return "technical";
}

function questionFocus(question = "") {
    const text = lower(question);
    const focusMap = [
        {
            match: /challenging technical|technical problem|debug|bug|issue|error|fix|approach solving|solve/,
            topic: "technical problem solving",
            expected: ["specific problem", "root cause", "steps you took", "final result"]
        },
        {
            match: /mern|full[- ]?stack|frontend|backend|stack/,
            topic: "MERN/full-stack background",
            expected: ["MongoDB/Express/React/Node experience", "project example", "why full-stack interests you", "how frontend and backend connect"]
        },
        {
            match: /introduce|yourself|background|career|journey/,
            topic: "self introduction",
            expected: ["current role or learning path", "relevant projects", "skills that match the job", "career motivation"]
        },
        {
            match: /react|component|state|props|hook/,
            topic: "React fundamentals",
            expected: ["components", "state and props", "hooks", "rendering or data flow"]
        },
        {
            match: /node|express|api|server|backend/,
            topic: "backend/API development",
            expected: ["routes/controllers", "request validation", "database operations", "error handling"]
        },
        {
            match: /database|mongodb|sql|schema|query/,
            topic: "database design",
            expected: ["data model", "relationships or collections", "query strategy", "indexes or performance"]
        },
        {
            match: /auth|jwt|login|security|password/,
            topic: "authentication and security",
            expected: ["secure password handling", "token/session flow", "protected routes", "common risks"]
        },
        {
            match: /deploy|hosting|production|cloud|ci\/cd/,
            topic: "deployment",
            expected: ["build process", "environment variables", "hosting choice", "monitoring or rollback"]
        },
        {
            match: /debug|bug|issue|error|fix/,
            topic: "debugging approach",
            expected: ["reproduction steps", "logs or inspection", "root cause", "verification"]
        },
        {
            match: /team|collaborat|conflict|feedback|deadline/,
            topic: "teamwork",
            expected: ["situation", "personal responsibility", "communication", "result"]
        },
        {
            match: /project|built|portfolio|application/,
            topic: "project explanation",
            expected: ["problem solved", "tech stack", "your contribution", "outcome"]
        }
    ];

    return focusMap.find((item) => item.match.test(text)) || {
        topic: "role knowledge",
        expected: ["direct answer", "specific example", "technical detail", "result or learning"]
    };
}

function answerMentionsExpected(answer = "", expected = []) {
    const text = lower(answer);

    return expected.filter((item) => {
        const keywords = lower(item).split(/\s+|\/|-/).filter((word) => word.length > 3);
        return keywords.some((word) => text.includes(word));
    });
}

function uniqueItems(items = []) {
    return [...new Set(items.filter(Boolean))];
}

function shortAdvice(text = "", max = 72) {
    const cleaned = String(text || "").replace(/\s+/g, " ").trim();
    if (!cleaned) return "";
    if (cleaned.length <= max) return cleaned;
    return `${cleaned.slice(0, max - 1).trim()}…`;
}

const PROFILE_SKILL_KEYWORDS = [
    "React.js", "React", "Node.js", "Express.js", "MongoDB", "JavaScript",
    "TypeScript", "REST APIs", "JWT", "Authentication", "System Design",
    "Python", "Java", "Spring Boot", "Flutter", "Dart", "Django",
    "Firebase", "PostgreSQL", "MySQL", "DSA", "AI", "LLM",
    "Socket.IO", "WebSocket", "GetX", "Riverpod", "Android", "iOS"
];

function extractProfileSkills(text = "") {
    const normalized = lower(text);

    return uniqueItems(
        PROFILE_SKILL_KEYWORDS.filter((skill) =>
            normalized.includes(lower(skill))
        ).map((skill) => (skill === "React" ? "React.js" : skill))
    );
}

function parseResumeContext(resume = "", selfDescription = "") {
    const lines = String(resume || "")
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);

    const projects = [];
    const experiences = [];

    lines.forEach((line, index) => {
        if (
            /habitsync|hrm system|easy project|interview platform|e-?commerce|jennie|project/i.test(line) &&
            line.length < 100 &&
            !projects.some((item) => item.name === line)
        ) {
            projects.push({
                name: line.replace(/\|.*$/, "").trim(),
                tech: extractProfileSkills(lines.slice(index, index + 4).join(" ")).join(", "),
                summary: lines[index + 1] || line
            });
        }

        if (
            (/pvt|ltd|llc|inc|infosystems|hangout|solopackers|gravit|company/i.test(line)) &&
            line.length < 90 &&
            !experiences.some((item) => item.company === line)
        ) {
            const nextLine = lines[index + 1] || "";
            experiences.push({
                company: line.replace(/\|.*$/, "").trim(),
                role: /developer|intern|engineer/i.test(nextLine) ? nextLine : "Developer",
                summary: lines.slice(index, index + 5).join(" ").slice(0, 220)
            });
        }
    });

    const education =
        lines.find((line) => /b\.?tech|bachelor|master|engineering|institute|university|college/i.test(line)) ||
        "";

    const degreeLine = lines.find((line) => /electronics|communication|computer|electrical/i.test(line)) || education;

    return {
        projects,
        experiences,
        education: degreeLine || education,
        topProject: projects[0]?.name || "your strongest project",
        topCompany: experiences[0]?.company || "your recent company",
        topRole: experiences[0]?.role || "developer"
    };
}

function buildSessionProfile(session = {}) {
    const resume = session.resume || "";
    const selfDescription = session.selfDescription || "";
    const jobDescription = session.jobDescription || "";
    const candidateText = `${resume}\n${selfDescription}`;
    const resumeContext = parseResumeContext(resume, selfDescription);
    const candidateSkills = extractProfileSkills(candidateText);
    const jobSkills = extractProfileSkills(jobDescription);
    const gapSkills = (session.skillGaps || [])
        .map((gap) => gap.skill || gap)
        .filter(Boolean);

    return {
        role: session.title || "the target role",
        resumeContext,
        candidateSkills,
        jobSkills,
        gapSkills: gapSkills.length ? gapSkills : jobSkills.filter(
            (skill) => !candidateSkills.map(lower).includes(lower(skill))
        )
    };
}

function extractMentionedEntity(question = "", profile = {}) {
    const ctx = profile.resumeContext || {};
    const fromQuestion = question.match(/resume mentions\s+([^.?]+)/i)?.[1]?.trim();
    if (fromQuestion) return fromQuestion;

    return ctx.topCompany || ctx.topProject || "your recent experience";
}

function answerReferencesResume(answer = "", profile = {}) {
    const text = lower(answer);
    const ctx = profile.resumeContext || {};
    const tokens = uniqueItems([
        ...ctx.projects.map((item) => lower(item.name)),
        ...ctx.experiences.map((item) => lower(item.company)),
        ...ctx.experiences.map((item) => lower(item.role)),
        ...profile.candidateSkills.map(lower)
    ]).filter((token) => token.length > 3);

    return tokens.some((token) => text.includes(token.slice(0, Math.min(token.length, 12))));
}

function buildModelAnswer(question = "", profile = {}) {
    const q = lower(question);
    const role = profile.role;
    const skills = profile.candidateSkills.slice(0, 5).join(", ") || "tools from your resume";
    const ctx = profile.resumeContext || {};
    const project = ctx.topProject;
    const company = ctx.topCompany;
    const jobRole = ctx.topRole;
    const edu = ctx.education || "your degree and college";
    const entity = extractMentionedEntity(question, profile);
    const gap = profile.gapSkills[0] || "the role requirement";

    if (/concise introduction|using your background|tell me about yourself/.test(q)) {
        return `I am ${edu}. I worked as ${jobRole} at ${company}, where I built features using ${skills}. One key project is ${project}. I am targeting ${role} because my internship and project work already match this position.`;
    }

    if (/why does|why.*interest|why.*position/.test(q)) {
        return `I want ${role} because my work at ${company} and project ${project} already use ${skills}. This role lets me grow from internship delivery to stronger ownership, and I am actively improving ${gap}.`;
    }

    if (/which project|proves you are ready|best project/.test(q)) {
        return `${project} is my strongest proof. I handled real modules, used ${skills}, solved integration/debug issues, and delivered working features. That shows I can contribute in ${role}.`;
    }

    if (/walk me through|architecture|exact contribution|resume mentions/.test(q)) {
        return `At ${entity}, I worked as ${jobRole}. The system had UI/app layer, REST APIs, and database/storage. I built core modules, integrated APIs, handled auth/data flow, and fixed bugs before release. Stack: ${skills}. Result: stable features shipped on time.`;
    }

    if (/target job emphasizes|where have you used it|what would you improve/.test(q)) {
        return `I used ${skills} in ${project} and at ${company}. I would improve ${gap} by building a small practice project, studying fundamentals, and documenting one real implementation example before the next interview.`;
    }

    if (/authentication|protected routes|jwt/.test(q)) {
        return `Use login API with hashed passwords, issue JWT after validation, send token in headers, verify in middleware, and protect routes on client and server. I applied token-based auth in ${project} and blocked unauthenticated access to private screens/routes.`;
    }

    if (/mongodb.*failed|debug.*step/.test(q)) {
        return `Reproduce the issue, check app and DB logs, verify connection string and credentials, inspect slow queries and indexes, test on staging data, isolate code vs DB/network cause, patch, then monitor errors after deployment.`;
    }

    if (/gap|improving your|close the gap/.test(q)) {
        return `My current level in ${gap} is basic but improving. I connected related work from ${project}, identified what is missing, and planned daily practice with one mini demo and revision notes for two weeks.`;
    }

    return `Give a direct answer, prove it with ${project} or ${company}, mention ${skills}, and end with one result or learning for ${role}.`;
}

function buildAnswerGuide(question = "", profile = {}) {
    const type = questionType(question);

    if (type === "intro") return "Structure: who you are → stack → one project → why this role (45 sec).";
    if (type === "motivation") return "Structure: role fit → resume proof → growth plan.";
    if (type === "project-fit") return "Structure: pick one project → your role → stack → outcome.";
    if (type === "experience-deep") return "Structure: company context → architecture → your modules → result.";
    if (type === "technical-auth") return "Structure: login flow → token → middleware → protected routes.";
    if (type === "problem-solving") return "Structure: reproduce → logs → isolate → fix → verify.";
    if (type === "behavioral") return "Structure: STAR with your personal action and result.";

    return "Structure: direct answer → example → tools → result.";
}

function feedbackForAnswer({ answerScore, type, focus, signals, answer, question = "", profile = {} }) {
    const text = lower(answer);
    const role = profile.role || "this role";

    if (!answer.trim()) {
        return `No answer recorded. Prepare a sample response using ${profile.resumeContext?.topProject || "your project"}.`;
    }

    if (/don't know|can't answer|sorry i can'?t|i do not know/.test(text)) {
        return `Avoid stopping at "I don't know." Share partial knowledge, relate it to ${profile.resumeContext?.topCompany || "your experience"}, and explain your learning plan.`;
    }

    if (/project|resume|background|proves|walk me through|architecture|contribution/.test(lower(question)) && !answerReferencesResume(answer, profile)) {
        return `Name a real item from your resume such as ${profile.resumeContext?.topProject || "your project"} or ${profile.resumeContext?.topCompany || "your company"}.`;
    }

    if (type === "intro" && !signals.hasExample) {
        return "Add degree/role, one company or project, and why this job fits you.";
    }

    if (signals.veryShort) {
        return `Too short. Expand with ${profile.resumeContext?.topProject || "one project"} and a clear result.`;
    }

    if (type === "behavioral" && !/situation|task|action|result|i did|my role|we/.test(text)) {
        return "Use STAR and state what you personally did.";
    }

    if ((type === "technical" || type === "technical-auth") && !signals.hasTechDepth) {
        return `Add concrete tools and steps. Mention ${profile.candidateSkills.slice(0, 2).join(", ") || "your stack"}.`;
    }

    if (type === "problem-solving" && !signals.hasStructure) {
        return "Walk through reproduce → logs → root cause → fix → verify.";
    }

    if (answerScore >= 75) {
        return `Good ${focus.topic} answer. Add one metric or trade-off.`;
    }

    if (answerScore >= 55) {
        return "Partial answer. Add structure and one resume-based example.";
    }

    return `Weak answer for ${role}. Use the model answer below and practice out loud.`;
}

function reviewPair(pair, index, session) {
    const answer = pair.answer?.text || "";
    const s = answerSignals(answer);
    const question = pair.question?.text || "";
    const profile = buildSessionProfile(session);
    const cleanedQuestion = cleanInterviewQuestion(question);
    const type = questionType(cleanedQuestion);
    const focus = questionFocus(cleanedQuestion);
    const mistakes = [];
    const missingPoints = [];
    const suggestions = [];

    if (!answer.trim()) mistakes.push("No answer was captured.");
    if (/don't know|can't answer|sorry i can'?t/.test(lower(answer))) mistakes.push('Saying "I don\'t know" without a learning plan hurts your score.');
    if (s.veryShort) mistakes.push("Answer is too short to show real experience.");
    if (s.tooShort && !s.veryShort) mistakes.push(`Needs more detail for this ${focus.topic} question.`);
    if (s.hasUncertainty) mistakes.push("Uncertain phrasing weakens confidence.");
    if (!answerReferencesResume(answer, profile) && /project|resume|background|proves|architecture|contribution|walk me through/.test(lower(cleanedQuestion))) {
        mistakes.push(`Did not reference ${profile.resumeContext?.topProject || "a resume project"} or ${profile.resumeContext?.topCompany || "company"}.`);
    }
    if (type === "intro" && !s.hasStructure) mistakes.push("Intro needs: background → skills → project → role goal.");
    if (type === "experience-deep" && !s.hasTechDepth) mistakes.push("Explain architecture, your modules, and stack used.");
    if (type === "technical-auth" && !s.hasTechDepth) mistakes.push("Mention login flow, token, middleware, and protected routes.");
    if (type === "problem-solving" && !s.hasStructure) mistakes.push("Show step-by-step debugging, not a one-line guess.");

    if (!s.hasExample) missingPoints.push("Missing a real project or internship example.");
    if (!s.hasResult) missingPoints.push("Missing outcome, impact, or learning.");
    if (type === "technical-auth" && !/jwt|token|auth|middleware|route|password|login/.test(lower(answer))) {
        missingPoints.push("Missing authentication flow details.");
    }
    if (type === "problem-solving" && !/log|check|verify|root|cause|query|connection/.test(lower(answer))) {
        missingPoints.push("Missing logs, root-cause, or verification steps.");
    }
    if (type === "motivation" && !/interest|want|grow|fit|because/.test(lower(answer))) {
        missingPoints.push("Missing clear motivation for this role.");
    }

    if (mistakes.length === 0) mistakes.push("Answer can be sharper with more resume-specific proof.");
    if (missingPoints.length === 0) missingPoints.push("Add one measurable result or trade-off.");

    suggestions.push(`Use ${profile.resumeContext?.topProject || "your project"} as proof.`);
    suggestions.push(`Mention tools: ${profile.candidateSkills.slice(0, 3).join(", ") || "your stack"}.`);
    suggestions.push("End with one result or learning.");

    const answerScore = answer.trim() ? scoreAnswer(answer) : 0;

    return {
        number: index + 1,
        aiQuestion: cleanedQuestion || "Question not available",
        candidateAnswer: answer.trim() || "No answer captured",
        difficulty: pair.question?.difficulty || (index < 2 ? "Easy" : index < 5 ? "Medium" : "Hard"),
        score: answerScore,
        mistakes: uniqueItems(mistakes).slice(0, 3),
        missingPoints: uniqueItems(missingPoints).slice(0, 3),
        modelAnswer: buildModelAnswer(cleanedQuestion, profile),
        answerGuide: buildAnswerGuide(cleanedQuestion, profile),
        aiFeedback: feedbackForAnswer({ answerScore, type, focus, signals: s, answer, question: cleanedQuestion, profile }),
        improvementSuggestions: uniqueItems(suggestions).slice(0, 3)
    };
}

function buildStrengths({ profile, reviews, scores, pairs }) {
    const strengths = [];
    const strongReviews = reviews.filter((item) => item.score >= 72);
    const answeredCount = pairs.filter((pair) => (pair.answer?.text || "").trim()).length;

    if (strongReviews.length > 0) {
        strengths.push(`Strong answers on ${strongReviews.length} question(s) with useful project detail.`);
    }

    if (scores.communicationScore >= 70) {
        strengths.push("Communicates with clear structure and readable flow.");
    }

    if (scores.technicalScore >= 70) {
        strengths.push(`Shows practical depth in ${profile.candidateSkills.slice(0, 2).join(", ") || "core technical areas"}.`);
    }

    if (scores.confidenceScore >= 70) {
        strengths.push("Uses confident, ownership-focused language.");
    }

    if (answeredCount >= 4) {
        strengths.push("Stayed engaged and answered most of the interview.");
    }

    if (strengths.length === 0) {
        if (answeredCount > 0) {
            strengths.push("Showed willingness to answer role-specific questions.");
        } else {
            strengths.push("Started the mock interview session.");
        }
    }

    return uniqueItems(strengths).slice(0, 3);
}

function buildWeaknesses({ profile, reviews, scores }) {
    const weaknesses = [];
    const weakReviews = reviews.filter((item) => item.score < 58);

    if (weakReviews.length > 0) {
        const topics = uniqueItems(weakReviews.map((item) => questionFocus(item.aiQuestion).topic)).slice(0, 1);
        weaknesses.push(`Weak on ${topics[0] || "role topics"} — add more project proof.`);
    }

    if (scores.technicalScore < 70) {
        weaknesses.push("Technical answers need more architecture and implementation detail.");
    }

    if (scores.communicationScore < 70) {
        weaknesses.push("Use answer → example → result structure.");
    }

    if (scores.confidenceScore < 70) {
        weaknesses.push("Reduce uncertain phrasing; state your role clearly.");
    }

    if (profile.gapSkills.length > 0) {
        weaknesses.push(`Prove job gaps: ${profile.gapSkills.slice(0, 2).join(", ")}.`);
    }

    if (weaknesses.length === 0) {
        weaknesses.push("Add measurable results and sharper trade-off explanations.");
    }

    return uniqueItems(weaknesses).slice(0, 4);
}

function buildPersonalizedRoadmap({ profile, reviews, scores }) {
    const roadmap = [];
    const weakestReview = [...reviews].sort((a, b) => a.score - b.score)[0];
    const weakTopic = weakestReview ? questionFocus(weakestReview.aiQuestion).topic : "weak areas";

    roadmap.push("Practice a 45-second intro: background, stack, one project, role goal.");

    if (profile.projectHint) {
        roadmap.push("Prepare one deep project story: problem, your role, stack, result.");
    }

    if (profile.gapSkills.length > 0) {
        roadmap.push(`Close gaps in ${profile.gapSkills.slice(0, 2).join(", ")} with a small demo.`);
    }

    if (scores.behavioralScore < 72) {
        roadmap.push("Practice 3 STAR behavioral answers from real projects.");
    }

    if (scores.technicalScore < 72) {
        roadmap.push(`Revise ${profile.jobSkills.slice(0, 3).join(", ") || "job skills"} with one example each.`);
    }

    roadmap.push(`Re-answer your weakest topic (${weakTopic}) out loud.`);

    return uniqueItems(roadmap).slice(0, 6);
}

function buildHeroInsights({ profile, scores, reviews, strengths, weaknesses, roadmap, overall }) {
    const strongReviews = reviews.filter((item) => item.score >= 72);
    const weakReview = [...reviews].sort((a, b) => a.score - b.score)[0];
    const weakTopic = weakReview ? questionFocus(weakReview.aiQuestion).topic : "core topics";

    let topStrength = "Finished the session and stayed engaged.";

    if (strongReviews.length > 0) {
        topStrength = `Good detail on ${strongReviews.length} answer(s).`;
    } else if (scores.communicationScore >= 65) {
        topStrength = "Communication is clear enough to build on.";
    } else if (strengths[0]) {
        topStrength = shortAdvice(strengths[0], 68);
    }

    let mainGap = "Add more project proof with stack and results.";

    if (scores.technicalScore < 55) {
        mainGap = `Weak ${weakTopic} depth — use a real project story.`;
    } else if (weaknesses[0]) {
        mainGap = shortAdvice(weaknesses[0], 68);
    }

    let nextStep = "Practice a short intro and one project story.";

    if (profile.gapSkills.length > 0) {
        nextStep = `Study ${profile.gapSkills[0]} and prepare one example.`;
    } else if (roadmap[0]) {
        nextStep = shortAdvice(roadmap[0], 68);
    }

    return { topStrength, mainGap, nextStep };
}

function buildOverview({ profile, overall, pairs, questions }) {
    const answered = pairs.filter((pair) => (pair.answer?.text || "").trim()).length;

    return shortAdvice(
        `${overall}% ready for ${profile.role} · ${answered}/${questions.length} answered.`,
        80
    );
}

export function buildInterviewAnalysis(session) {
    const transcript = session?.transcript || [];
    const answers = candidateAnswers(transcript);
    const questions = aiQuestions(transcript);
    const pairs = pairQuestionAnswers(transcript);
    const profile = buildSessionProfile(session);

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

    const reviews = pairs.map((pair, index) => reviewPair(pair, index, session));
    const answeredCount = pairs.filter((pair) => (pair.answer?.text || "").trim()).length;
    const missedCount = Math.max(0, pairs.length - answeredCount);
    const avgAnswerScore = reviews.length
        ? clampScore(reviews.reduce((sum, item) => sum + item.score, 0) / reviews.length)
        : 0;

    const strengths = buildStrengths({ profile, reviews, scores: {
        technicalScore: technical,
        communicationScore: communication,
        confidenceScore: confidence
    }, pairs });

    const weaknesses = buildWeaknesses({
        profile,
        reviews,
        scores: {
            technicalScore: technical,
            communicationScore: communication,
            confidenceScore: confidence
        }
    });

    const gapTech = uniqueItems([
        ...profile.gapSkills,
        ...(session?.skillGaps || []).map((gap) => gap.skill || gap)
    ]).slice(0, 6);

    const improvementRoadmap = buildPersonalizedRoadmap({
        profile,
        reviews,
        scores: {
            technicalScore: technical,
            behavioralScore: behavioral
        }
    });

    const heroInsights = buildHeroInsights({
        profile,
        scores: {
            technicalScore: technical,
            communicationScore: communication,
            confidenceScore: confidence
        },
        reviews,
        strengths,
        weaknesses,
        roadmap: improvementRoadmap,
        overall
    });

    return {
        heroInsights,
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
            totalQuestions: pairs.length || questions.length,
            answeredCount,
            missedCount,
            avgAnswerScore,
            recommendation: recommendation(overall),
            overview: buildOverview({ profile, overall, pairs, questions: pairs.length ? pairs : questions })
        },
        reviews,
        strengths,
        weaknesses,
        improvementRoadmap,
        recommendedTechnologies: gapTech,
        readinessLevel: readiness(overall)
    };
}
