/**
 * Global error handler middleware.
 * Handles Prisma errors, database connection issues, and general server errors.
 */
function errorHandler(err, req, res, next) {
    // Log error for debugging
    console.error('Error:', err);

    // Handle Prisma database connection errors
    if (err.name === 'PrismaClientInitializationError') {
        return res.status(503).json({
            error: 'Database connection failed. Please check your database configuration.'
        });
    }

    // Handle Prisma unique constraint violations (should be caught in controllers, but safety net)
    if (err.code === 'P2002') {
        return res.status(409).json({ error: 'Custom code already taken' });
    }

    // Handle Prisma record not found (should be caught in controllers, but safety net)
    if (err.code === 'P2025') {
        return res.status(404).json({ error: 'Link not found' });
    }

    // Default to 500 for unhandled errors
    res.status(500).json({ error: 'Internal server error' });
}

module.exports = errorHandler;


