const mongoose = require('mongoose');

const connectToDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            maxPoolSize: 20, // Connection pool for concurrency
            minPoolSize: 3,
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB connected!');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
};

module.exports = connectToDatabase;
