import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axiosInstance";
import toast from "react-hot-toast";

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const fetchCart = async () => {
    try {
      const res = await api.get("/cart");
      setCart(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Error loading cart");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCart();
  }, []);
  const handleQuantityUpdate = async (itemId, newQunatity) => {
    if (newQunatity < 1) return;
    try {
      await api.put(`/cart/${itemId}`, { quantity: newQunatity });
      fetchCart();
    } catch (err) {
      toast.error("Error updating quantity");
    }
  };
  const handleRemove = async (itemId) => {
    try {
      await api.delete(`/cart/${itemId}`);
      toast.success("Item removed!");
      fetchCart();
    } catch (err) {
      toast.error("Error removing Item!");
    }
  };
  const handleClearCart = async () => {
    try {
      await api.delete("/cart");
      toast.success("Cart Cleared!");
      fetchCart();
    } catch (err) {
      toast.error("Error clearing cart");
    }
  };
  if (loading)
    return <p className="text-center text-gray-500 mt-20">Loading cart...</p>;

  if (error) return <p className="text-center text-red-500 mt-20">{error}</p>;

  if (!cart || cart.items?.length === 0)
    return (
      <div className="text-center mt-20">
        <p className="text-gray-500 text-lg">Your cart is empty</p>
        <button
          onClick={() => navigate("/products")}
          className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white
                   px-6 py-2 rounded-lg text-sm font-medium"
        >
          Browse Products
        </button>
      </div>
    );
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items — Left Side */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {cart.items.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl border border-gray-200 p-4
                         flex items-center justify-between gap-4"
            >
              {/* Product Info */}
              <div className="flex-1">
                <p className="text-gray-900 font-semibold">
                  {item.product?.name || "Product"}
                </p>
                <p className="text-indigo-600 font-bold mt-1">₹{item.price}</p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    handleQuantityUpdate(item._id, item.quantity - 1)
                  }
                  className="border border-gray-300 px-2 py-1 rounded
                             hover:bg-gray-50 text-gray-700 font-medium"
                >
                  −
                </button>
                <span className="text-sm font-medium w-8 text-center">
                  {item.quantity}
                </span>
                <button
                  onClick={() =>
                    handleQuantityUpdate(item._id, item.quantity + 1)
                  }
                  className="border border-gray-300 px-2 py-1 rounded
                             hover:bg-gray-50 text-gray-700 font-medium"
                >
                  +
                </button>
              </div>

              {/* Item Total + Remove */}
              <div className="text-right">
                <p className="text-gray-900 font-semibold">
                  ₹{item.price * item.quantity}
                </p>
                <button
                  onClick={() => handleRemove(item._id)}
                  className="text-red-500 hover:text-red-700
                             text-sm font-medium mt-1"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          {/* Clear Cart */}
          <button
            onClick={handleClearCart}
            className="text-red-500 hover:text-red-700
                       text-sm font-medium text-left mt-2"
          >
            Clear entire cart
          </button>
        </div>

        {/* Summary — Right Side */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Order Summary
            </h2>

            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Subtotal</span>
              <span>₹{cart.totalPrice}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mb-4">
              <span>Shipping</span>
              <span className="text-green-600">Free</span>
            </div>

            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="flex justify-between font-bold text-gray-900">
                <span>Total</span>
                <span>₹{cart.totalPrice}</span>
              </div>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white
                         py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
