import { useState, useEffect } from "react";
import api from "../utils/axiosInstance";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("stats");
  const [images, setImages] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
  });

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products?limit=100");
      setProducts(res.data.products);
    } catch (err) {
      toast.error("Error loading products");
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders/all");
      setOrders(res.data);
    } catch (err) {
      toast.error("Error loading orders");
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchProducts(), fetchOrders()]).finally(() =>
      setLoading(false),
    );
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", newProduct.name);
      formData.append("description", newProduct.description);
      formData.append("price", newProduct.price);
      formData.append("category", newProduct.category);
      formData.append("stock", newProduct.stock);
      images.forEach((image) => formData.append("images", image));

      await api.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Product added!");
      setShowForm(false);
      setImages([]);
      setNewProduct({
        name: "",
        description: "",
        price: "",
        category: "",
        stock: "",
      });
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error adding product");
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success("Product deleted!");
      fetchProducts();
    } catch (err) {
      toast.error("Error deleting product");
    }
  };

  const handleUpdateOrderStatus = async (id, orderStatus) => {
    try {
      await api.put(`/orders/${id}`, { orderStatus });
      toast.success("Order status updated!");
      fetchOrders();
    } catch (err) {
      toast.error("Error updating order");
    }
  };

  const totalRevenue = orders
    .filter((o) => o.paymentStatus === "paid")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  if (loading)
    return <p className="text-center text-gray-500 mt-20">Loading...</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-8">
        {["stats", "products", "orders"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium
                        capitalize transition-colors
              ${
                activeTab === tab
                  ? "bg-indigo-600 text-white"
                  : "border border-gray-300 text-gray-600 hover:bg-gray-50"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── Stats Tab ── */}
      {activeTab === "stats" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Total Orders", value: orders.length },
            { label: "Total Products", value: products.length },
            { label: "Total Revenue", value: `₹${totalRevenue}` },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="bg-white rounded-xl border border-gray-200 p-6"
            >
              <p className="text-sm text-gray-500 mb-2">{label}</p>
              <p className="text-3xl font-bold text-indigo-600">{value}</p>
            </div>
          ))}
        </div>
      )}

      {/* ── Products Tab ── */}
      {activeTab === "products" && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* Header + Add Button */}
          <div
            className="flex justify-between items-center p-4
                          border-b border-gray-200"
          >
            <h2 className="text-lg font-semibold text-gray-900">Products</h2>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white
                         px-4 py-2 rounded-lg text-sm font-medium
                         transition-colors"
            >
              {showForm ? "Cancel" : "+ Add Product"}
            </button>
          </div>

          {/* Add Product Form */}
          {showForm && (
            <form
              onSubmit={handleAddProduct}
              className="grid grid-cols-2 gap-4 p-4 border-b border-gray-200
                         bg-gray-50"
            >
              <input
                placeholder="Product Name"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm
                           focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                placeholder="Price"
                type="number"
                value={newProduct.price}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, price: e.target.value })
                }
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm
                           focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                placeholder="Description"
                value={newProduct.description}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, description: e.target.value })
                }
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm
                           focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                placeholder="Stock"
                type="number"
                value={newProduct.stock}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, stock: e.target.value })
                }
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm
                           focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setImages([...e.target.files])}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm
             col-span-2 focus:outline-none
             focus:ring-2 focus:ring-indigo-500"
              />
              <select
                value={newProduct.category}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, category: e.target.value })
                }
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm
                           focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select Category</option>
                <option value="electronics">Electronics</option>
                <option value="clothing">Clothing</option>
                <option value="footwear">Footwear</option>
                <option value="accessories">Accessories</option>
              </select>
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white
                           py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Add Product
              </button>
            </form>
          )}

          {/* Products Table */}
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {["Name", "Price", "Category", "Stock", "Action"].map((h) => (
                  <th
                    key={h}
                    className="text-left text-xs font-medium
                               text-gray-500 px-4 py-3"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product._id}
                  className="border-t border-gray-100 hover:bg-gray-50"
                >
                  <td className="text-sm text-gray-900 px-4 py-3 font-medium">
                    {product.name}
                  </td>
                  <td className="text-sm text-gray-700 px-4 py-3">
                    ₹{product.price}
                  </td>
                  <td className="text-sm text-gray-700 px-4 py-3 capitalize">
                    {product.category}
                  </td>
                  <td className="text-sm text-gray-700 px-4 py-3">
                    {product.stock}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDeleteProduct(product._id)}
                      className="text-red-500 hover:text-red-700
                                 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Orders Tab ── */}
      {activeTab === "orders" && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {["Order ID", "User", "Amount", "Payment", "Status"].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left text-xs font-medium
                               text-gray-500 px-4 py-3"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-t border-gray-100 hover:bg-gray-50"
                >
                  <td className="text-sm font-mono text-gray-900 px-4 py-3">
                    #{order._id.slice(0, 8).toUpperCase()}
                  </td>
                  <td className="text-sm text-gray-700 px-4 py-3">
                    {order.user?.name || "N/A"}
                  </td>
                  <td className="text-sm text-gray-700 px-4 py-3">
                    ₹{order.totalAmount}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-medium px-2.5 py-1
                                      rounded-full
                      ${
                        order.paymentStatus === "paid"
                          ? "bg-green-100 text-green-700"
                          : order.paymentStatus === "failed"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={order.orderStatus}
                      onChange={(e) =>
                        handleUpdateOrderStatus(order._id, e.target.value)
                      }
                      className="border border-gray-300 rounded-lg
                                 px-2 py-1 text-sm focus:outline-none
                                 focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
