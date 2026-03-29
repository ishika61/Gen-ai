
// const { GoogleGenAI } = require("@google/genai");
// const { z } = require("zod");
// const { zodToJsonSchema } = require("zod-to-json-schema");
// const puppeteer = require("puppeteer");

// const ai = new GoogleGenAI({
//     apiKey: process.env.GOOGLE_GENAI_API_KEY
// });

// const interviewReportSchema = z.object({
//     matchScore: z.number(),
//     technicalQuestions: z.array(z.object({
//         question: z.string(),
//         intention: z.string(),
//         answer: z.string()
//     })),
//     behavioralQuestions: z.array(z.object({
//         question: z.string(),
//         intention: z.string(),
//         answer: z.string()
//     })),
//     skillGaps: z.array(z.object({
//         skill: z.string(),
//         severity: z.enum(["low", "medium", "high"])
//     })),
//     preparationPlan: z.array(z.object({
//         day: z.number(),
//         focus: z.string(),
//         tasks: z.array(z.string())
//     })),
//     title: z.string()
// });

// async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
//     try {
//         const prompt = `Generate an interview report for a candidate with the following details:
//         Resume: ${resume}
//         Self Description: ${selfDescription}
//         Job Description: ${jobDescription}
//         `;

//         const response = await ai.models.generateContent({
//             model: "gemini-3-flash-preview",
//             contents: prompt,
//             config: {
//                 responseMimeType: "application/json",
//                 responseSchema: zodToJsonSchema(interviewReportSchema),
//             }
//         });

//         console.log("AI RAW:", response.text);

//         let parsed;

//         try {
//             parsed = JSON.parse(response.text);
//         } catch (err) {
//             console.log("JSON Parse Error:", err.message);
//         }

//         if (Array.isArray(parsed)) {
//             parsed = parsed[0];
//         }

//         if (!parsed || typeof parsed !== "object") {
//             throw new Error("Invalid AI response");
//         }

//         // 🔥 TECH QUESTIONS (12+)
//      let techQuestions = (parsed.technical_assessment || parsed.interview_questions_suggested || []).map(item => ({
//     question: item,
//     intention: "Technical evaluation",
//     answer: "Explain with real-world examples"
// }));

// // 🔥 FORCE ADD QUESTIONS (VERY IMPORTANT)
// const extraQuestions = [
//     "Explain difference between REST and GraphQL",
//     "What is JWT authentication?",
//     "Explain React lifecycle and hooks",
//     "Difference between SQL and NoSQL",
//     "What is middleware in Express?",
//     "Explain event loop in JavaScript",
//     "What are closures?",
//     "Explain async/await vs promises",
//     "How does MongoDB indexing work?",
//     "Explain MVC architecture",
//     "What is virtual DOM in React?",
//     "Difference between useState and useEffect"
// ];

// // ✅ ALWAYS MAKE AT LEAST 12 QUESTIONS
// while (techQuestions.length < 12) {
//     const q = extraQuestions[techQuestions.length % extraQuestions.length];

//     techQuestions.push({
//         question: q,
//         intention: "Concept clarity",
//         answer: "Explain with examples"
//     });
// }
//         // 🔥 BEHAVIORAL QUESTIONS
//         const behavioralQuestions = [
//             {
//                 question: "Tell me about yourself",
//                 intention: "Communication",
//                 answer: selfDescription || "Explain your background"
//             },
//             {
//                 question: "Why should we hire you?",
//                 intention: "Confidence",
//                 answer: "Highlight skills and projects"
//             },
//             {
//                 question: "Describe a challenging project",
//                 intention: "Problem-solving",
//                 answer: "Explain approach and outcome"
//             },
//             {
//                 question: "Tell me about a failure",
//                 intention: "Learning ability",
//                 answer: "Explain lesson learned"
//             },
//             {
//                 question: "How do you handle deadlines?",
//                 intention: "Work ethic",
//                 answer: "Explain time management"
//             }
//         ];

//         // 🔥 SKILL GAPS
//         const skillGaps = (parsed.weaknesses || parsed.concerns || []).map(skill => ({
//             skill,
//             severity: "medium"
//         }));

//         // 🔥 7 DAY ROADMAP (PROGRESSIVE)
//         const preparationPlan = [
//             {
//                 day: 1,
//                 focus: "JavaScript Basics",
//                 tasks: ["Variables", "Closures", "Promises", "Async/Await"]
//             },
//             {
//                 day: 2,
//                 focus: "React Basics",
//                 tasks: ["Components", "Props", "State", "Hooks"]
//             },
//             {
//                 day: 3,
//                 focus: "Advanced React",
//                 tasks: ["Context API", "Routing", "Performance optimization"]
//             },
//             {
//                 day: 4,
//                 focus: "Node.js + Express",
//                 tasks: ["REST APIs", "Middleware", "JWT Authentication"]
//             },
//             {
//                 day: 5,
//                 focus: "Database",
//                 tasks: ["MongoDB queries", "Schema design", "CRUD"]
//             },
//             {
//                 day: 6,
//                 focus: "Projects",
//                 tasks: ["Explain projects", "Fix bugs", "Prepare GitHub"]
//             },
//             {
//                 day: 7,
//                 focus: "Mock Interview",
//                 tasks: ["Practice questions", "HR questions", "Confidence"]
//             }
//         ];

//         return {
//             matchScore: Math.round((parsed.overall_rating || 7) * 10),
//             technicalQuestions: techQuestions,
//             behavioralQuestions,
//             skillGaps,
//             preparationPlan,
//             title: parsed.applied_role || parsed.position || "Interview Report"
//         };

//     } catch (error) {
//         console.log("AI ERROR:", error.message);

//         return {
//             matchScore: 65,
//             technicalQuestions: [
//                 {
//                     question: "Explain your main project",
//                     intention: "Practical knowledge",
//                     answer: "Explain architecture"
//                 }
//             ],
//             behavioralQuestions: [
//                 {
//                     question: "Tell me about yourself",
//                     intention: "Communication",
//                     answer: selfDescription || "Explain background"
//                 }
//             ],
//             skillGaps: [{ skill: "DSA", severity: "medium" }],
//             preparationPlan: [
//                 {
//                     day: 1,
//                     focus: "Basics",
//                     tasks: ["Revise JS"]
//                 }
//             ],
//             title: "Interview Report"
//         };
//     }
// }

// async function generatePdfFromHtml(htmlContent) {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();

//     await page.setContent(htmlContent, { waitUntil: "networkidle0" });

//     const pdfBuffer = await page.pdf({
//         format: "A4",
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
//         const resumePdfSchema = z.object({
//             html: z.string()
//         });

//         const prompt = `Generate resume for a candidate with the following details:
//         Resume: ${resume}
//         Self Description: ${selfDescription}
//         Job Description: ${jobDescription}
//         `;

//         const response = await ai.models.generateContent({
//             model: "gemini-3-flash-preview",
//             contents: prompt,
//             config: {
//                 responseMimeType: "application/json",
//                 responseSchema: zodToJsonSchema(resumePdfSchema),
//             }
//         });

//         const jsonContent = JSON.parse(response.text);

//         return await generatePdfFromHtml(jsonContent.html);

//     } catch (error) {
//         console.log("Resume PDF Error:", error.message);

//         const fallbackHtml = `
//             <html>
//                 <body>
//                     <h1>Resume</h1>
//                     <p>${selfDescription}</p>
//                     <p>${jobDescription}</p>
//                 </body>
//             </html>
//         `;

//         return await generatePdfFromHtml(fallbackHtml);

//     }
// }

// module.exports = { generateInterviewReport, generateResumePdf };

const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")
const puppeteer = require("puppeteer")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})


const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job describe"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum([ "low", "medium", "high" ]).describe("The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances")
    })).describe("List of skill gaps in the candidate's profile along with their severity"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.")
    })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"),
    title: z.string().describe("The title of the job for which the interview report is generated"),
})

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {


    const prompt = `Generate an interview report for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}
`

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(interviewReportSchema),
        }
    })

    return JSON.parse(response.text)


}



async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" })

    const pdfBuffer = await page.pdf({
        format: "A4", margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }
    })

    await browser.close()

    return pdfBuffer
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {

    const resumePdfSchema = z.object({
        html: z.string().describe("The HTML content of the resume which can be converted to PDF using any library like puppeteer")
    })

    const prompt = `Generate resume for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
                    `

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(resumePdfSchema),
        }
    })


    const jsonContent = JSON.parse(response.text)

    const pdfBuffer = await generatePdfFromHtml(jsonContent.html)

    return pdfBuffer

}

module.exports = { generateInterviewReport, generateResumePdf }