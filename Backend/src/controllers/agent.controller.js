const { voiceInterviewAgent } = require("../services/agent.service");

async function agentChatController(req, res) {
    try {
        const {
            message,
            history,
            resume,
            selfDescription,
            jobDescription,
            title,
            technicalQuestions,
            behavioralQuestions,
            skillGaps
        } = req.body;

        const reply = await voiceInterviewAgent({
            message,
            history,
            resume,
            selfDescription,
            jobDescription,
            title,
            technicalQuestions,
            behavioralQuestions,
            skillGaps
        });

        res.status(200).json({ reply });
    } catch (error) {
        console.error("Agent Controller Error:", error.message);

        res.status(500).json({
            error: "Agent error",
            message: error.message
        });
    }
}

module.exports = { agentChatController };
