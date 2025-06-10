const express = require('express')

const router = express.Router();

const ProductionController = require('../controllers/ProductionController');

router.post('/production/request', ProductionController.requestProduction);
router.post('/production/process', ProductionController.processProduction);
router.post('/production/complete', ProductionController.completeProduction);
router.get('/productions', ProductionController.getAllProductions);  



module.exports = router