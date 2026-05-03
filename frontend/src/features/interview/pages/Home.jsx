
// import React, { useState, useRef } from 'react'
// import "../style/home.scss"
// import { useInterview } from '../hooks/useInterview.js'
// import { useNavigate } from 'react-router'

// const Home = () => {
//     const { loading, generateReport, reports } = useInterview()
//     const [jobDescription, setJobDescription] = useState("")
//     const [selfDescription, setSelfDescription] = useState("")
//     const [jobCharCount, setJobCharCount] = useState(0)
//     const resumeInputRef = useRef()
//     const [fileName, setFileName] = useState("")

//     const navigate = useNavigate()

//     const handleGenerateReport = async () => {
//         const resumeFile = resumeInputRef.current.files[0]
//         const data = await generateReport({ jobDescription, selfDescription, resumeFile })
//         navigate(`/interview/${data._id}`)
//     }

//     const handleFileChange = (e) => {
//         const file = e.target.files[0]
//         setFileName(file ? file.name : "")
//     }

//     const handleJobDescChange = (e) => {
//         setJobDescription(e.target.value)
//         setJobCharCount(e.target.value.length)
//     }

//     if (loading) {
//         return (
//             <main className='loading-screen'>
//                 <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
//                     <div style={{
//                         width: 48, height: 48, borderRadius: '50%',
//                         border: '3px solid var(--border-default)',
//                         borderTopColor: 'var(--accent)',
//                         animation: 'spin 0.9s linear infinite'
//                     }} />
//                     <h1>Generating your interview plan...</h1>
//                     <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>AI is analyzing the job requirements and your profile</p>
//                 </div>
//                 <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
//             </main>
//         )
//     }

//     return (
//         <div className='home-page'>

//             {/* Top Nav */}
//             <nav className='top-nav'>
//                 <div className='top-nav__brand'>
//                     <div className='brand-mark'>✦</div>
//                     <span className='brand-name'>InterviewAI</span>
//                 </div>
//                 <div className='top-nav__actions'>
//                     <button className='button ghost-button' style={{ fontSize: '0.8rem' }}>
//                         <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
//                         Profile
//                     </button>
//                 </div>
//             </nav>

//             {/* Page Header */}
//             <header className='page-header'>
//                 <span className='header-eyebrow'>
//                     <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" /></svg>
//                     AI-Powered Interview Prep
//                 </span>
//                 <h1>Build Your Custom <span className='highlight'>Interview Plan</span></h1>
//                 <p>Let AI analyze the job requirements and your unique profile to craft a winning preparation strategy.</p>
//             </header>

//             {/* Main Card */}
//             <div className='interview-card'>
//                 <div className='interview-card__body'>

//                     {/* Left Panel - Job Description */}
//                     <div className='panel panel--left'>
//                         <div className='panel__header'>
//                             <span className='panel__icon'>
//                                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
//                             </span>
//                             <h2>Target Job Description</h2>
//                             <span className='badge badge--required'>Required</span>
//                         </div>
//                         <textarea
//                             onChange={handleJobDescChange}
//                             className='panel__textarea'
//                             placeholder={`Paste the full job description here...\ne.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'`}
//                             maxLength={5000}
//                         />
//                         <div className='char-counter'>{jobCharCount} / 5000</div>
//                     </div>

//                     {/* Vertical Divider */}
//                     <div className='panel-divider' />

//                     {/* Right Panel - Profile */}
//                     <div className='panel panel--right'>
//                         <div className='panel__header'>
//                             <span className='panel__icon'>
//                                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
//                             </span>
//                             <h2>Your Profile</h2>
//                         </div>

//                         {/* Upload Resume */}
//                         <div className='upload-section'>
//                             <label className='section-label'>
//                                 Upload Resume
//                                 <span className='badge badge--best'>Best Results</span>
//                             </label>
//                             <label className='dropzone' htmlFor='resume'
//                                 style={fileName ? { borderColor: 'var(--accent)', background: 'rgba(220,38,90,0.05)' } : {}}>
//                                 <span className='dropzone__icon'>
//                                     {fileName ? (
//                                         <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
//                                     ) : (
//                                         <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" /></svg>
//                                     )}
//                                 </span>
//                                 <p className='dropzone__title'>{fileName || 'Click to upload or drag & drop'}</p>
//                                 <p className='dropzone__subtitle'>{fileName ? 'File selected ✓' : 'PDF or DOCX (Max 5MB)'}</p>
//                                 <input
//                                     ref={resumeInputRef}
//                                     hidden type='file' id='resume' name='resume'
//                                     accept='.pdf,.docx'
//                                     onChange={handleFileChange}
//                                 />
//                             </label>
//                         </div>

//                         {/* OR Divider */}
//                         <div className='or-divider'><span>OR</span></div>

//                         {/* Quick Self-Description */}
//                         <div className='self-description'>
//                             <label className='section-label' htmlFor='selfDescription'>Quick Self-Description</label>
//                             <textarea
//                                 onChange={(e) => setSelfDescription(e.target.value)}
//                                 id='selfDescription'
//                                 name='selfDescription'
//                                 className='panel__textarea panel__textarea--short'
//                                 placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
//                             />
//                         </div>

//                         {/* Info Box */}
//                         <div className='info-box'>
//                             <span className='info-box__icon'>
//                                 <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
//                             </span>
//                             <p>Either a <strong>Resume</strong> or a <strong>Self Description</strong> is required to generate a personalized plan.</p>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Card Footer */}
//                 <div className='interview-card__footer'>
//                     <span className='footer-info'>AI-Powered Strategy Generation &bull; Approx 30s</span>
//                     <button onClick={handleGenerateReport} className='generate-btn'>
//                         <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" /></svg>
//                         Generate My Interview Strategy
//                     </button>
//                 </div>
//             </div>

//             {/* Recent Reports List */}
//             {reports.length > 0 && (
//                 <section className='recent-reports'>
//                     <h2>My Recent Interview Plans</h2>
//                     <ul className='reports-list'>
//                         {reports.map(report => (
//                             <li key={report._id} className='report-item' onClick={() => navigate(`/interview/${report._id}`)}>
//                                 <h3>{report.title || 'Untitled Position'}</h3>
//                                 <p className='report-meta'>Generated on {new Date(report.createdAt).toLocaleDateString()}</p>
//                                 <p className={`match-score ${report.matchScore >= 80 ? 'score--high' : report.matchScore >= 60 ? 'score--mid' : 'score--low'}`}>
//                                     Match Score: {report.matchScore}%
//                                 </p>
//                             </li>
//                         ))}
//                     </ul>
//                 </section>
//             )}

//             {/* Page Footer */}
//             <footer className='page-footer'>
//                 <a href='#'>Privacy Policy</a>
//                 <a href='#'>Terms of Service</a>
//                 <a href='#'>Help Center</a>
//             </footer>
//         </div>
//     )
// }

// export default Home


import React, { useState, useRef } from 'react'
import "../style/home.scss"
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate } from 'react-router'

const Home = () => {
    const { loading, generateReport, reports } = useInterview()
    const [jobDescription, setJobDescription] = useState("")
    const [selfDescription, setSelfDescription] = useState("")
    const [jobCharCount, setJobCharCount] = useState(0)
    const resumeInputRef = useRef()
    const [fileName, setFileName] = useState("")

    const navigate = useNavigate()

    // ── unchanged logic ───────────────────────────────────────────────────────
    const handleGenerateReport = async () => {
        const resumeFile = resumeInputRef.current.files[0]
        const data = await generateReport({ jobDescription, selfDescription, resumeFile })
        navigate(`/interview/${data._id}`)
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        setFileName(file ? file.name : "")
    }

    const handleJobDescChange = (e) => {
        setJobDescription(e.target.value)
        setJobCharCount(e.target.value.length)
    }
    // ─────────────────────────────────────────────────────────────────────────

    if (loading) {
        return (
            <main className='loading-screen'>
                <div className='load-spinner' />
                <h1>Crafting your interview plan…</h1>
                <p>AI is analysing the job requirements and your profile</p>
            </main>
        )
    }

    return (
        <div className='home-page'>

            {/* ── Ambient background orbs ─────────────────────────────────── */}
            <div className='bg-orb bg-orb--1' />
            <div className='bg-orb bg-orb--2' />
            <div className='bg-orb bg-orb--3' />

            {/* ── Top Nav ─────────────────────────────────────────────────── */}
            <nav className='top-nav'>
                <div className='top-nav__brand'>
                    <div className='brand-mark'>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="white">
                            <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
                        </svg>
                    </div>
                    <span className='brand-name'>InterviewAI</span>
                </div>
                <div className='top-nav__actions'>
                    <button className='button ghost-button'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                        Profile
                    </button>
                </div>
            </nav>

            {/* ── Page Header ──────────────────────────────────────────────── */}
            <header className='page-header'>
                <span className='header-eyebrow'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11"
                        viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
                    </svg>
                    AI-Powered Interview Prep
                </span>

                <h1>
                    Build Your Custom{' '}
                    <span className='highlight'>Interview Plan</span>
                </h1>

                <p>
                    Let AI analyse the job requirements and your unique profile
                    to craft a winning preparation strategy.
                </p>
            </header>

            {/* ── Main Card ────────────────────────────────────────────────── */}
            <div className='interview-card'>
                <div className='interview-card__body'>

                    {/* Left Panel — Job Description */}
                    <div className='panel panel--left'>
                        <div className='panel__header'>
                            <span className='panel__icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15"
                                    viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                                </svg>
                            </span>
                            <h2>Target Job Description</h2>
                            <span className='badge badge--required'>Required</span>
                        </div>

                        <textarea
                            onChange={handleJobDescChange}
                            className='panel__textarea'
                            placeholder={`Paste the full job description here…\ne.g. "Senior Frontend Engineer at Google requires React, TypeScript, and system design…"`}
                            maxLength={5000}
                        />

                        <div className='char-counter'>{jobCharCount} / 5000</div>
                    </div>

                    {/* Divider */}
                    <div className='panel-divider' />

                    {/* Right Panel — Profile */}
                    <div className='panel panel--right'>
                        <div className='panel__header'>
                            <span className='panel__icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15"
                                    viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            </span>
                            <h2>Your Profile</h2>
                        </div>

                        {/* Upload Resume */}
                        <div className='upload-section'>
                            <label className='section-label'>
                                Upload Resume
                                <span className='badge badge--best'>Best Results</span>
                            </label>

                            <label
                                className='dropzone'
                                htmlFor='resume'
                                style={fileName
                                    ? { borderColor: 'rgba(108,82,246,0.6)', background: 'rgba(108,82,246,0.07)' }
                                    : {}
                                }
                            >
                                <span className='dropzone__icon'>
                                    {fileName ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26"
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                            <polyline points="14 2 14 8 20 8" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26"
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="16 16 12 12 8 16" />
                                            <line x1="12" y1="12" x2="12" y2="21" />
                                            <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                                        </svg>
                                    )}
                                </span>

                                <p className='dropzone__title'>
                                    {fileName || 'Click to upload or drag & drop'}
                                </p>
                                <p className='dropzone__subtitle'>
                                    {fileName ? 'File selected ✓' : 'PDF or DOCX · Max 5 MB'}
                                </p>

                                <input
                                    ref={resumeInputRef}
                                    hidden
                                    type='file'
                                    id='resume'
                                    name='resume'
                                    accept='.pdf,.docx'
                                    onChange={handleFileChange}
                                />
                            </label>
                        </div>

                        {/* OR divider */}
                        <div className='or-divider'><span>or</span></div>

                        {/* Quick Self-Description */}
                        <div className='self-description'>
                            <label className='section-label' htmlFor='selfDescription'>
                                Quick Self-Description
                            </label>
                            <textarea
                                onChange={(e) => setSelfDescription(e.target.value)}
                                id='selfDescription'
                                name='selfDescription'
                                className='panel__textarea panel__textarea--short'
                                placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy…"
                            />
                        </div>

                        {/* Info box */}
                        <div className='info-box'>
                            <span className='info-box__icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15"
                                    viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="8" x2="12" y2="12" />
                                    <line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                            </span>
                            <p>
                                Either a <strong>Resume</strong> or a{' '}
                                <strong>Self Description</strong> is required to generate a
                                personalised plan.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Card Footer */}
                <div className='interview-card__footer'>
                    <span className='footer-info'>
                        AI-Powered Strategy Generation &bull; Approx 30 s
                    </span>
                    <button onClick={handleGenerateReport} className='generate-btn'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"
                            viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
                        </svg>
                        Generate My Interview Strategy
                    </button>
                </div>
            </div>

            {/* ── Recent Reports ───────────────────────────────────────────── */}
            {reports.length > 0 && (
                <section className='recent-reports'>
                    <h2>Recent Interview Plans</h2>
                    <ul className='reports-list'>
                        {reports.map(report => (
                            <li
                                key={report._id}
                                className='report-item'
                                onClick={() => navigate(`/interview/${report._id}`)}
                            >
                                <h3>{report.title || 'Untitled Position'}</h3>
                                <p className='report-meta'>
                                    {new Date(report.createdAt).toLocaleDateString('en-US', {
                                        month: 'short', day: 'numeric', year: 'numeric'
                                    })}
                                </p>
                                <p className={`match-score ${
                                    report.matchScore >= 80 ? 'score--high'
                                    : report.matchScore >= 60 ? 'score--mid'
                                    : 'score--low'
                                }`}>
                                    {report.matchScore}% match
                                </p>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {/* ── Page Footer ──────────────────────────────────────────────── */}
            <footer className='page-footer'>
                <a href='#'>Privacy Policy</a>
                <a href='#'>Terms of Service</a>
                <a href='#'>Help Centre</a>
            </footer>

        </div>
    )
}

export default Home

