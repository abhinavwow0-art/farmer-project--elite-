import { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function TransportPage() {
    const { user } = useAuth();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ crop: '', quantity: '', location: '', destination: '' });

    useEffect(() => { fetchRequests(); }, []);

    const fetchRequests = async () => {
        try {
            const res = await API.get('/transport');
            setRequests(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post('/transport', form);
            setShowForm(false);
            setForm({ crop: '', quantity: '', location: '', destination: '' });
            fetchRequests();
        } catch (err) { console.error(err); }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await API.patch(`/transport/${id}/status`, { status });
            fetchRequests();
        } catch (err) { console.error(err); }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'Pending': return 'status-pending';
            case 'Accepted': return 'status-accepted';
            case 'In Transit': return 'status-in-transit';
            case 'Completed': return 'status-completed';
            default: return '';
        }
    };

    const isFarmer = user?.role === 'farmer';
    const isTransporter = user?.role === 'transporter';

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        {isFarmer ? 'Request transport for your crops and track pickup status.' : 'View and manage farmer transport requests.'}
                    </p>
                </div>
                {isFarmer && (
                    <button className="btn-primary" onClick={() => setShowForm(true)}>
                        🚛 Request Pickup
                    </button>
                )}
            </div>

            {loading ? (
                <div className="loading-spinner"><div className="spinner"></div></div>
            ) : requests.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">🚛</div>
                    <h3>No transport requests</h3>
                    <p>{isFarmer ? 'Create your first pickup request!' : 'No requests available at the moment.'}</p>
                </div>
            ) : (
                <div className="grid-3">
                    {requests.map((req, i) => (
                        <div key={req._id} className={`transport-card animate-fade-in-up stagger-${(i % 5) + 1}`}>
                            <div className="transport-card-header">
                                <h4 style={{ fontWeight: 700, fontSize: '1rem' }}>{req.crop}</h4>
                                <span className={`badge ${getStatusClass(req.status)}`}>{req.status}</span>
                            </div>

                            <div className="transport-details">
                                <div>
                                    <div className="transport-detail-label">Farmer</div>
                                    <div className="transport-detail-value">{req.farmerName}</div>
                                </div>
                                <div>
                                    <div className="transport-detail-label">Quantity</div>
                                    <div className="transport-detail-value">{req.quantity}</div>
                                </div>
                                <div>
                                    <div className="transport-detail-label">Pickup</div>
                                    <div className="transport-detail-value">{req.location}</div>
                                </div>
                                <div>
                                    <div className="transport-detail-label">Destination</div>
                                    <div className="transport-detail-value">{req.destination || '—'}</div>
                                </div>
                            </div>

                            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
                                📅 {new Date(req.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </p>

                            {/* Transporter Actions */}
                            {isTransporter && req.status !== 'Completed' && (
                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                                    {req.status === 'Pending' && (
                                        <button className="btn-primary btn-sm" onClick={() => handleStatusUpdate(req._id, 'Accepted')}>
                                            ✅ Accept
                                        </button>
                                    )}
                                    {req.status === 'Accepted' && (
                                        <button className="btn-primary btn-sm" style={{ background: 'linear-gradient(135deg, #6A1B9A, #9C27B0)' }}
                                            onClick={() => handleStatusUpdate(req._id, 'In Transit')}>
                                            🚚 In Transit
                                        </button>
                                    )}
                                    {req.status === 'In Transit' && (
                                        <button className="btn-primary btn-sm" style={{ background: 'linear-gradient(135deg, #1B5E20, #2E7D32)' }}
                                            onClick={() => handleStatusUpdate(req._id, 'Completed')}>
                                            ✔ Complete
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* New Request Modal */}
            {showForm && (
                <div className="modal-overlay" onClick={() => setShowForm(false)}>
                    <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>🚛 Request Transport</h2>
                            <button className="modal-close" onClick={() => setShowForm(false)}>×</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Crop Name</label>
                                <input type="text" className="form-input" placeholder="e.g. Tomato, Onion" value={form.crop} onChange={(e) => setForm({ ...form, crop: e.target.value })} required />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Quantity</label>
                                    <input type="text" className="form-input" placeholder="e.g. 50 quintals" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Pickup Location</label>
                                    <input type="text" className="form-input" placeholder="Village / Town" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Destination (Optional)</label>
                                <input type="text" className="form-input" placeholder="Mandi / Warehouse" value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} />
                            </div>
                            <button type="submit" className="btn-primary" style={{ width: '100%' }}>Submit Request →</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
