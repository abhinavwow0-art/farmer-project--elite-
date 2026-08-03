const mongoose = require('mongoose');

const mandiPriceSchema = new mongoose.Schema({
    district: { type: String, required: true, trim: true },
    crop: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    price: { type: Number, required: true }
}, { timestamps: true });

mandiPriceSchema.index({ district: 1, crop: 1, date: -1 });

module.exports = mongoose.model('MandiPrice', mandiPriceSchema);
