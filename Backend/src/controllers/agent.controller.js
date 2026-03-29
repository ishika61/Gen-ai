const { voiceInterviewAgent } = require("../services/agent.service");

async function agentChatController(req, res) {
    try {
        const { message, history, resume, jobDescription } = req.body;

        const reply = await voiceInterviewAgent({
            message,
            history,
            resume,
            jobDescription
        });

        res.json({ reply });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Agent error" });
    }
}

module.exports = { agentChatController };