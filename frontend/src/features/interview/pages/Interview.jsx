
import React, { useState, useEffect } from 'react'
import '../style/interview.scss'
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate, useParams } from 'react-router'

/* ── Nav config ─────────────────────────────────────────────────────────────── */
const NAV_ITEMS = [
    {
        id: 'technical', label: 'Technical',
        icon: (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
            </svg>
        ),
    },
    {
        id: 'behavioral', label: 'Behavioral',
        icon: (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
        ),
    },
    {
        id: 'roadmap', label: 'Road Map',
        icon: (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
        ),
    },
]

/* ── Question Card ───────────────────────────────────────────────────────────── */
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
                        <p>{item.intention}</p>
                    </div>
                    <div className="q-card__section">
                        <span className="q-card__tag q-card__tag--answer">Model Answer</span>
                        <p>{item.answer}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

/* ── Roadmap Day ─────────────────────────────────────────────────────────────── */
const RoadMapDay = ({ day }) => (
    <div className="roadmap-day">
        <div className="roadmap-day__header">
            <span className="roadmap-day__badge">Day {day.day}</span>
            <h3 className="roadmap-day__focus">{day.focus}</h3>
        </div>
        <ul className="roadmap-day__tasks">
            {day.tasks.map((task, i) => (
                <li key={i}>
                    <span className="roadmap-day__bullet" />
                    {task}
                </li>
            ))}
        </ul>
    </div>
)

/* ── SVG Arc Score Ring ──────────────────────────────────────────────────────── */
const ScoreRing = ({ score }) => {
    const r = 54
    const circ = 2 * Math.PI * r
    const filled = (score / 100) * circ
    const color = score >= 80 ? 'var(--score-high)' : score >= 60 ? 'var(--score-mid)' : 'var(--score-low)'
    const glow  = score >= 80 ? 'rgba(34,197,94,0.45)'   : score >= 60 ? 'rgba(129, 255, 147, 0.45)' : 'rgba(110, 165, 98, 0.93)'

    return (
        <svg className="score-svg" viewBox="0 0 120 120" width="140" height="140">
            <defs>
                <filter id="scoreGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
            </defs>
            {/* Track */}
            <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="7" />
            {/* Arc */}
            <circle
                cx="60" cy="60" r={r}
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
            {/* Value */}
            <text x="60" y="56" textAnchor="middle" dominantBaseline="middle"
                fill="var(--text-primary)" fontFamily="var(--font-display)"
                fontWeight="800" fontSize="26" letterSpacing="-1">
                {score}
            </text>
            <text x="60" y="74" textAnchor="middle" dominantBaseline="middle"
                fill="var(--text-muted)" fontFamily="var(--font-mono)"
                fontWeight="400" fontSize="11">
                %
            </text>
        </svg>
    )
}

/* ── Main Component ──────────────────────────────────────────────────────────── */
const Interview = () => {
    const [activeNav, setActiveNav] = useState('technical')
    const { report, getReportById, loading, getResumePdf } = useInterview()
    const { interviewId } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        if (interviewId) getReportById(interviewId)
    }, [interviewId])

    if (loading || !report) {
        return (
            <main className="iv-loading">
                <div className="iv-spinner" />
                <p>Loading your interview plan…</p>
            </main>
        )
    }

    const technicalQuestions  = report.technicalQuestions  || []
    const behavioralQuestions = report.behavioralQuestions || []
    const preparationPlan     = report.preparationPlan     || []
    const skillGaps           = report.skillGaps           || []

    const activeQuestions =
        activeNav === 'technical'  ? technicalQuestions  :
        activeNav === 'behavioral' ? behavioralQuestions : []

    const handleStartVoiceInterview = () => {
        navigate('/voice-interview', {
            state: {
                interviewReportId: report._id,
                title: report.title,
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
        report.matchScore >= 60 ? 'Solid fit with focus areas'  : 'Significant gaps to close'

    return (
        <div className="iv-page">

            {/* ── Hero Header ── */}
            <header className="iv-hero">
                {/* ambient blobs */}
                <div className="iv-hero__blob iv-hero__blob--1" />
                <div className="iv-hero__blob iv-hero__blob--2" />

                <div className="iv-hero__inner">
                    {/* <div className="iv-hero__eyebrow">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                        </svg>
                        INTERVIEW REPORT &bull; MOCK-001
                    </div>

                    <h1 className="iv-hero__title">Senior Frontend Engineer &middot; Linear</h1>

                    <p className="iv-hero__sub">Design-driven engineer who ships polished UI fast.</p> */}





<div className="iv-hero__eyebrow">
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
    INTERVIEW REPORT &bull; MOCK-001
</div>

<h1 className="iv-hero__title">Senior Frontend Engineer &middot; Linear</h1>

<p className="iv-hero__sub">Design-driven engineer who ships polished UI fast.</p>






                </div>
            </header>

            {/* ── Body ── */}
            <div className="iv-body">

                {/* ── Left Sidebar ── */}
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
                                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
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

                {/* ── Center Content ── */}
                <main className="iv-content">
                    {/* Section header */}
                    <div className="iv-content__header">
                        <h2 className="iv-content__title">
                            {activeNav === 'technical'  && 'Technical Questions'}
                            {activeNav === 'behavioral' && 'Behavioral Questions'}
                            {activeNav === 'roadmap'    && 'Preparation Road Map'}
                        </h2>
                        <span className="iv-content__count">
                            {activeNav === 'technical'  && `${technicalQuestions.length} questions`}
                            {activeNav === 'behavioral' && `${behavioralQuestions.length} questions`}
                            {activeNav === 'roadmap'    && `${preparationPlan.length}-day plan`}
                        </span>
                    </div>

                    {/* Questions */}
                    {(activeNav === 'technical' || activeNav === 'behavioral') && (
                        <div className="q-list">
                            {activeQuestions.map((q, i) => (
                                <QuestionCard key={i} item={q} index={i} />
                            ))}
                        </div>
                    )}

                    {/* Roadmap */}
                    {activeNav === 'roadmap' && (
                        <div className="roadmap-list">
                            {preparationPlan.map(day => (
                                <RoadMapDay key={day.day} day={day} />
                            ))}
                        </div>
                    )}
                </main>

                {/* ── Right Sidebar ── */}
                <aside className="iv-right">

                    {/* Match Score Card */}
                    <div className="iv-score-card">
                        <p className="iv-score-card__label">MATCH SCORE</p>
                        <div className="iv-score-card__ring">
                            <ScoreRing score={report.matchScore} />
                        </div>
                        <p className="iv-score-card__sub">{scoreLabel}</p>
                    </div>

                    {/* Skill Gaps Card */}
                    <div className="iv-gaps-card">
                        <p className="iv-gaps-card__label">SKILL GAPS</p>
                        <div className="iv-gaps-card__list">
                            {skillGaps.map((gap, i) => (
                                <span key={i} className={`iv-skill iv-skill--${gap.severity}`}>
                                    {gap.skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    )
}

export default Interview

// import React, { useState, useEffect } from 'react'
// import '../style/interview.scss'
// import { useInterview } from '../hooks/useInterview.js'
// import { useNavigate, useParams } from 'react-router'

// const NAV_ITEMS = [
//     {
//         id: 'technical', label: 'Technical Questions',
//         icon: (<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>)
//     },
//     {
//         id: 'behavioral', label: 'Behavioral Questions',
//         icon: (<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>)
//     },
//     {
//         id: 'roadmap', label: 'Road Map',
//         icon: (<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11" /></svg>)
//     },
// ]

// const QuestionCard = ({ item, index }) => {
//     const [open, setOpen] = useState(false)

//     return (
//         <div className='q-card'>
//             <div className='q-card__header' onClick={() => setOpen(o => !o)}>
//                 <span className='q-card__index'>Q{index + 1}</span>
//                 <p className='q-card__question'>{item.question}</p>
//                 <span className={`q-card__chevron ${open ? 'q-card__chevron--open' : ''}`}>
//                     <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
//                 </span>
//             </div>

//             {open && (
//                 <div className='q-card__body'>
//                     <div className='q-card__section'>
//                         <span className='q-card__tag q-card__tag--intention'>Intention</span>
//                         <p>{item.intention}</p>
//                     </div>
//                     <div className='q-card__section'>
//                         <span className='q-card__tag q-card__tag--answer'>Model Answer</span>
//                         <p>{item.answer}</p>
//                     </div>
//                 </div>
//             )}
//         </div>
//     )
// }

// const RoadMapDay = ({ day }) => (
//     <div className='roadmap-day'>
//         <div className='roadmap-day__header'>
//             <span className='roadmap-day__badge'>Day {day.day}</span>
//             <h3 className='roadmap-day__focus'>{day.focus}</h3>
//         </div>
//         <ul className='roadmap-day__tasks'>
//             {day.tasks.map((task, i) => (
//                 <li key={i}>
//                     <span className='roadmap-day__bullet' />
//                     {task}
//                 </li>
//             ))}
//         </ul>
//     </div>
// )

// const Interview = () => {
//     const [activeNav, setActiveNav] = useState('technical')
//     const { report, getReportById, loading, getResumePdf } = useInterview()
//     const { interviewId } = useParams()
//     const navigate = useNavigate()

//     useEffect(() => {
//         if (interviewId) {
//             getReportById(interviewId)
//         }
//     }, [interviewId])

//     if (loading || !report) {
//         return (
//             <main className='loading-screen'>
//                 <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
//                     <div style={{
//                         width: 44, height: 44, borderRadius: '50%',
//                         border: '3px solid var(--border-default)',
//                         borderTopColor: 'var(--accent)',
//                         animation: 'spin 0.9s linear infinite'
//                     }} />
//                     <h1>Loading your interview plan...</h1>
//                 </div>
//                 <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
//             </main>
//         )
//     }

//     const technicalQuestions = report.technicalQuestions || []
//     const behavioralQuestions = report.behavioralQuestions || []
//     const preparationPlan = report.preparationPlan || []
//     const skillGaps = report.skillGaps || []

//     const scoreColor =
//         report.matchScore >= 80 ? 'score--high' :
//             report.matchScore >= 60 ? 'score--mid' : 'score--low'

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
//                 preparationPlan
//             }
//         })
//     }

//     return (
//         <div className='interview-page'>
//             <div className='interview-layout'>

//                 {/* Left Nav */}
//                 <nav className='interview-nav'>
//                     <div className='nav-content'>
//                         <p className='interview-nav__label'>Sections</p>
//                         {NAV_ITEMS.map(item => (
//                             <button
//                                 key={item.id}
//                                 className={`interview-nav__item ${activeNav === item.id ? 'interview-nav__item--active' : ''}`}
//                                 onClick={() => setActiveNav(item.id)}
//                             >
//                                 <span className='interview-nav__icon'>{item.icon}</span>
//                                 {item.label}
//                             </button>
//                         ))}
//                     </div>

//                     <div className='nav-actions'>
//                         <button onClick={handleStartVoiceInterview} className='button primary-button'>
//                             <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
//                             Voice Interview
//                         </button>

//                         <button onClick={() => getResumePdf(interviewId)} className='button ghost-button'>
//                             <svg height='0.8rem' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'>
//                                 <path d='M10.6144 17.7956 11.492 15.7854C12.2731 13.9966 13.6789 12.5726 15.4325 11.7942L17.8482 10.7219C18.6162 10.381 18.6162 9.26368 17.8482 8.92277L15.5079 7.88394C13.7092 7.08552 12.2782 5.60881 11.5105 3.75894L10.6215 1.61673C10.2916.821765 9.19319.821767 8.8633 1.61673L7.97427 3.75892C7.20657 5.60881 5.77553 7.08552 3.97685 7.88394L1.63658 8.92277C.868537 9.26368.868536 10.381 1.63658 10.7219L4.0523 11.7942C5.80589 12.5726 7.21171 13.9966 7.99275 15.7854L8.8704 17.7956C9.20776 18.5682 10.277 18.5682 10.6144 17.7956ZM19.4014 22.6899 19.6482 22.1242C20.0882 21.1156 20.8807 20.3125 21.8695 19.8732L22.6299 19.5353C23.0412 19.3526 23.0412 18.7549 22.6299 18.5722L21.9121 18.2532C20.8978 17.8026 20.0911 16.9698 19.6586 15.9269L19.4052 15.3156C19.2285 14.8896 18.6395 14.8896 18.4628 15.3156L18.2094 15.9269C17.777 16.9698 16.9703 17.8026 15.956 18.2532L15.2381 18.5722C14.8269 18.7549 14.8269 19.3526 15.2381 19.5353L15.9985 19.8732C16.9874 20.3125 17.7798 21.1156 18.2198 22.1242L18.4667 22.6899C18.6473 23.104 19.2207 23.104 19.4014 22.6899Z' />
//                             </svg>
//                             Download Resume
//                         </button>
//                     </div>
//                 </nav>

//                 <div className='interview-divider' />

//                 {/* Center Content */}
//                 <main className='interview-content'>
//                     {activeNav === 'technical' && (
//                         <section>
//                             <div className='content-header'>
//                                 <h2>Technical Questions</h2>
//                                 <span className='content-header__count'>{technicalQuestions.length} questions</span>
//                             </div>
//                             <div className='q-list'>
//                                 {technicalQuestions.map((q, i) => (
//                                     <QuestionCard key={i} item={q} index={i} />
//                                 ))}
//                             </div>
//                         </section>
//                     )}

//                     {activeNav === 'behavioral' && (
//                         <section>
//                             <div className='content-header'>
//                                 <h2>Behavioral Questions</h2>
//                                 <span className='content-header__count'>{behavioralQuestions.length} questions</span>
//                             </div>
//                             <div className='q-list'>
//                                 {behavioralQuestions.map((q, i) => (
//                                     <QuestionCard key={i} item={q} index={i} />
//                                 ))}
//                             </div>
//                         </section>
//                     )}

//                     {activeNav === 'roadmap' && (
//                         <section>
//                             <div className='content-header'>
//                                 <h2>Preparation Road Map</h2>
//                                 <span className='content-header__count'>{preparationPlan.length}-day plan</span>
//                             </div>
//                             <div className='roadmap-list'>
//                                 {preparationPlan.map((day) => (
//                                     <RoadMapDay key={day.day} day={day} />
//                                 ))}
//                             </div>
//                         </section>
//                     )}
//                 </main>

//                 <div className='interview-divider' />

//                 {/* Right Sidebar */}
//                 <aside className='interview-sidebar'>
//                     <div className='match-score'>
//                         <p className='match-score__label'>Match Score</p>
//                         <div className={`match-score__ring ${scoreColor}`}>
//                             <span className='match-score__value'>{report.matchScore}</span>
//                             <span className='match-score__pct'>%</span>
//                         </div>
//                         <p className='match-score__sub'>
//                             {report.matchScore >= 80 ? 'Strong match for this role' :
//                                 report.matchScore >= 60 ? 'Good potential match' : 'Skill gaps identified'}
//                         </p>
//                     </div>

//                     <div className='sidebar-divider' />

//                     <div className='skill-gaps'>
//                         <p className='skill-gaps__label'>Skill Gaps</p>
//                         <div className='skill-gaps__list'>
//                             {skillGaps.map((gap, i) => (
//                                 <span key={i} className={`skill-tag skill-tag--${gap.severity}`}>
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







