const express = require('express');
const router = express.Router();

const OrderController = require('../controller/orders')
const checkAuth = require('../middleware/check-auth');

// Middleware
// To get all orders
router.get('/', checkAuth, OrderController.orders_get_all);

// To create Order
router.post('/', checkAuth, OrderController.orders_create);

// To get specific Order
router.get('/:orderId', checkAuth, OrderController.orders_get_single);

// To delete Order
router.delete('/:orderId', checkAuth, OrderController.order_delete);

// To export Router
module.exports = router;