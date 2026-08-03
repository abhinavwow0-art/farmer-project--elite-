const mongoose = require('mongoose');

const transportRequestSchema = new mongoose.Schema({
    farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    farmerName: { type: String, required: true },
    crop: { type: String, required: true, trim: true },
    quantity: { type: String, required: true },
    location: { type: String, required: true, trim: true },
    destination: { type: String, default: '' },
    status: { type: String, enum: ['Pending', 'Accepted', 'In Transit', 'Completed'], default: 'Pending' },
    transporterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('TransportRequest', transportRequestSchema);
