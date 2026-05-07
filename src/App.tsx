import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PlaceNixAssistant from './components/PlaceNixAssistant';
import InterviewPage from './pages/InterviewPage';

// Placeholder mock pages for the router context
function LandingPage() {
    return (
        <div style={{ padding: '3rem', fontFamily: 'sans-serif', color: '#fff' }}>
            <h1>⚡ PlaceNix.ai Landing Page</h1>
            <p>This is a placeholder for the React version of the landing page.</p>
            <nav style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <Link to="/resume" style={{ color: '#CAFF00' }}>Resume Analysis</Link>
                <Link to="/companies" style={{ color: '#CAFF00' }}>Companies</Link>
                <Link to="/interview" style={{ color: '#CAFF00' }}>Mock Interview</Link>
                <Link to="/dashboard" style={{ color: '#CAFF00' }}>Dashboard</Link>
            </nav>
        </div>
    );
}

function App() {
    return (
        <>
            <Router>
                {/* 
          These routes simulate navigation so that PlaceNixAssistant 
          can detect the current page context using window.location.pathname 
        */}
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/resume" element={<div style={{ padding: '3rem', color: '#fff' }}>Resume Page</div>} />
                    <Route path="/companies" element={<div style={{ padding: '3rem', color: '#fff' }}>Companies Page</div>} />
                    <Route path="/interview" element={<InterviewPage />} />
                    <Route path="/dashboard" element={<div style={{ padding: '3rem', color: '#fff' }}>Dashboard Page</div>} />
                    <Route path="/admin" element={<div style={{ padding: '3rem', color: '#fff' }}>Admin Page</div>} />
                </Routes>
            </Router>

            {/* ════ Global Floating Widget ════ */}
            <PlaceNixAssistant />
        </>
    );
}

export default App;
