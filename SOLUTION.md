# Solution Steps

1. 1. Define the Review Mongoose schema (models/review.js) to include 'product', 'rating', 'text', timestamps, and utilize Mongoose's built-in indexing, including compound indexes to support queries grouping by 'product' and filtering by 'rating'.

2. 2. Add compound indexes on {product, rating} and {product, createdAt} in the schema to optimize the aggregation performance for queries grouping and filtering by product.

3. 3. Refactor and implement the aggregation logic (services/reviewService.js) to build the aggregation pipeline with early $match (if needed), efficient $group by product to compute avgRating and reviewCount, and apply later $match to filter on avgRating/reviewCount, followed by $sort, $limit, and a $project to output only needed fields.

4. 4. Ensure the service layer uses async/await with robust error handling: wrap all await calls in try/catch, propagate errors with descriptive context.

5. 5. In db/connection.js, implement a MongoDB connection function that uses connection pooling settings for scalability and error handling. Ensure connection errors are fatal.

6. 6. In index.js, call the database connect logic on server startup, and wire up the /reviews/top-rated endpoint to call the optimized reviewService, passing query parameters for minReviews, minRating, and limit, all fully type-checked and parsed.

7. 7. Ensure all aggregation and database operations use non-blocking, async control flow and avoid over-fetching (project only necessary fields).

8. 8. Confirm that the system references products (not embedding reviews in the product document) for scalability given high review volumes and stable query targeting via productId.

9. 9. Review anti-patterns: do not fetch entire review text arrays or unrelated fields; do not aggregate without supporting indexes or with inefficient groupings.

10. 10. Test the endpoint on a large data set to verify 2–4s response time and index-backed, non-blocking aggregation queries.

