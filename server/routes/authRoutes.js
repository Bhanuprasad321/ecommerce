const express = require("express");
const route = express.Router();
const { registerUser, loginUser } = require("../controllers/authController");

route.post("/register", registerUser);
route.post("/login", loginUser);

const { protect, adminOnly } = require("../middleware/authMiddleware");

// temporary test routes
route.get("/test-protected", protect, (req, res) => {
  res.json({ message: "Access granted", user: req.user });
});

route.get("/test-admin", protect, adminOnly, (req, res) => {
  res.json({ message: "Admin access granted" });
});

module.exports = route;
