const fraudDetectionMiddleware = (req, res, next) => {
    const { amount } = req.body;

    // Simple fraud detection: Flag transactions above a certain threshold
    const FRAUD_THRESHOLD = 10000; // Example: Flag transactions above $10,000

    if (amount && amount > FRAUD_THRESHOLD) {
        return res.status(403).json({
            success: false,
            message: "Transaction flagged as suspicious. Please verify with support."
        });
    }

    next();
};

// ✅ Correctly export the middleware
export { fraudDetectionMiddleware };

