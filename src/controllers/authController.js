import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const signup = async (req, res) => {
    try {
        const { name, email, phone, password, pin } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        // Hash Password & PIN
        const hashedPassword = await bcrypt.hash(password, 10);
        const hashedPin = await bcrypt.hash(pin, 10);

        // Create new user
        const newUser = new User({
            name,
            email,
            phone,
            password: hashedPassword,
            pin: hashedPin,
        });

        await newUser.save();

        // Generate JWT Token
        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });

        res.status(201).json({
            message: "User registered successfully",
            user: { name, email, phone },
            token
        });

    } catch (error) {
      next(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Compare Passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Generate JWT Token
        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });

        res.status(200).json({
            message: "Login successful",
            user: { name: user.name, email: user.email, phone: user.phone, role: user.role },
            token
        });

    } catch (error) {
      next(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
export const logout = async (req, res) => {
    try {
        // On the client side, the token should be removed (not stored)
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
      next(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
