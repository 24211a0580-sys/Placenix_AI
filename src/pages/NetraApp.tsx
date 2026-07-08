import React, { useState, useEffect, useRef } from 'react';
import { Message } from '../types/netraTypes.ts';
import { generateCareerCoachResponse } from '../services/netraGeminiService.ts';
import { useSpeech } from '../hooks/useSpeech.ts';

const LANG_OPTIONS = [
    { code: 'en-IN', label: 'English', native: 'English', placeholder: 'Ask me your career or placement doubt...' },
    { code: 'te-IN', label: 'Telugu', native: 'తెలుగు', placeholder: 'మీ కెరీర్ లేదా ప్లేస్‌మెంట్ సందేహాన్ని అడగండి...' },
    { code: 'hi-IN', label: 'Hindi', native: 'हिंदी', placeholder: 'अपनी करियर या प्लेसमेंट शंका पूछें...' },
    { code: 'ta-IN', label: 'Tamil', native: 'தமிழ்', placeholder: 'உங்கள் வேலைவாய்ப்பு சந்தேகங்களைக் கேளுங்கள்...' },
    { code: 'mr-IN', label: 'Marathi', native: 'मराठी', placeholder: 'तुमची प्लेसमेंट किंवा करिअर शंका विचारा...' },
    { code: 'ml-IN', label: 'Malayalam', native: 'മലയാളം', placeholder: 'നിങ്ങളുടെ പ്ലേസ്‌മെന്റ് സംശയങ്ങൾ ചോദിക്കൂ...' }
];

const SUGGESTION_CHIPS: Record<string, string[]> = {
    'en-IN': [
        'How to write a standard resume?',
        'Amazon DSA interview rounds',
        'Aptitude test shortcut tricks',
        'How to introduce myself in HR round?',
        'TCS placement prep guide'
    ],
    'te-IN': [
        'Resume ఎలా తయారుచేయాలి?',
        'Amazon DSA రౌండ్స్ ఎలా ఉంటాయి?',
        'Aptitude సులభమైన టిప్స్',
        'HR రౌండ్ లో నన్ను నేను ఎలా పరిచయం చేసుకోవాలి?',
        'TCS ప్లేస్‌మెంట్ ప్రిపరేషన్'
    ],
    'hi-IN': [
        'Resume कैसे बनाएं?',
        'Amazon DSA राउंड की तैयारी',
        'Aptitude हल करने की शॉर्टकट ट्रिक्स',
        'HR राउंड में अपना परिचय कैसे दें?',
        'TCS प्लेसमेंट की तैयारी कैसे करें?'
    ],
    'ta-IN': [
        'Resume தயாரிப்பது எப்படி?',
        'Amazon DSA நேர்காணல் முறைகள்',
        'Aptitude எளிய கணித முறைகள்',
        'HR சுற்றில் என்னை எப்படி அறிமுகப்படுத்துவது?',
        'TCS வேலைவாய்ப்பு தேர்வு முறை'
    ],
    'mr-IN': [
        'Resume कसा तयार करावा?',
        'Amazon DSA राउंड्सची माहिती',
        'Aptitude गणित सोडवण्याच्या शॉर्टकट ट्रिक्स',
        'HR राउंड मध्ये स्वतःची ओळख कशी करून द्यावी?',
        'TCS प्लेसमेंट तयारी मार्गदर्शक'
    ],
    'ml-IN': [
        'Resume എങ്ങനെ തയ്യാറാക്കാം?',
        'Amazon DSA ഇൻ്റർവ്യൂ വിവരങ്ങൾ',
        'Aptitude എളുപ്പവഴികൾ പറയൂ',
        'HR ഇൻ്റർവ്യൂവിൽ എങ്ങനെ സ്വയം പരിചയപ്പെടുത്താം?',
        'TCS പ്ലേസ്‌മെൻ്റ് ടിപ്സ്'
    ]
};

export const NetraApp: React.FC = () => {
    const [langCode, setLangCode] = useState('en-IN');
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputVal, setInputVal] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [toast, setToast] = useState<string | null>(null);
    const [isMuted, setIsMuted] = useState(() => {
        return localStorage.getItem('netra_coach_muted') === 'true';
    });

    const endOfMsgRef = useRef<HTMLDivElement>(null);

    // Integrate multi-lingual voice hooks
    const {
        isListening,
        isSpeaking,
        interimTranscript,
        error: speechError,
        hasSpeechRecognition,
        startListening,
        stopListening,
        speakText,
        stopSpeaking
    } = useSpeech(langCode);

    const selectedLangDef = LANG_OPTIONS.find(l => l.code === langCode) || LANG_OPTIONS[0];
    const chips = SUGGESTION_CHIPS[langCode] || SUGGESTION_CHIPS['en-IN'];

    // Scroll to bottom on new chats
    useEffect(() => {
        endOfMsgRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, interimTranscript, isProcessing]);

    // Handle speech recognition error redirect
    useEffect(() => {
        if (speechError) {
            showToast(`Voice Error: ${speechError}`);
        }
    }, [speechError]);

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    const handleSend = async (content: string) => {
        if (!content.trim() || isProcessing) return;

        if (isSpeaking) stopSpeaking();
        if (isListening) stopListening();

        const userMsg: Message = { role: 'user', content: content.trim() };
        const updatedHistory = [...messages, userMsg];
        setMessages(updatedHistory);
        setInputVal('');
        setIsProcessing(true);

        try {
            const reply = await generateCareerCoachResponse(updatedHistory, langCode);
            
            setMessages(prev => [...prev, { role: 'model', content: reply }]);

            // Play voice back if not muted
            if (!isMuted) {
                speakText(reply, langCode);
            }
        } catch (err: any) {
            showToast(err.message || "Failed to generate guidance response.");
            setMessages(prev => [...prev, { 
                role: 'model', 
                content: `⚠️ System link failure: ${err.message || 'Check your keys.'}` 
            }]);
        } finally {
            setIsProcessing(false);
        }
    };

    const toggleMic = () => {
        if (!hasSpeechRecognition) {
            showToast("Speech recognition is not supported in this browser.");
            return;
        }

        if (isListening) {
            stopListening();
        } else {
            startListening((finalResult) => {
                handleSend(finalResult);
            });
        }
    };

    const toggleMute = () => {
        const nextMuted = !isMuted;
        setIsMuted(nextMuted);
        localStorage.setItem('netra_coach_muted', String(nextMuted));
        if (nextMuted && isSpeaking) {
            stopSpeaking();
        }
        showToast(nextMuted ? "Voice synthesis muted" : "Voice synthesis enabled");
    };

    // Reacting AI core style
    let orbClass = "bg-cyan-500/10 border-cyan-500/30 text-cyan-400";
    let orbStatus = "SYSTEM IDLE";
    if (isListening) {
        orbClass = "bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_30px_rgba(245,158,11,0.4)] scale-105 animate-[pulse_1s_infinite]";
        orbStatus = "LISTENING VOICE...";
    } else if (isProcessing) {
        orbClass = "bg-purple-500/20 border-purple-400 text-purple-300 shadow-[0_0_30px_rgba(168,85,247,0.4)] scale-105 animate-[spin_4s_linear_infinite]";
        orbStatus = "THINKING SOLUTIONS...";
    } else if (isSpeaking) {
        orbClass = "bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-[0_0_30px_rgba(16,185,129,0.4)] scale-105 animate-tech-pulse";
        orbStatus = "SPEAKING TRANSMISSION...";
    }

    return (
        <div className="flex flex-col lg:flex-row gap-6 w-full min-h-[600px] bg-[#0c0926]/90 border border-cyan-500/20 rounded-xl overflow-hidden p-6 shadow-2xl relative select-none">
            {toast && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-900 border border-cyan-500/50 text-cyan-400 font-mono text-xs px-4 py-2 rounded shadow-2xl z-50">
                    {toast}
                </div>
            )}

            {/* ════ LEFT COLUMN: NETRA COCH CORE HOLOGRAPH ════ */}
            <div className="w-full lg:w-[35%] flex flex-col items-center justify-between border-b lg:border-b-0 lg:border-r border-cyan-500/10 pb-6 lg:pb-0 lg:pr-6 flex-shrink-0">
                <div className="w-full flex items-center justify-between mb-4">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-mono text-cyan-500 uppercase tracking-widest">TACTICAL COACH</span>
                        <h2 className="text-xl font-bold italic tracking-tighter text-white">NETRA CORE</h2>
                    </div>
                    <div className="flex items-center gap-1.5 bg-cyan-950/40 border border-cyan-800/40 px-2 py-0.5 rounded font-mono text-[9px] text-cyan-400">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        ACTIVE
                    </div>
                </div>

                {/* Pulsing Tactical AI Orb */}
                <div className="relative w-48 h-48 my-6 flex items-center justify-center">
                    <div className={`absolute w-full h-full rounded-full border border-dashed border-cyan-500/10 animate-[spin-slow_20s_linear_infinite] pointer-events-none`} />
                    <div className={`absolute w-[80%] h-[80%] rounded-full border border-double border-cyan-500/20 animate-[spin_10s_linear_infinite] pointer-events-none`} />
                    
                    <div className={`w-36 h-36 rounded-full border flex flex-col items-center justify-center text-center p-4 transition-all duration-500 ${orbClass}`}>
                        <div className="text-xs font-bold font-mono uppercase tracking-widest">{orbStatus}</div>
                        {isSpeaking && <div className="text-[9px] font-mono text-emerald-400 mt-1 animate-pulse">TTS ACTIVE</div>}
                        {isListening && <div className="text-[9px] font-mono text-amber-400 mt-1 animate-pulse">MIC OPEN</div>}
                    </div>
                </div>

                {/* Subtitle / Live speech reader */}
                <div className="w-full bg-[#0a071f] border border-cyan-950 px-4 py-3 rounded-md min-h-[80px] flex items-center justify-center text-center">
                    {isListening && interimTranscript ? (
                        <p className="text-amber-400 font-mono text-sm italic">"{interimTranscript}"</p>
                    ) : isListening ? (
                        <p className="text-cyan-600 font-mono text-xs animate-pulse">State your doubt clearly...</p>
                    ) : isSpeaking && messages.length > 0 ? (
                        <p className="text-emerald-400 font-mono text-xs leading-relaxed truncate-3-lines">
                            {messages[messages.length - 1].content}
                        </p>
                    ) : (
                        <p className="text-cyan-500/50 font-mono text-[11px] leading-relaxed">
                            Select a language, select a placement topic chip, or press microphone to ask.
                        </p>
                    )}
                </div>

                {/* Language Select deck */}
                <div className="w-full mt-4 space-y-2">
                    <label className="text-[10px] font-mono text-cyan-600 uppercase block">COMMUNICATION_LANG</label>
                    <select
                        className="w-full bg-[#110D30] border border-cyan-500/20 text-cyan-400 font-mono text-xs px-3 py-2 rounded focus:outline-none focus:border-cyan-400 cursor-pointer"
                        value={langCode}
                        onChange={(e) => {
                            setLangCode(e.target.value);
                            stopSpeaking();
                            stopListening();
                        }}
                    >
                        {LANG_OPTIONS.map(opt => (
                            <option key={opt.code} value={opt.code}>
                                🇮🇳 {opt.native} ({opt.label})
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* ════ RIGHT COLUMN: CONVERSATION INTERACTIVES ════ */}
            <div className="flex-1 flex flex-col justify-between overflow-hidden">
                
                {/* Scrollable messages area */}
                <div className="flex-1 overflow-y-auto pr-2 min-h-[350px] max-h-[420px] mb-4 space-y-4 custom-scrollbar">
                    {messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                            <span className="text-4xl animate-bounce">🎓</span>
                            <h3 className="text-white font-bold text-lg">Crack Your Placements with Netra AI</h3>
                            <p className="text-cyan-600 text-xs max-w-sm font-mono leading-relaxed">
                                I am your placement prep companion. I can help clear doubts on Technical DSA, Resume scoring, Mock Interview responses, and Aptitude tests.
                            </p>
                        </div>
                    ) : (
                        messages.map((m, idx) => (
                            <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                                <div className={`max-w-[85%] rounded px-4 py-3 text-sm font-mono ${
                                    m.role === 'user' 
                                        ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-200' 
                                        : 'bg-[#0f0b36] border border-cyan-950 text-cyan-100'
                                }`}>
                                    <div className="flex items-center justify-between gap-6 border-b border-cyan-950 pb-1 mb-2 opacity-50 text-[9px]">
                                        <span>{m.role === 'user' ? 'STUDENT' : 'NETRA COACH'}</span>
                                        {m.role === 'model' && (
                                            <button 
                                                onClick={() => speakText(m.content, langCode)} 
                                                className="hover:text-cyan-400 cursor-pointer"
                                                title="Speak response"
                                            >
                                                🔊 LISTEN
                                            </button>
                                        )}
                                    </div>
                                    <p className="leading-relaxed whitespace-pre-line">{m.content}</p>
                                </div>
                            </div>
                        ))
                    )}

                    {isProcessing && (
                        <div className="flex justify-start">
                            <div className="bg-[#0f0b36] border border-cyan-950 max-w-[80%] rounded px-4 py-3 font-mono text-cyan-500 text-xs animate-pulse">
                                ⚡ Fetching placement coaching transmission...
                            </div>
                        </div>
                    )}
                    <div ref={endOfMsgRef} />
                </div>

                {/* Suggestion Chips Section */}
                <div className="mb-4">
                    <span className="text-[9px] font-mono text-cyan-600 uppercase tracking-widest block mb-2">QUICK TOPICS</span>
                    <div className="flex flex-wrap gap-2">
                        {chips.map((chip, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleSend(chip)}
                                disabled={isProcessing}
                                className="bg-[#110D30]/60 border border-cyan-950 hover:border-cyan-500/40 text-cyan-400 hover:text-cyan-200 font-mono text-[10px] px-3 py-1.5 rounded-full transition-all duration-300 disabled:opacity-50"
                            >
                                {chip}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Bottom Control deck for input */}
                <div className="bg-slate-900/60 border border-cyan-950 p-2 rounded-lg flex items-center gap-3">
                    <button
                        onClick={toggleMute}
                        className={`w-10 h-10 flex items-center justify-center border rounded transition-all duration-300 ${
                            isMuted 
                                ? 'bg-rose-950/20 border-rose-900/50 text-rose-400' 
                                : 'bg-[#110D30] border-cyan-800/40 text-cyan-400 hover:text-cyan-300'
                        }`}
                        title={isMuted ? "Unmute Career Coach" : "Mute Career Coach"}
                    >
                        {isMuted ? '🔇' : '🔊'}
                    </button>

                    {/* Speech Dictation Mic Trigger */}
                    <button
                        onClick={toggleMic}
                        disabled={isProcessing}
                        className={`w-12 h-10 flex items-center justify-center border rounded transition-all duration-300 ${
                            isListening 
                                ? 'bg-amber-500 border-amber-400 text-slate-900 shadow-[0_0_15px_rgba(245,158,11,0.5)]' 
                                : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20'
                        }`}
                        title="Voice dictation"
                    >
                        🎤
                    </button>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSend(inputVal);
                        }}
                        className="flex-1 flex gap-2"
                    >
                        <input
                            type="text"
                            value={inputVal}
                            onChange={(e) => setInputVal(e.target.value)}
                            placeholder={selectedLangDef.placeholder}
                            disabled={isProcessing}
                            className="flex-1 bg-[#110D30] border border-cyan-500/10 text-cyan-200 text-xs px-4 py-2 rounded focus:outline-none focus:border-cyan-500/40 font-mono disabled:opacity-50"
                        />
                        <button
                            type="submit"
                            disabled={!inputVal.trim() || isProcessing}
                            className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 font-mono text-xs px-4 py-2 rounded transition-all duration-300 disabled:opacity-30"
                        >
                            SEND
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
};
