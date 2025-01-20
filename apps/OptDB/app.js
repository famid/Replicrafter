const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();


// Import Prometheus client
const promClient = require('prom-client');

// Setup Prometheus metrics registry
const register = new promClient.Registry();
promClient.collectDefaultMetrics({ register });

const httpRequestDuration = new promClient.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.1, 0.2, 0.5, 1, 2, 5],
});
register.registerMetric(httpRequestDuration);

const userRouter = require('./src/routes/userRoutes');
const orderRouter = require('./src/routes/orderRoutes');

// ===========end prometheus metrics================

const app = express();
app.use(express.json());

// Middleware to measure request duration
app.use((req, res, next) => {
    const end = httpRequestDuration.startTimer({
        method: req.method,
        route: req.path,
    });
    res.on('finish', () => {
        end({ status_code: res.statusCode });
    });
    next();
});

// Expose Prometheus metrics at /metrics
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Root route for testing
app.get('/', (req, res) => {
    res.send('Welcome to the API');
});


// API routes
app.use('/users', userRouter);
app.use('/orders', orderRouter);

// Server setup
const port = process.env.PORT || 8020;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});