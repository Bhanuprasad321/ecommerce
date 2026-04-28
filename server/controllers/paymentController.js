const crypto = require("crypto");
const Order = require("../models/orderModel");
const initiatePayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    // find order
    const order = await Order.findById(orderId).populate("user", "name email");
    if (!order) return res.status(404).json({ message: "Order not found" });

    // create unique transaction id
    const txnid = `TXN_${Date.now()}_${req.user._id}`;
    await Order.findByIdAndUpdate(orderId, { stripePaymentId: txnid });
    // payment details
    const amount = order.totalAmount.toString();
    const productinfo = "E-Commerce Order";
    const firstname = order.user.name;
    const email = order.user.email;

    // create hash
    // EXACT ORDER IS CRITICAL → key|txnid|amount|productinfo|firstname|email|||||||||||salt
    const hashString = `${process.env.PAYU_MERCHANT_KEY}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${process.env.PAYU_MERCHANT_SALT}`;
    const hash = crypto.createHash("sha512").update(hashString).digest("hex");

    // send payment data to frontend
    res.json({
      key: process.env.PAYU_MERCHANT_KEY,
      txnid,
      amount,
      productinfo,
      firstname,
      email,
      hash,
      payuUrl: process.env.PAYU_BASE_URL,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const paymentSuccess = async (req, res) => {
  try {
    const { txnid, status, hash, amount, productinfo, firstname, email } =
      req.body;

    // verify hash (reverse formula)
    // EXACT ORDER → salt|status|...email|firstname|productinfo|amount|txnid|key
    const hashString = `${process.env.PAYU_MERCHANT_SALT}|${status}|||||||||||${email}|${firstname}|${productinfo}|${amount}|${txnid}|${process.env.PAYU_MERCHANT_KEY}`;
    const generatedHash = crypto
      .createHash("sha512")
      .update(hashString)
      .digest("hex");

    // compare hash PayU sent vs hash you generated
    if (generatedHash !== hash) {
      return res.status(400).json({ message: "Payment verification failed!" });
    }

    // find and update order
    // txnid format was TXN_timestamp_userId → extract from DB
    const order = await Order.findOneAndUpdate(
      { stripePaymentId: txnid }, // we store txnid here
      { paymentStatus: status === "success" ? "paid" : "failed" },
      { new: true },
    );
    if (!order) {
      return res.redirect(`${process.env.FRONTEND_URL}/orders`);
    }
    // redirect to frontend
    if (status === "success") {
      res.redirect(`${process.env.FRONTEND_URL}/orders`);
    } else {
      res.redirect(`${process.env.FRONTEND_URL}/orders`);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  initiatePayment,
  paymentSuccess,
};
