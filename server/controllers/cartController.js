const Cart = require("../models/cartModel");
const Product = require("../models/productModel");

const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product",
      "name price images",
    );
    if (!cart) {
      return res.json({ items: [], totalPrice: 0 });
    }
    res.json(cart);
  } catch (err) {
    console.log("Error in getCart : ", err);
    res.status(500).json({ message: "Error in getting user cart." });
  }
};

const addToCart = async (req, res) => {
  try {
    const productId = req.params.id;
    const { quantity = 1 } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [{ product: productId, quantity, price: product.price }],
        totalPrice: product.price * quantity,
      });
    } else {
      const item = cart.items.find(
        (item) => item.product.toString() === productId,
      );
      if (item) {
        item.quantity += quantity;
      } else {
        cart.items.push({
          product: productId,
          quantity,
          price: product.price,
        });
      }
      cart.totalPrice = cart.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      );
      await cart.save();
    }
    const populatedCart = await cart.populate(
      "items.product",
      "name price images",
    );
    res.json(populatedCart);
  } catch (err) {
    console.log("Error in adding product to cart: ", err);
    res.status(500).json({ message: "error in adding product to cart" });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    const { quantity } = req.body;
    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "Valid quantity is required" });
    }
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Item not found in cart." });
    } else {
      const item = cart.items.id(itemId);
      if (!item) {
        return res.status(404).json({ message: "Item not found in cart." });
      } else {
        item.quantity = quantity;
        cart.totalPrice = cart.items.reduce(
          (total, item) => total + item.price * item.quantity,
          0,
        );
      }
      await cart.save();
    }
    await cart.populate("items.product", "name price images");
    res.json(cart);
  } catch (err) {
    console.log("Error in updating the Item: ", err);
    res.status(500).json({ message: "Error in updating the Item" });
  }
};

const removeCartItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Item not found in cart." });
    } else {
      cart.items = cart.items.filter((item) => item._id.toString() !== itemId);
      cart.totalPrice = cart.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      );
      await cart.save();
      res.json(cart);
    }
  } catch (err) {
    console.log("Error in removing item from cart: ", err);
    res.status(500).json({ message: "Error in removing cart item" });
  }
};

const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "No Cart found" });
    else {
      cart.items = [];
      cart.totalPrice = 0;
      await cart.save();
      res.json(cart);
    }
  } catch (err) {
    console.log("Error in clearing the cart : ", err);
    return res.status(500).json({ message: "Error in clearing the cart." });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
};
