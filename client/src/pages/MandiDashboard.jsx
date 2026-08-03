import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import API from '../services/api';

export default function MandiDashboard() {
    const [districts, setDistricts] = useState([]);
    const [mandiCrops, setMandiCrops] = useState([]);
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedCrop, setSelectedCrop] = useState('');
    const [trendData, setTrendData] = useState(null);
    const [allPrices, setAllPrices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDistricts();
        fetchAllPrices();
    }, []);

    useEffect(() => {
        if (selectedDistrict) fetchMandiCrops();
    }, [selectedDistrict]);

    useEffect(() => {
        if (selectedDistrict && selectedCrop) fetchTrend();
    }, [selectedDistrict, selectedCrop]);

    const fetchDistricts = async () => {
        try {
            const res = await API.get('/mandi/districts');
            setDistricts(res.data);
            if (res.data.length > 0) setSelectedDistrict(res.data[0]);
        } catch (err) { console.error(err); }
    };

    const fetchMandiCrops = async () => {
        try {
            const res = await API.get('/mandi/crops', { params: { district: selectedDistrict } });
            setMandiCrops(res.data);
            if (res.data.length > 0) setSelectedCrop(res.data[0]);
        } catch (err) { console.error(err); }
    };

    const fetchTrend = async () => {
        try {
            const res = await API.get('/mandi/trend', { params: { district: selectedDistrict, crop: selectedCrop } });
            setTrendData(res.data);
        } catch (err) { console.error(err); }
    };

    const fetchAllPrices = async () => {
        try {
            const res = await API.get('/mandi');
            // Group by crop+district, take latest
            const latest = {};
            res.data.forEach(p => {
                const key = `${p.crop}-${p.district}`;
                if (!latest[key] || new Date(p.date) > new Date(latest[key].date)) {
                    latest[key] = p;
                }
            });
            setAllPrices(Object.values(latest).slice(0, 12));
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const chartData = trendData?.trend?.map(t => ({
        date: new Date(t.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
        price: t.price
    })) || [];

    return (
        <div className="animate-fade-in">
            {/* Filters */}
            <div className="search-bar">
                <select className="filter-select" value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)}>
                    <option value="">Select District</option>
                    {districts.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <select className="filter-select" value={selectedCrop} onChange={(e) => setSelectedCrop(e.target.value)}>
                    <option value="">Select Crop</option>
                    {mandiCrops.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>

            {/* Trend Section */}
            {trendData && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem', marginBottom: '2rem', alignItems: 'stretch' }}>
                    <div className="chart-container">
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                            📈 7-Day Price Trend — {selectedCrop} in {selectedDistrict}
                        </h3>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Prices in ₹ per quintal</p>
                        <ResponsiveContainer width="100%" height={260}>
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2E7D32" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#2E7D32" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="date" fontSize={12} tick={{ fill: '#718096' }} />
                                <YAxis fontSize={12} tick={{ fill: '#718096' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 14px rgba(0,0,0,0.08)' }}
                                    formatter={(value) => [`₹${value.toLocaleString()}`, 'Price']}
                                />
                                <Area type="monotone" dataKey="price" stroke="#2E7D32" strokeWidth={3} fill="url(#colorPrice)" dot={{ fill: '#2E7D32', r: 5 }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div className="glass-card" style={{ padding: '1.25rem', flex: 1 }}>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Latest Price</p>
                            <p style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-dark)' }}>
                                ₹{trendData.latestPrice?.toLocaleString()}
                            </p>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>per quintal</p>
                        </div>
                        <div className="glass-card" style={{ padding: '1.25rem', flex: 1 }}>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Previous Price</p>
                            <p style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                                ₹{trendData.previousPrice?.toLocaleString()}
                            </p>
                        </div>
                        <div className="glass-card" style={{ padding: '1.25rem', flex: 1 }}>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Change</p>
                            <div className={`price-change ${trendData.change >= 0 ? 'up' : 'down'}`} style={{ fontSize: '1.1rem' }}>
                                {trendData.change >= 0 ? '▲' : '▼'} {Math.abs(trendData.change)}%
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* All Latest Prices Grid */}
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem' }}>📋 Latest Market Prices</h3>
            {loading ? (
                <div className="loading-spinner"><div className="spinner"></div></div>
            ) : (
                <div className="grid-4">
                    {allPrices.map((p, i) => (
                        <div key={i} className={`price-card animate-fade-in-up stagger-${(i % 5) + 1}`}
                            style={{ cursor: 'pointer' }}
                            onClick={() => { setSelectedDistrict(p.district); setSelectedCrop(p.crop); }}>
                            <div className="price-card-header">
                                <h4>{p.crop}</h4>
                                <span className="badge badge-blue">{p.district}</span>
                            </div>
                            <div className="price-value">₹{p.price?.toLocaleString()}</div>
                            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                                {new Date(p.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
