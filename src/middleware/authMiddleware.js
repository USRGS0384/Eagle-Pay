import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import dotenv from 'dotenv';

dotenv.config();

// ✅ Authentication Middleware
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access Denied. No token provided.' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid or expired token.' });
  }
};

// ✅ Protect Middleware
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ error: 'User not found.' });
      }

      next();
    } catch (error) {
      res.status(401).json({ error: 'Not authorized, token failed.' });
    }
  }

  if (!token) {
    return res.status(401).json({ error: 'Not authorized, no token.' });
  }
};
// ✅ Function to authenticate user
const authenticateUser = async (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password'); // Fetch user from DB
        if (!req.user) {
            return res.status(401).json({ message: "User not found" });
        }
        next();
    } catch (error) {
        res.status(403).json({ message: "Invalid or expired token" });
    }
};

// ✅ Export the function correctly
export { authMiddleware, protect, authenticateUser };

