import { useState, useEffect, useRef } from 'react';
import API from '../services/api';

const TRANSLATIONS = {
    en: {
        greeting: "Hello! I am KrishiAI. I can help you with farming queries, Mandi prices, crop advice, or weather. How can I help today?",
        placeholder: "Type your farming query...",
        quickActions: [
            "What is the wheat price today?",
            "Fertilizer for tomatoes?",
            "Weather for next 3 days?",
            "Tips for rice yield"
        ],
        header: "KrishiAI Assistant",
        status: "Online | Smart Farming Help"
    },
    hi: {
        greeting: "नमस्ते! मैं कृषिAI हूँ। मैं खेती-बाड़ी, मंडी के भाव, फसल की सलाह या मौसम में आपकी मदद कर सकता हूँ। आज मैं आपकी क्या सेवा करूँ?",
        placeholder: "अपना सवाल यहाँ लिखें...",
        quickActions: [
            "आज गेहूं का क्या भाव है?",
            "टमाटर में कौन सा खाद डालें?",
            "अगले 3 दिनों का मौसम?",
            "धान की पैदावार के सुझाव"
        ],
        header: "कृषिAI सहायक",
        status: "ऑनलाइन | स्मार्ट खेती सहायता"
    },
    mr: {
        greeting: "नमस्ते! मी कृषिAI आहे. मी तुम्हाला शेती, मंडी भाव, पिकांचा सल्ला किंवा हवामानाबद्दल मदत करू शकतो. आज मी तुम्हाला कशी मदत करू?",
        placeholder: "तुमचा प्रश्न येथे लिहा...",
        quickActions: [
            "आज गव्हाचा भाव काय आहे?",
            "टोमॅटोसाठी कोणते खत वापरावे?",
            "पुढील ३ दिवसांचे हवामान?",
            "भाताच्या उत्पादनासाठी टिप्स"
        ],
        header: "कृषिAI सहाय्यक",
        status: "ऑनलाईन | स्मार्ट शेती मदत"
    },
    te: {
        greeting: "నమస్తే! నేను కృషిAI. వ్యవసాయం, మండి ధరలు, పంటల సలహాలు లేదా వాతావరణం గురించి నేను మీకు సహాయం చేయగలను. ఈరోజు నేనేలా సహాయపడగలను?",
        placeholder: "మీ ప్రశ్నను ఇక్కడ టైప్ చేయండి...",
        quickActions: [
            "ఈరోజు గోధుమ ధర ఎంత?",
            "టమోటాలకు ఏ ఎరువు వేయాలి?",
            "వచ్చే 3 రోజుల వాతావరణం?",
            "వరి దిగుబడికి చిట్కాలు"
        ],
        header: "కృషిAI అసిస్టెంట్",
        status: "ఆన్‌లైన్ | స్మార్ట్ ఫార్మింగ్ సహాయం"
    },
    ta: {
        greeting: "வணக்கம்! நான் கிருஷிAI. விவசாயம், மண்டி விலைகள், பயிர் ஆலோசனைகள் அல்லது வானிலை பற்றி நான் உங்களுக்கு உதவ முடியும். இன்று நான் உங்களுக்கு எப்படி உதவ முடியும்?",
        placeholder: "உங்கள் கேள்வியைத் தட்டச்சு செய்யவும்...",
        quickActions: [
            "இன்று கோதுமை விலை என்ன?",
            "தக்காளிக்கு என்ன உரம் போட வேண்டும்?",
            "அடுத்த 3 நாட்களுக்கான வானிலை?",
            "நெல் விளைச்சலுக்கான குறிப்புகள்"
        ],
        header: "கிருஷிAI உதவியாளர்",
        status: "ஆன்லைன் | விவசாய உதவி"
    },
    bn: {
        greeting: "নমস্কার! আমি কৃষিAI। আমি আপনাকে চাষাবাদ, মন্ডির দর, ফসলের পরামর্শ বা আবহাওয়া সম্পর্কে সাহায্য করতে পারি। আজ আমি আপনাকে কীভাবে সাহায্য করতে পারি?",
        placeholder: "আপনার প্রশ্ন এখানে লিখুন...",
        quickActions: [
            "আজ গমের দাম কত?",
            "টমেটোর জন্য কোন সার দেব?",
            "আগামী ৩ দিনের আবহাওয়া?",
            "ধানের ফলন বৃদ্ধির টিপস"
        ],
        header: "কৃষিAI সহকারী",
        status: "অনলাইন | স্মার্ট চাষাবাদ সহায়তা"
    },
    kn: {
        greeting: "ನಮಸ್ಕಾರ! ನಾನು ಕೃಷಿAI. ಕೃಷಿ, ಮಂಡಿ ಬೆಲೆಗಳು, ಬೆಳೆ ಸಲಹೆ ಅಥವಾ ಹವಾಮಾನದ ಬಗ್ಗೆ ನಾನು ನಿಮಗೆ ಸಹಾಯ ಮಾಡಬಲ್ಲೆ. ಇಂದು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?",
        placeholder: "ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಇಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ...",
        quickActions: [
            "ಇಂದು ಗೋಧಿ ಬೆಲೆ ಎಷ್ಟಿದೆ?",
            "ಟೊಮೆಟೊಗೆ ಯಾವ ಗೊಬ್ಬರ ಹಾಕಬೇಕು?",
            "ಮುಂದಿನ 3 ದಿನಗಳ ಹವಾಮಾನ?",
            "ಭತ್ತದ ಇಳುವರಿಗೆ ಸಲಹೆಗಳು"
        ],
        header: "ಕೃಷಿAI ಸಹಾಯಕ",
        status: "ಆನ್‌ಲೈನ್ | ಕೃಷಿ ಸಹಾಯ"
    },
    pa: {
        greeting: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਕ੍ਰਿਸ਼ੀAI ਹਾਂ। ਮੈਂ ਖੇਤੀਬਾੜੀ, ਮੰਡੀ ਦੇ ਭਾਅ, ਫਸਲਾਂ ਦੀ ਸਲਾਹ ਜਾਂ ਮੌਸਮ ਬਾਰੇ ਤੁਹਾਡੀ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ। ਅੱਜ ਮੈਂ ਤੁਹਾਡੀ ਕੀ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?",
        placeholder: "ਆਪਣਾ ਸਵਾਲ ਇੱਥੇ ਲਿਖੋ...",
        quickActions: [
            "ਅੱਜ ਕਣਕ ਦਾ ਕੀ ਭਾਅ ਹੈ?",
            "ਟਮਾਟਰ ਲਈ ਕਿਹੜੀ ਖਾਦ ਪਾਈਏ?",
            "ਅਗਲੇ 3 ਦਿਨਾਂ ਦਾ ਮੌਸਮ?",
            "ਝੋਨੇ ਦੀ ਪੈਦਾਵਾਰ ਲਈ ਸੁਝਾਅ"
        ],
        header: "ਕ੍ਰਿਸ਼ੀAI ਸਹਾਇਕ",
        status: "ਔਨਲਾਈਨ | ਸਮਾਰਟ ਖੇਤੀ ਸਹਾਇਤਾ"
    }
};

const LANGUAGES = [
    { code: 'hi', name: 'हिन्दी' },
    { code: 'en', name: 'English' },
    { code: 'mr', name: 'मराठी' },
    { code: 'te', name: 'తెలుగు' },
    { code: 'ta', name: 'தமிழ்' },
    { code: 'bn', name: 'বাংলা' },
    { code: 'kn', name: 'ಕನ್ನಡ' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ' }
];

export default function KrishiAIWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [showCare, setShowCare] = useState(false);
    const [lang, setLang] = useState(localStorage.getItem('krishiai-lang') || 'hi');
    const [messages, setMessages] = useState([
        { role: 'model', content: TRANSLATIONS[lang].greeting }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const t = TRANSLATIONS[lang];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
            setShowCare(false);
        }
    }, [messages, isOpen]);

    // Show attraction bubble after 2 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!isOpen) setShowCare(true);
        }, 3000);

        const hideTimer = setTimeout(() => {
            setShowCare(false);
        }, 12000);

        return () => { clearTimeout(timer); clearTimeout(hideTimer); };
    }, [isOpen]);

    // Update greeting when language changes (if messages only contain the initial one)
    useEffect(() => {
        localStorage.setItem('krishiai-lang', lang);
        if (messages.length === 1 && messages[0].role === 'model') {
            setMessages([{ role: 'model', content: TRANSLATIONS[lang].greeting }]);
        }
    }, [lang]);

    const handleSend = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        const msgToSend = typeof e === 'string' ? e : input;
        if (!msgToSend.trim() || loading) return;

        const userMsg = { role: 'user', content: msgToSend };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const res = await API.post('/ai/chat', {
                message: msgToSend,
                history: messages.slice(1),
                langHint: lang // Provide context to backend
            });
            setMessages(prev => [...prev, { role: 'model', content: res.data.reply }]);
        } catch (err) {
            console.error('Chat Error:', err);
            const errorMsg = lang === 'en' ? 'Sorry, server issue. Please try later.' : 'क्षमा करें, सर्वर में समस्या है। कृपया बाद में प्रयास करें।';
            setMessages(prev => [...prev, { role: 'model', content: errorMsg }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="krishiai-widget-wrapper">
            {/* Attraction Bubble */}
            {showCare && !isOpen && (
                <div className="attraction-bubble animate-slide-in-right">
                    <span>{lang === 'hi' ? 'नमस्ते! मैं यहाँ हूँ 👋' : 'Hi! I am here to help 👋'}</span>
                </div>
            )}

            {/* Floating FAB Button */}
            <button
                className={`krishiai-fab ${isOpen ? 'active' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="KrishiAI Assistant"
            >
                {isOpen ? '✕' : '🤖'}
                {!isOpen && <span className="fab-label">{t.header}</span>}
            </button>

            {isOpen && (
                <div className="krishiai-window animate-fade-in-up">
                    <div className="krishiai-header">
                        <div className="header-info">
                            <span className="bot-icon">🤖</span>
                            <div>
                                <h3>{t.header}</h3>
                                <p>{t.status}</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <select
                                className="lang-mini-select"
                                value={lang}
                                onChange={(e) => setLang(e.target.value)}
                            >
                                {LANGUAGES.map(l => (
                                    <option key={l.code} value={l.code}>{l.name}</option>
                                ))}
                            </select>
                            <button className="close-btn" onClick={() => setIsOpen(false)}>✕</button>
                        </div>
                    </div>

                    <div className="krishiai-messages">
                        {messages.map((msg, i) => (
                            <div key={i} className={`widget-msg ${msg.role === 'user' ? 'user' : 'ai'}`}>
                                <div className="msg-bubble">
                                    {msg.content.split('\n').map((line, j) => (
                                        <p key={j}>{line}</p>
                                    ))}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="widget-msg ai">
                                <div className="typing-indicator">
                                    <span></span><span></span><span></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="krishiai-footer">
                        <div className="widget-quick-actions">
                            {t.quickActions.map((action, i) => (
                                <button key={i} onClick={() => handleSend(action)}>{action}</button>
                            ))}
                        </div>
                        <form onSubmit={handleSend} className="widget-input-form">
                            <input
                                type="text"
                                placeholder={t.placeholder}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                disabled={loading}
                            />
                            <button type="submit" disabled={loading || !input.trim()}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="22" y1="2" x2="11" y2="13"></line>
                                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                </svg>
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
