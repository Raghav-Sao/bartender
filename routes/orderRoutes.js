const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

/* POST /order - Place a drink order */
router.post('/order', orderController.placeOrder);

/* GET /served - List served orders */
router.get('/served', orderController.getServedOrders);

/* POST /config/prepTime - Set drink preparation time i*/
router.post('/config/prepTime', orderController.setPrepTime);

module.exports = router;

