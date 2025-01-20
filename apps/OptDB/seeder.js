const mongoose = require('mongoose');
const User = require('./src/models/user');
const Order = require('./src/models/order');
require('dotenv').config();

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB for seeding'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Helper function to generate random data
const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

const seedUsers = async (count) => {
    const names = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank'];
    const users = [];
    for (let i = 0; i < count; i++) {
        users.push({
            name: getRandomElement(names),
            email: `user${i}@example.com`,
            age: Math.floor(Math.random() * 60) + 18, // Age between 18 and 77
        });
    }
    await User.insertMany(users);
    console.log(`${count} users seeded successfully.`);
};

const seedOrders = async (count) => {
    const products = ['Laptop', 'Phone', 'Tablet', 'Headphones', 'Monitor'];
    const orders = [];
    const userIds = await User.find().select('_id').limit(1000); // Sample user IDs
    for (let i = 0; i < count; i++) {
        orders.push({
            userId: getRandomElement(userIds)._id,
            product: getRandomElement(products),
            quantity: Math.floor(Math.random() * 10) + 1, // Quantity between 1 and 10
            status: 'pending',
        });
    }
    await Order.insertMany(orders);
    console.log(`${count} orders seeded successfully.`);
};

// Run the seeding process
const seedDatabase = async () => {
    try {
        await mongoose.connection.dropDatabase(); // Clear the database
        console.log('Database cleared.');

        await seedUsers(100000); // Seed 100,000 users
        await seedOrders(1000000); // Seed 1,000,000 orders
    } catch (err) {
        console.error('Error during seeding:', err);
    } finally {
        mongoose.disconnect();
    }
};

seedDatabase();
