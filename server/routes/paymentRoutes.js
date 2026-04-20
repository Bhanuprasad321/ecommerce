const express = require("express");
const route = express.Router();
const paymentController = require("../controllers/paymentController");
const { protect } = require("../middleware/authMiddleware");
route.post("/initiate", protect, paymentController.initiatePayment);
route.post("/success", paymentController.paymentSuccess);
module.exports = route;
