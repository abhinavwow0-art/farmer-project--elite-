const TransportRequest = require('../models/TransportRequest');

// GET /api/transport
exports.getTransportRequests = async (req, res) => {
    try {
        let query = {};
        if (req.user.role === 'farmer') {
            query.farmerId = req.user._id;
        }
        const requests = await TransportRequest.find(query)
            .populate('transporterId', 'name email')
            .sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST /api/transport
exports.createTransportRequest = async (req, res) => {
    try {
        const { crop, quantity, location, destination } = req.body;
        const request = await TransportRequest.create({
            farmerId: req.user._id,
            farmerName: req.user.name,
            crop,
            quantity,
            location,
            destination: destination || ''
        });
        res.status(201).json(request);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// PATCH /api/transport/:id/status
exports.updateTransportStatus = async (req, res) => {
    try {
        const request = await TransportRequest.findById(req.params.id);
        if (!request) return res.status(404).json({ message: 'Request not found' });

        const { status } = req.body;
        const validStatuses = ['Pending', 'Accepted', 'In Transit', 'Completed'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        request.status = status;
        if (status === 'Accepted' && req.user.role === 'transporter') {
            request.transporterId = req.user._id;
        }
        await request.save();
        res.json(request);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
