import { Link, useLocation } from "react-router-dom";
import api from "../utils/axiosInstance";
import { useEffect, useState } from "react";

const ProductsPage = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialCategory = params.get("category") || "";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState(initialCategory);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await api.get(
          `/products?search=${searchInput}&category=${category}&page=${page}`,
        );
        setProducts(res.data.products);
        setTotalPages(res.data.pages);
      } catch (err) {
        setError(err.response?.data?.message || "Error loading products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchInput, category, page]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Search bar */}
      <input
        type="text"
        placeholder="Search products..."
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        className="w-full max-w-md border border-gray-300 rounded-lg px-4 py-2 text-sm
                   focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-6"
      />

      {/* Category filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {["All", "electronics", "clothing", "footwear", "accessories"].map(
          (cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat === "All" ? "" : cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                ${
                  category === (cat === "All" ? "" : cat)
                    ? "bg-indigo-600 text-white"
                    : "border border-gray-300 text-gray-600 hover:bg-gray-50"
                }`}
            >
              {cat}
            </button>
          ),
        )}
      </div>

      {/* Loading and error */}
      {loading && <p className="text-center text-gray-500">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Products grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Link to={`/products/${product._id}`} key={product._id}>
            <div
              className="bg-white rounded-xl border border-gray-200
                           hover:shadow-md transition-shadow duration-200
                           overflow-hidden"
            >
              {/* Image */}
              <div className="bg-gray-100 h-48 flex items-center justify-center">
                {product.images?.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <p className="text-gray-400 text-sm">No image</p>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                <p className="text-gray-900 font-semibold truncate">
                  {product.name}
                </p>
                <p className="text-gray-500 text-sm mt-1 truncate">
                  {product.description}
                </p>
                <div className="flex items-center justify-between mt-3">
                  <p className="text-indigo-600 font-bold">₹{product.price}</p>
                  <span
                    className="text-xs bg-indigo-50 text-indigo-600
                                   px-2 py-1 rounded-full font-medium"
                  >
                    {product.category}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-4 mt-8">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="border border-gray-300 px-4 py-2 rounded-lg text-sm
                     hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Prev
        </button>
        <span className="text-sm text-gray-600">
          {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
          className="border border-gray-300 px-4 py-2 rounded-lg text-sm
                     hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProductsPage;
