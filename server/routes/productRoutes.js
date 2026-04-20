const express = require("express");
const { upload } = require("../config/cloudinary");
const route = express.Router();

const productController = require("../controllers/productController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

route.get("/", productController.getAllProducts);
route.get("/:id", productController.getProductById);
route.post(
  "/",
  protect,
  adminOnly,
  upload.array("images", 4),
  productController.createProduct,
);
route.put("/:id", protect, adminOnly, productController.updateProduct);
route.delete("/:id", protect, adminOnly, productController.deleteProduct);

module.exports = route;
