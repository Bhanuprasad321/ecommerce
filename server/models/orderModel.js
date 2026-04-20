const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, default: 1 },
        price: { type: Number },
      },
    ],
    shippingAddress: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      zip: { type: String },
    },
    paymentStatus: {
      type: String,
      required: true,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: ["processing", "shipped", "delivered", "cancelled"],
      default: "processing",
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    stripePaymentId: {
      type: String,
    },
  },
  { timestamps: true },
);

const Order = mongoose.model("Order",orderSchema);
module.exports = Order;