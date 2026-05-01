import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router";

export default function VoiceInterview() {
    const { state } = useLocation();
    const navigate = useNavigate();

    const [messages, setMessages] = useState([]);
    const [listening, setListening] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const recognitionRef = useRef(null);

    const interviewContext = useMemo(() => {
        return {
            title: state?.title || "Mock Interview",
            resume: state?.resume || state?.selfDescription || "Not provided",
            jobDescription: state?.jobDescription || "Not provided",
            technicalQuestions: state?.technicalQuestions || [],
            skillGaps: state?.skillGaps || []
        };
    }, [state]);

    useEffect(() => {
        window.speechSynthesis.getVoices();

        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            setError("Speech recognition is not supported in this browser. Please use Chrome.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = "en-US";
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => setListening(true);

        recognition.onend = () => setListening(false);

        recognition.onerror = () => {
            setListening(false);
            setError("Could not hear your answer. Please try again.");
        };

        recognition.onresult = async (event) => {
            const userText = event.results[0][0].transcript;
            await sendMessage(userText);
        };

        recognitionRef.current = recognition;

        startInterview();

        return () => {
            recognition.stop();
            window.speechSynthesis.cancel();
        };
    }, []);

    const speak = (text) => {
        window.speechSynthesis.cancel();

        const speech = new SpeechSynthesisUtterance(text);
        speech.lang = "en-US";
        speech.rate = 1;
        speech.pitch = 1.15;

        const voices = window.speechSynthesis.getVoices();

        const femaleVoice =
            voices.find((voice) =>
                voice.lang.startsWith("en") &&
                /female|zira|samantha|victoria|google us english/i.test(voice.name)
            ) ||
            voices.find((voice) => voice.lang.startsWith("en")) ||
            voices[0];

        if (femaleVoice) {
            speech.voice = femaleVoice;
        }

        window.speechSynthesis.speak(speech);
    };

    const startInterview = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await axios.post("http://localhost:3000/api/agent/chat", {
                message: "",
                history: "",
                ...interviewContext
            });

            const aiReply = response.data.reply;

            setMessages([{ sender: "AI", text: aiReply }]);
            speak(aiReply);
        } catch (err) {
            console.log(err);
            setError("AI interview could not start. Please check backend terminal.");
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async (userText) => {
        setLoading(true);
        setError("");

        const updatedMessages = [
            ...messages,
            {
                sender: "You",
                text: userText
            }
        ];

        setMessages(updatedMessages);

        try {
            const response = await axios.post("http://localhost:3000/api/agent/chat", {
                message: userText,
                history: updatedMessages
                    .map((message) => `${message.sender}: ${message.text}`)
                    .join("\n"),
                ...interviewContext
            });

            const aiReply = response.data.reply;

            setMessages([
                ...updatedMessages,
                {
                    sender: "AI",
                    text: aiReply
                }
            ]);

            speak(aiReply);
        } catch (err) {
            console.log(err);
            setError("AI service error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const startListening = () => {
        setError("");

        if (!recognitionRef.current) {
            setError("Speech recognition is not available.");
            return;
        }

        recognitionRef.current.start();
    };

    return (
        <div style={{ padding: 30, color: "white", background: "#111", minHeight: "100vh" }}>
            <button
                onClick={() => navigate(-1)}
                style={{
                    marginBottom: 20,
                    padding: "10px 16px",
                    cursor: "pointer"
                }}
            >
                Back
            </button>

            <h1>AI Mock Interview</h1>

            <p style={{ color: "#aaa", marginBottom: 20 }}>
                Role: {interviewContext.title}
            </p>

            {error && (
                <p style={{ color: "#ff5555", marginBottom: 20 }}>
                    {error}
                </p>
            )}

            <button
                onClick={startListening}
                disabled={loading || listening}
                style={{
                    padding: "12px 22px",
                    borderRadius: 8,
                    border: "none",
                    cursor: loading || listening ? "not-allowed" : "pointer",
                    background: listening ? "#ffaa00" : "#ff0055",
                    color: "white",
                    fontWeight: "bold"
                }}
            >
                {listening ? "Listening..." : loading ? "Thinking..." : "Answer Question"}
            </button>

            <button
                onClick={startInterview}
                disabled={loading}
                style={{
                    marginLeft: 12,
                    padding: "12px 22px",
                    borderRadius: 8,
                    border: "none",
                    cursor: loading ? "not-allowed" : "pointer",
                    background: "#333",
                    color: "white",
                    fontWeight: "bold"
                }}
            >
                Restart Interview
            </button>

            <div style={{ marginTop: 30, maxWidth: 900 }}>
                {messages.map((message, index) => (
                    <div
                        key={index}
                        style={{
                            marginBottom: 18,
                            padding: 16,
                            borderRadius: 8,
                            background: message.sender === "AI" ? "#1d2530" : "#2a1d30"
                        }}
                    >
                        <strong>{message.sender}:</strong>
                        <p style={{ marginTop: 8, lineHeight: 1.5 }}>
                            {message.text}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
