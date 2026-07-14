// import { useEffect, useMemo, useRef, useState } from "react";
// import { io } from "socket.io-client";
// import { useLocation, useNavigate } from "react-router";
// import "../style/voice-interview.scss";

// export default function VoiceInterview() {

//     // ── state ─────────────────────────────────────────────────────────────────
//     const { state }   = useLocation();
//     const navigate    = useNavigate();

//     const [messages,  setMessages]  = useState([]);
//     const [listening, setListening] = useState(false);
//     const [loading,   setLoading]   = useState(false);
//     const [error,     setError]     = useState("");
//     const [socketConnected, setSocketConnected] = useState(false);

//     const recognitionRef = useRef(null);
//     const messagesEndRef = useRef(null);
//     const socketRef = useRef(null);
//     const messagesRef = useRef([]);
//     const hasStartedInterviewRef = useRef(false);

//     // ── interviewContext — field names UNCHANGED ───────────────────────────────
//     const interviewContext = useMemo(() => ({
//         title:              state?.title              || "Mock Interview",
//         resume:             state?.resume             || state?.selfDescription || "Not provided",
//         jobDescription:     state?.jobDescription     || "Not provided",
//         technicalQuestions: state?.technicalQuestions || [],
//         skillGaps:          state?.skillGaps          || []
//     }), [state]);

//     // ── scroll helper — UNCHANGED ─────────────────────────────────────────────
//     const scrollToBottom = () => {
//         messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     };
//     useEffect(() => { scrollToBottom(); }, [messages]);
//     useEffect(() => { messagesRef.current = messages; }, [messages]);

//     // ── speech recognition setup — UNCHANGED ──────────────────────────────────
//     useEffect(() => {
//         window.speechSynthesis.getVoices();

//         const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//         if (!SpeechRecognition) {
//             setError("Speech recognition is not supported in this browser. Please use Chrome.");
//             return;
//         }

//         const recognition = new SpeechRecognition();
//         recognition.lang           = "en-US";
//         recognition.continuous     = false;
//         recognition.interimResults = false;
//         recognition.onstart  = () => setListening(true);
//         recognition.onend    = () => setListening(false);
//         recognition.onerror  = () => {
//             setListening(false);
//             setError("Could not hear your answer. Please try again.");
//         };
//         recognition.onresult = async (event) => {
//             const userText = event.results[0][0].transcript;
//             await sendMessage(userText);
//         };

//         recognitionRef.current = recognition;

//         return () => {
//             recognition.stop();
//             window.speechSynthesis.cancel();
//         };
//     }, []);

//     useEffect(() => {
//         const socket = io("http://localhost:3000", {
//             withCredentials: true
//         });

//         socketRef.current = socket;

//         const handleConnect = () => {
//             setSocketConnected(true);
//             setError("");
//         };

//         const handleReceiveMessage = (reply) => {
//             setMessages((prev) => {
//                 const nextMessages = [...prev, { sender: "AI", text: reply }];
//                 messagesRef.current = nextMessages;
//                 return nextMessages;
//             });
//             setLoading(false);
//             speak(reply);
//         };

//         const handleDisconnect = () => {
//             setSocketConnected(false);
//             setLoading(false);
//             setError("Connection lost. Trying to reconnect...");
//         };

//         const handleConnectError = () => {
//             setLoading(false);
//             setError("Unable to connect to realtime interview service.");
//         };

//         socket.on("connect", handleConnect);
//         socket.on("receive_message", handleReceiveMessage);
//         socket.on("disconnect", handleDisconnect);
//         socket.on("connect_error", handleConnectError);

//         return () => {
//             // Prevent duplicate listeners and cleanly close socket on unmount.
//             socket.off("connect", handleConnect);
//             socket.off("receive_message", handleReceiveMessage);
//             socket.off("disconnect", handleDisconnect);
//             socket.off("connect_error", handleConnectError);
//             socket.disconnect();
//         };
//     }, []);

//     useEffect(() => {
//         if (!socketConnected || hasStartedInterviewRef.current) return;
//         hasStartedInterviewRef.current = true;
//         startInterview();
//     }, [socketConnected]);

//     // ── speak — UNCHANGED ─────────────────────────────────────────────────────
//     function speak(text) {
//         window.speechSynthesis.cancel();
//         const speech   = new SpeechSynthesisUtterance(text);
//         speech.lang    = "en-US";
//         speech.rate    = 1;
//         speech.pitch   = 1.15;
//         const voices   = window.speechSynthesis.getVoices();
//         const femaleVoice =
//             voices.find(v => v.lang.startsWith("en") &&
//                 /female|zira|samantha|victoria|google us english/i.test(v.name)) ||
//             voices.find(v => v.lang.startsWith("en")) ||
//             voices[0];
//         if (femaleVoice) speech.voice = femaleVoice;
//         window.speechSynthesis.speak(speech);
//     }

//     function emitInterviewMessage({ message, history }) {
//         if (!socketRef.current || !socketRef.current.connected) {
//             setLoading(false);
//             setError("Realtime connection unavailable. Please try again.");
//             return;
//         }

//         // Emit interview payload over socket to keep existing backend agent input shape.
//         socketRef.current.emit("send_message", {
//             message,
//             history,
//             ...interviewContext
//         });
//     }

//     // ── startInterview — now uses Socket.IO realtime messaging ─────────────────
//     async function startInterview() {
//         setMessages([]);
//         messagesRef.current = [];
//         setLoading(true);
//         setError("");
//         emitInterviewMessage({ message: "", history: "" });
//     }

//     // ── sendMessage — now uses Socket.IO realtime messaging ────────────────────
//     async function sendMessage(userText) {
//         setLoading(true);
//         setError("");
//         const updatedMessages = [...messagesRef.current, { sender: "You", text: userText }];
//         messagesRef.current = updatedMessages;
//         setMessages(updatedMessages);
//         emitInterviewMessage({
//             message: userText,
//             history: updatedMessages.map(m => `${m.sender}: ${m.text}`).join("\n")
//         });
//     }

//     // ── startListening — UNCHANGED ────────────────────────────────────────────
//     const startListening = () => {
//         setError("");
//         if (!recognitionRef.current) {
//             setError("Speech recognition is not available.");
//             return;
//         }
//         recognitionRef.current.start();
//     };

//     // ── UI-only helpers (derive mic state / hint text from existing state) ─────
//     const micClass = listening ? "vi-mic-btn--listening"
//                    : loading   ? "vi-mic-btn--loading"
//                    :             "vi-mic-btn--idle";

//     const hintText = listening ? "Listening… speak your answer"
//                    : loading   ? "AI is thinking…"
//                    :             "Press the mic to answer";

//     // ─────────────────────────────────────────────────────────────────────────
//     return (
//         <div className="vi-page">

//             {/* decorative ambient orbs */}
//             <div className="vi-orb vi-orb--a" aria-hidden="true" />
//             <div className="vi-orb vi-orb--b" aria-hidden="true" />

//             {/* ── Header ────────────────────────────────────────────────────── */}
//             <header className="vi-header">
//                 <div className="vi-header__left">

//                     {/* back — navigate(-1) UNCHANGED */}
//                     <button
//                         className="vi-header__back"
//                         onClick={() => navigate(-1)}
//                         aria-label="Go back"
//                     >
//                         <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15"
//                             viewBox="0 0 24 24" fill="none" stroke="currentColor"
//                             strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                             <polyline points="15 18 9 12 15 6" />
//                         </svg>
//                     </button>

//                     <div className="vi-header__meta">
//                         <div className="vi-header__title">AI Voice Interview</div>
//                         <div className="vi-header__role">{interviewContext.title}</div>
//                     </div>
//                 </div>

//                 <div className="vi-header__right">
//                     {/* live indicator pill */}
//                     <div className="vi-header__status">
//                         <span className="vi-header__status__dot" />
//                         Live Session
//                     </div>

//                     {/* restart — startInterview() UNCHANGED */}
//                     <button
//                         className="vi-header__restart"
//                         onClick={startInterview}
//                         disabled={loading}
//                         aria-label="Restart interview"
//                     >
//                         <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13"
//                             viewBox="0 0 24 24" fill="none" stroke="currentColor"
//                             strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                             <polyline points="1 4 1 10 7 10" />
//                             <path d="M3.51 15a9 9 0 1 0 .49-3.89" />
//                         </svg>
//                         Restart
//                     </button>
//                 </div>
//             </header>

//             {/* ── Message feed ──────────────────────────────────────────────── */}
//             <div className="vi-feed">

//                 {/* empty / initialising */}
//                 {messages.length === 0 && !loading && (
//                     <div className="vi-empty">
//                         <div className="vi-empty__icon">
//                             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
//                                 viewBox="0 0 24 24" fill="none" stroke="currentColor"
//                                 strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                                 <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
//                                 <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
//                                 <line x1="12" y1="19" x2="12" y2="23" />
//                                 <line x1="8"  y1="23" x2="16" y2="23" />
//                             </svg>
//                         </div>
//                         <p>Initialising your interview session…</p>
//                     </div>
//                 )}

//                 {/* messages */}
//                 {messages.map((message, index) => (
//                     <div
//                         key={index}
//                         className={`vi-msg vi-msg--${message.sender === "AI" ? "ai" : "user"}`}
//                     >
//                         <div className={`vi-msg__sender vi-msg__sender--${message.sender === "AI" ? "ai" : "user"}`}>
//                             {message.sender === "AI" ? "✦ InterviewAI" : "You"}
//                         </div>
//                         <div className={`vi-msg__bubble vi-msg__bubble--${message.sender === "AI" ? "ai" : "user"}`}>
//                             {message.text}
//                         </div>
//                     </div>
//                 ))}

//                 {/* typing indicator */}
//                 {loading && (
//                     <div className="vi-typing">
//                         <div className="vi-typing__label">✦ InterviewAI</div>
//                         <div className="vi-typing__bubble">
//                             <div className="vi-typing__dot" />
//                             <div className="vi-typing__dot" />
//                             <div className="vi-typing__dot" />
//                         </div>
//                     </div>
//                 )}

//                 <div ref={messagesEndRef} />
//             </div>

//             {/* ── Bottom dock ────────────────────────────────────────────────── */}
//             <div className="vi-dock">

//                 {/* error banner */}
//                 {error && (
//                     <div className="vi-dock__error">
//                         <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13"
//                             viewBox="0 0 24 24" fill="none" stroke="currentColor"
//                             strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                             <circle cx="12" cy="12" r="10" />
//                             <line x1="12" y1="8"  x2="12"    y2="12" />
//                             <line x1="12" y1="16" x2="12.01" y2="16" />
//                         </svg>
//                         {error}
//                     </div>
//                 )}

//                 {/* mic button */}
//                 <div className="vi-mic-wrap">
//                     {/* ripple rings — only while listening */}
//                     {listening && (
//                         <>
//                             <div className="vi-ring vi-ring--1" />
//                             <div className="vi-ring vi-ring--2" />
//                         </>
//                     )}

//                     {/* startListening + disabled logic UNCHANGED */}
//                     <button
//                         className={`vi-mic-btn ${micClass}`}
//                         onClick={startListening}
//                         disabled={loading || listening}
//                         aria-label={hintText}
//                     >
//                         {listening ? (
//                             <div className="vi-wave">
//                                 {[1,2,3,4,5,6,7].map(i => (
//                                     <div key={i} className="vi-wave__bar" />
//                                 ))}
//                             </div>
//                         ) : loading ? (
//                             <div className="vi-mic-btn__spinner" />
//                         ) : (
//                             <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23"
//                                 viewBox="0 0 24 24" fill="none" stroke="currentColor"
//                                 strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                                 <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
//                                 <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
//                                 <line x1="12" y1="19" x2="12" y2="23" />
//                                 <line x1="8"  y1="23" x2="16" y2="23" />
//                             </svg>
//                         )}
//                     </button>
//                 </div>

//                 <p className="vi-dock__hint">{hintText}</p>
//             </div>
//         </div>
//     );
// }


import { useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useLocation, useNavigate } from "react-router";
import { saveInterviewResult } from "../utils/interviewResults";
import "../style/voice-interview.scss";

function createId() {
    if (window.crypto && window.crypto.randomUUID) {
        return window.crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function nowIso() {
    return new Date().toISOString();
}

function getDurationSeconds(startedAt) {
    if (!startedAt) return 0;

    return Math.max(
        0,
        Math.round((Date.now() - new Date(startedAt).getTime()) / 1000)
    );
}

function getQuestionDifficulty(questionNumber) {
    if (questionNumber <= 2) return "Easy";
    if (questionNumber <= 5) return "Medium";
    return "Hard";
}

export default function VoiceInterview() {
    const { state } = useLocation();
    const navigate = useNavigate();

    const [messages, setMessages] = useState([]);
    const [listening, setListening] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [socketConnected, setSocketConnected] = useState(false);
    const [interviewEnded, setInterviewEnded] = useState(false);
    const [reportReady, setReportReady] = useState(false);
    const [savedReportId, setSavedReportId] = useState("");

    const recognitionRef = useRef(null);
    const messagesEndRef = useRef(null);
    const socketRef = useRef(null);
    const messagesRef = useRef([]);
    const transcriptRef = useRef([]);
    const startedAtRef = useRef(null);
    const hasStartedInterviewRef = useRef(false);

    const interviewContext = useMemo(() => ({
        title: state?.title || "Mock Interview",
        resume: state?.resume || "Not provided",
        selfDescription: state?.selfDescription || "",
        jobDescription: state?.jobDescription || "Not provided",
        technicalQuestions: state?.technicalQuestions || [],
        behavioralQuestions: state?.behavioralQuestions || [],
        skillGaps: state?.skillGaps || []
    }), [state]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        messagesRef.current = messages;
    }, [messages]);

    useEffect(() => {
        window.speechSynthesis.getVoices();

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

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

        return () => {
            recognition.stop();
            window.speechSynthesis.cancel();
        };
    }, []);

    useEffect(() => {
        const socket = io("http://localhost:3000", {
            withCredentials: true
        });

        socketRef.current = socket;

        const handleConnect = () => {
            setSocketConnected(true);
            setError("");
        };

        const handleReceiveMessage = (reply) => {
            const aiQuestionNumber =
                transcriptRef.current.filter((item) => item.sender === "AI").length + 1;

            const aiEntry = {
                id: createId(),
                sender: "AI",
                text: reply,
                timestamp: nowIso(),
                difficulty: getQuestionDifficulty(aiQuestionNumber)
            };

            transcriptRef.current = [...transcriptRef.current, aiEntry];

            setMessages((prev) => {
                const nextMessages = [...prev, aiEntry];
                messagesRef.current = nextMessages;
                return nextMessages;
            });

            setLoading(false);
            speak(reply);
        };

        const handleDisconnect = () => {
            setSocketConnected(false);
            setLoading(false);
            setError("Connection lost. Trying to reconnect...");
        };

        const handleConnectError = () => {
            setLoading(false);
            setError("Unable to connect to realtime interview service.");
        };

        socket.on("connect", handleConnect);
        socket.on("receive_message", handleReceiveMessage);
        socket.on("disconnect", handleDisconnect);
        socket.on("connect_error", handleConnectError);

        return () => {
            socket.off("connect", handleConnect);
            socket.off("receive_message", handleReceiveMessage);
            socket.off("disconnect", handleDisconnect);
            socket.off("connect_error", handleConnectError);
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (!socketConnected || hasStartedInterviewRef.current) return;

        hasStartedInterviewRef.current = true;
        startInterview();
    }, [socketConnected]);

    function speak(text) {
        window.speechSynthesis.cancel();

        const speech = new SpeechSynthesisUtterance(text);
        speech.lang = "en-US";
        speech.rate = 1;
        speech.pitch = 1.15;

        const voices = window.speechSynthesis.getVoices();

        const femaleVoice =
            voices.find(v => v.lang.startsWith("en") &&
                /female|zira|samantha|victoria|google us english/i.test(v.name)) ||
            voices.find(v => v.lang.startsWith("en")) ||
            voices[0];

        if (femaleVoice) speech.voice = femaleVoice;

        window.speechSynthesis.speak(speech);
    }

    function emitInterviewMessage({ message, history }) {
        if (!socketRef.current || !socketRef.current.connected) {
            setLoading(false);
            setError("Realtime connection unavailable. Please try again.");
            return;
        }

        socketRef.current.emit("send_message", {
            message,
            history,
            ...interviewContext
        });
    }

    async function startInterview() {
        const startedAt = nowIso();

        startedAtRef.current = startedAt;
        transcriptRef.current = [];
        messagesRef.current = [];

        setMessages([]);
        setInterviewEnded(false);
        setReportReady(false);
        setSavedReportId("");
        setLoading(true);
        setError("");

        emitInterviewMessage({ message: "", history: "" });
    }

    async function sendMessage(userText) {
        setLoading(true);
        setError("");

        const userEntry = {
            id: createId(),
            sender: "You",
            text: userText,
            timestamp: nowIso()
        };

        const updatedMessages = [...messagesRef.current, userEntry];

        transcriptRef.current = [...transcriptRef.current, userEntry];
        messagesRef.current = updatedMessages;
        setMessages(updatedMessages);

        emitInterviewMessage({
            message: userText,
            history: updatedMessages.map(m => `${m.sender}: ${m.text}`).join("\n")
        });
    }

    const startListening = () => {
        setError("");

        if (!recognitionRef.current) {
            setError("Speech recognition is not available.");
            return;
        }

        recognitionRef.current.start();
    };

    function finishInterview() {
        const endedAt = nowIso();
        const startedAt = startedAtRef.current || endedAt;
        const transcript = transcriptRef.current.length > 0
            ? transcriptRef.current
            : messagesRef.current;

        const resultData = {
            id: createId(),
            title: interviewContext.title,
            resume: interviewContext.resume,
            selfDescription: state?.selfDescription || interviewContext.selfDescription || "",
            jobDescription: interviewContext.jobDescription,
            technicalQuestions: interviewContext.technicalQuestions,
            behavioralQuestions: interviewContext.behavioralQuestions,
            skillGaps: interviewContext.skillGaps,
            startedAt,
            endedAt,
            durationSeconds: getDurationSeconds(startedAt),
            transcript
        };

        const reportId = saveInterviewResult(resultData);

        setSavedReportId(reportId);
        setInterviewEnded(true);
        setReportReady(true);
        setListening(false);
        setLoading(false);

        window.speechSynthesis.cancel();

        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
    }

    const micClass = listening ? "vi-mic-btn--listening"
        : loading ? "vi-mic-btn--loading"
            : "vi-mic-btn--idle";

    const hintText = listening ? "Listening... speak your answer"
        : loading ? "AI is thinking..."
            : interviewEnded ? "Interview completed. Open your report when ready."
                : "Press the mic to answer";

    return (
        <div className="vi-page">
            <div className="vi-orb vi-orb--a" aria-hidden="true" />
            <div className="vi-orb vi-orb--b" aria-hidden="true" />

            <header className="vi-header">
                <div className="vi-header__left">
                    <button
                        className="vi-header__back"
                        onClick={() => navigate(-1)}
                        aria-label="Go back"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15"
                            viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                    </button>

                    <div className="vi-header__meta">
                        <div className="vi-header__title">AI Voice Interview</div>
                        <div className="vi-header__role">{interviewContext.title}</div>
                    </div>
                </div>

                <div className="vi-header__right">
                    <div className="vi-header__status">
                        <span className="vi-header__status__dot" />
                        Live Session
                    </div>

                    <button
                        className="vi-header__restart"
                        onClick={finishInterview}
                        disabled={messages.length === 0 || loading || interviewEnded}
                    >
                        End Interview
                    </button>

                    <button
                        className="vi-header__restart"
                        onClick={startInterview}
                        disabled={loading}
                        aria-label="Restart interview"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13"
                            viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="1 4 1 10 7 10" />
                            <path d="M3.51 15a9 9 0 1 0 .49-3.89" />
                        </svg>
                        Restart
                    </button>
                </div>
            </header>

            <div className="vi-feed">
                {messages.length === 0 && !loading && (
                    <div className="vi-empty">
                        <div className="vi-empty__icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                                <line x1="12" y1="19" x2="12" y2="23" />
                                <line x1="8" y1="23" x2="16" y2="23" />
                            </svg>
                        </div>
                        <p>Initialising your interview session...</p>
                    </div>
                )}

                {messages.map((message) => (
                    <div
                        key={message.id || `${message.sender}-${message.timestamp}-${message.text}`}
                        className={`vi-msg vi-msg--${message.sender === "AI" ? "ai" : "user"}`}
                    >
                        <div className={`vi-msg__sender vi-msg__sender--${message.sender === "AI" ? "ai" : "user"}`}>
                            {message.sender === "AI" ? "✦ InterviewAI" : "You"}
                        </div>
                        <div className={`vi-msg__bubble vi-msg__bubble--${message.sender === "AI" ? "ai" : "user"}`}>
                            {message.text}
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="vi-typing">
                        <div className="vi-typing__label">✦ InterviewAI</div>
                        <div className="vi-typing__bubble">
                            <div className="vi-typing__dot" />
                            <div className="vi-typing__dot" />
                            <div className="vi-typing__dot" />
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            <div className="vi-dock">
                {error && (
                    <div className="vi-dock__error">
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13"
                            viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        {error}
                    </div>
                )}

                <div className="vi-mic-wrap">
                    {listening && (
                        <>
                            <div className="vi-ring vi-ring--1" />
                            <div className="vi-ring vi-ring--2" />
                        </>
                    )}

                    <button
                        className={`vi-mic-btn ${micClass}`}
                        onClick={startListening}
                        disabled={loading || listening || interviewEnded}
                        aria-label={hintText}
                    >
                        {listening ? (
                            <div className="vi-wave">
                                {[1, 2, 3, 4, 5, 6, 7].map(i => (
                                    <div key={i} className="vi-wave__bar" />
                                ))}
                            </div>
                        ) : loading ? (
                            <div className="vi-mic-btn__spinner" />
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                                <line x1="12" y1="19" x2="12" y2="23" />
                                <line x1="8" y1="23" x2="16" y2="23" />
                            </svg>
                        )}
                    </button>
                </div>

                <p className="vi-dock__hint">{hintText}</p>

                {reportReady && (
                    <button
                        className="vi-report-btn"
                        onClick={() => navigate(`/interview-results/${savedReportId}`)}
                    >
                        View Interview Report
                    </button>
                )}
            </div>
        </div>
    );
}
