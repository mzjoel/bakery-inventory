const express = require('express')
const router = express.Router();
const DeliveryController = require('../controllers/DeliveryController');

router.get('/delivery-records', DeliveryController.findAllDelivery);
router.post('/delivery', DeliveryController.createDelivery);
router.put('/delivered/:deliveryId/:status', DeliveryController.updateDeliveryStatus)

module.exports = router;