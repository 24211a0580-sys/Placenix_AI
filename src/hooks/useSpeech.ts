import { useState, useEffect, useCallback, useRef } from 'react';

// For browser compatibility
const BrowserSpeechRecognition =
    typeof window !== 'undefined' ?
        ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition) : null;

export function useSpeech(languageCode: string) {
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [interimTranscript, setInterimTranscript] = useState('');
    const [error, setError] = useState<string | null>(null);

    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        if (!BrowserSpeechRecognition) {
            setError('Speech recognition not supported in this browser.');
            return;
        }

        const recognition = new BrowserSpeechRecognition();
        recognition.continuous = false; // Stop listening after one phrase
        recognition.interimResults = true; // Give live feedback

        recognition.onstart = () => {
            setIsListening(true);
            setError(null);
        };

        recognition.onerror = (event: any) => {
            console.error('Speech recognition error', event.error);
            setIsListening(false);

            // Map common errors
            if (event.error === 'not-allowed') {
                setError('Microphone access denied.');
            } else if (event.error === 'no-speech') {
                // Optional handling for no-speech
            } else {
                setError(event.error);
            }
        };

        recognition.onend = () => {
            setIsListening(false);
            setInterimTranscript('');
        };

        recognitionRef.current = recognition;

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.abort();
            }
        };
    }, []);

    // Update language when code changes
    useEffect(() => {
        if (recognitionRef.current) {
            recognitionRef.current.lang = languageCode;
        }
    }, [languageCode]);

    /* ════ STT Logic ════ */
    const startListening = useCallback((onResult: (finalText: string) => void) => {
        if (!recognitionRef.current) return;

        // Stop any ongoing TTS before listening
        stopSpeaking();

        // Attach local onresult handler to capture both interim and final
        recognitionRef.current.onresult = (event: any) => {
            let tempInterim = '';
            let tempFinal = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcriptChunk = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    tempFinal += transcriptChunk;
                } else {
                    tempInterim += transcriptChunk;
                }
            }

            setInterimTranscript(tempInterim);

            if (tempFinal) {
                onResult(tempFinal.trim());
            }
        };

        try {
            recognitionRef.current.start();
        } catch (err) {
            // Catch already started error
            console.warn("Recognition already started");
        }
    }, []);

    const stopListening = useCallback(() => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
    }, []);

    /* ════ TTS Logic ════ */
    const speakText = useCallback((text: string, langCode: string) => {
        if (typeof window === 'undefined' || !window.speechSynthesis) return;

        // Stop previous utterance
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = langCode;
        const triggerSpeak = () => {
            const voices = window.speechSynthesis.getVoices();
            let match = voices.find(v => v.lang === langCode || v.lang.replace('_', '-') === langCode);
            if (!match) {
                const prefix = langCode.split('-')[0];
                match = voices.find(v => v.lang.startsWith(prefix));
            }
            if (!match && langCode === 'hi-IN') match = voices.find(v => v.name.includes('Hindi'));
            if (!match && langCode === 'ta-IN') match = voices.find(v => v.name.includes('Tamil'));
            if (!match && langCode === 'te-IN') match = voices.find(v => v.name.includes('Telugu'));
            if (!match && langCode === 'mr-IN') match = voices.find(v => v.name.includes('Marathi'));
            if (!match && langCode === 'ml-IN') match = voices.find(v => v.name.includes('Malayalam'));
            
            if (match) {
                utterance.voice = match;
            }

            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = (e) => {
                console.error('Speech synthesis error', e);
                setIsSpeaking(false);
            };

            window.speechSynthesis.speak(utterance);
        };

        if (window.speechSynthesis.getVoices().length === 0) {
            window.speechSynthesis.onvoiceschanged = () => {
                triggerSpeak();
                window.speechSynthesis.onvoiceschanged = null;
            };
        } else {
            triggerSpeak();
        }
    }, []);

    const stopSpeaking = useCallback(() => {
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        }
    }, []);

    return {
        isListening,
        isSpeaking,
        interimTranscript,
        error,
        hasSpeechRecognition: !!BrowserSpeechRecognition,
        startListening,
        stopListening,
        speakText,
        stopSpeaking
    };
}
