import rateLimit from 'express-rate-limit';

// Set up rate limiter (100 requests per 15 minutes per IP)
const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `windowMs`
    message: "Too many requests from this IP, please try again later.",
    headers: true, // Send rate limit info in headers
});

// ✅ Correctly export the middleware
export { rateLimiter };

