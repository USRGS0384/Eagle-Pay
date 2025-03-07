import fs from 'fs';
import path from 'path';

// Log file location
const logFilePath = path.join(process.cwd(), 'logs', 'server.log');

// Ensure logs directory exists
if (!fs.existsSync(path.dirname(logFilePath))) {
    fs.mkdirSync(path.dirname(logFilePath), { recursive: true });
}

const loggerMiddleware = (req, res, next) => {
    const logEntry = `[${new Date().toISOString()}] ${req.method} ${req.url} - ${req.ip}\n`;

    // Append log entry to the file
    fs.appendFile(logFilePath, logEntry, (err) => {
        if (err) {
            console.error("Logging error:", err);
        }
    });

    console.log(logEntry.trim());
    next();
};

// ✅ Correctly export the middleware
export { loggerMiddleware };

