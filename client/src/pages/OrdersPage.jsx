import { useState, useEffect } from "react";
import api from "../utils/axiosInstance";
const getPaymentBadge = (status) => {
  const styles = {
    pending: "bg-yellow-100 text-yellow-700",
    paid: "bg-green-100 text-green-700",
    failed: "bg-red-100 text-red-700",
  };
  return styles[status] || "bg-gray-100 text-gray-700";
};

const getOrderBadge = (status) => {
  const styles = {
    processing: "bg-blue-100 text-blue-700",
    shipped: "bg-indigo-100 text-indigo-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };
  return styles[status] || "bg-gray-100 text-gray-700";
};
const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await api.get("/orders");
        setOrders(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Error loading orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);
  if (loading)
    return <p className="text-center text-gray-500 mt-20">Loading orders...</p>;

  if (error) return <p className="text-center text-red-500 mt-20">{error}</p>;

  if (orders.length === 0)
    return (
      <div className="text-center mt-20">
        <p className="text-gray-500 text-lg">No orders yet</p>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h1>

      <div className="flex flex-col gap-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-xl border border-gray-200 p-6"
          >
            {/* Order Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="text-sm font-mono font-semibold text-gray-900">
                  #{order._id.slice(0, 8).toUpperCase()}
                </p>
              </div>
              <p className="text-sm text-gray-500">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* Order Items */}
            <div className="border-t border-gray-100 pt-4 mb-4">
              {order.items.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between text-sm text-gray-600 mb-2"
                >
                  <span>
                    {item.product?.name || "Product"} × {item.quantity}
                  </span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            {/* Order Footer */}
            <div
              className="flex items-center justify-between
                            border-t border-gray-100 pt-4"
            >
              <div className="flex gap-2">
                {/* Payment Status Badge */}
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full
                                  ${getPaymentBadge(order.paymentStatus)}`}
                >
                  {order.paymentStatus}
                </span>
                {/* Order Status Badge */}
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full
                                  ${getOrderBadge(order.orderStatus)}`}
                >
                  {order.orderStatus}
                </span>
              </div>
              <p className="font-bold text-gray-900">₹{order.totalAmount}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default OrdersPage;
