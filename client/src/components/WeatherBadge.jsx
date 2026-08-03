import { useState, useEffect } from 'react';
import axios from 'axios';

export default function WeatherBadge() {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWeather = async (city = 'Delhi') => {
            try {
                // Using wttr.in for a simple, no-key JSON weather response
                const res = await axios.get(`https://wttr.in/${city}?format=j1`);
                const current = res.data.current_condition[0];
                setWeather({
                    temp: current.temp_C,
                    desc: current.weatherDesc[0].value,
                    city: res.data.nearest_area[0].areaName[0].value
                });
            } catch (err) {
                console.error('Weather Fetch Error:', err);
            } finally {
                setLoading(false);
            }
        };

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    try {
                        // Reverse geocoding hint or just use lat/lon with wttr.in
                        fetchWeather(`${latitude},${longitude}`);
                    } catch (err) {
                        fetchWeather(); // Fallback
                    }
                },
                () => fetchWeather() // Default to Delhi if location denied
            );
        } else {
            fetchWeather();
        }
    }, []);

    if (loading) return (
        <div className="weather-badge loading">
            <div className="shimmer-line"></div>
        </div>
    );

    if (!weather) return null;

    return (
        <div className="weather-badge animate-fade-in">
            <div className="weather-icon">
                {weather.temp > 25 ? '☀️' : weather.temp > 15 ? '⛅' : '🌦️'}
            </div>
            <div className="weather-info">
                <span className="weather-temp">{weather.temp}°C</span>
                <span className="weather-city">{weather.city}</span>
            </div>
        </div>
    );
}
