const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const createOrder = async (req, res) => {
  try {
    const { shippingAddress } = req.body;
    if (!shippingAddress) {
      return res.status(400).json({ message: "shipping Address is required" });
    }
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Empty cart!" });
    }
    const data = {
      user: req.user._id,
      items: cart.items,
      totalAmount: cart.totalPrice,
      shippingAddress: shippingAddress,
    };
    const order = await Order.create(data);
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMyOrder = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate(
      "items.product",
      "name price images",
    );
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error in getting orders." });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "No order found" });
    }
    if (order.user.toString() === req.user._id.toString()) res.json(order);
    else res.status(401).json({ message: "Unauthorized!" });
  } catch (err) {
    res.status(500).json({ message: "Error in getting order by Id ", err });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product", "name price images");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error in getting all orders ", err });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const id = req.params.id;
    const order = await Order.findByIdAndUpdate(
      id,
      { orderStatus },
      { new: true },
    );
    if (!order) {
      return res.status(404).json({ message: "No order found!" });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "error in updating order status ", err });
  }
};

module.exports = {
  createOrder,
  getMyOrder,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
};
