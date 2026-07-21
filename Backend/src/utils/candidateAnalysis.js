const SKILL_KEYWORDS = [
    "React.js", "React", "Node.js", "Express.js", "MongoDB", "JavaScript",
    "TypeScript", "HTML", "CSS", "REST APIs", "JWT", "Authentication",
    "Git", "GitHub", "Socket.IO", "WebSocket", "Redux", "Tailwind CSS",
    "MySQL", "PostgreSQL", "Python", "Java", "Spring Boot", "Flutter", "Dart",
    "Django", "Firebase", "GetX", "Riverpod", "Android", "iOS", "DSA",
    "System Design", "Gemini API", "OpenAI API", "AI", "LLM", "Prompt Engineering",
    "Docker", "Kubernetes", "AWS", "Azure", "GCP", "GraphQL", "Redis", "CI/CD",
    "Next.js", "Vue.js", "Angular", "Microservices", "Kafka", "Elasticsearch"
];

function normalizeText(value = "") {
    return String(value || "")
        .toLowerCase()
        .replace(/[^a-z0-9\s.+/#-]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function cleanText(value = "") {
    return String(value || "")
        .replace(/\s+/g, " ")
        .replace(/[•●▪]/g, "")
        .trim();
}

function unique(values = []) {
    const seen = new Set();

    return values.filter((value) => {
        const key = normalizeText(value);
        if (!key || seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}

function getLines(text = "") {
    return String(text || "")
        .split(/\r?\n/)
        .map((line) => cleanText(line))
        .filter(Boolean);
}

function extractSkills(text = "") {
    const normalized = normalizeText(text);

    return unique(
        SKILL_KEYWORDS.filter((skill) => normalized.includes(normalizeText(skill)))
            .map((skill) => (skill === "React" ? "React.js" : skill))
    );
}

function extractCompanyFromJob(jobDescription = "") {
    const text = cleanText(jobDescription);
    if (!text) return "the target company";

    const patterns = [
        /(?:at|@|join|about)\s+([A-Z][A-Za-z0-9&.\- ]{2,40}?)(?:\s+(?:is|are|we|as|in|for|\.|,|\n))/i,
        /company[:\s]+([A-Z][A-Za-z0-9&.\- ]{2,40})/i,
        /^([A-Z][A-Za-z0-9&.\- ]{2,35})\s+(?:is hiring|hiring|careers|jobs)/im,
        /(?:position at|role at|opening at)\s+([A-Z][A-Za-z0-9&.\- ]{2,40})/i
    ];

    for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match?.[1]) {
            const company = cleanText(match[1])
                .replace(/\b(inc|ltd|llc|pvt|corp|corporation|technologies|technology|tech|labs|studio|studios)\b\.?$/i, "")
                .trim();

            if (company.length >= 2 && company.length <= 40) {
                return company;
            }
        }
    }

    const firstLine = getLines(text)[0] || "";
    const titleMatch = firstLine.match(/^([A-Z][A-Za-z0-9&.\- ]{2,30})/);

    if (titleMatch && !/developer|engineer|intern|full.?stack|frontend|backend|software/i.test(titleMatch[1])) {
        return cleanText(titleMatch[1]);
    }

    return "the target company";
}

function inferRole(jobDescription = "") {
    const text = normalizeText(jobDescription);

    if (text.includes("prompt")) return "Prompt Engineer";
    if (text.includes("junior") && text.includes("software")) return "Junior Software Developer";
    if (text.includes("flutter") || text.includes("mobile")) return "Flutter Developer";
    if (text.includes("ai") || text.includes("llm") || text.includes("machine learning")) return "AI Developer";
    if (text.includes("full stack") || text.includes("fullstack") || text.includes("mern")) return "Full Stack Developer";
    if (text.includes("frontend") || text.includes("front end") || text.includes("react")) return "Frontend Developer";
    if (text.includes("backend") || text.includes("back end") || text.includes("node")) return "Backend Developer";
    if (text.includes("devops") || text.includes("sre") || text.includes("platform")) return "DevOps Engineer";

    const words = cleanText(jobDescription).split(" ").slice(0, 7).join(" ");
    return words || "Software Developer";
}

function inferExperienceLevel(resume = "", jobDescription = "") {
    const text = normalizeText(`${resume} ${jobDescription}`);

    if (/senior|lead|architect|principal|staff|8 years|9 years|10 years/.test(text)) return "senior";
    if (/mid.?level|mid level|3 years|4 years|5 years|6 years|7 years/.test(text)) return "mid";
    if (/intern|fresher|graduate|entry.?level|0-1 year|1 year|student|campus/.test(text)) return "junior";

    return "junior";
}

function calculateMatchScore({ resume, selfDescription, jobDescription }) {
    const candidateText = normalizeText(`${resume || ""} ${selfDescription || ""}`);
    const jobSkills = extractSkills(jobDescription);
    const candidateSkills = extractSkills(`${resume || ""} ${selfDescription || ""}`);

    const matchedSkills = jobSkills.filter((skill) =>
        candidateSkills.map(normalizeText).includes(normalizeText(skill))
    );

    let score = 38;

    if (jobSkills.length > 0) {
        score += Math.round((matchedSkills.length / jobSkills.length) * 42);
    } else if (candidateSkills.length > 0) {
        score += 18;
    }

    if (/project|built|developed|implemented|created|designed|deployed/.test(candidateText)) score += 8;
    if (/intern|experience|company|remote|work|freelance/.test(candidateText)) score += 7;
    if (/api|auth|database|mongodb|node|react|express|rest/.test(candidateText)) score += 5;
    if (candidateText.length < 100) score -= 15;
    if (candidateText.length > 400) score += 4;

    const missingRatio = jobSkills.length
        ? (jobSkills.length - matchedSkills.length) / jobSkills.length
        : 0.3;

    if (missingRatio > 0.6) score -= 10;
    if (missingRatio < 0.2 && matchedSkills.length >= 3) score += 6;

    return Math.max(22, Math.min(94, Math.round(score)));
}

function getSkillGaps({ resume, selfDescription, jobDescription }) {
    const jobSkills = extractSkills(jobDescription);
    const candidateSkills = extractSkills(`${resume || ""} ${selfDescription || ""}`);
    const candidateKeys = candidateSkills.map(normalizeText);
    const missing = jobSkills.filter((skill) => !candidateKeys.includes(normalizeText(skill)));

    if (missing.length > 0) {
        return missing.slice(0, 5).map((skill, index) => ({
            skill,
            severity: index === 0 ? "high" : index < 3 ? "medium" : "low"
        }));
    }

    const role = inferRole(jobDescription);

    if (/full stack|backend|frontend|software|developer/.test(normalizeText(role))) {
        return [
            { skill: "System Design", severity: "medium" },
            { skill: "Production Debugging", severity: "medium" }
        ];
    }

    return [{ skill: "Role-specific depth", severity: "low" }];
}

function extractCandidateProfile({ resume, selfDescription, jobDescription }) {
    const candidateText = `${resume || ""}\n${selfDescription || ""}`;
    const candidateSkills = extractSkills(candidateText);
    const jobSkills = extractSkills(jobDescription);
    const gaps = getSkillGaps({ resume, selfDescription, jobDescription });

    const projects = getLines(candidateText)
        .filter((line) => /project|built|developed|implemented|created|platform|application|app|system/i.test(line))
        .slice(0, 4);

    const experience = getLines(candidateText)
        .filter((line) => /intern|experience|company|worked|remote|freelance|developer|engineer/i.test(line))
        .slice(0, 3);

    const education = getLines(candidateText)
        .filter((line) => /b\.?tech|bachelor|master|degree|college|university|institute|engineering/i.test(line))
        .slice(0, 2);

    return {
        company: extractCompanyFromJob(jobDescription),
        role: inferRole(jobDescription),
        experienceLevel: inferExperienceLevel(candidateText, jobDescription),
        candidateSkills,
        jobSkills,
        matchedSkills: jobSkills.filter((skill) =>
            candidateSkills.map(normalizeText).includes(normalizeText(skill))
        ),
        gaps,
        projects,
        experience,
        education,
        strongestSkill: candidateSkills[0] || jobSkills[0] || "core programming",
        roleRequirement: jobSkills[0] || "the target job requirements",
        projectReference: projects[0] || selfDescription || "your strongest project",
        weakArea: gaps[0]?.skill || "system design",
        matchScore: calculateMatchScore({ resume, selfDescription, jobDescription })
    };
}

function blendMatchScore(aiScore, profile) {
    if (typeof aiScore !== "number" || Number.isNaN(aiScore)) {
        return profile.matchScore;
    }

    const normalizedAi = Math.max(0, Math.min(100, Math.round(aiScore)));
    const heuristic = profile.matchScore;
    const blended = Math.round(normalizedAi * 0.55 + heuristic * 0.45);

    return Math.max(22, Math.min(94, blended));
}

function assignQuestionDifficulty(index, type) {
    if (type === "intro" || type === "behavioral" && index < 2) return "easy";
    if (type === "closing") return "hard";
    if (index < 3) return "easy";
    if (index < 7) return "medium";
    return "hard";
}

module.exports = {
    SKILL_KEYWORDS,
    normalizeText,
    cleanText,
    unique,
    getLines,
    extractSkills,
    extractCompanyFromJob,
    inferRole,
    inferExperienceLevel,
    calculateMatchScore,
    getSkillGaps,
    extractCandidateProfile,
    blendMatchScore,
    assignQuestionDifficulty
};
