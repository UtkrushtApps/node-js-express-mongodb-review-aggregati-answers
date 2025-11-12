const express = require('express');
const connectToDatabase = require('./db/connection');
const reviewService = require('./services/reviewService');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

app.get('/reviews/top-rated', async (req, res) => {
    try {
        const { minReviews, minRating, limit } = req.query;
        const parsedMinReviews = minReviews !== undefined ? parseInt(minReviews, 10) : undefined;
        const parsedMinRating = minRating !== undefined ? parseFloat(minRating) : undefined;
        const parsedLimit = limit !== undefined ? parseInt(limit, 10) : undefined;
        const results = await reviewService.getTopRatedProducts({
            minReviews: parsedMinReviews,
            minRating: parsedMinRating,
            limit: parsedLimit
        });
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const startServer = async () => {
    await connectToDatabase();
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

// Prevent accidental server start in test/import scripts
if (require.main === module) {
    startServer();
}
