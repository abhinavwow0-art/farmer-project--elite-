const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    season: { type: String, required: true, enum: ['Kharif', 'Rabi', 'Zaid', 'All Season'] },
    soilType: { type: String, required: true },
    irrigation: { type: String, required: true },
    fertilizerSchedule: { type: String, required: true },
    pests: [{ type: String }],
    imageUrl: { type: String, default: '' },
    description: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Crop', cropSchema);
