const express = require("express");
const route = express.Router();

const cartController = require("../controllers/cartController");
const { protect } = require("../middleware/authMiddleware");
route.get("/", protect, cartController.getCart);
route.post("/:id", protect, cartController.addToCart);
route.put("/:id", protect, cartController.updateCartItem);
route.delete("/", protect, cartController.clearCart);
route.delete("/:id", protect, cartController.removeCartItem);

module.exports = route;
