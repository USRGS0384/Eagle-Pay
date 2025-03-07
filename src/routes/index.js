import express from "express";
import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import transactionRoutes from "./transactionRoutes.js";
import institutionRoutes from "./institutionRoutes.js";
import accountRoutes from "./accountRoutes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/transactions", transactionRoutes);
router.use("/institutions", institutionRoutes);
router.use("/accounts", accountRoutes);

export default router;

