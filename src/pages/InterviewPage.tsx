// src/pages/InterviewPage.tsx
import React, { useState } from 'react';
import './InterviewPage.css';
import { questionBankService, Question } from '../services/questionBankService';
import { evaluationService, EvaluationResult } from '../services/evaluationService';
import { feedbackService, Feedback } from '../services/feedbackService';

type Stage = 'INTRO' | 'QUESTION' | 'EVALUATION' | 'RESULT';

const InterviewPage: React.FC = () => {
    const [stage, setStage] = useState<Stage>('INTRO');
    const [category, setCategory] = useState<string>('');
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
    const [answer, setAnswer] = useState<string>('');
    const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
    const [feedback, setFeedback] = useState<Feedback | null>(null);

    const handleStartInterview = (cat: string) => {
        setCategory(cat);
        const q = questionBankService.getRandomQuestion(cat);
        setCurrentQuestion(q);
        setStage('QUESTION');
    };

    const handleSubmitAnswer = async () => {
        if (!answer.trim() || !currentQuestion) return;

        setStage('EVALUATION');

        // Parallel processing of evaluation and feedback for speed
        const evalRes = await evaluationService.evaluateAnswer(
            currentQuestion.text,
            answer,
            category
        );
        const feedbackRes = await feedbackService.generatePersonalizedFeedback(
            currentQuestion.text,
            answer,
            evalRes
        );

        setEvaluation(evalRes);
        setFeedback(feedbackRes);
        setStage('RESULT');
    };

    const handleNextQuestion = () => {
        const nextQ = questionBankService.getRandomQuestion(category);
        setCurrentQuestion(nextQ);
        setAnswer('');
        setStage('QUESTION');
    };

    const handleRestart = () => {
        setStage('INTRO');
        setAnswer('');
    };

    return (
        <div className="interview-container">
            <div className="interview-card anim-up">
                
                {/* --- STAGE: INTRO --- */}
                {stage === 'INTRO' && (
                    <div className="intro-view">
                        <h1 className="intro-title">AI Mock <span className="lime">Interview</span></h1>
                        <p className="intro-desc">Select a category to begin your personalized interview session. Our AI will analyze your response in real-time.</p>
                        
                        <div className="category-grid">
                            <button className="cat-btn" onClick={() => handleStartInterview('HR')}>
                                <span className="cat-icon">🤝</span>
                                <span className="cat-label">HR Round</span>
                            </button>
                            <button className="cat-btn" onClick={() => handleStartInterview('Technical')}>
                                <span className="cat-icon">💻</span>
                                <span className="cat-label">Technical</span>
                            </button>
                            <button className="cat-btn" onClick={() => handleStartInterview('DSA')}>
                                <span className="cat-icon">🧩</span>
                                <span className="cat-label">DSA</span>
                            </button>
                            <button className="cat-btn" onClick={() => handleStartInterview('System Design')}>
                                <span className="cat-icon">🏗️</span>
                                <span className="cat-label">System Design</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* --- STAGE: QUESTION --- */}
                {stage === 'QUESTION' && currentQuestion && (
                    <div className="question-view">
                        <div className="question-header">
                            <span className="q-badge">{currentQuestion.category}</span>
                            <span className="q-difficulty">{currentQuestion.difficulty}</span>
                        </div>
                        <h2 className="q-text">"{currentQuestion.text}"</h2>
                        
                        <textarea
                            className="answer-textarea"
                            placeholder="Type your detailed answer here..."
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                        />

                        <div className="q-actions">
                            <button className="btn btn-outline" onClick={handleRestart}>Exit</button>
                            <button 
                                className="btn btn-primary btn-next" 
                                onClick={handleSubmitAnswer}
                                disabled={!answer.trim()}
                            >
                                Submit Answer
                            </button>
                        </div>
                    </div>
                )}

                {/* --- STAGE: EVALUATION --- */}
                {stage === 'EVALUATION' && (
                    <div className="intro-view">
                        <div className="loading-spinner" style={{ marginBottom: '2rem' }}>💎</div>
                        <h2>Analyzing your response...</h2>
                        <p>Our AI model is evaluating your clarity, technical depth, and confidence.</p>
                    </div>
                )}

                {/* --- STAGE: RESULT --- */}
                {stage === 'RESULT' && evaluation && feedback && (
                    <div className="result-view">
                        <div className="result-header">
                            <h2 className="intro-title">Performance <span className="lime">Score</span></h2>
                            <p>Here's how you performed in this round.</p>
                        </div>

                        <div className="score-row">
                            <div className="score-card">
                                <span className="score-label">Clarity</span>
                                <span className="score-num" style={{ color: '#CAFF00' }}>{evaluation.clarity}/10</span>
                            </div>
                            <div className="score-card">
                                <span className="score-label">Depth</span>
                                <span className="score-num" style={{ color: '#00C2FF' }}>{evaluation.depth}/10</span>
                            </div>
                            <div className="score-card">
                                <span className="score-label">Confidence</span>
                                <span className="score-num" style={{ color: '#FF4ECD' }}>{evaluation.confidence}/10</span>
                            </div>
                        </div>

                        <div className="feedback-section">
                            <h3 className="lime" style={{ marginBottom: '1rem' }}>Personalized Feedback</h3>
                            <p className="feedback-summary">{feedback.summary}</p>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                <div>
                                    <h4 style={{ color: '#CAFF00', marginBottom: '10px' }}>Strengths</h4>
                                    <ul className="point-list">
                                        {feedback.strengths.map((s, i) => (
                                            <li key={i} className="point-item">
                                                <span className="point-check">✓</span> {s}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h4 style={{ color: '#FF4ECD', marginBottom: '10px' }}>Improvements</h4>
                                    <ul className="point-list">
                                        {feedback.improvements.map((im, i) => (
                                            <li key={i} className="point-item">
                                                <span className="point-check">!</span> {im}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                <h4 style={{ marginBottom: '10px' }}>Suggested Resources</h4>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    {feedback.suggestedResources.map((res, i) => (
                                        <a href={res.url} key={i} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ fontSize: '0.8rem', textDecoration: 'none' }}>
                                            🔗 {res.title}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="q-actions" style={{ marginTop: '3rem' }}>
                            <button className="btn btn-outline" onClick={handleRestart}>Change Category</button>
                            <button className="btn btn-primary btn-next" onClick={handleNextQuestion}>Next Question</button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default InterviewPage;
