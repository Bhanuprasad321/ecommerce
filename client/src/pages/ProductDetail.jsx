import api from "../utils/axiosInstance";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
const ProductDetail = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { id } = useParams();
  const addToCart = async () => {
    try {
      setLoading(true);
      const cart = await api.post(`/cart/${id}`, { quantity: 1 });
      toast.success("Added to cart!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error adding to cart");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Error loading product details",
        );
      }
    };
    fetchProduct();
  }, [id]);
  if (loading)
    return <p className="text-center mt-8 text-gray-500">Loading...</p>;
  if (error) return <p className="text-center mt-8 text-red-500">{error}</p>;
  if (!product) return null;
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
      <p className="text-gray-600 mt-2">{product.description}</p>
      <p className="text-indigo-600 font-bold text-xl mt-4">₹{product.price}</p>
      <p className="text-gray-500 text-sm mt-1">{product.category}</p>
      <p className="text-gray-500 text-sm mt-1">
        {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
      </p>
      <button
        onClick={addToCart}
        disabled={product.stock === 0}
        className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white
                   px-6 py-2 rounded-lg text-sm font-medium
                   disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Add to Cart
      </button>
    </div>
  );
};
export default ProductDetail;
