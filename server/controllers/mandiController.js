const MandiPrice = require('../models/MandiPrice');

// GET /api/mandi
exports.getMandiPrices = async (req, res) => {
    try {
        const { district, crop } = req.query;
        let query = {};
        if (district) query.district = { $regex: district, $options: 'i' };
        if (crop) query.crop = { $regex: crop, $options: 'i' };

        const prices = await MandiPrice.find(query).sort({ date: -1 }).limit(100);
        res.json(prices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET /api/mandi/trend
exports.getMandiTrend = async (req, res) => {
    try {
        const { district, crop } = req.query;
        if (!district || !crop) {
            return res.status(400).json({ message: 'District and crop are required' });
        }

        const prices = await MandiPrice.find({
            district: { $regex: district, $options: 'i' },
            crop: { $regex: crop, $options: 'i' }
        }).sort({ date: -1 }).limit(7);

        if (prices.length === 0) {
            return res.json({ trend: [], latestPrice: 0, previousPrice: 0, change: 0 });
        }

        const latestPrice = prices[0].price;
        const previousPrice = prices.length > 1 ? prices[1].price : latestPrice;
        const change = previousPrice > 0
            ? (((latestPrice - previousPrice) / previousPrice) * 100).toFixed(2)
            : 0;

        res.json({
            trend: prices.reverse(),
            latestPrice,
            previousPrice,
            change: parseFloat(change)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET /api/mandi/districts
exports.getDistricts = async (req, res) => {
    try {
        const districts = await MandiPrice.distinct('district');
        res.json(districts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET /api/mandi/crops
exports.getMandiCrops = async (req, res) => {
    try {
        const { district } = req.query;
        let query = {};
        if (district) query.district = district;
        const crops = await MandiPrice.distinct('crop', query);
        res.json(crops);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
