import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
    const { user } = useAuth();

    return (
        <div>
            {/* Navbar */}
            <nav className="navbar">
                <Link to="/" className="navbar-brand">🌾 Farm<span>IQ</span></Link>
                <ul className="nav-links">
                    <li><a href="#features" className="nav-link">Features</a></li>
                    <li><a href="#mandi-preview" className="nav-link">Mandi Rates</a></li>
                    <li><a href="#community-preview" className="nav-link">Community</a></li>
                </ul>
                <div className="hero-buttons">
                    {user ? (
                        <Link to="/dashboard" className="btn-primary btn-sm">Dashboard →</Link>
                    ) : (
                        <>
                            <Link to="/login" className="btn-secondary btn-sm">Login</Link>
                            <Link to="/register" className="btn-primary btn-sm">Get Started</Link>
                        </>
                    )}
                </div>
            </nav>

            {/* Hero */}
            <section className="hero">
                <div className="hero-content">
                    <div className="hero-text animate-fade-in-up">
                        <h1>
                            Empowering Farmers with <span className="highlight">Smart Intelligence</span>
                        </h1>
                        <p>
                            FarmIQ connects farmers with real-time mandi prices, expert crop guidance,
                            community knowledge, and transport solutions — all in one unified platform.
                        </p>
                        <div className="hero-buttons">
                            <Link to="/register" className="btn-primary">Start Free → </Link>
                            <a href="#features" className="btn-secondary">Explore Features</a>
                        </div>
                        <div className="hero-stats">
                            <div>
                                <div className="hero-stat-value">50K+</div>
                                <div className="hero-stat-label">Active Farmers</div>
                            </div>
                            <div>
                                <div className="hero-stat-value">200+</div>
                                <div className="hero-stat-label">Mandi Markets</div>
                            </div>
                            <div>
                                <div className="hero-stat-value">15+</div>
                                <div className="hero-stat-label">Crops Tracked</div>
                            </div>
                        </div>
                    </div>

                    <div className="hero-visual animate-fade-in-up stagger-2">
                        <div className="hero-illustration">
                            <div className="hero-card">
                                <div style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '1rem' }}>🌱</div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, textAlign: 'center', marginBottom: '0.5rem', color: '#1B5E20' }}>
                                    Today's Top Price
                                </h3>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: '#E8F5E9', borderRadius: '12px', marginBottom: '0.5rem' }}>
                                    <span style={{ fontWeight: 600 }}>Tomato — Nashik</span>
                                    <span style={{ fontWeight: 800, color: '#2E7D32' }}>₹3,450/q</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: '#FFF3E0', borderRadius: '12px', marginBottom: '0.5rem' }}>
                                    <span style={{ fontWeight: 600 }}>Onion — Pune</span>
                                    <span style={{ fontWeight: 800, color: '#E65100' }}>₹2,180/q</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: '#E3F2FD', borderRadius: '12px' }}>
                                    <span style={{ fontWeight: 600 }}>Wheat — Indore</span>
                                    <span style={{ fontWeight: 800, color: '#1565C0' }}>₹2,640/q</span>
                                </div>
                            </div>
                            <div className="hero-mini-card top-right">📈 +5.2% Today</div>
                            <div className="hero-mini-card bottom-left">🚛 3 Pickups Scheduled</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section id="features" className="features-section">
                <div className="section-header animate-fade-in-up">
                    <div className="section-tag">Platform Features</div>
                    <h2 className="section-title">Everything a Modern Farmer Needs</h2>
                    <p className="section-desc">
                        From crop intelligence to market prices, community support to logistics —
                        FarmIQ is your complete farming companion.
                    </p>
                </div>
                <div className="grid-4">
                    {[
                        { icon: '🌾', title: 'Crop Intelligence', desc: 'Detailed crop guides with soil, irrigation, fertilizer schedules and pest management strategies.', color: 'green' },
                        { icon: '📊', title: 'Live Mandi Rates', desc: 'Real-time price data from 200+ mandi markets with 7-day trends and smart price alerts.', color: 'orange' },
                        { icon: '💬', title: 'Community Q&A', desc: 'Ask questions, get expert answers. Connect with agricultural experts and fellow farmers.', color: 'blue' },
                        { icon: '🚛', title: 'Transport Booking', desc: 'Request crop pickup and delivery. Transporters can manage and track all shipments.', color: 'purple' },
                    ].map((f, i) => (
                        <div key={i} className={`feature-card animate-fade-in-up stagger-${i + 1}`}>
                            <div className={`feature-icon ${f.color}`}>{f.icon}</div>
                            <h3>{f.title}</h3>
                            <p>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Mandi Preview */}
            <section id="mandi-preview" className="preview-section">
                <div className="preview-content">
                    <div className="section-header animate-fade-in-up">
                        <div className="section-tag">Market Intelligence</div>
                        <h2 className="section-title">Stay Ahead of Market Trends</h2>
                        <p className="section-desc">Monitor live prices across major mandi markets and make informed selling decisions.</p>
                    </div>
                    <div className="grid-4 animate-fade-in-up stagger-2">
                        {[
                            { crop: 'Tomato', district: 'Nashik', price: '₹3,450/q', change: '+5.2%', up: true },
                            { crop: 'Onion', district: 'Pune', price: '₹2,180/q', change: '-2.1%', up: false },
                            { crop: 'Wheat', district: 'Indore', price: '₹2,640/q', change: '+1.8%', up: true },
                            { crop: 'Rice', district: 'Lucknow', price: '₹2,890/q', change: '+3.4%', up: true },
                        ].map((item, i) => (
                            <div key={i} className="price-card">
                                <div className="price-card-header">
                                    <h4>{item.crop}</h4>
                                    <span className="badge badge-green">{item.district}</span>
                                </div>
                                <div className="price-value">{item.price}</div>
                                <div className={`price-change ${item.up ? 'up' : 'down'}`}>
                                    {item.up ? '▲' : '▼'} {item.change}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Community Preview */}
            <section id="community-preview" className="features-section" style={{ background: '#f8fffe' }}>
                <div className="section-header animate-fade-in-up">
                    <div className="section-tag">Knowledge Hub</div>
                    <h2 className="section-title">Learn from the Community</h2>
                    <p className="section-desc">Farmers and experts sharing knowledge to grow together.</p>
                </div>
                <div className="grid-2 animate-fade-in-up stagger-2">
                    {[
                        { q: 'Best time to sow wheat in North India?', user: 'Rajesh Kumar', answers: 3, tags: ['wheat', 'rabi'] },
                        { q: 'How to manage Fall Army Worm in Maize?', user: 'Sunil Patil', answers: 5, tags: ['maize', 'pest'] },
                    ].map((item, i) => (
                        <div key={i} className="question-card">
                            <div className="question-meta">
                                <span style={{ fontWeight: 600, color: '#2E7D32' }}>{item.user}</span>
                                <span>•</span>
                                <span>{item.answers} answers</span>
                            </div>
                            <h3>{item.q}</h3>
                            <div className="question-tags">
                                {item.tags.map((t, j) => <span key={j} className="badge badge-green">{t}</span>)}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section style={{ background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 50%, #4CAF50 100%)', padding: '5rem 2rem', textAlign: 'center' }}>
                <div className="animate-fade-in-up" style={{ maxWidth: 600, margin: '0 auto' }}>
                    <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'white', marginBottom: '1rem' }}>
                        Ready to Transform Your Farming?
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.1rem', marginBottom: '2rem' }}>
                        Join thousands of farmers already using FarmIQ to make smarter decisions.
                    </p>
                    <Link to="/register" className="btn-primary" style={{ background: 'white', color: '#1B5E20', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
                        Create Free Account →
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-content">
                    <div className="footer-brand">
                        <h3>🌾 FarmIQ</h3>
                        <p>Empowering Indian farmers with technology-driven solutions for better crop management, market intelligence, and community support.</p>
                    </div>
                    <div className="footer-col">
                        <h4>Platform</h4>
                        <a href="#features">Crop Intelligence</a>
                        <a href="#mandi-preview">Mandi Rates</a>
                        <a href="#community-preview">Community Q&A</a>
                        <a href="#features">Transport</a>
                    </div>
                    <div className="footer-col">
                        <h4>Resources</h4>
                        <a href="#">Documentation</a>
                        <a href="#">API Reference</a>
                        <a href="#">Blog</a>
                        <a href="#">Help Center</a>
                    </div>
                    <div className="footer-col">
                        <h4>Company</h4>
                        <a href="#">About Us</a>
                        <a href="#">Careers</a>
                        <a href="#">Contact</a>
                        <a href="#">Privacy Policy</a>
                    </div>
                </div>
                <div className="footer-bottom">
                    © 2024 FarmIQ — Smart Farmer Intelligence Platform. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
