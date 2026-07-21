require("dotenv").config()
const app = require("./src/app")
const connectToDB = require("./src/config/database")
const http = require("http")
const { Server } = require("socket.io")
const { voiceInterviewAgent } = require("./src/services/agent.service")

connectToDB()

const server = http.createServer(app)
const io = new Server(server, {
    cors: {
       origin: process.env.CLIENT_URL || "http://localhost:5173",
        credentials: true
    }
})

io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`)

    // Core realtime interview flow: frontend sends input, backend returns next AI reply.
    socket.on("send_message", async (data = {}) => {
        try {
            const reply = await voiceInterviewAgent(data)
            socket.emit("receive_message", reply)
        } catch (error) {
            console.error("Socket agent error:", error.message)
            socket.emit("receive_message", "AI service error. Please try again.")
        }
    })

    socket.on("disconnect", (reason) => {
        console.log(`Socket disconnected: ${socket.id} (${reason})`)
    })
})


const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});