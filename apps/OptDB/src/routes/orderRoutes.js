const express = require('express');
const Order = require('../models/order');

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hello from order routes');
});

// Fetch all orders without any filters (slow query)
router.get('/all', async (req, res) => {
    try {
        console.time('Fetch All Orders'); // Start timing
        const orders = await Order.find(); // Intentionally slow
        console.timeEnd('Fetch All Orders'); // Start timing
        res.json({
            success: true,
            data: orders,
            statusCode: 200,
            message: 'All orders fetched successfully',
        });
    } catch (err) {
        res.status(500).json({ error: 'Error fetching all orders' });
    }
});

// Fetch orders by product name (unoptimized query)
router.get('/by-product', async (req, res) => {
    try {
        const { product } = req.query;
        console.time('Fetch Orders by Product'); // Start timing
        const orders = await Order.find({ product }); // No index on product
        console.timeEnd('Fetch Orders by Product'); // Start timing
        res.status(200).json({
            success: true,
            data: orders,
            statusCode: 200,
            message: 'All orders fetched by product successfully',
        });
    } catch (err) {
        res.status(500).json({ error: 'Error fetching orders by product' });
    }
});

// Fetch and sort orders by quantity (unoptimized sorting)
router.get('/sorted-by-quantity', async (req, res) => {
    try {
        console.time('Sort Orders by Quantity'); // Start timing
        const orders = await Order.find().sort({ quantity: 1 }); // No index on quantity
        console.time('Sort Orders by Quantity'); // Start timing
        res.status(200).json({
            success: true,
            data: orders,
            statusCode: 200,
            message: 'All orders fetched successfully sorted by quantity.',
        });
    } catch (err) {
        res.status(500).json({ error: 'Error sorting orders by quantity' });
    }
});

module.exports = router;