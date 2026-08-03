const express = require('express');
const router = express.Router();
const { getTransportRequests, createTransportRequest, updateTransportStatus } = require('../controllers/transportController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getTransportRequests);
router.post('/', protect, createTransportRequest);
router.patch('/:id/status', protect, updateTransportStatus);

module.exports = router;
