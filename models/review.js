const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
        index: true // Support queries by product
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
        index: true // Support queries by rating
    },
    text: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true // Support time-based queries if needed
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Compound index to optimize aggregation pipeline by product & rating queries
reviewSchema.index({ product: 1, rating: 1 });

// Ensure _id and product compound for fast $group by product
reviewSchema.index({ product: 1, createdAt: -1 });

module.exports = mongoose.model('Review', reviewSchema);
