const express = require("express");

const route = express.Router();
const { protect, adminOnly } = require("../middleware/authMiddleware");
const orderController = require("../controllers/orderController");

route.get("/", protect, orderController.getMyOrder);
route.get("/all", protect, adminOnly, orderController.getAllOrders);
route.get("/:id", protect, orderController.getOrderById);
route.post("/", protect, orderController.createOrder);
route.put("/:id", protect, adminOnly, orderController.updateOrderStatus);

module.exports = route;
