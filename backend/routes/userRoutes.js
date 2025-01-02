const express = require("express");
const {
  registerUser,
  authUser,
  allUsers,
} = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Route to fetch all users (protected)
router.get("/", protect, allUsers);

// Route to register a new user
router.post("/", registerUser);

// Route to log in a user
router.post("/login", authUser);

module.exports = router;
