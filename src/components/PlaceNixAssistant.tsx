import React, { useState, useEffect, useRef } from 'react';
import './PlaceNixAssistant.css';
import { useSpeech } from '../hooks/useSpeech';
import { assistantGeminiService, Message } from '../services/assistantGeminiService';

const LANG_OPTIONS = [
    { code: 'en-IN', label: 'English', native: 'English', placeholder: 'Ask me anything...' },
    { code: 'te-IN', label: 'Telugu', native: 'తెలుగు', placeholder: 'మీ ప్రశ్న టైప్ చేయండి...' },
    { code: 'hi-IN', label: 'Hindi', native: 'हिंदी', placeholder: 'अपना सवाल लिखें...' },
    { code: 'ta-IN', label: 'Tamil', native: 'தமிழ்', placeholder: 'உங்கள் கேள்வியை தட்டச்சு செய்யுங்கள்...' },
    { code: 'mr-IN', label: 'Marathi', native: 'मराठी', placeholder: 'तुमचा प्रश्न टाइप करा...' },
    { code: 'ml-IN', label: 'Malayalam', native: 'മലയാളം', placeholder: 'നിങ്ങളുടെ ചോദ്യം ടൈപ്പ് ചെയ്യുക...' }
];

const QUICK_CHIPS: Record<string, string[]> = {
    'te-IN': ['నా resume చెక్ చేయండి', 'Amazon interview ఎలా ఉంటుంది?', 'DSA tips చెప్పండి', 'Mock interview start చేద్దాం'],
    'en-IN': ['Check my resume', 'Amazon interview rounds', 'DSA tips for placements', 'Start mock interview'],
    'hi-IN': ['Resume tips do bhai', 'Amazon ke rounds batao', 'DSA kaise prepare karein', 'Mock interview shuru karo'],
    'ta-IN': ['என் resume செக் பண்ணுங்க', 'Amazon ரவுண்ட்ஸ் சொல்லுங்க', 'DSA tips', 'Mock interview ஆரம்பிக்கலாம்'],
    'mr-IN': ['माझा resume तपासा', 'Amazon interview कसा असतो?', 'DSA preparation tips', 'Mock interview सुरू करा'],
    'ml-IN': ['എന്റെ resume നോക്കാമോ', 'Amazon interview rounds', 'DSA tips തരാമോ', 'Mock interview തുടങ്ങാം']
};

export default function PlaceNixAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [langCode, setLangCode] = useState('en-IN');
    const [inputMode, setInputMode] = useState<'VOICE' | 'TEXT'>('TEXT');
    const [messages, setMessages] = useState<(Message & { id: string; time: string })[]>([]);
    const [textVal, setTextVal] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [toast, setToast] = useState<string | null>(null);
    const [isMuted, setIsMuted] = useState(() => {
        return localStorage.getItem('placenix_assistant_muted') === 'true';
    });

    const endOfMsgRef = useRef<HTMLDivElement>(null);

    const {
        isListening,
        isSpeaking,
        interimTranscript,
        error: speechErr,
        hasSpeechRecognition,
        startListening,
        stopListening,
        speakText,
        stopSpeaking
    } = useSpeech(langCode);

    const selectedLangDef = LANG_OPTIONS.find(l => l.code === langCode) || LANG_OPTIONS[0];
    const chips = QUICK_CHIPS[langCode] || QUICK_CHIPS['en-IN'];

    // Scroll to bottom on new message
    useEffect(() => {
        endOfMsgRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, interimTranscript, isProcessing]);

    // Handle Speech Error Fallback
    useEffect(() => {
        if (speechErr && inputMode === 'VOICE') {
            showToast(`Voice error: ${speechErr}. Switching to text.`);
            setInputMode('TEXT');
        }
    }, [speechErr, inputMode]);

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    const getTimeString = () => {
        return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const handleSend = async (content: string) => {
        if (!content.trim() || isProcessing) return;

        if (isSpeaking) stopSpeaking();

        // Convert to strict schema for service
        const newMsgId = Math.random().toString(36).substr(2, 9);
        const userMsg: Message & { id: string; time: string } = {
            role: 'user', content: content.trim(), id: newMsgId, time: getTimeString()
        };

        const updatedHistory = [...messages, userMsg];
        setMessages(updatedHistory);
        setTextVal('');
        setIsProcessing(true);

        try {
            // Map back to just Role and Content for Gemini
            const apiHistory: Message[] = updatedHistory.map(m => ({
                role: m.role,
                content: m.content
            }));

            const replyText = await assistantGeminiService.generateResponse(
                apiHistory,
                langCode,
                window.location.pathname
            );

            const aiMsgId = Math.random().toString(36).substr(2, 9);
            setMessages(prev => [...prev, {
                role: 'model', content: replyText, id: aiMsgId, time: getTimeString()
            }]);

            if (inputMode === 'VOICE' && !isMuted) {
                speakText(replyText, langCode);
            }
        } catch (err: any) {
            // Add error message to chat
            setMessages(prev => [...prev, {
                role: 'model',
                content: '⚠️ ' + err.message,
                id: Math.random().toString(36).substr(2, 9),
                time: getTimeString()
            }]);
        } finally {
            setIsProcessing(false);
        }
    };

    const onDictationResult = (finalText: string) => {
        // If we get a final result from useSpeech, send it instantly
        handleSend(finalText);
    };

    const toggleMic = () => {
        if (!hasSpeechRecognition) {
            showToast("Voice input not supported in your browser.");
            setInputMode('TEXT');
            return;
        }
        if (isListening) {
            stopListening();
        } else {
            startListening(onDictationResult);
        }
    };

    const toggleMute = () => {
        const nextMuted = !isMuted;
        setIsMuted(nextMuted);
        localStorage.setItem('placenix_assistant_muted', String(nextMuted));
        
        if (nextMuted && isSpeaking) {
            stopSpeaking();
        }
        
        showToast(nextMuted ? "Assistant muted" : "Assistant unmuted");
    };

    return (
        <div className="pn-assistant-widget">
            {/* TRIGGER BUTTON */}
            <button
                className={`pn-trigger-btn ${isListening ? 'pn-listening' : ''} ${isSpeaking ? 'pn-speaking' : ''}`}
                onClick={() => setIsOpen(val => !val)}
                aria-label="Toggle PlaceNix AI Assistant"
            >
                <div className="pn-ring-wrap">
                    <div className="pn-ring"></div>
                    <div className="pn-ring"></div>
                    <div className="pn-ring"></div>
                </div>
                <svg className="pn-mic-icon" viewBox="0 0 24 24">
                    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                    <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                </svg>
            </button>

            {/* PANEL */}
            {isOpen && (
                <div className={`pn-panel ${isSpeaking ? 'pn-speaking' : ''}`}>
                    {toast && <div className="pn-toast">{toast}</div>}

                    {/* HEADER */}
                    <div className="pn-header">
                        <div className="pn-header-left">
                            <span className="pn-brand">NETRA</span>
                            <span className="pn-subbrand">PlaceNix AI</span>
                        </div>

                        <div className="pn-header-center">
                            <div className="pn-wave"></div>
                            <div className="pn-wave"></div>
                            <div className="pn-wave"></div>
                            <div className="pn-wave"></div>
                            <div className="pn-wave"></div>
                        </div>

                        <div className="pn-header-right">
                            <select
                                className="pn-lang-select"
                                value={langCode}
                                onChange={e => setLangCode(e.target.value)}
                            >
                                {LANG_OPTIONS.map(opt => (
                                    <option key={opt.code} value={opt.code}>
                                        🇮🇳 {opt.native} ({opt.label})
                                    </option>
                                ))}
                            </select>
                            <button 
                                className={`pn-mute-btn ${isMuted ? 'muted' : ''}`} 
                                onClick={toggleMute}
                                title={isMuted ? "Unmute Assistant" : "Mute Assistant"}
                            >
                                {isMuted ? '🔇' : '🔊'}
                            </button>
                            <button className="pn-close-btn" onClick={() => setIsOpen(false)}>×</button>
                        </div>
                    </div>

                    {/* MESSAGES */}
                    <div className="pn-messages-area">
                        {messages.length === 0 ? (
                            <div className="pn-empty-state">
                                <span className="pn-empty-icon">🤖</span>
                                <span className="pn-empty-text">Namaste! Choose your language and ask me anything.</span>
                                <div className="pn-chips">
                                    {chips.map((chip, idx) => (
                                        <button key={idx} className="pn-chip" onClick={() => handleSend(chip)}>
                                            {chip}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            messages.map(msg => (
                                <div key={msg.id} className={`pn-msg ${msg.role === 'user' ? 'pn-msg-user' : 'pn-msg-ai'}`}>
                                    <div className="pn-bubble">{msg.content}</div>
                                    <div className="pn-msg-time">{msg.time}</div>
                                    {msg.role === 'model' && (
                                        <button className="pn-tts-btn" onClick={() => speakText(msg.content, langCode)} aria-label="Play message">
                                            🔊
                                        </button>
                                    )}
                                </div>
                            ))
                        )}

                        {isProcessing && (
                            <div className="pn-msg pn-msg-ai">
                                <div className="pn-bubble pn-loading">
                                    <span className="pn-dot"></span><span className="pn-dot"></span><span className="pn-dot"></span>
                                </div>
                            </div>
                        )}

                        {interimTranscript && (
                            <div className="pn-msg pn-msg-user">
                                <div className="pn-bubble" style={{ opacity: 0.7, fontStyle: 'italic' }}>
                                    "{interimTranscript}"
                                </div>
                            </div>
                        )}

                        <div ref={endOfMsgRef} />
                    </div>

                    {/* INPUT AREA */}
                    <div className="pn-input-row">
                        <div className="pn-mode-toggle">
                            <button
                                className={`pn-tgl-btn ${inputMode === 'VOICE' ? 'active' : ''}`}
                                onClick={() => setInputMode('VOICE')}
                            >
                                🎤 Voice
                            </button>
                            <button
                                className={`pn-tgl-btn ${inputMode === 'TEXT' ? 'active' : ''}`}
                                onClick={() => setInputMode('TEXT')}
                            >
                                ⌨️ Text
                            </button>
                        </div>

                        {inputMode === 'VOICE' ? (
                            <div className="pn-voice-input">
                                <button
                                    className={`pn-voice-btn ${isListening ? 'listening' : ''}`}
                                    onClick={toggleMic}
                                >
                                    🎤
                                </button>
                                <div className="pn-interim-text">
                                    {isListening ? (interimTranscript || 'Listening...') : 'Tap to speak'}
                                </div>
                            </div>
                        ) : (
                            <form
                                className="pn-text-input"
                                onSubmit={e => { e.preventDefault(); handleSend(textVal); }}
                            >
                                <input
                                    type="text"
                                    value={textVal}
                                    onChange={e => setTextVal(e.target.value)}
                                    placeholder={selectedLangDef.placeholder}
                                    disabled={isProcessing}
                                />
                                <button type="submit" className="pn-send-btn" disabled={!textVal.trim() || isProcessing}>
                                    ➔
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
