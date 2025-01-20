const express = require('express');
const User = require('../models/user');

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hello from user routes');
});

// Fetch all users without any filters (slow query)
router.get('/all', async (req, res) => {
    try {
        console.time('Fetch All Users'); // Start timing
        const users = await User.find();
        console.timeEnd('Fetch All Users'); // End timing
        res.status(200).json({
            success: true,
            data: users,
            statusCode: 200,
            message: 'All users fetched successfully',
        });
    } catch (err) {
        res.status(500).json({ error: err.message || 'Error fetching all users' });
    }
});

// Fetch users by name (unoptimized query)
router.get('/by-name', async (req, res) => {
    try {
        const { name } = req.query;
        console.time('Fetch Users by Name'); // Start timing
        const users = await User.find({ name }); // No index on name
        console.timeEnd('Fetch Users by Name'); // End timing
        res.json({
            success: true,
            data: users,
            statusCode: 200,
            message: 'All users fetched by name successfully',
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Fetch and sort users by age (unoptimized sorting)
router.get('/sorted-by-age', async (req, res) => {
    try {
        console.time('Sort Users by Age'); // Start timing
        const users = await User.find().sort({ age: 1 }); // No index on age
        console.timeEnd('Sort Users by Age'); // End timing
        res.json({
            success: true,
            data: users,
            statusCode: 200,
            message: 'All users fetched sorted by age successfully',
        });
    } catch (err) {
        res.status(500).json({ error: 'Error sorting users by age' });
    }
});


module.exports = router;