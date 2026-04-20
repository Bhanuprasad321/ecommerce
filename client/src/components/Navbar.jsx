import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/slices/authSlice";
import { ShoppingCartIcon, UserIcon } from "@heroicons/react/24/outline";
const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const handleButton = (e) => {
    if (!user) navigate("/login");
    else {
      dispatch(logout());
      navigate("/login");
    }
  };
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="text-xl font-bold text-indigo-600">ECOMMERCE</div>
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors duration-200"
          >
            Home
          </Link>
          <Link
            to="/products"
            className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors duration-200"
          >
            Products
          </Link>
        </div>
        {user && (
          <Link
            to="/orders"
            className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors duration-200"
          >
            My Orders
          </Link>
        )}
        {user && user.role === "admin" && (
          <Link
            to="/admin"
            className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors duration-200"
          >
            Dashboard
          </Link>
        )}

        <div className="flex items-center gap-4">
          <Link to="/cart">
            <ShoppingCartIcon className="w-6 h-6 text-gray-600" />
          </Link>
          <button
            onClick={handleButton}
            className="border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg"
          >
            {user ? "Logout" : "Login"}{" "}
          </button>
        </div>
        {user && (
          <div className="text-sm font-medium text-gray-700 flex">
            <UserIcon className="w-6 h-5 text-gray-600 mx-1" />
            {user.name}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
