
// const puppeteer = require("puppeteer");

// const GEMINI_MODEL = "gemini-1.5-flash";

// function extractJson(text) {
//     if (!text) return null;

//     try {
//         return JSON.parse(text);
//     } catch (_) {
//         const match = text.match(/\{[\s\S]*\}/);
//         if (!match) return null;

//         try {
//             return JSON.parse(match[0]);
//         } catch (_) {
//             return null;
//         }
//     }
// }

// function fallbackInterviewReport({ selfDescription, jobDescription }) {
//     return {
//         matchScore: 65,
//         title: jobDescription?.slice(0, 50) || "Interview Report",
//         technicalQuestions: [
//             {
//                 question: "Explain your main project architecture.",
//                 intention: "To check practical project understanding.",
//                 answer: "Explain frontend, backend, database, authentication, APIs, and your contribution."
//             },
//             {
//                 question: "What is the difference between SQL and NoSQL databases?",
//                 intention: "To test database knowledge.",
//                 answer: "SQL uses structured tables and schemas. NoSQL like MongoDB stores flexible document-based data."
//             },
//             {
//                 question: "How does JWT authentication work?",
//                 intention: "To check authentication understanding.",
//                 answer: "After login, the server signs a token. The client sends it with requests, and the server verifies it."
//             },
//             {
//                 question: "What is middleware in Express.js?",
//                 intention: "To test backend fundamentals.",
//                 answer: "Middleware functions run between request and response and are used for auth, validation, logging, and error handling."
//             },
//             {
//                 question: "What are React hooks?",
//                 intention: "To check React knowledge.",
//                 answer: "Hooks like useState and useEffect allow functional components to manage state and side effects."
//             }
//         ],
//         behavioralQuestions: [
//             {
//                 question: "Tell me about yourself.",
//                 intention: "To evaluate communication and confidence.",
//                 answer: selfDescription || "Briefly explain your education, skills, projects, and career goal."
//             },
//             {
//                 question: "Why should we hire you?",
//                 intention: "To understand your value for the role.",
//                 answer: "Connect your skills, projects, learning ability, and interest in the company role."
//             },
//             {
//                 question: "Describe a challenge you faced in a project.",
//                 intention: "To test problem-solving ability.",
//                 answer: "Explain the problem, your action, and the result clearly."
//             }
//         ],
//         skillGaps: [
//             {
//                 skill: "System design",
//                 severity: "medium"
//             },
//             {
//                 skill: "Advanced DSA",
//                 severity: "medium"
//             }
//         ],
//         preparationPlan: [
//             {
//                 day: 1,
//                 focus: "JavaScript and React revision",
//                 tasks: ["Revise hooks", "Practice components", "Review state management"]
//             },
//             {
//                 day: 2,
//                 focus: "Node.js and Express",
//                 tasks: ["Revise middleware", "Practice REST APIs", "Review JWT authentication"]
//             },
//             {
//                 day: 3,
//                 focus: "MongoDB",
//                 tasks: ["Practice CRUD queries", "Revise schema design", "Understand indexing"]
//             },
//             {
//                 day: 4,
//                 focus: "Project explanation",
//                 tasks: ["Prepare project architecture", "Explain your role", "Prepare challenges and solutions"]
//             },
//             {
//                 day: 5,
//                 focus: "Mock interview",
//                 tasks: ["Practice technical questions", "Practice HR questions", "Improve answers"]
//             }
//         ]
//     };
// }

// function normalizeInterviewReport(report, input) {
//     const fallback = fallbackInterviewReport(input);

//     return {
//         matchScore:
//             typeof report?.matchScore === "number"
//                 ? Math.max(0, Math.min(100, Math.round(report.matchScore)))
//                 : fallback.matchScore,

//         title:
//             report?.title ||
//             input.jobDescription?.slice(0, 50) ||
//             fallback.title,

//         technicalQuestions:
//             Array.isArray(report?.technicalQuestions) && report.technicalQuestions.length > 0
//                 ? report.technicalQuestions
//                 : fallback.technicalQuestions,

//         behavioralQuestions:
//             Array.isArray(report?.behavioralQuestions) && report.behavioralQuestions.length > 0
//                 ? report.behavioralQuestions
//                 : fallback.behavioralQuestions,

//         skillGaps:
//             Array.isArray(report?.skillGaps) && report.skillGaps.length > 0
//                 ? report.skillGaps
//                 : fallback.skillGaps,

//         preparationPlan:
//             Array.isArray(report?.preparationPlan) && report.preparationPlan.length > 0
//                 ? report.preparationPlan
//                 : fallback.preparationPlan
//     };
// }

// async function callGemini(prompt) {
//     const apiKey = process.env.GOOGLE_GENAI_API_KEY;

//     if (!apiKey) {
//         throw new Error("GOOGLE_GENAI_API_KEY is missing in .env");
//     }

//     const response = await fetch(
//         `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
//         {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify({
//                 contents: [
//                     {
//                         parts: [{ text: prompt }]
//                     }
//                 ],
//                 generationConfig: {
//                     temperature: 0.4,
//                     responseMimeType: "application/json"
//                 }
//             })
//         }
//     );

//     const data = await response.json();

//     if (!response.ok) {
//         throw new Error(data?.error?.message || "Gemini API request failed");
//     }

//     return data?.candidates?.[0]?.content?.parts?.[0]?.text;
// }

// async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
//     const input = { resume, selfDescription, jobDescription };

//     try {
//         const prompt = `
// Generate an interview preparation report.

// Return ONLY valid JSON in this exact shape:
// {
//   "matchScore": 75,
//   "title": "Job title",
//   "technicalQuestions": [
//     {
//       "question": "Question text",
//       "intention": "Why interviewer asks this",
//       "answer": "How candidate should answer"
//     }
//   ],
//   "behavioralQuestions": [
//     {
//       "question": "Question text",
//       "intention": "Why interviewer asks this",
//       "answer": "How candidate should answer"
//     }
//   ],
//   "skillGaps": [
//     {
//       "skill": "Skill name",
//       "severity": "low"
//     }
//   ],
//   "preparationPlan": [
//     {
//       "day": 1,
//       "focus": "Focus area",
//       "tasks": ["Task 1", "Task 2"]
//     }
//   ]
// }

// Rules:
// - matchScore must be between 0 and 100.
// - severity must be one of: low, medium, high.
// - Give at least 5 technical questions.
// - Give at least 3 behavioral questions.
// - Give at least 5 preparation days.

// Resume:
// ${resume || "Not provided"}

// Self Description:
// ${selfDescription || "Not provided"}

// Job Description:
// ${jobDescription || "Not provided"}
// `;

//         const text = await callGemini(prompt);
//         const parsed = extractJson(text);

//         return normalizeInterviewReport(parsed, input);
//     } catch (error) {
//         console.log("AI ERROR:", error.message);
//         return fallbackInterviewReport(input);
//     }
// }

// async function generatePdfFromHtml(htmlContent) {
//     const browser = await puppeteer.launch({
//         headless: "new",
//         args: ["--no-sandbox", "--disable-setuid-sandbox"]
//     });

//     const page = await browser.newPage();

//     await page.setContent(htmlContent, {
//         waitUntil: "networkidle0"
//     });

//     const pdfBuffer = await page.pdf({
//         format: "A4",
//         printBackground: true,
//         margin: {
//             top: "20mm",
//             bottom: "20mm",
//             left: "15mm",
//             right: "15mm"
//         }
//     });

//     await browser.close();

//     return pdfBuffer;
// }

// async function generateResumePdf({ resume, selfDescription, jobDescription }) {
//     try {
//         const prompt = `
// Create a professional ATS-friendly resume as HTML.

// Return ONLY valid JSON:
// {
//   "html": "<html>...</html>"
// }

// Resume:
// ${resume || "Not provided"}

// Self Description:
// ${selfDescription || "Not provided"}

// Job Description:
// ${jobDescription || "Not provided"}
// `;

//         const text = await callGemini(prompt);
//         const parsed = extractJson(text);

//         if (!parsed?.html) {
//             throw new Error("AI did not return resume HTML");
//         }

//         return await generatePdfFromHtml(parsed.html);
//     } catch (error) {
//         console.log("Resume PDF Error:", error.message);

//         const fallbackHtml = `
//             <html>
//                 <body style="font-family: Arial, sans-serif; padding: 24px;">
//                     <h1>Resume</h1>
//                     <h2>Profile</h2>
//                     <p>${selfDescription || ""}</p>
//                     <h2>Experience / Skills</h2>
//                     <p>${resume || ""}</p>
//                     <h2>Target Role</h2>
//                     <p>${jobDescription || ""}</p>
//                 </body>
//             </html>
//         `;

//         return await generatePdfFromHtml(fallbackHtml);
//     }
// }

// module.exports = {
//     generateInterviewReport,
//     generateResumePdf
// };








const puppeteer = require("puppeteer");

const MODEL_CANDIDATES = [
    process.env.GEMINI_MODEL,
    "gemini-2.0-flash",
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite"
].filter(Boolean);

function extractJson(text) {
    if (!text) return null;

    try {
        return JSON.parse(text);
    } catch (_) {
        const match = text.match(/\{[\s\S]*\}/);
        if (!match) return null;

        try {
            return JSON.parse(match[0]);
        } catch (_) {
            return null;
        }
    }
}

function escapeHtml(value = "") {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
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
                            temperature: 0.35,
                            maxOutputTokens: 2500,
                            responseMimeType: "application/json"
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

            if (text) return text;

            lastError = `Empty Gemini response for ${model}`;
        } catch (error) {
            lastError = error.message;
        }
    }

    throw new Error(lastError || "All Gemini models failed");
}

function fallbackInterviewReport({ selfDescription, jobDescription }) {
    return {
        matchScore: 65,
        title: jobDescription?.slice(0, 50) || "Interview Report",
        technicalQuestions: [
            {
                question: "Explain your main project architecture.",
                intention: "To check practical project understanding.",
                answer: "Explain frontend, backend, database, authentication, APIs, and your contribution."
            },
            {
                question: "What is middleware in Express.js?",
                intention: "To test backend fundamentals.",
                answer: "Middleware functions run between request and response and are used for auth, validation, logging, and error handling."
            },
            {
                question: "How does JWT authentication work?",
                intention: "To check authentication understanding.",
                answer: "After login, the server signs a token. The client sends it with requests, and the server verifies it."
            },
            {
                question: "What are React hooks?",
                intention: "To check React knowledge.",
                answer: "Hooks like useState and useEffect allow functional components to manage state and side effects."
            },
            {
                question: "What is the difference between SQL and NoSQL?",
                intention: "To test database knowledge.",
                answer: "SQL uses structured tables. NoSQL databases like MongoDB use flexible documents."
            }
        ],
        behavioralQuestions: [
            {
                question: "Tell me about yourself.",
                intention: "To evaluate communication and confidence.",
                answer: selfDescription || "Briefly explain your education, skills, projects, and career goal."
            },
            {
                question: "Why should we hire you?",
                intention: "To understand your fit for the role.",
                answer: "Connect your skills, projects, learning ability, and interest in the company role."
            },
            {
                question: "Describe a challenge you faced in a project.",
                intention: "To test problem-solving ability.",
                answer: "Explain the problem, your action, and the result clearly."
            }
        ],
        skillGaps: [
            { skill: "System design", severity: "medium" },
            { skill: "Advanced DSA", severity: "medium" }
        ],
        preparationPlan: [
            {
                day: 1,
                focus: "JavaScript and React revision",
                tasks: ["Revise hooks", "Practice components", "Review state management"]
            },
            {
                day: 2,
                focus: "Node.js and Express",
                tasks: ["Revise middleware", "Practice REST APIs", "Review JWT authentication"]
            },
            {
                day: 3,
                focus: "MongoDB",
                tasks: ["Practice CRUD queries", "Revise schema design", "Understand indexing"]
            },
            {
                day: 4,
                focus: "Project explanation",
                tasks: ["Prepare project architecture", "Explain your role", "Prepare challenges and solutions"]
            },
            {
                day: 5,
                focus: "Mock interview",
                tasks: ["Practice technical questions", "Practice HR questions", "Improve answers"]
            }
        ]
    };
}

function normalizeInterviewReport(report, input) {
    const fallback = fallbackInterviewReport(input);

    return {
        matchScore:
            typeof report?.matchScore === "number"
                ? Math.max(0, Math.min(100, Math.round(report.matchScore)))
                : fallback.matchScore,
        title: report?.title || input.jobDescription?.slice(0, 50) || fallback.title,
        technicalQuestions:
            Array.isArray(report?.technicalQuestions) && report.technicalQuestions.length > 0
                ? report.technicalQuestions
                : fallback.technicalQuestions,
        behavioralQuestions:
            Array.isArray(report?.behavioralQuestions) && report.behavioralQuestions.length > 0
                ? report.behavioralQuestions
                : fallback.behavioralQuestions,
        skillGaps:
            Array.isArray(report?.skillGaps) && report.skillGaps.length > 0
                ? report.skillGaps
                : fallback.skillGaps,
        preparationPlan:
            Array.isArray(report?.preparationPlan) && report.preparationPlan.length > 0
                ? report.preparationPlan
                : fallback.preparationPlan
    };
}

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    const input = { resume, selfDescription, jobDescription };

    try {
        const prompt = `
Generate an interview preparation report.

Return ONLY valid JSON:
{
  "matchScore": 75,
  "title": "Job title",
  "technicalQuestions": [
    {
      "question": "Question text",
      "intention": "Why interviewer asks this",
      "answer": "How candidate should answer"
    }
  ],
  "behavioralQuestions": [
    {
      "question": "Question text",
      "intention": "Why interviewer asks this",
      "answer": "How candidate should answer"
    }
  ],
  "skillGaps": [
    {
      "skill": "Skill name",
      "severity": "low"
    }
  ],
  "preparationPlan": [
    {
      "day": 1,
      "focus": "Focus area",
      "tasks": ["Task 1", "Task 2"]
    }
  ]
}

Rules:
- matchScore must be between 0 and 100.
- severity must be one of: low, medium, high.
- Give at least 5 technical questions.
- Give at least 3 behavioral questions.
- Give at least 5 preparation days.

Resume:
${resume || "Not provided"}

Self Description:
${selfDescription || "Not provided"}

Job Description:
${jobDescription || "Not provided"}
`;

        const text = await callGemini(prompt);
        const parsed = extractJson(text);

        return normalizeInterviewReport(parsed, input);
    } catch (error) {
        console.log("AI ERROR:", error.message);
        return fallbackInterviewReport(input);
    }
}

function createAtsResumeHtml(data) {
    const skills = Array.isArray(data.skills) ? data.skills : [];
    const projects = Array.isArray(data.projects) ? data.projects : [];
    const experience = Array.isArray(data.experience) ? data.experience : [];
    const education = Array.isArray(data.education) ? data.education : [];

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8" />
    <style>
        * {
            box-sizing: border-box;
        }

        body {
            font-family: Arial, Helvetica, sans-serif;
            color: #000;
            background: #fff;
            margin: 0;
            padding: 0;
            font-size: 10.5pt;
            line-height: 1.35;
        }

        .resume {
            width: 100%;
            padding: 0;
        }

        .header {
            text-align: center;
            margin-bottom: 12px;
        }

        .name {
            font-size: 22pt;
            font-weight: 700;
            letter-spacing: 0;
            margin: 0 0 4px;
            text-transform: uppercase;
        }

        .contact {
            font-size: 9.5pt;
            margin: 0;
        }

        .section {
            margin-top: 11px;
        }

        .section-title {
            font-size: 11.5pt;
            font-weight: 700;
            text-transform: uppercase;
            border-bottom: 1px solid #000;
            padding-bottom: 2px;
            margin-bottom: 6px;
        }

        p {
            margin: 0 0 5px;
        }

        .item {
            margin-bottom: 8px;
        }

        .item-header {
            display: flex;
            justify-content: space-between;
            gap: 10px;
            font-weight: 700;
        }

        .item-sub {
            display: flex;
            justify-content: space-between;
            gap: 10px;
            font-style: italic;
            margin-top: 1px;
        }

        ul {
            margin: 4px 0 0 16px;
            padding: 0;
        }

        li {
            margin-bottom: 3px;
        }

        .skills {
            margin: 0;
        }
    </style>
</head>
<body>
    <div class="resume">
        <div class="header">
            <h1 class="name">${escapeHtml(data.name || "Ishika Savita")}</h1>
            <p class="contact">${escapeHtml(data.contact || "")}</p>
        </div>

        <div class="section">
            <div class="section-title">Professional Summary</div>
            <p>${escapeHtml(data.summary || "")}</p>
        </div>

        <div class="section">
            <div class="section-title">Technical Skills</div>
            <p class="skills">${escapeHtml(skills.join(" | "))}</p>
        </div>

        <div class="section">
            <div class="section-title">Experience</div>
            ${experience.map(item => `
                <div class="item">
                    <div class="item-header">
                        <span>${escapeHtml(item.role || "")}</span>
                        <span>${escapeHtml(item.duration || "")}</span>
                    </div>
                    <div class="item-sub">
                        <span>${escapeHtml(item.company || "")}</span>
                        <span>${escapeHtml(item.location || "")}</span>
                    </div>
                    <ul>
                        ${(item.points || []).map(point => `<li>${escapeHtml(point)}</li>`).join("")}
                    </ul>
                </div>
            `).join("")}
        </div>

        <div class="section">
            <div class="section-title">Projects</div>
            ${projects.map(item => `
                <div class="item">
                    <div class="item-header">
                        <span>${escapeHtml(item.name || "")}</span>
                        <span>${escapeHtml(item.tech || "")}</span>
                    </div>
                    <ul>
                        ${(item.points || []).map(point => `<li>${escapeHtml(point)}</li>`).join("")}
                    </ul>
                </div>
            `).join("")}
        </div>

        <div class="section">
            <div class="section-title">Education</div>
            ${education.map(item => `
                <div class="item">
                    <div class="item-header">
                        <span>${escapeHtml(item.degree || "")}</span>
                        <span>${escapeHtml(item.duration || "")}</span>
                    </div>
                    <div>${escapeHtml(item.institute || "")}</div>
                    <div>${escapeHtml(item.location || "")}</div>
                </div>
            `).join("")}
        </div>
    </div>
</body>
</html>
`;
}

async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch({
        headless: "new",
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    const page = await browser.newPage();

    await page.setContent(htmlContent, {
        waitUntil: "networkidle0"
    });

    const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: {
            top: "14mm",
            bottom: "14mm",
            left: "16mm",
            right: "16mm"
        }
    });

    await browser.close();

    return pdfBuffer;
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
    try {
        const prompt = `
You are an expert ATS resume writer.

Create a clean ATS-friendly resume from the candidate details and target job.

Return ONLY valid JSON in this shape:
{
  "name": "Candidate Name",
  "contact": "Phone | Email | LinkedIn | GitHub | Portfolio",
  "summary": "3-4 line professional summary tailored to the job",
  "skills": ["React.js", "Node.js", "MongoDB"],
  "experience": [
    {
      "role": "Job title",
      "company": "Company name",
      "location": "Location or Remote",
      "duration": "Month Year - Month Year",
      "points": [
        "Achievement-oriented bullet point",
        "Achievement-oriented bullet point"
      ]
    }
  ],
  "projects": [
    {
      "name": "Project name",
      "tech": "React.js, Node.js, MongoDB",
      "points": [
        "Project bullet point",
        "Project bullet point"
      ]
    }
  ],
  "education": [
    {
      "degree": "Degree name",
      "institute": "Institute name",
      "location": "Location",
      "duration": "Year - Year"
    }
  ]
}

Rules:
- Do not invent fake companies.
- Use only information from resume/profile where possible.
- Improve wording to be professional and ATS-friendly.
- Keep it one-column, simple, black text resume content.
- Make bullets concise and impact-focused.
- Tailor keywords to the job description.

Candidate Resume Text:
${resume || "Not provided"}

Candidate Self Description:
${selfDescription || "Not provided"}

Target Job Description:
${jobDescription || "Not provided"}
`;

        const text = await callGemini(prompt);
        const parsed = extractJson(text);

        if (!parsed) {
            throw new Error("AI did not return valid resume JSON");
        }

        const html = createAtsResumeHtml(parsed);
        return await generatePdfFromHtml(html);
    } catch (error) {
        console.log("Resume PDF Error:", error.message);

        const html = createAtsResumeHtml({
            name: "Ishika Savita",
            contact: "+91 9131314683 | ishikasavita946@gmail.com | LinkedIn | GitHub | Portfolio",
            summary: selfDescription || "Full-stack developer with experience in React.js, Node.js, MongoDB, REST APIs, authentication, and responsive web application development.",
            skills: ["React.js", "Node.js", "Express.js", "MongoDB", "JavaScript", "HTML", "CSS", "REST APIs", "Git", "GitHub"],
            experience: [
                {
                    role: "Full Stack Developer Intern",
                    company: "iNeuron Intelligence Pvt. Ltd.",
                    location: "Remote",
                    duration: "May 2025 - July 2025",
                    points: [
                        "Developed full-stack web application features using React.js, Node.js, Express.js, and MongoDB.",
                        "Implemented REST APIs for authentication, data management, and backend business logic.",
                        "Built responsive user interfaces and improved frontend-backend communication."
                    ]
                }
            ],
            projects: [
                {
                    name: "AI Interview Preparation Platform",
                    tech: "React.js, Node.js, MongoDB, Gemini API",
                    points: [
                        "Built an AI-powered platform that generates interview questions, skill gaps, and preparation plans.",
                        "Integrated resume parsing, authentication, report generation, and mock interview functionality."
                    ]
                }
            ],
            education: [
                {
                    degree: "B.Tech in Electrical Engineering",
                    institute: "Madhav Institute of Technology and Science",
                    location: "Gwalior, India",
                    duration: "2022 - Present"
                }
            ]
        });

        return await generatePdfFromHtml(html);
    }
}

module.exports = {
    generateInterviewReport,
    generateResumePdf
};

