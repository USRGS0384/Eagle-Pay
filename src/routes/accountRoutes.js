import express from "express";

const router = express.Router();

// Define account-related routes here
router.get("/", (req, res) => {
    res.send("Accounts API");
});

export default router;

