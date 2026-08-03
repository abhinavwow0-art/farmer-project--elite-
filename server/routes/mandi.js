const express = require('express');
const router = express.Router();
const { getMandiPrices, getMandiTrend, getDistricts, getMandiCrops } = require('../controllers/mandiController');

router.get('/', getMandiPrices);
router.get('/trend', getMandiTrend);
router.get('/districts', getDistricts);
router.get('/crops', getMandiCrops);

module.exports = router;
