import { useState, useEffect } from 'react';
import API from '../services/api';

export default function CropIntelligence() {
    const [crops, setCrops] = useState([]);
    const [search, setSearch] = useState('');
    const [seasonFilter, setSeasonFilter] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCrops();
    }, [search, seasonFilter]);

    const fetchCrops = async () => {
        try {
            const params = {};
            if (search) params.search = search;
            if (seasonFilter) params.season = seasonFilter;
            const res = await API.get('/crops', { params });
            setCrops(res.data);
        } catch (err) {
            console.error('Failed to fetch crops:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="search-bar">
                <input
                    type="text"
                    className="form-input"
                    placeholder="🔍 Search crops by name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select className="filter-select" value={seasonFilter} onChange={(e) => setSeasonFilter(e.target.value)}>
                    <option value="">All Seasons</option>
                    <option value="Kharif">🌧️ Kharif</option>
                    <option value="Rabi">❄️ Rabi</option>
                    <option value="Zaid">☀️ Zaid</option>
                    <option value="All Season">🔄 All Season</option>
                </select>
            </div>

            {loading ? (
                <div className="loading-spinner"><div className="spinner"></div></div>
            ) : crops.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">🌾</div>
                    <h3>No crops found</h3>
                    <p>Try adjusting your search or filter criteria.</p>
                </div>
            ) : (
                <div className="grid-3">
                    {crops.map((crop, i) => (
                        <div key={crop._id} className={`crop-card animate-fade-in-up stagger-${(i % 5) + 1}`}>
                            <div className="crop-card-header">
                                <h3>{crop.name}</h3>
                                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                    <span className="badge badge-green">{crop.season}</span>
                                </div>
                            </div>
                            <div className="crop-card-body">
                                {crop.description && (
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', lineHeight: 1.6 }}>{crop.description}</p>
                                )}
                                <div className="crop-detail"><strong>🌍 Soil:</strong> <span>{crop.soilType}</span></div>
                                <div className="crop-detail"><strong>💧 Water:</strong> <span>{crop.irrigation}</span></div>
                                <div className="crop-detail"><strong>🧪 NPK:</strong> <span style={{ fontSize: '0.82rem' }}>{crop.fertilizerSchedule}</span></div>
                                {crop.pests && crop.pests.length > 0 && (
                                    <div style={{ marginTop: '0.75rem' }}>
                                        <strong style={{ fontSize: '0.85rem' }}>🐛 Common Pests:</strong>
                                        <div className="crop-pests" style={{ marginTop: '0.4rem' }}>
                                            {crop.pests.map((pest, j) => (
                                                <span key={j} className="badge badge-red">{pest}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
