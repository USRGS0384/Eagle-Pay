// ✅ Standard Error Middleware
export const errorMiddleware = (err, req, res, next) => {
    console.error(err.stack);

    const statusCode = res.statusCode === 200 ? 500 : res.statusCode; // Set default to 500 if not set
    res.status(statusCode).json({
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'production' ? null : err.stack, // Hide stack in production
    });
};
// ✅ Standard Error Middleware
export const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    const statusCode = res.statusCode === 200 ? 500 : res.statusCode; // Default to 500 if not set
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'production' ? null : err.stack, // Hide stack in production
    });
};
