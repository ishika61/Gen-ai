const express = require("express");
const router = express.Router();
const { agentChatController } = require("../controllers/agent.controller");

router.post("/chat", agentChatController);

module.exports = router;