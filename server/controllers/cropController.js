const Crop = require('../models/Crop');

// GET /api/crops
exports.getCrops = async (req, res) => {
    try {
        const { search, season, soilType } = req.query;
        let query = {};
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }
        if (season) {
            query.season = season;
        }
        if (soilType) {
            query.soilType = { $regex: soilType, $options: 'i' };
        }
        const crops = await Crop.find(query).sort({ name: 1 });
        res.json(crops);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET /api/crops/:id
exports.getCropById = async (req, res) => {
    try {
        const crop = await Crop.findById(req.params.id);
        if (!crop) return res.status(404).json({ message: 'Crop not found' });
        res.json(crop);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
