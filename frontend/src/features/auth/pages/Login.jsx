// import React, { useState } from 'react'
// import { useNavigate, Link } from 'react-router'
// import "../auth_form.scss"
// import { useAuth } from '../hooks/useAuth'

// const Login = () => {
//     const { loading, handleLogin } = useAuth()
//     const navigate = useNavigate()
//     const [email, setEmail] = useState("")
//     const [password, setPassword] = useState("")

//     const handleSubmit = async (e) => {
//         e.preventDefault()
//         await handleLogin({ email, password })
//         navigate('/')
//     }

//     if (loading) {
//         return (
//             <main className="auth-main">
//                 <div className="auth-wrapper">
//                     <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Signing you in...</p>
//                 </div>
//             </main>
//         )
//     }

//     return (
//         <main className="auth-main">
//             <div className="auth-wrapper">
//                 {/* Logo */}
//                 <div className="auth-logo">
//                     <div className="auth-logo__mark">✦</div>
//                     <span className="auth-logo__name">InterviewAI</span>
//                 </div>

//                 <div className="form-container">
//                     <div className="auth-header">
//                         <h1>Welcome back</h1>
//                         <p className="auth-subtitle">Sign in to access your interview plans and reports.</p>
//                     </div>

//                     <form onSubmit={handleSubmit}>
//                         <div className="input-group">
//                             <label htmlFor="email">Email address</label>
//                             <div className="input-field">
//                                 <span className="input-icon">
//                                     <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
//                                 </span>
//                                 <input
//                                     onChange={(e) => setEmail(e.target.value)}
//                                     type="email" id="email" name="email" placeholder="you@example.com" />
//                             </div>
//                         </div>

//                         <div className="input-group">
//                             <label htmlFor="password">Password</label>
//                             <div className="input-field">
//                                 <span className="input-icon">
//                                     <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
//                                 </span>
//                                 <input
//                                     onChange={(e) => setPassword(e.target.value)}
//                                     type="password" id="password" name="password" placeholder="Enter your password" />
//                             </div>
//                         </div>

//                         <button type="submit" className="auth-submit-btn">
//                             <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" /></svg>
//                             Sign In
//                         </button>
//                     </form>

//                     <div className="auth-footer">
//                         <p>Don't have an account? <Link to="/register">Create one free</Link></p>
//                     </div>
//                 </div>
//             </div>
//         </main>
//     )
// }

// export default Login


import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import "../auth.form.scss"
import { useAuth } from '../hooks/useAuth'

const Login = () => {
    const { loading, handleLogin } = useAuth()
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        await handleLogin({ email, password })
        navigate('/')
    }

    if (loading) {
        return (
            <main className="auth-main">
                {/* ambient orbs */}
                <div className="auth-orb auth-orb--1" />
                <div className="auth-orb auth-orb--2" />
                <div className="auth-orb auth-orb--3" />
                <div className="auth-wrapper">
                    <p className="auth-loading-text">Authenticating…</p>
                </div>
            </main>
        )
    }

    return (
        <main className="auth-main">
            {/* ambient orbs — decorative only */}
            <div className="auth-orb auth-orb--1" />
            <div className="auth-orb auth-orb--2" />
            <div className="auth-orb auth-orb--3" />

            <div className="auth-wrapper">

                {/* ── Logo mark ─────────────────────────────────────── */}
                <div className="auth-logo">
                    <div className="auth-logo__mark">
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"
                                fill="white" />
                        </svg>
                    </div>
                    <span className="auth-logo__name">InterviewAI</span>
                </div>

                {/* ── Glass card ────────────────────────────────────── */}
                <div className="form-container">

                    <div className="auth-header">
                        <h1>Welcome back</h1>
                        <p className="auth-subtitle">
                            Sign in to access your interview plans and AI-powered reports.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>

                        <div className="input-group">
                            <label htmlFor="email">Email address</label>
                            <div className="input-field">
                                <span className="input-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15"
                                        viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="2" y="4" width="20" height="16" rx="2" />
                                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                    </svg>
                                </span>
                                <input
                                    onChange={(e) => setEmail(e.target.value)}
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <div className="input-field">
                                <span className="input-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15"
                                        viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>
                                </span>
                                <input
                                    onChange={(e) => setPassword(e.target.value)}
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                />
                            </div>
                        </div>

                        <button type="submit" className="auth-submit-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                                <polyline points="10 17 15 12 10 7" />
                                <line x1="15" y1="12" x2="3" y2="12" />
                            </svg>
                            Sign In
                        </button>

                    </form>

                    <div className="auth-footer">
                        <p>Don't have an account? <Link to="/register">Create one free →</Link></p>
                    </div>

                </div>
            </div>
        </main>
    )
}

export default Login
