const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getProfile, updateProfile } = require("../controllers/userController");

// GET /api/users/profile
router.get("/profile", authMiddleware, getProfile);

// PUT /api/users/profile
router.put("/profile", authMiddleware, updateProfile);

module.exports = router;
