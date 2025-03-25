const Razorpay = require('razorpay');
const CustomerSchema = require('../model/customer');
const OrderSchema = require('../model/order');
const PaymentSchema = require('../model/payment');
const RefundSchema = require('../model/refund');
const razorpay = new Razorpay({
        key_id: 'rzp_test_1d8Uz0Rqn101Hj',
        key_secret: 'DREkz3zAKcStej7cslGOdYLy',
});

exports.createCustomer = async (req, res) => {
    try {
        const { name, email, contact } = req.body;
        if(!name || !email || !contact){
            return res.status(404).json({status:false,message:'Required All Fields'});
        }
        const customer = new CustomerSchema({
            name,
            email,
            contact
        });
        const savedCustomer = await customer.save();
        return res.status(400).json({ status: true, message: "Customer Created Successfully",savedCustomer });
    } catch (error) {
        console.log("error message==>",error);
        res.status(500).json({ error: error.message });
    }
};

exports.createOrder = async (req, res) => {
    try {
        const { amount, currency, receipt, notes } = req.body;
        if(!amount || !currency || !receipt || !notes){
            return res.status(404).json({status:false, message:"All Fields Are Required"});
        }
        const order = new OrderSchema({
            amount,
            currency,
            receipt,
            notes
        });
        const savedOrder = await order.save();
        return res.status(400).json({ status: true, message: "Order Created Successfully",savedOrder });
    } catch (error) {
        console.log("error message==>",error);
        res.status(500).json({ error: error.message });
    }
};



exports.makePayment = async (req, res) => {
    try {
        const { order_id, amount, currency, payment_capture } = req.body;
        if(!order_id || !amount || !currency || !payment_capture){
            return res.status(404).json({status:false,message:"All Fields Are Required"})
        }
        const payment = new PaymentSchema({
            order_id,
            amount,
            currency,
            payment_capture
        });
        const savedPayment = await payment.save();
       return res.status(200).json({ status: true, message: 'Payment done successfully', savedPayment });
    } catch (error) {
        console.log("error message==>",error);
        res.status(500).json({ error: error.message });
    }
};

exports.refundPayment = async (req, res) => {
    try {
        const { payment_id, amount } = req.body;
        if (!payment_id || !amount) {
            return res.status(400).json({ error: 'Payment ID and amount are required' });
        }
        const refund = new RefundSchema({
            payment_id,
            amount
        });
        const savedRefund = await refund.save();
       return res.status(200).json({ status: true, message: 'Refund received successfully', savedRefund });
    } catch (error) {
        console.log("error message==>",error);
        res.status(500).json({ error: error.message });
    }
};

