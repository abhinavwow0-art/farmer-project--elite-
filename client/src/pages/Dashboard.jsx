import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CropIntelligence from './CropIntelligence';
import MandiDashboard from './MandiDashboard';
import CommunityQA from './CommunityQA';
import TransportPage from './TransportPage';

const tabs = [
    { id: 'crops', label: '🌾 Crop Intelligence', icon: '🌾' },
    { id: 'mandi', label: '📊 Mandi Rates', icon: '📊' },
    { id: 'community', label: '💬 Community Q&A', icon: '💬' },
    { id: 'transport', label: '🚛 Transport', icon: '🚛' },
];

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState('crops');
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const renderTab = () => {
        switch (activeTab) {
            case 'crops': return <CropIntelligence />;
            case 'mandi': return <MandiDashboard />;
            case 'community': return <CommunityQA />;
            case 'transport': return <TransportPage />;
            default: return <CropIntelligence />;
        }
    };

    const getPageTitle = () => {
        switch (activeTab) {
            case 'crops': return { title: '🌾 Crop Intelligence', subtitle: 'Discover detailed crop guides, soil requirements, and pest management.' };
            case 'mandi': return { title: '📊 Live Mandi Rates', subtitle: 'Track real-time market prices and 7-day trends across districts.' };
            case 'community': return { title: '💬 Community Q&A', subtitle: 'Ask questions and connect with agricultural experts.' };
            case 'transport': return { title: '🚛 Transport Hub', subtitle: 'Manage crop transport requests and track deliveries.' };
            default: return { title: 'Dashboard', subtitle: '' };
        }
    };

    const page = getPageTitle();

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
            {/* Navbar */}
            <nav className="navbar">
                <Link to="/" className="navbar-brand">🌾 Farm<span>IQ</span></Link>
                <div className="nav-user">
                    <span className="badge badge-green" style={{ fontSize: '0.8rem', padding: '6px 14px' }}>
                        {user?.role === 'farmer' ? '🌾' : user?.role === 'transporter' ? '🚛' : '👨‍🔬'} {user?.role}
                    </span>
                    <div className="nav-avatar">{user?.name?.charAt(0)?.toUpperCase()}</div>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user?.name}</span>
                    <button onClick={handleLogout} className="btn-secondary btn-sm" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
                        Logout
                    </button>
                </div>
            </nav>

            <div className="page-container">
                {/* Page Header */}
                <div className="page-header animate-fade-in">
                    <h1 className="page-title">{page.title}</h1>
                    <p className="page-subtitle">{page.subtitle}</p>
                </div>

                {/* Tab Navigation */}
                <div className="dashboard-tabs animate-fade-in">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            className={`dashboard-tab ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                {renderTab()}
            </div>
        </div>
    );
}
