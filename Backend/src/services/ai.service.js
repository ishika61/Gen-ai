
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








// const puppeteer = require("puppeteer");

// const MODEL_CANDIDATES = [
//     process.env.GEMINI_MODEL,
//     "gemini-2.0-flash",
//     "gemini-2.5-flash",
//     "gemini-2.5-flash-lite"
// ].filter(Boolean);

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

// function escapeHtml(value = "") {
//     return String(value)
//         .replace(/&/g, "&amp;")
//         .replace(/</g, "&lt;")
//         .replace(/>/g, "&gt;")
//         .replace(/"/g, "&quot;")
//         .replace(/'/g, "&#039;");
// }

// async function callGemini(prompt) {
//     const apiKey = process.env.GOOGLE_GENAI_API_KEY;

//     if (!apiKey) {
//         throw new Error("GOOGLE_GENAI_API_KEY is missing in .env");
//     }

//     let lastError = null;

//     for (const model of MODEL_CANDIDATES) {
//         try {
//             const response = await fetch(
//                 `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
//                 {
//                     method: "POST",
//                     headers: {
//                         "Content-Type": "application/json"
//                     },
//                     body: JSON.stringify({
//                         contents: [
//                             {
//                                 parts: [{ text: prompt }]
//                             }
//                         ],
//                         generationConfig: {
//                             temperature: 0.35,
//                             maxOutputTokens: 2500,
//                             responseMimeType: "application/json"
//                         }
//                     })
//                 }
//             );

//             const data = await response.json();

//             if (!response.ok) {
//                 lastError = data?.error?.message || `Gemini request failed for ${model}`;
//                 continue;
//             }

//             const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

//             if (text) return text;

//             lastError = `Empty Gemini response for ${model}`;
//         } catch (error) {
//             lastError = error.message;
//         }
//     }

//     throw new Error(lastError || "All Gemini models failed");
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
//                 question: "What is middleware in Express.js?",
//                 intention: "To test backend fundamentals.",
//                 answer: "Middleware functions run between request and response and are used for auth, validation, logging, and error handling."
//             },
//             {
//                 question: "How does JWT authentication work?",
//                 intention: "To check authentication understanding.",
//                 answer: "After login, the server signs a token. The client sends it with requests, and the server verifies it."
//             },
//             {
//                 question: "What are React hooks?",
//                 intention: "To check React knowledge.",
//                 answer: "Hooks like useState and useEffect allow functional components to manage state and side effects."
//             },
//             {
//                 question: "What is the difference between SQL and NoSQL?",
//                 intention: "To test database knowledge.",
//                 answer: "SQL uses structured tables. NoSQL databases like MongoDB use flexible documents."
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
//                 intention: "To understand your fit for the role.",
//                 answer: "Connect your skills, projects, learning ability, and interest in the company role."
//             },
//             {
//                 question: "Describe a challenge you faced in a project.",
//                 intention: "To test problem-solving ability.",
//                 answer: "Explain the problem, your action, and the result clearly."
//             }
//         ],
//         skillGaps: [
//             { skill: "System design", severity: "medium" },
//             { skill: "Advanced DSA", severity: "medium" }
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
//         title: report?.title || input.jobDescription?.slice(0, 50) || fallback.title,
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

// async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
//     const input = { resume, selfDescription, jobDescription };

//     try {
//         const prompt = `
// Generate an interview preparation report.

// Return ONLY valid JSON:
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

// function createAtsResumeHtml(data) {
//     const skills = Array.isArray(data.skills) ? data.skills : [];
//     const projects = Array.isArray(data.projects) ? data.projects : [];
//     const experience = Array.isArray(data.experience) ? data.experience : [];
//     const education = Array.isArray(data.education) ? data.education : [];

//     return `
// <!DOCTYPE html>
// <html>
// <head>
//     <meta charset="UTF-8" />
//     <style>
//         * {
//             box-sizing: border-box;
//         }

//         body {
//             font-family: Arial, Helvetica, sans-serif;
//             color: #000;
//             background: #fff;
//             margin: 0;
//             padding: 0;
//             font-size: 10.5pt;
//             line-height: 1.35;
//         }

//         .resume {
//             width: 100%;
//             padding: 0;
//         }

//         .header {
//             text-align: center;
//             margin-bottom: 12px;
//         }

//         .name {
//             font-size: 22pt;
//             font-weight: 700;
//             letter-spacing: 0;
//             margin: 0 0 4px;
//             text-transform: uppercase;
//         }

//         .contact {
//             font-size: 9.5pt;
//             margin: 0;
//         }

//         .section {
//             margin-top: 11px;
//         }

//         .section-title {
//             font-size: 11.5pt;
//             font-weight: 700;
//             text-transform: uppercase;
//             border-bottom: 1px solid #000;
//             padding-bottom: 2px;
//             margin-bottom: 6px;
//         }

//         p {
//             margin: 0 0 5px;
//         }

//         .item {
//             margin-bottom: 8px;
//         }

//         .item-header {
//             display: flex;
//             justify-content: space-between;
//             gap: 10px;
//             font-weight: 700;
//         }

//         .item-sub {
//             display: flex;
//             justify-content: space-between;
//             gap: 10px;
//             font-style: italic;
//             margin-top: 1px;
//         }

//         ul {
//             margin: 4px 0 0 16px;
//             padding: 0;
//         }

//         li {
//             margin-bottom: 3px;
//         }

//         .skills {
//             margin: 0;
//         }
//     </style>
// </head>
// <body>
//     <div class="resume">
//         <div class="header">
//             <h1 class="name">${escapeHtml(data.name || "Ishika Savita")}</h1>
//             <p class="contact">${escapeHtml(data.contact || "")}</p>
//         </div>

//         <div class="section">
//             <div class="section-title">Professional Summary</div>
//             <p>${escapeHtml(data.summary || "")}</p>
//         </div>

//         <div class="section">
//             <div class="section-title">Technical Skills</div>
//             <p class="skills">${escapeHtml(skills.join(" | "))}</p>
//         </div>

//         <div class="section">
//             <div class="section-title">Experience</div>
//             ${experience.map(item => `
//                 <div class="item">
//                     <div class="item-header">
//                         <span>${escapeHtml(item.role || "")}</span>
//                         <span>${escapeHtml(item.duration || "")}</span>
//                     </div>
//                     <div class="item-sub">
//                         <span>${escapeHtml(item.company || "")}</span>
//                         <span>${escapeHtml(item.location || "")}</span>
//                     </div>
//                     <ul>
//                         ${(item.points || []).map(point => `<li>${escapeHtml(point)}</li>`).join("")}
//                     </ul>
//                 </div>
//             `).join("")}
//         </div>

//         <div class="section">
//             <div class="section-title">Projects</div>
//             ${projects.map(item => `
//                 <div class="item">
//                     <div class="item-header">
//                         <span>${escapeHtml(item.name || "")}</span>
//                         <span>${escapeHtml(item.tech || "")}</span>
//                     </div>
//                     <ul>
//                         ${(item.points || []).map(point => `<li>${escapeHtml(point)}</li>`).join("")}
//                     </ul>
//                 </div>
//             `).join("")}
//         </div>

//         <div class="section">
//             <div class="section-title">Education</div>
//             ${education.map(item => `
//                 <div class="item">
//                     <div class="item-header">
//                         <span>${escapeHtml(item.degree || "")}</span>
//                         <span>${escapeHtml(item.duration || "")}</span>
//                     </div>
//                     <div>${escapeHtml(item.institute || "")}</div>
//                     <div>${escapeHtml(item.location || "")}</div>
//                 </div>
//             `).join("")}
//         </div>
//     </div>
// </body>
// </html>
// `;
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
//             top: "14mm",
//             bottom: "14mm",
//             left: "16mm",
//             right: "16mm"
//         }
//     });

//     await browser.close();

//     return pdfBuffer;
// }

// async function generateResumePdf({ resume, selfDescription, jobDescription }) {
//     try {
//         const prompt = `
// You are an expert ATS resume writer.

// Create a clean ATS-friendly resume from the candidate details and target job.

// Return ONLY valid JSON in this shape:
// {
//   "name": "Candidate Name",
//   "contact": "Phone | Email | LinkedIn | GitHub | Portfolio",
//   "summary": "3-4 line professional summary tailored to the job",
//   "skills": ["React.js", "Node.js", "MongoDB"],
//   "experience": [
//     {
//       "role": "Job title",
//       "company": "Company name",
//       "location": "Location or Remote",
//       "duration": "Month Year - Month Year",
//       "points": [
//         "Achievement-oriented bullet point",
//         "Achievement-oriented bullet point"
//       ]
//     }
//   ],
//   "projects": [
//     {
//       "name": "Project name",
//       "tech": "React.js, Node.js, MongoDB",
//       "points": [
//         "Project bullet point",
//         "Project bullet point"
//       ]
//     }
//   ],
//   "education": [
//     {
//       "degree": "Degree name",
//       "institute": "Institute name",
//       "location": "Location",
//       "duration": "Year - Year"
//     }
//   ]
// }

// Rules:
// - Do not invent fake companies.
// - Use only information from resume/profile where possible.
// - Improve wording to be professional and ATS-friendly.
// - Keep it one-column, simple, black text resume content.
// - Make bullets concise and impact-focused.
// - Tailor keywords to the job description.

// Candidate Resume Text:
// ${resume || "Not provided"}

// Candidate Self Description:
// ${selfDescription || "Not provided"}

// Target Job Description:
// ${jobDescription || "Not provided"}
// `;

//         const text = await callGemini(prompt);
//         const parsed = extractJson(text);

//         if (!parsed) {
//             throw new Error("AI did not return valid resume JSON");
//         }

//         const html = createAtsResumeHtml(parsed);
//         return await generatePdfFromHtml(html);
//     } catch (error) {
//         console.log("Resume PDF Error:", error.message);

//         const html = createAtsResumeHtml({
//             name: "Ishika Savita",
//             contact: "+91 9131314683 | ishikasavita946@gmail.com | LinkedIn | GitHub | Portfolio",
//             summary: selfDescription || "Full-stack developer with experience in React.js, Node.js, MongoDB, REST APIs, authentication, and responsive web application development.",
//             skills: ["React.js", "Node.js", "Express.js", "MongoDB", "JavaScript", "HTML", "CSS", "REST APIs", "Git", "GitHub"],
//             experience: [
//                 {
//                     role: "Full Stack Developer Intern",
//                     company: "iNeuron Intelligence Pvt. Ltd.",
//                     location: "Remote",
//                     duration: "May 2025 - July 2025",
//                     points: [
//                         "Developed full-stack web application features using React.js, Node.js, Express.js, and MongoDB.",
//                         "Implemented REST APIs for authentication, data management, and backend business logic.",
//                         "Built responsive user interfaces and improved frontend-backend communication."
//                     ]
//                 }
//             ],
//             projects: [
//                 {
//                     name: "AI Interview Preparation Platform",
//                     tech: "React.js, Node.js, MongoDB, Gemini API",
//                     points: [
//                         "Built an AI-powered platform that generates interview questions, skill gaps, and preparation plans.",
//                         "Integrated resume parsing, authentication, report generation, and mock interview functionality."
//                     ]
//                 }
//             ],
//             education: [
//                 {
//                     degree: "B.Tech in Electrical Engineering",
//                     institute: "Madhav Institute of Technology and Science",
//                     location: "Gwalior, India",
//                     duration: "2022 - Present"
//                 }
//             ]
//         });

//         return await generatePdfFromHtml(html);
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

const SKILL_KEYWORDS = [
    "React.js", "React", "Node.js", "Express.js", "MongoDB", "JavaScript",
    "TypeScript", "HTML", "CSS", "REST APIs", "JWT", "Authentication",
    "Git", "GitHub", "Socket.IO", "WebSocket", "Redux", "Tailwind CSS",
    "MySQL", "PostgreSQL", "Python", "Java", "DSA", "System Design",
    "Gemini API", "OpenAI API", "AI", "LLM", "Prompt Engineering"
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

function escapeHtml(value = "") {
    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function extractJson(text) {
    if (!text) return null;

    const cleaned = String(text)
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

    try {
        return JSON.parse(cleaned);
    } catch (_) {
        const firstBrace = cleaned.indexOf("{");
        const lastBrace = cleaned.lastIndexOf("}");

        if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
            return null;
        }

        try {
            return JSON.parse(cleaned.slice(firstBrace, lastBrace + 1));
        } catch (_) {
            return null;
        }
    }
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

function toArray(value) {
    return Array.isArray(value) ? value.filter(Boolean) : [];
}

function limitWords(text, maxWords) {
    const words = cleanText(text).split(" ").filter(Boolean);
    return words.slice(0, maxWords).join(" ");
}

function getLines(text = "") {
    return String(text || "")
        .split(/\r?\n/)
        .map((line) => cleanText(line))
        .filter(Boolean);
}

function extractEmail(text = "") {
    return String(text).match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/)?.[0] || "";
}

function extractPhone(text = "") {
    return String(text).match(/(\+91[\s-]?)?[6-9]\d{9}/)?.[0] || "";
}

function extractName(resume = "") {
    const lines = getLines(resume);

    const nameLine = lines.find((line) => {
        const lower = line.toLowerCase();

        return (
            line.length >= 4 &&
            line.length <= 45 &&
            !lower.includes("@") &&
            !lower.includes("linkedin") &&
            !lower.includes("github") &&
            !lower.includes("portfolio") &&
            !lower.includes("resume") &&
            !lower.includes("profile") &&
            !lower.includes("summary") &&
            !lower.includes("skills") &&
            !lower.includes("education") &&
            !/\d/.test(line)
        );
    });

    return nameLine || "Ishika Savita";
}

function extractSkills(text = "") {
    const normalized = normalizeText(text);

    const found = SKILL_KEYWORDS.filter((skill) =>
        normalized.includes(normalizeText(skill))
    ).map((skill) => {
        if (skill === "React") return "React.js";
        return skill;
    });

    return unique(found);
}

function inferRole(jobDescription = "") {
    const text = normalizeText(jobDescription);

    if (text.includes("prompt")) return "Prompt Engineer";
    if (text.includes("ai") || text.includes("llm") || text.includes("machine learning")) return "AI Developer";
    if (text.includes("full stack") || text.includes("fullstack") || text.includes("mern")) return "Full Stack Developer";
    if (text.includes("frontend") || text.includes("front end") || text.includes("react")) return "Frontend Developer";
    if (text.includes("backend") || text.includes("back end") || text.includes("node")) return "Backend Developer";

    const words = cleanText(jobDescription).split(" ").slice(0, 7).join(" ");
    return words || "Software Developer";
}

function calculateMatchScore({ resume, selfDescription, jobDescription }) {
    const candidateText = normalizeText(`${resume || ""} ${selfDescription || ""}`);
    const jobSkills = extractSkills(jobDescription);
    const candidateSkills = extractSkills(`${resume || ""} ${selfDescription || ""}`);

    const matchedSkills = jobSkills.filter((skill) =>
        candidateSkills.map(normalizeText).includes(normalizeText(skill))
    );

    let score = 42;

    if (jobSkills.length > 0) {
        score += Math.round((matchedSkills.length / jobSkills.length) * 38);
    }

    if (/project|built|developed|implemented|created|designed/.test(candidateText)) score += 8;
    if (/intern|experience|company|remote|work/.test(candidateText)) score += 6;
    if (/api|auth|database|mongodb|node|react/.test(candidateText)) score += 6;
    if (candidateText.length < 120) score -= 12;

    return Math.max(28, Math.min(92, score));
}

function getSkillGaps({ resume, selfDescription, jobDescription }) {
    const jobSkills = extractSkills(jobDescription);
    const candidateSkills = extractSkills(`${resume || ""} ${selfDescription || ""}`);

    const candidateKeys = candidateSkills.map(normalizeText);
    const missing = jobSkills.filter((skill) => !candidateKeys.includes(normalizeText(skill)));

    if (missing.length > 0) {
        return missing.slice(0, 4).map((skill, index) => ({
            skill,
            severity: index < 2 ? "high" : "medium"
        }));
    }

    return [
        { skill: "System Design", severity: "medium" },
        { skill: "Advanced DSA", severity: "medium" }
    ];
}

function buildDynamicFallbackReport({ resume, selfDescription, jobDescription }) {
    const title = inferRole(jobDescription);
    const score = calculateMatchScore({ resume, selfDescription, jobDescription });
    const candidateSkills = extractSkills(`${resume || ""} ${selfDescription || ""}`);
    const jobSkills = extractSkills(jobDescription);
    const gaps = getSkillGaps({ resume, selfDescription, jobDescription });

    const primarySkill = candidateSkills[0] || jobSkills[0] || "your main technology";
    const secondSkill = candidateSkills[1] || jobSkills[1] || "backend/frontend development";
    const thirdSkill = candidateSkills[2] || jobSkills[2] || "database design";
    const gapSkill = gaps[0]?.skill || "system design";

    return {
        matchScore: score,
        title,
        technicalQuestions: [
            {
                question: `Tell me about a project where you used ${primarySkill}.`,
                intention: "To check real project experience and technical ownership.",
                answer: `Explain the project goal, your role, how you used ${primarySkill}, the main challenge, and the final outcome.`
            },
            {
                question: `How would you design authentication for a ${title} project?`,
                intention: "To evaluate backend security and practical implementation thinking.",
                answer: "Explain signup/login, password hashing, JWT or sessions, protected routes, validation, and secure error handling."
            },
            {
                question: `How do you connect frontend and backend in a production application?`,
                intention: "To test full-stack API communication understanding.",
                answer: "Discuss REST APIs, request/response flow, auth headers, validation, error handling, loading states, and database updates."
            },
            {
                question: `What problems have you faced while working with ${secondSkill}, and how did you solve them?`,
                intention: "To evaluate debugging and problem-solving skill.",
                answer: "Give a specific issue, how you investigated it, the fix you applied, and what you learned."
            },
            {
                question: `This job requires ${thirdSkill}. How strong are you in it, and where have you used it?`,
                intention: "To compare job requirements with candidate experience.",
                answer: "Explain your practical experience, project usage, limitations, and how you are improving."
            }
        ],
        behavioralQuestions: [
            {
                question: "Tell me about yourself.",
                intention: "To evaluate communication, confidence, and role fit.",
                answer: `Give a short summary of your education, skills, projects, and why you fit the ${title} role.`
            },
            {
                question: "Describe a challenging project situation and how you handled it.",
                intention: "To evaluate ownership and problem-solving behavior.",
                answer: "Use STAR format: situation, task, action, result. Keep it specific and outcome-focused."
            },
            {
                question: "Why are you interested in this role?",
                intention: "To check motivation and alignment with the job.",
                answer: "Connect the role requirements with your skills, projects, and learning goals."
            }
        ],
        skillGaps: gaps,
        preparationPlan: [
            {
                day: 1,
                focus: "Resume and job alignment",
                tasks: ["Review target job keywords", "Prepare a strong introduction", "Map your projects to the role"]
            },
            {
                day: 2,
                focus: `${primarySkill} revision`,
                tasks: ["Revise fundamentals", "Prepare project examples", "Practice explaining trade-offs"]
            },
            {
                day: 3,
                focus: "API and backend fundamentals",
                tasks: ["Revise REST APIs", "Practice authentication flow", "Review database CRUD and validation"]
            },
            {
                day: 4,
                focus: `${gapSkill} improvement`,
                tasks: [`Study ${gapSkill} basics`, "Build one small practice feature", "Prepare interview explanation"]
            },
            {
                day: 5,
                focus: "Mock interview practice",
                tasks: ["Practice technical questions", "Practice HR answers", "Record and improve communication"]
            }
        ]
    };
}

function normalizeInterviewReport(report, input) {
    const fallback = buildDynamicFallbackReport(input);

    return {
        matchScore:
            typeof report?.matchScore === "number"
                ? Math.max(0, Math.min(100, Math.round(report.matchScore)))
                : fallback.matchScore,

        title:
            cleanText(report?.title) ||
            fallback.title,

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

async function callGemini(prompt, jsonMode = false) {
    const apiKey = process.env.GOOGLE_GENAI_API_KEY;

    if (!apiKey) {
        throw new Error("GOOGLE_GENAI_API_KEY is missing in .env");
    }

    let lastError = null;

    for (const model of MODEL_CANDIDATES) {
        try {
            const body = {
                contents: [
                    {
                        parts: [{ text: prompt }]
                    }
                ],
                generationConfig: {
                    temperature: 0.35,
                    maxOutputTokens: 3000
                }
            };

            if (jsonMode) {
                body.generationConfig.responseMimeType = "application/json";
            }

            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(body)
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

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    const input = { resume, selfDescription, jobDescription };

    try {
        const prompt = `
You are an expert technical recruiter.

Generate a unique interview preparation report for this exact candidate and job.

Return ONLY valid JSON:
{
  "matchScore": 75,
  "title": "Specific target role title",
  "technicalQuestions": [
    {
      "question": "Specific technical question",
      "intention": "Why this question is asked",
      "answer": "Strong model answer"
    }
  ],
  "behavioralQuestions": [
    {
      "question": "Specific behavioral question",
      "intention": "Why this question is asked",
      "answer": "Strong model answer"
    }
  ],
  "skillGaps": [
    {
      "skill": "Missing or weak skill",
      "severity": "low"
    }
  ],
  "preparationPlan": [
    {
      "day": 1,
      "focus": "Focus area",
      "tasks": ["Task 1", "Task 2", "Task 3"]
    }
  ]
}

Rules:
- Do not return generic repeated questions.
- Questions must be based on candidate resume, projects, skills, target job, and missing skills.
- matchScore must be realistic based on skill overlap, project relevance, and experience depth.
- If candidate is weak for this job, score should be low.
- If candidate strongly matches this job, score should be high.
- Give at least 5 technical questions.
- Give at least 3 behavioral questions.
- Give at least 5 preparation days.
- severity must be one of: low, medium, high.

Candidate Resume:
${resume || "Not provided"}

Candidate Self Description:
${selfDescription || "Not provided"}

Target Job Description:
${jobDescription || "Not provided"}
`;

        const text = await callGemini(prompt, true);
        const parsed = extractJson(text);

        return normalizeInterviewReport(parsed, input);
    } catch (error) {
        console.log("AI REPORT WARNING:", error.message);
        return buildDynamicFallbackReport(input);
    }
}

function buildFallbackResumeData({ resume, selfDescription, jobDescription }) {
    const name = extractName(resume);
    const email = extractEmail(resume) || "ishikasavita946@gmail.com";
    const phone = extractPhone(resume) || "+91 9131314683";
    const role = inferRole(jobDescription);
    const skills = extractSkills(`${resume || ""} ${selfDescription || ""} ${jobDescription || ""}`);

    const finalSkills = skills.length > 0
        ? skills.slice(0, 16)
        : ["React.js", "Node.js", "Express.js", "MongoDB", "JavaScript", "HTML", "CSS", "REST APIs", "Git", "GitHub"];

    return {
        name,
        contact: `${phone} | ${email} | LinkedIn | GitHub | Portfolio`,
        summary:
            selfDescription ||
            `${role} with hands-on experience in ${finalSkills.slice(0, 5).join(", ")}. Skilled in building responsive web applications, REST APIs, authentication flows, and database-driven features. Strong learner with practical project experience and interest in building scalable software solutions.`,
        skills: finalSkills,
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
                    "Integrated resume parsing, authentication, report generation, and mock interview functionality.",
                    "Implemented full-stack features including user flow, API communication, and dynamic report generation."
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
    };
}

function normalizeResumeData(data = {}, input = {}) {
    const fallback = buildFallbackResumeData(input);

    return {
        name: cleanText(data.name) || fallback.name,
        contact: cleanText(data.contact) || fallback.contact,
        summary: limitWords(data.summary || fallback.summary, 65),

        skills: unique([
            ...toArray(data.skills).map(cleanText),
            ...fallback.skills
        ]).slice(0, 18),

        experience: (
            toArray(data.experience).length > 0
                ? toArray(data.experience)
                : fallback.experience
        ).slice(0, 3).map((item) => ({
            role: cleanText(item.role),
            company: cleanText(item.company),
            location: cleanText(item.location),
            duration: cleanText(item.duration),
            points: toArray(item.points).map((point) => limitWords(point, 26)).slice(0, 4)
        })),

        projects: (
            toArray(data.projects).length > 0
                ? toArray(data.projects)
                : fallback.projects
        ).slice(0, 3).map((item) => ({
            name: cleanText(item.name),
            tech: cleanText(item.tech),
            points: toArray(item.points).map((point) => limitWords(point, 26)).slice(0, 4)
        })),

        education: (
            toArray(data.education).length > 0
                ? toArray(data.education)
                : fallback.education
        ).slice(0, 2).map((item) => ({
            degree: cleanText(item.degree),
            institute: cleanText(item.institute),
            location: cleanText(item.location),
            duration: cleanText(item.duration)
        }))
    };
}

function createAtsResumeHtml(data) {
    const skills = data.skills || [];
    const experience = data.experience || [];
    const projects = data.projects || [];
    const education = data.education || [];

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8" />
    <style>
        @page {
            size: A4;
            margin: 12mm 14mm;
        }

        body {
            margin: 0;
            color: #000;
            background: #fff;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 10pt;
            line-height: 1.25;
        }

        .header {
            text-align: center;
            margin-bottom: 9px;
        }

        .name {
            margin: 0 0 4px;
            font-size: 20pt;
            font-weight: 700;
            text-transform: uppercase;
        }

        .contact {
            margin: 0;
            font-size: 8.7pt;
        }

        .section {
            margin-top: 8px;
            page-break-inside: avoid;
        }

        .section-title {
            margin-bottom: 4px;
            padding-bottom: 2px;
            border-bottom: 1px solid #000;
            font-size: 10.5pt;
            font-weight: 700;
            text-transform: uppercase;
        }

        p {
            margin: 0 0 4px;
        }

        .item {
            margin-bottom: 6px;
            page-break-inside: avoid;
        }

        .item-header {
            display: flex;
            justify-content: space-between;
            gap: 12px;
            font-weight: 700;
        }

        .item-left {
            flex: 1;
        }

        .item-right {
            white-space: nowrap;
            text-align: right;
        }

        .item-sub {
            display: flex;
            justify-content: space-between;
            gap: 12px;
            margin-top: 1px;
            font-style: italic;
        }

        ul {
            margin: 3px 0 0 15px;
            padding: 0;
        }

        li {
            margin-bottom: 2px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1 class="name">${escapeHtml(data.name)}</h1>
        <p class="contact">${escapeHtml(data.contact)}</p>
    </div>

    <div class="section">
        <div class="section-title">Professional Summary</div>
        <p>${escapeHtml(data.summary)}</p>
    </div>

    <div class="section">
        <div class="section-title">Technical Skills</div>
        <p>${escapeHtml(skills.join(" | "))}</p>
    </div>

    <div class="section">
        <div class="section-title">Experience</div>
        ${experience.map((item) => `
            <div class="item">
                <div class="item-header">
                    <span class="item-left">${escapeHtml(item.role)}</span>
                    <span class="item-right">${escapeHtml(item.duration)}</span>
                </div>
                <div class="item-sub">
                    <span>${escapeHtml(item.company)}</span>
                    <span>${escapeHtml(item.location)}</span>
                </div>
                <ul>
                    ${(item.points || []).map((point) => `<li>${escapeHtml(point)}</li>`).join("")}
                </ul>
            </div>
        `).join("")}
    </div>

    <div class="section">
        <div class="section-title">Projects</div>
        ${projects.map((item) => `
            <div class="item">
                <div class="item-header">
                    <span class="item-left">${escapeHtml(item.name)}</span>
                    <span class="item-right">${escapeHtml(item.tech)}</span>
                </div>
                <ul>
                    ${(item.points || []).map((point) => `<li>${escapeHtml(point)}</li>`).join("")}
                </ul>
            </div>
        `).join("")}
    </div>

    <div class="section">
        <div class="section-title">Education</div>
        ${education.map((item) => `
            <div class="item">
                <div class="item-header">
                    <span class="item-left">${escapeHtml(item.degree)}</span>
                    <span class="item-right">${escapeHtml(item.duration)}</span>
                </div>
                <div>${escapeHtml(item.institute)}</div>
                <div>${escapeHtml(item.location)}</div>
            </div>
        `).join("")}
    </div>
</body>
</html>
`;
}

async function generatePdfFromHtml(htmlContent) {
    let browser;

    try {
        browser = await puppeteer.launch({
            headless: "new",
            args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage", "--disable-gpu"]
        });

        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(0);
        page.setDefaultTimeout(0);

        await page.setContent(htmlContent, {
            waitUntil: "domcontentloaded",
            timeout: 0
        });

        return await page.pdf({
            format: "A4",
            printBackground: true,
            preferCSSPageSize: true,
            margin: {
                top: "12mm",
                bottom: "12mm",
                left: "14mm",
                right: "14mm"
            },
            timeout: 0
        });
    } finally {
        if (browser) await browser.close();
    }
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
    const input = { resume, selfDescription, jobDescription };
    let parsed = null;

    try {
        const prompt = `
You are an expert ATS resume writer.

Create a clean, one-page ATS-friendly resume tailored to the job.

Return ONLY valid JSON. No markdown. No explanation.

{
  "name": "Candidate Name",
  "contact": "Phone | Email | LinkedIn | GitHub | Portfolio",
  "summary": "Professional summary maximum 65 words",
  "skills": ["Skill 1", "Skill 2"],
  "experience": [
    {
      "role": "Role",
      "company": "Company",
      "location": "Location",
      "duration": "Duration",
      "points": ["Point 1", "Point 2"]
    }
  ],
  "projects": [
    {
      "name": "Project",
      "tech": "Tech stack",
      "points": ["Point 1", "Point 2"]
    }
  ],
  "education": [
    {
      "degree": "Degree",
      "institute": "Institute",
      "location": "Location",
      "duration": "Duration"
    }
  ]
}

Rules:
- Use uploaded resume as source of truth.
- Tailor to target job description.
- Use ATS keywords naturally.
- Do not invent fake companies, dates, degrees, or personal details.
- Keep bullets concise and strong.

Uploaded Resume:
${resume || "Not provided"}

Self Description:
${selfDescription || "Not provided"}

Target Job:
${jobDescription || "Not provided"}
`;

        const text = await callGemini(prompt, true);
        parsed = extractJson(text);

        if (!parsed) {
            console.log("Resume PDF Warning: AI did not return valid resume JSON. Using dynamic ATS fallback.");
        }
    } catch (error) {
        console.log("Resume PDF Warning:", error.message);
    }

    const normalized = normalizeResumeData(parsed || {}, input);
    const html = createAtsResumeHtml(normalized);

    return await generatePdfFromHtml(html);
}

module.exports = {
    generateInterviewReport,
    generateResumePdf
};