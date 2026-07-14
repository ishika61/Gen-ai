import { useMemo } from "react";
import { useNavigate, useParams } from "react-router";
import {
    getInterviewResultById,
    getLatestInterviewResult,
    buildInterviewAnalysis
} from "../utils/interviewResults";
import "../style/interview-results.scss";

export default function InterviewResults() {
    const navigate = useNavigate();
    const { id } = useParams();

    const session = useMemo(() => {
        if (id) {
            return getInterviewResultById(id);
        }

        return getLatestInterviewResult();
    }, [id]);

    const analysis = useMemo(() => {
        if (!session) return null;
        return buildInterviewAnalysis(session);
    }, [session]);

    if (!session || !analysis) {
        return (
            <main className="ir-page">
                <section className="ir-empty">
                    <p className="ir-eyebrow">Interview Report</p>
                    <h1>No interview report found</h1>
                    <p>This report may not exist yet, or it may have been cleared from local storage.</p>
                    <button onClick={() => navigate("/")}>Back Home</button>
                </section>
            </main>
        );
    }

    const scoreCards = [
        ["Technical", analysis.scores.technicalScore],
        ["Communication", analysis.scores.communicationScore],
        ["Confidence", analysis.scores.confidenceScore],
        ["Problem Solving", analysis.scores.problemSolvingScore],
        ["HR / Behavioral", analysis.scores.behavioralScore]
    ];

    const topStrength = analysis.heroInsights?.topStrength || "Finished the session and stayed engaged.";
    const mainGap = analysis.heroInsights?.mainGap || "Add more project proof with stack and results.";
    const nextStep = analysis.heroInsights?.nextStep || "Practice a short intro and one project story.";

    return (
        <main className="ir-page">
            <section className="ir-hero ir-hero--with-score">
                <div>
                    <button className="ir-back" onClick={() => navigate(-1)}>Back</button>
                    <p className="ir-eyebrow">Interview Readiness Report</p>
                    <h1>{session.title}</h1>
                    <p>{analysis.summary.overview}</p>

                    <div className="ir-hero-insights">
                        <article>
                            <span>Top Strength</span>
                            <strong>{topStrength}</strong>
                        </article>
                        <article>
                            <span>Main Gap</span>
                            <strong>{mainGap}</strong>
                        </article>
                        <article>
                            <span>Next Best Step</span>
                            <strong>{nextStep}</strong>
                        </article>
                    </div>
                </div>

                <aside className="ir-final-score">
                    <span>Overall Score</span>
                    <strong>{analysis.scores.overallScore}%</strong>
                    <p>{analysis.summary.recommendation}</p>
                </aside>
            </section>

            <section className="ir-grid ir-score-grid">
                {scoreCards.map(([label, score]) => (
                    <article className="ir-score-card" key={label}>
                        <span>{label}</span>
                        <strong>{score}%</strong>
                    </article>
                ))}
            </section>

            <section className="ir-panel">
                <div className="ir-section-head">
                    <h2>Interview Summary</h2>
                    <span>{analysis.summary.recommendation}</span>
                </div>

                <div className="ir-summary-grid">
                    <div><span>Duration</span><strong>{analysis.summary.duration}</strong></div>
                    <div><span>Questions</span><strong>{analysis.summary.totalQuestions}</strong></div>
                    <div><span>Answered</span><strong>{analysis.summary.answeredCount}</strong></div>
                    <div><span>Missed</span><strong>{analysis.summary.missedCount}</strong></div>
                    <div><span>Avg Score</span><strong>{analysis.summary.avgAnswerScore}%</strong></div>
                    <div><span>Readiness</span><strong>{analysis.readinessLevel}</strong></div>
                </div>
            </section>

            <section className="ir-grid">
                <article className="ir-panel">
                    <h2>Strengths</h2>
                    <ul>
                        {analysis.strengths.map((item, index) => (
                            <li key={index}>
                                <span className="ir-list-tag">Good</span>
                                {" "}
                                {item}
                            </li>
                        ))}
                    </ul>
                </article>

                <article className="ir-panel">
                    <h2>Weaknesses</h2>
                    <ul>
                        {analysis.weaknesses.map((item, index) => (
                            <li key={index}>
                                <span className="ir-list-tag ir-list-tag--warning">
                                    {index === 0 ? "High priority" : "Focus"}
                                </span>
                                {" "}
                                {item}
                            </li>
                        ))}
                    </ul>
                </article>
            </section>

            <section className="ir-panel">
                <h2>Improvement Roadmap</h2>
                <ol>
                    {analysis.improvementRoadmap.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ol>
            </section>

            {analysis.recommendedTechnologies.length > 0 && (
                <section className="ir-panel">
                    <h2>Recommended Technologies to Learn</h2>
                    <div className="ir-tech-list">
                        {analysis.recommendedTechnologies.map((item, index) => (
                            <span key={index}>{item}</span>
                        ))}
                    </div>
                </section>
            )}

            <section className="ir-panel">
                <h2>Question & Answer Review</h2>

                <div className="ir-review-list">
                    {analysis.reviews.map((review) => (
                        <article className="ir-review-card" key={review.number}>
                            <div className="ir-review-card__top">
                                <h3>Question {review.number}</h3>
                                <div className="ir-review-meta">
                                    <span>{review.difficulty}</span>
                                    <span>{review.score}%</span>
                                </div>
                            </div>

                            <div className="ir-review-block">
                                <strong>Question</strong>
                                <p>{review.aiQuestion}</p>
                            </div>

                            <div className="ir-review-block">
                                <strong>Your Answer</strong>
                                <p>{review.candidateAnswer}</p>
                            </div>

                            <div className="ir-review-columns">
                                <div className="ir-review-block">
                                    <strong>Mistakes</strong>
                                    <ul>
                                        {review.mistakes.map((item, index) => (
                                            <li key={index}>{item}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="ir-review-block">
                                    <strong>Missing Concepts</strong>
                                    <ul>
                                        {review.missingPoints.map((item, index) => (
                                            <li key={index}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="ir-review-block ir-review-block--model">
                                <strong>Model Answer</strong>
                                <p>{review.modelAnswer}</p>
                            </div>

                            <div className="ir-review-block">
                                <strong>Answer Structure</strong>
                                <p>{review.answerGuide}</p>
                            </div>

                            <div className="ir-review-block">
                                <strong>AI Feedback</strong>
                                <p>{review.aiFeedback}</p>
                            </div>

                            <div className="ir-review-block">
                                <strong>Suggested Improvements</strong>
                                <ul>
                                    {review.improvementSuggestions.map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </main>
    );
}
