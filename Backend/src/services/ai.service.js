
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
    "MySQL", "PostgreSQL", "Python", "Java", "Spring Boot", "Flutter", "Dart",
    "Django", "Firebase", "GetX", "Riverpod", "Android", "iOS", "DSA",
    "System Design", "Gemini API", "OpenAI API", "AI", "LLM", "Prompt Engineering"
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
    if (text.includes("junior") && text.includes("software")) return "Junior Software Developer";
    if (text.includes("flutter") || text.includes("mobile")) return "Flutter Developer";
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

function extractRelevantLines(text = "", matcher, limit = 3) {
    return getLines(text)
        .filter((line) => matcher.test(line))
        .map((line) => limitWords(line, 22))
        .slice(0, limit);
}

function extractCandidateProfile({ resume, selfDescription, jobDescription }) {
    const candidateText = `${resume || ""}\n${selfDescription || ""}`;
    const candidateSkills = extractSkills(candidateText);
    const jobSkills = extractSkills(jobDescription);
    const gaps = getSkillGaps({ resume, selfDescription, jobDescription });
    const projects = extractRelevantLines(candidateText, /project|built|developed|implemented|created|platform|application|app|system/i, 4);
    const education = extractRelevantLines(candidateText, /b\.?tech|bachelor|master|degree|college|university|institute|engineering/i, 2);
    const experience = extractRelevantLines(candidateText, /intern|experience|company|worked|remote|freelance|developer/i, 3);

    return {
        candidateSkills,
        jobSkills,
        gaps,
        projects,
        education,
        experience,
        strongestSkill: candidateSkills[0] || jobSkills[0] || "core programming",
        roleRequirement: jobSkills[0] || "the target job requirements",
        projectReference: projects[0] || selfDescription || "your strongest project",
        weakArea: gaps[0]?.skill || jobSkills.find((skill) => !candidateSkills.map(normalizeText).includes(normalizeText(skill))) || "system design"
    };
}

function questionItem(question, intention, answer) {
    return {
        question: limitWords(question, 28),
        intention: limitWords(intention, 28),
        answer: limitWords(answer, 55)
    };
}

function roadmapDay(day, focus, tasks) {
    return {
        day,
        focus: limitWords(focus, 10),
        tasks: tasks.map((task) => limitWords(task, 18)).slice(0, 3)
    };
}

function buildDynamicFallbackReport({ resume, selfDescription, jobDescription }) {
    const title = inferRole(jobDescription);
    const score = calculateMatchScore({ resume, selfDescription, jobDescription });
    const profile = extractCandidateProfile({ resume, selfDescription, jobDescription });
    const candidateSkills = profile.candidateSkills;
    const jobSkills = profile.jobSkills;
    const gaps = profile.gaps;

    const primarySkill = profile.strongestSkill;
    const secondSkill = candidateSkills[1] || jobSkills[1] || "frontend and backend integration";
    const thirdSkill = jobSkills[2] || candidateSkills[2] || "database design";
    const gapSkill = profile.weakArea;
    const projectReference = profile.projectReference;
    const jobRequirement = profile.roleRequirement;

    return {
        matchScore: score,
        title,
        technicalQuestions: [
            questionItem(
                `Your resume mentions ${projectReference}. Walk me through its architecture and your exact contribution.`,
                "To verify project ownership, system understanding, and whether the resume experience is practical.",
                `Start with the problem, then explain frontend, backend, database, APIs, your role, one technical challenge, and the result. Mention ${primarySkill} only if you actually used it.`
            ),
            questionItem(
                `The target job emphasizes ${jobRequirement}. Where have you used it, and what would you improve now?`,
                "To compare target-job requirements with the candidate's real experience depth.",
                `Give a concrete example from resume or self-description, explain implementation choices, limitations, and one improvement plan.`
            ),
            questionItem(
                `How would you design authentication and protected routes for a ${title} application?`,
                "To evaluate backend security, API design, and production readiness.",
                "Explain password hashing, login flow, JWT/session storage, middleware, protected frontend routes, validation, expiry, and safe error handling."
            ),
            questionItem(
                `If ${secondSkill} failed in production, how would you debug it step by step?`,
                "To test practical troubleshooting, logs, root-cause analysis, and verification habits.",
                "Explain reproduction, checking logs/network/database, isolating frontend vs backend, fixing root cause, writing tests, and monitoring after deployment."
            ),
            questionItem(
                `This role needs ${gapSkill}. What do you know today, and how will you close the gap quickly?`,
                "To assess honesty, learning plan, and readiness for the weakest role requirement.",
                `State your current level, connect any related experience, name what is missing, then give a 1-2 week practice plan for ${gapSkill}.`
            ),
            questionItem(
                `How do you structure REST APIs in ${primarySkill} and ${secondSkill} for a production ${title} app?`,
                "To test API design, validation, error handling, and backend architecture thinking.",
                "Explain routes, controllers, middleware, validation, auth, status codes, and one example endpoint from your project."
            ),
            questionItem(
                `How would you optimize performance in a React + Node application like ${projectReference}?`,
                "To evaluate real-world performance, caching, and scaling awareness.",
                "Cover frontend rendering, API latency, database queries, indexing, lazy loading, and one bottleneck you would fix first."
            ),
            questionItem(
                `Explain how you would deploy and monitor a ${title} project in production.`,
                "To check deployment readiness, environment handling, and basic DevOps awareness.",
                "Mention build steps, env variables, hosting, logging, error tracking, and how you would verify a release."
            )
        ],
        behavioralQuestions: [
            questionItem(
                `Give me a 45-second introduction for the ${title} role using your resume and self-description.`,
                "To check communication, confidence, and whether the candidate can position their profile clearly.",
                `Mention education/current stage, strongest skills, one project, target role motivation, and the specific value you can bring.`
            ),
            questionItem(
                `Tell me about a time you were stuck while building ${projectReference}. What did you do?`,
                "To evaluate ownership, problem-solving behavior, and resilience from a real candidate context.",
                "Use STAR: situation, task, action, result. Include the blocker, your debugging steps, help you used, and the final learning."
            ),
            questionItem(
                `Why should this company choose you for ${title} despite your current gaps in ${gapSkill}?`,
                "To test self-awareness, motivation, and ability to turn gaps into a credible growth plan.",
                `Acknowledge the gap honestly, show matching strengths from resume, explain learning speed, and give a concrete preparation plan.`
            ),
            questionItem(
                `Describe a time you worked under pressure to deliver a feature using ${primarySkill}.`,
                "To test deadline handling, prioritization, and teamwork under pressure.",
                "Use STAR with the deadline, your task, how you prioritized, what you shipped, and the outcome."
            ),
            questionItem(
                `How do you handle critical feedback on your code or project work?`,
                "To assess coachability, growth mindset, and professional maturity.",
                "Share a real feedback moment, what you changed, and how it improved the final output."
            )
        ],
        skillGaps: gaps,
        preparationPlan: [
            roadmapDay(1, "Profile and job alignment", [
                `Extract top requirements from the ${title} job description`,
                `Map ${projectReference} to those requirements`,
                "Prepare a 45-second self introduction"
            ]),
            roadmapDay(2, `${primarySkill} interview depth`, [
                `Revise ${primarySkill} fundamentals`,
                `Prepare one project story using ${primarySkill}`,
                "Practice explaining trade-offs and mistakes"
            ]),
            roadmapDay(3, "Full-stack implementation proof", [
                "Draw frontend-backend-database flow for your main project",
                "Practice REST API, auth, validation, and error handling explanations",
                "Prepare one production debugging example"
            ]),
            roadmapDay(4, `${gapSkill} gap closing`, [
                `Study the basics of ${gapSkill}`,
                `Build one tiny demo or note set for ${gapSkill}`,
                "Prepare an honest gap explanation with learning plan"
            ]),
            roadmapDay(5, "Mock interview and refinement", [
                "Answer all technical questions out loud",
                "Record behavioral answers and improve structure",
                "Revise weak answers using feedback"
            ])
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
You are an expert technical recruiter and interview coach.

Generate a unique interview preparation report for this exact candidate and target job.
Use the uploaded resume as the main source of truth, then use the self-description to fill context, and compare both against the target job description.

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
- Treat the self-description as the candidate's quick profile summary. Use it for intro-style behavioral questions and role-fit answers.
- Every technical question must reference at least one of: a resume project, a candidate skill from resume/self-description, a target-job requirement, or a detected skill gap.
- Every behavioral question must be answerable from the candidate resume/self-description and must test role fit, ownership, communication, motivation, or learning ability.
- The preparationPlan must directly address the detected skillGaps and target job requirements.
- Model answers must mention what evidence the candidate should pull from their own resume, projects, or self-description.
- skillGaps must be skills required by the target job but missing, weak, or not clearly proven in resume/self-description.
- Do not list a skill gap if the resume strongly proves that skill.
- Model answers must be tailored to this candidate. Mention what kind of evidence they should use from their resume/projects.
- matchScore must be realistic based on skill overlap, project relevance, and experience depth.
- If candidate is weak for this job, score should be low.
- If candidate strongly matches this job, score should be high.
- Give exactly 8 technical questions.
- Give exactly 5 behavioral questions.
- Give at least 5 preparation days.
- severity must be one of: low, medium, high.
- Keep each question specific and interview-ready.
- Keep each intention under 25 words.
- Keep each model answer under 55 words.

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

function orderSkillsForAts({ resume, selfDescription, jobDescription }) {
    const jobSkills = extractSkills(jobDescription);
    const candidateSkills = extractSkills(`${resume || ""} ${selfDescription || ""}`);
    const combined = unique([...jobSkills, ...candidateSkills]);

    return combined.length > 0
        ? combined.slice(0, 18)
        : ["React.js", "Node.js", "Express.js", "MongoDB", "JavaScript", "REST APIs", "Git", "GitHub"];
}

function buildTailoredAtsSummary({ resume, selfDescription, jobDescription }) {
    const role = inferRole(jobDescription);
    const skills = orderSkillsForAts({ resume, selfDescription, jobDescription });
    const jobKeywords = extractSkills(jobDescription).slice(0, 4).join(", ");
    const stack = skills.slice(0, 6).join(", ");

    if (selfDescription && selfDescription.length > 30) {
        const trimmed = limitWords(selfDescription, 42);
        const keywordTail = jobKeywords ? ` Targeting ${role} with strengths in ${jobKeywords}.` : "";
        return limitWords(`${trimmed}${keywordTail}`, 48);
    }

    return limitWords(
        `Results-driven ${role} with hands-on experience in ${stack}. Built full-stack web applications with REST APIs, authentication, databases, and responsive UI. Motivated to deliver scalable, ATS-aligned solutions for ${role} roles requiring ${jobKeywords || "modern web development"}.`,
        48
    );
}

function extractResumeProjects(resume = "") {
    return getLines(resume)
        .filter((line) => /project|platform|application|built|developed/i.test(line))
        .slice(0, 3)
        .map((line, index) => ({
            name: limitWords(line.split(/[:\-–]/)[0] || `Project ${index + 1}`, 8),
            tech: extractSkills(line).slice(0, 5).join(", ") || "React.js, Node.js, MongoDB",
            points: [limitWords(line, 24)]
        }));
}

function extractResumeExperience(resume = "") {
    const lines = getLines(resume);
    const experiences = [];

    lines.forEach((line, index) => {
        if (!/pvt|ltd|llc|inc|infosystems|hangout|solopackers|gravit|hub/i.test(line)) return;
        if (line.length > 95) return;

        const company = line.split("|")[0].trim();
        const meta = line.includes("|") ? line.split("|").slice(1).join("|").trim() : "";
        const nextLines = lines.slice(index + 1, index + 6);
        const roleLine = nextLines.find((item) => /developer|intern|engineer/i.test(item)) || "Developer";
        const bullets = nextLines
            .filter((item) => item.length > 20 && !/tech stack|developer|intern/i.test(item))
            .slice(0, 4)
            .map((item) => limitWords(item, 28));
        const techLine = nextLines.find((item) => /tech stack|flutter|dart|java|react|node|api/i.test(item));

        experiences.push({
            company,
            role: limitWords(roleLine, 12),
            location: meta || "Remote",
            duration: meta.match(/\d{4}\s*[-–]\s*(\w+|\d{4})/i)?.[0] || meta || "See resume",
            techStack: techLine ? techLine.replace(/^tech stack:\s*/i, "") : extractSkills(nextLines.join(" ")).join(", "),
            points: bullets.length > 0 ? bullets : [limitWords(roleLine, 28)]
        });
    });

    return experiences.length > 0 ? experiences : null;
}

function extractResumeEducation(resume = "") {
    const lines = getLines(resume);
    const instituteLine = lines.find((line) =>
        /institute|university|college|technology|science/i.test(line)
    );
    const degreeLine = lines.find((line) =>
        /b\.?tech|bachelor|master|engineering|electronics|communication|computer/i.test(line)
    );
    const durationLine = lines.find((line) =>
        /\d{4}\s*[-–]\s*(present|\d{4})/i.test(line)
    );

    if (!instituteLine && !degreeLine) return [];

    return [{
        institute: instituteLine || "Institute Name",
        degree: degreeLine || "B.Tech",
        location: instituteLine?.includes(",") ? instituteLine.split(",").slice(1).join(",").trim() : "India",
        duration: durationLine || "2022 - Present"
    }];
}

function extractResumeAchievements(resume = "") {
    return getLines(resume)
        .filter((line) =>
            /winner|achieved|star|certificate|merit|rank|hackathon|codethon|competition/i.test(line)
        )
        .slice(0, 6)
        .map((line) => limitWords(line, 22));
}

function buildSkillCategories(skills = []) {
    const categories = [
        { category: "Programming Languages", items: [] },
        { category: "Frameworks", items: [] },
        { category: "Databases & APIs", items: [] },
        { category: "Tools & Platforms", items: [] }
    ];

    skills.forEach((skill) => {
        const key = normalizeText(skill);
        if (/java|python|dart|javascript|typescript|c\+\+|go/.test(key)) categories[0].items.push(skill);
        else if (/flutter|react|node|express|spring|django|next/.test(key)) categories[1].items.push(skill);
        else if (/mongo|sql|postgres|firebase|rest|api|jwt/.test(key)) categories[2].items.push(skill);
        else categories[3].items.push(skill);
    });

    return categories.filter((item) => item.items.length > 0);
}

function buildFallbackResumeData({ resume, selfDescription, jobDescription }) {
    const name = extractName(resume);
    const email = extractEmail(resume);
    const phone = extractPhone(resume);
    const role = inferRole(jobDescription);
    const finalSkills = orderSkillsForAts({ resume, selfDescription, jobDescription });
    const parsedProjects = extractResumeProjects(resume);
    const parsedExperience = extractResumeExperience(resume);
    const parsedEducation = extractResumeEducation(resume);
    const achievements = extractResumeAchievements(resume);

    const contactParts = [phone, email, "LinkedIn", "GitHub"].filter(Boolean);

    return {
        name,
        contact: contactParts.join(" | "),
        education: parsedEducation.length > 0 ? parsedEducation : [{
            institute: "Madhav Institute of Technology and Science, Gwalior, India",
            degree: "B.Tech",
            location: "Gwalior, India",
            duration: "2022 - Present"
        }],
        experience: parsedExperience || [],
        projects: parsedProjects,
        skillCategories: buildSkillCategories(finalSkills),
        achievements
    };
}

function normalizeResumeData(data = {}, input = {}) {
    const fallback = buildFallbackResumeData(input);
    const orderedSkills = orderSkillsForAts(input);
    const mergedSkills = unique([
        ...orderedSkills,
        ...toArray(data.skills).map(cleanText)
    ]).slice(0, 20);

    const skillCategories = toArray(data.skillCategories).length > 0
        ? toArray(data.skillCategories).map((item) => ({
            category: cleanText(item.category),
            items: toArray(item.items).map(cleanText).slice(0, 10)
        })).filter((item) => item.category && item.items.length > 0)
        : buildSkillCategories(mergedSkills);

    return {
        name: cleanText(data.name) || fallback.name,
        contact: cleanText(data.contact) || fallback.contact,

        education: (
            toArray(data.education).length > 0
                ? toArray(data.education)
                : fallback.education
        ).slice(0, 2).map((item) => ({
            degree: cleanText(item.degree),
            institute: cleanText(item.institute),
            location: cleanText(item.location),
            duration: cleanText(item.duration)
        })),

        experience: (
            toArray(data.experience).length > 0
                ? toArray(data.experience)
                : fallback.experience
        ).slice(0, 4).map((item) => ({
            role: cleanText(item.role),
            company: cleanText(item.company),
            location: cleanText(item.location),
            duration: cleanText(item.duration),
            techStack: cleanText(item.techStack || item.tech || ""),
            points: toArray(item.points).map((point) => limitWords(point, 28)).slice(0, 4)
        })),

        projects: (
            toArray(data.projects).length > 0
                ? toArray(data.projects)
                : fallback.projects
        ).slice(0, 4).map((item) => ({
            name: cleanText(item.name),
            tech: cleanText(item.tech),
            points: toArray(item.points).map((point) => limitWords(point, 28)).slice(0, 4)
        })),

        skillCategories,
        achievements: (
            toArray(data.achievements).length > 0
                ? toArray(data.achievements)
                : fallback.achievements
        ).map((item) => limitWords(cleanText(item), 24)).slice(0, 6)
    };
}

function createAtsResumeHtml(data) {
    const experience = data.experience || [];
    const projects = data.projects || [];
    const education = data.education || [];
    const skillCategories = data.skillCategories || [];
    const achievements = data.achievements || [];

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8" />
    <style>
        @page { size: A4; margin: 12mm 14mm; }
        body {
            margin: 0;
            color: #000;
            background: #fff;
            font-family: "Times New Roman", Times, serif;
            font-size: 10.5pt;
            line-height: 1.28;
        }
        .header { text-align: center; margin-bottom: 10px; }
        .name {
            margin: 0 0 4px;
            font-size: 20pt;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.4px;
        }
        .contact { margin: 0; font-size: 9pt; }
        .section { margin-top: 9px; page-break-inside: avoid; }
        .section-title {
            margin: 0 0 4px;
            padding-bottom: 2px;
            border-bottom: 1px solid #000;
            font-size: 11pt;
            font-weight: 700;
            text-transform: uppercase;
        }
        .item { margin-bottom: 7px; page-break-inside: avoid; }
        .item-header {
            display: flex;
            justify-content: space-between;
            gap: 10px;
            font-weight: 700;
        }
        .item-left { flex: 1; }
        .item-right { white-space: nowrap; text-align: right; font-weight: 700; }
        .item-role { margin-top: 1px; font-style: italic; }
        .tech-stack { margin: 3px 0 0; font-size: 10pt; }
        ul { margin: 3px 0 0 16px; padding: 0; }
        li { margin-bottom: 2px; }
        .skills-list { margin: 0; padding-left: 16px; }
        .skills-list li { margin-bottom: 2px; }
    </style>
</head>
<body>
    <div class="header">
        <h1 class="name">${escapeHtml(data.name)}</h1>
        <p class="contact">${escapeHtml(data.contact)}</p>
    </div>

    ${education.length > 0 ? `
    <div class="section">
        <div class="section-title">Education</div>
        ${education.map((item) => `
            <div class="item">
                <div class="item-header">
                    <span class="item-left">${escapeHtml(item.institute)}${item.location ? `, ${escapeHtml(item.location)}` : ""}</span>
                    <span class="item-right">${escapeHtml(item.duration)}</span>
                </div>
                <div>${escapeHtml(item.degree)}</div>
            </div>
        `).join("")}
    </div>` : ""}

    ${experience.length > 0 ? `
    <div class="section">
        <div class="section-title">Experience</div>
        ${experience.map((item) => `
            <div class="item">
                <div class="item-header">
                    <span class="item-left">${escapeHtml(item.company)}</span>
                    <span class="item-right">${escapeHtml(item.location)}${item.duration ? ` | ${escapeHtml(item.duration)}` : ""}</span>
                </div>
                <div class="item-role">${escapeHtml(item.role)}</div>
                <ul>
                    ${(item.points || []).map((point) => `<li>${escapeHtml(point)}</li>`).join("")}
                </ul>
                ${item.techStack ? `<p class="tech-stack"><strong>Tech Stack:</strong> ${escapeHtml(item.techStack)}</p>` : ""}
            </div>
        `).join("")}
    </div>` : ""}

    ${projects.length > 0 ? `
    <div class="section">
        <div class="section-title">Projects</div>
        ${projects.map((item) => `
            <div class="item">
                <div class="item-header">
                    <span class="item-left">${escapeHtml(item.name)}</span>
                    <span class="item-right">${escapeHtml(item.tech || "")}</span>
                </div>
                <ul>
                    ${(item.points || []).map((point) => `<li>${escapeHtml(point)}</li>`).join("")}
                </ul>
            </div>
        `).join("")}
    </div>` : ""}

    ${skillCategories.length > 0 ? `
    <div class="section">
        <div class="section-title">Technical Skills</div>
        <ul class="skills-list">
            ${skillCategories.map((group) => `
                <li><strong>${escapeHtml(group.category)}:</strong> ${escapeHtml(group.items.join(", "))}</li>
            `).join("")}
        </ul>
    </div>` : ""}

    ${achievements.length > 0 ? `
    <div class="section">
        <div class="section-title">Achievements &amp; Certificate</div>
        <ul>
            ${achievements.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
        </ul>
    </div>` : ""}
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
        const targetRole = inferRole(jobDescription);

        const prompt = `
You are an expert ATS resume writer.

Create a one-page ATS resume in this exact professional format:
1) Centered name and contact
2) EDUCATION
3) EXPERIENCE (company, location/dates, role, bullets, Tech Stack line)
4) PROJECTS
5) TECHNICAL SKILLS (grouped categories)
6) ACHIEVEMENTS & CERTIFICATE

Return ONLY valid JSON. No markdown.

{
  "name": "Candidate Name",
  "contact": "Phone | Email | LinkedIn | GitHub | Leetcode",
  "education": [
    {
      "institute": "Institute Name, City, Country",
      "degree": "B.Tech in ...",
      "location": "City, Country",
      "duration": "2022 - Present"
    }
  ],
  "experience": [
    {
      "company": "Company Name",
      "role": "Role Title",
      "location": "City | Remote",
      "duration": "Month Year - Month Year",
      "techStack": "Skill 1, Skill 2, Skill 3",
      "points": ["Action bullet with impact", "Action bullet with impact"]
    }
  ],
  "projects": [
    {
      "name": "Project Name",
      "tech": "Tech stack",
      "points": ["Bullet 1", "Bullet 2"]
    }
  ],
  "skillCategories": [
    {
      "category": "Programming Languages",
      "items": ["Java", "Dart"]
    }
  ],
  "achievements": ["Achievement or certificate line"]
}

Rules:
- Use uploaded resume as the only source of truth for companies, projects, dates, degrees, and achievements.
- Use self-description and target job only to tailor wording and keyword emphasis.
- Tailor bullets toward target role: ${targetRole}
- Do not invent fake companies, dates, degrees, emails, or phone numbers.
- Keep one-column black text ATS format. No tables, icons, or graphics.
- Bullets must start with strong action verbs and include outcomes when available.
- Every experience entry must include a techStack line when tools are known from resume.
- Group technical skills into categories like Programming Languages, Frameworks, Databases & APIs, Tools & Platforms.
- Preserve all real internships, projects, education, and achievements from the uploaded resume.

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
