import { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function CommunityQA() {
    const { user } = useAuth();
    const [questions, setQuestions] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newQ, setNewQ] = useState({ title: '', content: '', tags: '' });
    const [answerInputs, setAnswerInputs] = useState({});
    const [expandedQ, setExpandedQ] = useState(null);

    useEffect(() => { fetchQuestions(); }, [search]);

    const fetchQuestions = async () => {
        try {
            const params = search ? { search } : {};
            const res = await API.get('/questions', { params });
            setQuestions(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handlePostQuestion = async (e) => {
        e.preventDefault();
        try {
            await API.post('/questions', {
                title: newQ.title,
                content: newQ.content,
                tags: newQ.tags.split(',').map(t => t.trim()).filter(Boolean)
            });
            setShowModal(false);
            setNewQ({ title: '', content: '', tags: '' });
            fetchQuestions();
        } catch (err) { console.error(err); }
    };

    const handlePostAnswer = async (questionId) => {
        const content = answerInputs[questionId];
        if (!content?.trim()) return;
        try {
            await API.post(`/questions/${questionId}/answers`, { content });
            setAnswerInputs({ ...answerInputs, [questionId]: '' });
            fetchQuestions();
        } catch (err) { console.error(err); }
    };

    const timeAgo = (date) => {
        const diff = Date.now() - new Date(date).getTime();
        const minutes = Math.floor(diff / 60000);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    };

    return (
        <div className="animate-fade-in">
            <div className="search-bar" style={{ justifyContent: 'space-between' }}>
                <input
                    type="text"
                    className="form-input"
                    placeholder="🔍 Search questions..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                {user && (
                    <button className="btn-primary" onClick={() => setShowModal(true)}>
                        ✍️ Ask Question
                    </button>
                )}
            </div>

            {loading ? (
                <div className="loading-spinner"><div className="spinner"></div></div>
            ) : questions.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">💬</div>
                    <h3>No questions yet</h3>
                    <p>Be the first to ask a question!</p>
                </div>
            ) : (
                questions.map((q) => (
                    <div key={q._id} className="question-card animate-fade-in-up">
                        <div className="question-meta">
                            <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{q.userName}</span>
                            {q.userRole === 'expert' && <span className="expert-badge">⭐ Expert</span>}
                            <span>•</span>
                            <span>{timeAgo(q.createdAt)}</span>
                            <span>•</span>
                            <span>{q.answers?.length || 0} answers</span>
                        </div>
                        <h3>{q.title}</h3>
                        <p>{q.content}</p>
                        {q.tags && q.tags.length > 0 && (
                            <div className="question-tags">
                                {q.tags.map((t, i) => <span key={i} className="badge badge-green">{t}</span>)}
                            </div>
                        )}

                        {/* Answers */}
                        {q.answers && q.answers.length > 0 && (
                            <div className="answer-section">
                                <button
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', fontWeight: 600, fontSize: '0.88rem', marginBottom: '0.5rem' }}
                                    onClick={() => setExpandedQ(expandedQ === q._id ? null : q._id)}
                                >
                                    {expandedQ === q._id ? '▾ Hide' : '▸ Show'} {q.answers.length} answer{q.answers.length > 1 ? 's' : ''}
                                </button>
                                {expandedQ === q._id && q.answers.map((a, i) => (
                                    <div key={i} className="answer-item">
                                        <div className="question-meta" style={{ marginBottom: '0.4rem' }}>
                                            <span style={{ fontWeight: 600 }}>{a.userName}</span>
                                            {a.userRole === 'expert' && <span className="expert-badge">⭐ Expert</span>}
                                            <span>•</span>
                                            <span>{timeAgo(a.createdAt)}</span>
                                        </div>
                                        <p>{a.content}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Post Answer */}
                        {user && (
                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Write your answer..."
                                    style={{ flex: 1, padding: '8px 12px', fontSize: '0.85rem' }}
                                    value={answerInputs[q._id] || ''}
                                    onChange={(e) => setAnswerInputs({ ...answerInputs, [q._id]: e.target.value })}
                                    onKeyDown={(e) => { if (e.key === 'Enter') handlePostAnswer(q._id); }}
                                />
                                <button className="btn-primary btn-sm" onClick={() => handlePostAnswer(q._id)}>Reply</button>
                            </div>
                        )}
                    </div>
                ))
            )}

            {/* Post Question Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Ask a Question</h2>
                            <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
                        </div>
                        <form onSubmit={handlePostQuestion}>
                            <div className="form-group">
                                <label className="form-label">Question Title</label>
                                <input type="text" className="form-input" placeholder="What's your question?" value={newQ.title} onChange={(e) => setNewQ({ ...newQ, title: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Details</label>
                                <textarea className="form-input" rows={4} placeholder="Provide more context about your question..." value={newQ.content} onChange={(e) => setNewQ({ ...newQ, content: e.target.value })} required style={{ resize: 'vertical' }} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Tags (comma separated)</label>
                                <input type="text" className="form-input" placeholder="e.g. wheat, rabi, irrigation" value={newQ.tags} onChange={(e) => setNewQ({ ...newQ, tags: e.target.value })} />
                            </div>
                            <button type="submit" className="btn-primary" style={{ width: '100%' }}>Post Question →</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
