const Review = require('../models/review');

/**
 * Aggregates top-rated products based on average rating.
 * Optimizes for early filtering, minimal projection, and efficient grouping.
 * @param {Object} [options] - Optional filters e.g., { minReviews: Number, minRating: Number }
 * @returns {Promise<Array>} Array of { _id: productId, avgRating, reviewCount }
 */
async function getTopRatedProducts({ minReviews = 20, minRating = 4.0, limit = 10 } = {}) {
    try {
        // Early $match to reduce scanned docs
        const pipeline = [
            {
                // Example: only consider reviews for products in a certain category if needed (expandable)
                // $match: { rating: { $gte: 4 } }
            },
            {
                $group: {
                    _id: '$product',
                    avgRating: { $avg: '$rating' },
                    reviewCount: { $sum: 1 }
                }
            },
            {
                $match: {
                    avgRating: { $gte: minRating },
                    reviewCount: { $gte: minReviews }
                }
            },
            {
                $sort: { avgRating: -1, reviewCount: -1 } // Highest average, then most reviews
            },
            {
                $limit: limit
            }
        ];
        // Remove empty initial $match if no extra filter
        if (pipeline[0].$match && Object.keys(pipeline[0].$match).length === 0) {
            pipeline.shift();
        }

        // Only include relevant output fields ($project)
        pipeline.push({
            $project: {
                _id: 1,
                avgRating: { $round: ['$avgRating', 2] },
                reviewCount: 1
            }
        });

        // Use lean() for better memory/perf if returning raw results
        const aggregation = Review.aggregate(pipeline).allowDiskUse(true);
        const results = await aggregation.exec();
        return results;
    } catch (error) {
        // Robust error propagation
        throw new Error(`Review aggregation failed: ${error.message}`);
    }
}

module.exports = {
    getTopRatedProducts
};
