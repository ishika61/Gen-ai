
// import React, { useState, useEffect } from 'react'
// import '../style/interview.scss'
// import { useInterview } from '../hooks/useInterview.js'
// import { useNavigate, useParams } from 'react-router'

// /* ── Nav config ─────────────────────────────────────────────────────────────── */
// const NAV_ITEMS = [
//     {
//         id: 'technical', label: 'Technical',
//         icon: (
//             <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                 <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
//             </svg>
//         ),
//     },
//     {
//         id: 'behavioral', label: 'Behavioral',
//         icon: (
//             <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                 <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
//             </svg>
//         ),
//     },
//     {
//         id: 'roadmap', label: 'Road Map',
//         icon: (
//             <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                 <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
//             </svg>
//         ),
//     },
// ]

// /* ── Question Card ───────────────────────────────────────────────────────────── */
// const QuestionCard = ({ item, index }) => {
//     const [open, setOpen] = useState(false)
//     return (
//         <div className={`q-card ${open ? 'q-card--open' : ''}`}>
//             <button className="q-card__header" onClick={() => setOpen(o => !o)}>
//                 <span className="q-card__index">{String(index + 1).padStart(2, '0')}</span>
//                 <p className="q-card__question">{item.question}</p>
//                 <span className={`q-card__chevron ${open ? 'q-card__chevron--open' : ''}`}>
//                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                         <polyline points="6 9 12 15 18 9" />
//                     </svg>
//                 </span>
//             </button>

//             {open && (
//                 <div className="q-card__body">
//                     <div className="q-card__section">
//                         <span className="q-card__tag q-card__tag--intention">Intention</span>
//                         <p>{item.intention}</p>
//                     </div>
//                     <div className="q-card__section">
//                         <span className="q-card__tag q-card__tag--answer">Model Answer</span>
//                         <p>{item.answer}</p>
//                     </div>
//                 </div>
//             )}
//         </div>
//     )
// }

// /* ── Roadmap Day ─────────────────────────────────────────────────────────────── */
// const RoadMapDay = ({ day }) => (
//     <div className="roadmap-day">
//         <div className="roadmap-day__header">
//             <span className="roadmap-day__badge">Day {day.day}</span>
//             <h3 className="roadmap-day__focus">{day.focus}</h3>
//         </div>
//         <ul className="roadmap-day__tasks">
//             {day.tasks.map((task, i) => (
//                 <li key={i}>
//                     <span className="roadmap-day__bullet" />
//                     {task}
//                 </li>
//             ))}
//         </ul>
//     </div>
// )

// /* ── SVG Arc Score Ring ──────────────────────────────────────────────────────── */
// const ScoreRing = ({ score }) => {
//     const r = 54
//     const circ = 2 * Math.PI * r
//     const filled = (score / 100) * circ
//     const color = score >= 80 ? 'var(--score-high)' : score >= 60 ? 'var(--score-mid)' : 'var(--score-low)'
//     const glow  = score >= 80 ? 'rgba(34,197,94,0.45)'   : score >= 60 ? 'rgba(129, 255, 147, 0.45)' : 'rgba(110, 165, 98, 0.93)'

//     return (
//         <svg className="score-svg" viewBox="0 0 120 120" width="140" height="140">
//             <defs>
//                 <filter id="scoreGlow" x="-50%" y="-50%" width="200%" height="200%">
//                     <feGaussianBlur stdDeviation="4" result="blur" />
//                     <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
//                 </filter>
//             </defs>
//             {/* Track */}
//             <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="7" />
//             {/* Arc */}
//             <circle
//                 cx="60" cy="60" r={r}
//                 fill="none"
//                 stroke={color}
//                 strokeWidth="7"
//                 strokeLinecap="round"
//                 strokeDasharray={`${filled} ${circ}`}
//                 strokeDashoffset="0"
//                 transform="rotate(-90 60 60)"
//                 filter="url(#scoreGlow)"
//                 style={{ filter: `drop-shadow(0 0 6px ${glow})` }}
//             />
//             {/* Value */}
//             <text x="60" y="56" textAnchor="middle" dominantBaseline="middle"
//                 fill="var(--text-primary)" fontFamily="var(--font-display)"
//                 fontWeight="800" fontSize="26" letterSpacing="-1">
//                 {score}
//             </text>
//             <text x="60" y="74" textAnchor="middle" dominantBaseline="middle"
//                 fill="var(--text-muted)" fontFamily="var(--font-mono)"
//                 fontWeight="400" fontSize="11">
//                 %
//             </text>
//         </svg>
//     )
// }

// /* ── Main Component ──────────────────────────────────────────────────────────── */
// const Interview = () => {
//     const [activeNav, setActiveNav] = useState('technical')
//     const { report, getReportById, loading, getResumePdf } = useInterview()
//     const { interviewId } = useParams()
//     const navigate = useNavigate()

//     useEffect(() => {
//         if (interviewId) getReportById(interviewId)
//     }, [interviewId])

//     if (loading || !report) {
//         return (
//             <main className="iv-loading">
//                 <div className="iv-spinner" />
//                 <p>Loading your interview plan…</p>
//             </main>
//         )
//     }

//     const technicalQuestions  = report.technicalQuestions  || []
//     const behavioralQuestions = report.behavioralQuestions || []
//     const preparationPlan     = report.preparationPlan     || []
//     const skillGaps           = report.skillGaps           || []

//     const activeQuestions =
//         activeNav === 'technical'  ? technicalQuestions  :
//         activeNav === 'behavioral' ? behavioralQuestions : []

//     const handleStartVoiceInterview = () => {
//         navigate('/voice-interview', {
//             state: {
//                 interviewReportId: report._id,
//                 title: report.title,
//                 resume: report.resume,
//                 jobDescription: report.jobDescription,
//                 selfDescription: report.selfDescription,
//                 matchScore: report.matchScore,
//                 technicalQuestions,
//                 behavioralQuestions,
//                 skillGaps,
//                 preparationPlan,
//             }
//         })
//     }

//     const scoreLabel =
//         report.matchScore >= 80 ? 'Strong match for this role' :
//         report.matchScore >= 60 ? 'Solid fit with focus areas'  : 'Significant gaps to close'

//     return (
//         <div className="iv-page">

//             {/* ── Hero Header ── */}
//             <header className="iv-hero">
//                 {/* ambient blobs */}
//                 <div className="iv-hero__blob iv-hero__blob--1" />
//                 <div className="iv-hero__blob iv-hero__blob--2" />

//                 <div className="iv-hero__inner">
//                     {/* <div className="iv-hero__eyebrow">
//                         <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                             <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
//                         </svg>
//                         INTERVIEW REPORT &bull; MOCK-001
//                     </div>

//                     <h1 className="iv-hero__title">Senior Frontend Engineer &middot; Linear</h1>

//                     <p className="iv-hero__sub">Design-driven engineer who ships polished UI fast.</p> */}





// <div className="iv-hero__eyebrow">
//     <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//         <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
//     </svg>
//     INTERVIEW REPORT &bull; MOCK-001
// </div>

// <h1 className="iv-hero__title">Senior Frontend Engineer &middot; Linear</h1>

// <p className="iv-hero__sub">Design-driven engineer who ships polished UI fast.</p>






//                 </div>
//             </header>

//             {/* ── Body ── */}
//             <div className="iv-body">

//                 {/* ── Left Sidebar ── */}
//                 <aside className="iv-sidebar">
//                     <nav className="iv-nav">
//                         <p className="iv-nav__label">SECTIONS</p>
//                         {NAV_ITEMS.map(item => (
//                             <button
//                                 key={item.id}
//                                 className={`iv-nav__item ${activeNav === item.id ? 'iv-nav__item--active' : ''}`}
//                                 onClick={() => setActiveNav(item.id)}
//                             >
//                                 <span className="iv-nav__icon">{item.icon}</span>
//                                 {item.label}
//                             </button>
//                         ))}
//                     </nav>

//                     <div className="iv-sidebar__actions">
//                         <button onClick={handleStartVoiceInterview} className="iv-btn iv-btn--primary">
//                             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                                 <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
//                                 <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
//                                 <line x1="12" y1="19" x2="12" y2="23" />
//                                 <line x1="8" y1="23" x2="16" y2="23" />
//                             </svg>
//                             Start Voice Interview
//                             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                                 <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
//                             </svg>
//                         </button>

//                         <button onClick={() => getResumePdf(interviewId)} className="iv-btn iv-btn--ghost">
//                             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                                 <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
//                                 <polyline points="7 10 12 15 17 10" />
//                                 <line x1="12" y1="15" x2="12" y2="3" />
//                             </svg>
//                             Download Resume
//                         </button>
//                     </div>
//                 </aside>

//                 {/* ── Center Content ── */}
//                 <main className="iv-content">
//                     {/* Section header */}
//                     <div className="iv-content__header">
//                         <h2 className="iv-content__title">
//                             {activeNav === 'technical'  && 'Technical Questions'}
//                             {activeNav === 'behavioral' && 'Behavioral Questions'}
//                             {activeNav === 'roadmap'    && 'Preparation Road Map'}
//                         </h2>
//                         <span className="iv-content__count">
//                             {activeNav === 'technical'  && `${technicalQuestions.length} questions`}
//                             {activeNav === 'behavioral' && `${behavioralQuestions.length} questions`}
//                             {activeNav === 'roadmap'    && `${preparationPlan.length}-day plan`}
//                         </span>
//                     </div>

//                     {/* Questions */}
//                     {(activeNav === 'technical' || activeNav === 'behavioral') && (
//                         <div className="q-list">
//                             {activeQuestions.map((q, i) => (
//                                 <QuestionCard key={i} item={q} index={i} />
//                             ))}
//                         </div>
//                     )}

//                     {/* Roadmap */}
//                     {activeNav === 'roadmap' && (
//                         <div className="roadmap-list">
//                             {preparationPlan.map(day => (
//                                 <RoadMapDay key={day.day} day={day} />
//                             ))}
//                         </div>
//                     )}
//                 </main>

//                 {/* ── Right Sidebar ── */}
//                 <aside className="iv-right">

//                     {/* Match Score Card */}
//                     <div className="iv-score-card">
//                         <p className="iv-score-card__label">MATCH SCORE</p>
//                         <div className="iv-score-card__ring">
//                             <ScoreRing score={report.matchScore} />
//                         </div>
//                         <p className="iv-score-card__sub">{scoreLabel}</p>
//                     </div>

//                     {/* Skill Gaps Card */}
//                     <div className="iv-gaps-card">
//                         <p className="iv-gaps-card__label">SKILL GAPS</p>
//                         <div className="iv-gaps-card__list">
//                             {skillGaps.map((gap, i) => (
//                                 <span key={i} className={`iv-skill iv-skill--${gap.severity}`}>
//                                     {gap.skill}
//                                 </span>
//                             ))}
//                         </div>
//                     </div>
//                 </aside>
//             </div>
//         </div>
//     )
// }

// export default Interview

















import React, { useState, useEffect } from 'react'
import '../style/interview.scss'
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate, useParams } from 'react-router'

const NAV_ITEMS = [
    {
        id: 'technical',
        label: 'Technical',
        icon: (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
            </svg>
        ),
    },
    {
        id: 'behavioral',
        label: 'Behavioral',
        icon: (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
        ),
    },
    {
        id: 'roadmap',
        label: 'Road Map',
        icon: (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
        ),
    },
]

const QuestionCard = ({ item, index }) => {
    const [open, setOpen] = useState(false)

    return (
        <div className={`q-card ${open ? 'q-card--open' : ''}`}>
            <button className="q-card__header" onClick={() => setOpen(o => !o)}>
                <span className="q-card__index">{String(index + 1).padStart(2, '0')}</span>
                <p className="q-card__question">{item.question}</p>
                <span className={`q-card__chevron ${open ? 'q-card__chevron--open' : ''}`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                </span>
            </button>

            {open && (
                <div className="q-card__body">
                    <div className="q-card__section">
                        <span className="q-card__tag q-card__tag--intention">Intention</span>
                        <p>{item.intention || 'This question checks your role understanding and practical thinking.'}</p>
                    </div>

                    <div className="q-card__section">
                        <span className="q-card__tag q-card__tag--answer">Model Answer</span>
                        <p>{item.answer || 'Prepare a clear answer with context, your approach, trade-offs, and final result.'}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

const RoadMapDay = ({ day }) => (
    <div className="roadmap-day">
        <div className="roadmap-day__header">
            <span className="roadmap-day__badge">Day {day.day}</span>
            <h3 className="roadmap-day__focus">{day.focus}</h3>
        </div>

        <ul className="roadmap-day__tasks">
            {(day.tasks || []).map((task, i) => (
                <li key={i}>
                    <span className="roadmap-day__bullet" />
                    {task}
                </li>
            ))}
        </ul>
    </div>
)

const ScoreRing = ({ score }) => {
    const safeScore = Number(score) || 0
    const r = 54
    const circ = 2 * Math.PI * r
    const filled = (safeScore / 100) * circ

    const color =
        safeScore >= 80 ? 'var(--score-high)' :
        safeScore >= 60 ? 'var(--score-mid)' :
        'var(--score-low)'

    const glow =
        safeScore >= 80 ? 'rgba(34,197,94,0.45)' :
        safeScore >= 60 ? 'rgba(129,255,147,0.45)' :
        'rgba(110,165,98,0.93)'

    return (
        <svg className="score-svg" viewBox="0 0 120 120" width="140" height="140">
            <defs>
                <filter id="scoreGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="7" />

            <circle
                cx="60"
                cy="60"
                r={r}
                fill="none"
                stroke={color}
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray={`${filled} ${circ}`}
                strokeDashoffset="0"
                transform="rotate(-90 60 60)"
                filter="url(#scoreGlow)"
                style={{ filter: `drop-shadow(0 0 6px ${glow})` }}
            />

            <text
                x="60"
                y="56"
                textAnchor="middle"
                dominantBaseline="middle"
                fill="var(--text-primary)"
                fontFamily="var(--font-display)"
                fontWeight="800"
                fontSize="26"
                letterSpacing="-1"
            >
                {safeScore}
            </text>

            <text
                x="60"
                y="74"
                textAnchor="middle"
                dominantBaseline="middle"
                fill="var(--text-muted)"
                fontFamily="var(--font-mono)"
                fontWeight="400"
                fontSize="11"
            >
                %
            </text>
        </svg>
    )
}

const Interview = () => {
    const [activeNav, setActiveNav] = useState('technical')
    const { report, getReportById, loading, getResumePdf } = useInterview()
    const { interviewId } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        }
    }, [interviewId])

    if (loading || !report) {
        return (
            <main className="iv-loading">
                <div className="iv-spinner" />
                <p>Loading your interview plan…</p>
            </main>
        )
    }

    const technicalQuestions = report.technicalQuestions || []
    const behavioralQuestions = report.behavioralQuestions || []
    const preparationPlan = report.preparationPlan || []
    const skillGaps = report.skillGaps || []

    const activeQuestions =
        activeNav === 'technical' ? technicalQuestions :
        activeNav === 'behavioral' ? behavioralQuestions :
        []

    const reportTitle =
        report.title ||
        report.jobTitle ||
        report.role ||
        'Interview Report'

    const shortReportId =
        report._id || interviewId
            ? String(report._id || interviewId).slice(-6).toUpperCase()
            : 'MOCK-001'

    const handleStartVoiceInterview = () => {
        navigate('/voice-interview', {
            state: {
                interviewReportId: report._id,
                title: reportTitle,
                resume: report.resume,
                jobDescription: report.jobDescription,
                selfDescription: report.selfDescription,
                matchScore: report.matchScore,
                technicalQuestions,
                behavioralQuestions,
                skillGaps,
                preparationPlan,
            }
        })
    }

    const scoreLabel =
        report.matchScore >= 80 ? 'Strong match for this role' :
        report.matchScore >= 60 ? 'Solid fit with focus areas' :
        'Significant gaps to close'

    return (
        <div className="iv-page">
            <header className="iv-hero">
                <div className="iv-hero__blob iv-hero__blob--1" />
                <div className="iv-hero__blob iv-hero__blob--2" />

                <div className="iv-hero__inner iv-page__inner">
                    <div className="iv-hero__eyebrow">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                        </svg>
                        INTERVIEW REPORT &bull; {shortReportId}
                    </div>

                    <h1 className="iv-hero__title">{reportTitle}</h1>
                </div>
            </header>

            <div className="iv-page__inner">
                <div className="iv-body">
                <aside className="iv-sidebar">
                    <nav className="iv-nav">
                        <p className="iv-nav__label">SECTIONS</p>

                        {NAV_ITEMS.map(item => (
                            <button
                                key={item.id}
                                className={`iv-nav__item ${activeNav === item.id ? 'iv-nav__item--active' : ''}`}
                                onClick={() => setActiveNav(item.id)}
                            >
                                <span className="iv-nav__icon">{item.icon}</span>
                                {item.label}
                            </button>
                        ))}
                    </nav>

                    <div className="iv-sidebar__actions">
                        <button onClick={handleStartVoiceInterview} className="iv-btn iv-btn--primary">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                                <line x1="12" y1="19" x2="12" y2="23" />
                                <line x1="8" y1="23" x2="16" y2="23" />
                            </svg>
                            Start Voice Interview
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="5" y1="12" x2="19" y2="12" />
                                <polyline points="12 5 19 12 12 19" />
                            </svg>
                        </button>

                        <button onClick={() => getResumePdf(interviewId)} className="iv-btn iv-btn--ghost">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="7 10 12 15 17 10" />
                                <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                            Download Resume
                        </button>
                    </div>
                </aside>

                <main className="iv-content">
                    <div className="iv-content__header">
                        <h2 className="iv-content__title">
                            {activeNav === 'technical' && 'Technical Questions'}
                            {activeNav === 'behavioral' && 'Behavioral Questions'}
                            {activeNav === 'roadmap' && 'Preparation Road Map'}
                        </h2>

                        <span className="iv-content__count">
                            {activeNav === 'technical' && `${technicalQuestions.length} questions`}
                            {activeNav === 'behavioral' && `${behavioralQuestions.length} questions`}
                            {activeNav === 'roadmap' && `${preparationPlan.length}-day plan`}
                        </span>
                    </div>

                    {(activeNav === 'technical' || activeNav === 'behavioral') && (
                        <div className="q-list">
                            {activeQuestions.map((q, i) => (
                                <QuestionCard key={i} item={q} index={i} />
                            ))}
                        </div>
                    )}

                    {activeNav === 'roadmap' && (
                        <div className="roadmap-list">
                            {preparationPlan.map(day => (
                                <RoadMapDay key={day.day} day={day} />
                            ))}
                        </div>
                    )}
                </main>

                <aside className="iv-right">
                    <div className="iv-score-card">
                        <p className="iv-score-card__label">MATCH SCORE</p>
                        <div className="iv-score-card__ring">
                            <ScoreRing score={report.matchScore} />
                        </div>
                        <p className="iv-score-card__sub">{scoreLabel}</p>
                    </div>

                    <div className="iv-gaps-card">
                        <p className="iv-gaps-card__label">SKILL GAPS</p>
                        <div className="iv-gaps-card__list">
                            {skillGaps.map((gap, i) => (
                                <span key={i} className={`iv-skill iv-skill--${gap.severity || 'medium'}`}>
                                    {gap.skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </aside>
                </div>
            </div>
        </div>
    )
}

export default Interview
