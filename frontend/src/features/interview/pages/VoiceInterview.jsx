import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router";

export default function VoiceInterview() {

  const [messages, setMessages] = useState([]);
  const [listening, setListening] = useState(false);

  const { state } = useLocation();

  const resume = state?.resume || "Full stack developer";
  const jobDescription = state?.jobDescription || "MERN developer";

  const recognition = new window.webkitSpeechRecognition();
  recognition.lang = "en-US";
  recognition.continuous = false;

  // 🎤 Start AI Interview automatically
  useEffect(() => {
    startInterview();
  }, []);

  const startInterview = async () => {
    const res = await axios.post("http://localhost:3000/api/agent/chat", {
      message: "",
      history: "",
      resume,
      jobDescription
    });

    const aiReply = res.data.reply;

    setMessages([{ sender: "AI", text: aiReply }]);

    speak(aiReply);
  };

  // 🎤 User speaks
  const startListening = () => {
    recognition.start();
  };

  recognition.onstart = () => setListening(true);
  recognition.onend = () => setListening(false);

  recognition.onresult = async (event) => {
    const userText = event.results[0][0].transcript;

    const updated = [...messages, { sender: "You", text: userText }];
    setMessages(updated);

    const res = await axios.post("http://localhost:3000/api/agent/chat", {
      message: userText,
      history: updated.map(m => `${m.sender}: ${m.text}`).join("\n"),
      resume,
      jobDescription
    });

    const aiReply = res.data.reply;

    setMessages([...updated, { sender: "AI", text: aiReply }]);

    speak(aiReply);
  };

  // 🔊 Speak AI response
  const speak = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    speech.rate = 1;
    window.speechSynthesis.speak(speech);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🎤 AI Voice Interview</h2>

      <button onClick={startListening}>
        {listening ? "Listening..." : "🎤 Answer Question"}
      </button>

      <div style={{ marginTop: 20 }}>
        {messages.map((m, i) => (
          <p key={i}>
            <b>{m.sender}:</b> {m.text}
          </p>
        ))}
      </div>
    </div>
  );
}