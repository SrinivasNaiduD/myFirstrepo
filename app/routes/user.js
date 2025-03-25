const express = require('express')
const UserController = require('../controllers/user');
const OrderController = require('../controllers/payment')
const router = express.Router();
router.post('/findAll', UserController.findAll);
router.post('/findOne', UserController.findOne);
router.post('/create', UserController.create);
router.post('/update', UserController.update);
router.post('/destroy', UserController.destroy);
///////////////////////////rpay////////////////////////
router.post('/createCustomer', OrderController.createCustomer);
router.post('/createOrder', OrderController.createOrder);
router.post('/makePayment', OrderController.makePayment);
router.post('/refundPayment', OrderController.refundPayment);

module.exports = router

