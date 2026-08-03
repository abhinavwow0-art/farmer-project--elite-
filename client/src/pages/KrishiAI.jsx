import { useState, useEffect, useRef } from 'react';
import API from '../services/api';

export default function KrishiAI() {
    const [messages, setMessages] = useState([
        { role: 'model', content: 'Namaste! Main KrishiAI hoon. Main aapki kheti-baari se jude sawalon mein madad kar sakta hoon. Aap mujhse Mandi ke bhav, fasal ki salah, ya mausam ke baare mein pooch sakte hain.' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const res = await API.post('/ai/chat', {
                message: input,
                history: messages.slice(1) // Background history
            });
            setMessages(prev => [...prev, { role: 'model', content: res.data.reply }]);
        } catch (err) {
            console.error('Chat Error:', err);
            setMessages(prev => [...prev, { role: 'model', content: 'Kshama karein, abhi server mein kuch samasya hai. Kripya thodi der baad prayas karein.' }]);
        } finally {
            setLoading(false);
        }
    };

    const quickActions = [
        "आज मंडी में गेहूं का क्या भाव है?",
        "टमाटर की फसल में कौन सा खाद डालें?",
        "अगले 3 दिनों का मौसम कैसा रहेगा?",
        "धान की अच्छी पैदावार के सुझाव दें"
    ];

    return (
        <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', height: 'calc(100vh - 280px)', display: 'flex', flexDirection: 'column' }}>
            {/* Chat Messages */}
            <div className="chat-container" style={{ flex: 1, overflowY: 'auto', padding: '20px', background: 'var(--card-bg)', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                {messages.map((msg, i) => (
                    <div key={i} className={`chat-message ${msg.role === 'user' ? 'user' : 'ai'}`} style={{
                        display: 'flex',
                        justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                        marginBottom: '16px',
                        animation: 'fadeInUp 0.3s ease-out forwards'
                    }}>
                        <div style={{
                            maxWidth: '85%',
                            padding: '12px 18px',
                            borderRadius: msg.role === 'user' ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
                            background: msg.role === 'user' ? 'var(--primary-main)' : 'var(--bg-secondary)',
                            color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
                            fontSize: '0.95rem',
                            lineHeight: '1.5',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                            position: 'relative'
                        }}>
                            {msg.role === 'model' && <div style={{ fontSize: '0.7rem', marginBottom: '4px', opacity: 0.7, fontWeight: 600 }}>🤖 KrishiAI</div>}
                            {msg.content.split('\n').map((line, j) => (
                                <p key={j} style={{ margin: 0 }}>{line}</p>
                            ))}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="chat-message ai" style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '16px' }}>
                        <div className="typing-indicator" style={{ padding: '12px 18px', background: 'var(--bg-secondary)', borderRadius: '18px 18px 18px 2px' }}>
                            <span></span><span></span><span></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            <div className="quick-actions" style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', whiteSpace: 'nowrap' }}>
                {quickActions.map((action, i) => (
                    <button
                        key={i}
                        className="btn-outline btn-sm"
                        style={{ fontSize: '0.8rem', borderRadius: '20px', background: 'var(--card-bg)' }}
                        onClick={() => setInput(action)}
                    >
                        {action}
                    </button>
                ))}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} style={{ display: 'flex', gap: '12px', background: 'var(--card-bg)', padding: '10px', borderRadius: '30px', border: '1px solid var(--border-color)', boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}>
                <input
                    type="text"
                    className="form-input"
                    placeholder="Apna sawal yahan likhein..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    style={{ border: 'none', background: 'transparent', paddingLeft: '20px', outline: 'none', flex: 1 }}
                    disabled={loading}
                />
                <button
                    type="submit"
                    className="btn-primary"
                    style={{ borderRadius: '50%', width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
                    disabled={loading || !input.trim()}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                </button>
            </form>
        </div>
    );
}
