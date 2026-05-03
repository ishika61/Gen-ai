




// import React, { useState } from 'react'
// import { useNavigate, Link } from 'react-router'
// import { useAuth } from '../hooks/useAuth'
// import "../auth.form.scss"



// const Register = () => {
//     const navigate = useNavigate()
//     const [username, setUsername] = useState("")
//     const [email, setEmail] = useState("")
//     const [password, setPassword] = useState("")
//     const { loading, handleRegister } = useAuth()

//     const handleSubmit = async (e) => {
//         e.preventDefault()
//         await handleRegister({ username, email, password })
//         navigate("/")
//     }

//     if (loading) {
//         return (
//             <main className="auth-main">
//                 <div className="auth-wrapper">
//                     <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Creating your account...</p>
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
//                         <h1>Create account</h1>
//                         <p className="auth-subtitle">Start building smarter interview strategies today.</p>
//                     </div>

//                     <form onSubmit={handleSubmit}>
//                         <div className="input-group">
//                             <label htmlFor="username">Username</label>
//                             <div className="input-field">
//                                 <span className="input-icon">
//                                     <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
//                                 </span>
//                                 <input
//                                     onChange={(e) => setUsername(e.target.value)}
//                                     type="text" id="username" name="username" placeholder="Choose a username" />
//                             </div>
//                         </div>

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
//                                     type="password" id="password" name="password" placeholder="Create a password" />
//                             </div>
//                         </div>

//                         <button type="submit" className="auth-submit-btn">
//                             <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" /></svg>
//                             Create Account
//                         </button>
//                     </form>

//                     <div className="auth-footer">
//                         <p>Already have an account? <Link to="/login">Sign in</Link></p>
//                     </div>
//                 </div>
//             </div>
//         </main>
//     )
// }

// export default Register








import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import "../auth.form.scss"

const Register = () => {
    const navigate = useNavigate()
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const { loading, handleRegister } = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault()
        await handleRegister({ username, email, password })
        navigate("/")
    }

    if (loading) {
        return (
            <main className="auth-main">
                <div className="auth-orb auth-orb--1" />
                <div className="auth-orb auth-orb--2" />
                <div className="auth-orb auth-orb--3" />
                <div className="auth-wrapper">
                    <p className="auth-loading-text">Creating your account…</p>
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
                        <h1>Create account</h1>
                        <p className="auth-subtitle">
                            Start building smarter interview strategies with AI today.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>

                        <div className="input-group">
                            <label htmlFor="username">Username</label>
                            <div className="input-field">
                                <span className="input-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15"
                                        viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                        <circle cx="12" cy="7" r="4" />
                                    </svg>
                                </span>
                                <input
                                    onChange={(e) => setUsername(e.target.value)}
                                    type="text"
                                    id="username"
                                    name="username"
                                    placeholder="Choose a username"
                                    autoComplete="username"
                                />
                            </div>
                        </div>

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
                                    placeholder="Create a strong password"
                                    autoComplete="new-password"
                                />
                            </div>
                        </div>

                        <button type="submit" className="auth-submit-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <line x1="19" y1="8" x2="19" y2="14" />
                                <line x1="22" y1="11" x2="16" y2="11" />
                            </svg>
                            Create Account
                        </button>

                    </form>

                    <div className="auth-footer">
                        <p>Already have an account? <Link to="/login">Sign in →</Link></p>
                    </div>

                </div>
            </div>
        </main>
    )
}

export default Register