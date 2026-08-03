import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
    const [form, setForm] = useState({ name: '', email: '', password: '', role: 'farmer' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (form.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        setLoading(true);
        try {
            await register(form.name, form.email, form.password, form.role);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card animate-fade-in-up">
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <span style={{ fontSize: '2.5rem' }}>🌾</span>
                        <h2 style={{ marginTop: '0.5rem' }}>Join FarmIQ</h2>
                    </Link>
                    <p className="auth-subtitle">Create your account and start growing smarter</p>
                </div>

                {error && <div className="alert alert-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input type="text" name="name" className="form-input" placeholder="Enter your name" value={form.name} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input type="email" name="email" className="form-input" placeholder="Enter your email" value={form.email} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input type="password" name="password" className="form-input" placeholder="Min 6 characters" value={form.password} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">I am a</label>
                        <select name="role" className="filter-select" style={{ width: '100%' }} value={form.role} onChange={handleChange}>
                            <option value="farmer">🌾 Farmer</option>
                            <option value="transporter">🚛 Transporter</option>
                            <option value="expert">👨‍🔬 Agricultural Expert</option>
                        </select>
                    </div>
                    <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
                        {loading ? 'Creating Account...' : 'Create Account →'}
                    </button>
                </form>

                <div className="auth-link">
                    Already have an account? <Link to="/login">Sign in</Link>
                </div>
            </div>
        </div>
    );
}
