import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../redux/slices/authSlice";
import {
  ShoppingCartIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleButton = () => {
    if (!user) navigate("/login");
    else {
      dispatch(logout());
      navigate("/login");
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="text-xl font-bold text-indigo-600">ECOMMERCE</div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className="text-sm font-medium text-gray-600
                       hover:text-indigo-600 transition-colors duration-200"
          >
            Home
          </Link>
          <Link
            to="/products"
            className="text-sm font-medium text-gray-600
                       hover:text-indigo-600 transition-colors duration-200"
          >
            Products
          </Link>
          {user && (
            <Link
              to="/orders"
              className="text-sm font-medium text-gray-600
                         hover:text-indigo-600 transition-colors duration-200"
            >
              My Orders
            </Link>
          )}
          {user && user.role === "admin" && (
            <Link
              to="/admin"
              className="text-sm font-medium text-gray-600
                         hover:text-indigo-600 transition-colors duration-200"
            >
              Dashboard
            </Link>
          )}
        </div>

        {/* Desktop Right Side */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/cart">
            <ShoppingCartIcon
              className="w-6 h-6 text-gray-600
                                         hover:text-indigo-600"
            />
          </Link>
          {user && (
            <div
              className="flex items-center gap-1 text-sm
                            font-medium text-gray-700"
            >
              <UserIcon className="w-5 h-5 text-gray-600" />
              {user.name}
            </div>
          )}
          <button
            onClick={handleButton}
            className="border border-gray-300 hover:bg-gray-50
                       text-gray-700 text-sm font-medium
                       px-4 py-2 rounded-lg"
          >
            {user ? "Logout" : "Login"}
          </button>
        </div>

        {/* Mobile Right Side */}
        <div className="flex md:hidden items-center gap-3">
          <Link to="/cart">
            <ShoppingCartIcon className="w-6 h-6 text-gray-600" />
          </Link>
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? (
              <XMarkIcon className="w-6 h-6 text-gray-600" />
            ) : (
              <Bars3Icon className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div
          className="md:hidden mt-4 flex flex-col gap-4 pb-4
                        border-t border-gray-100 pt-4"
        >
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="text-sm font-medium text-gray-600
                       hover:text-indigo-600"
          >
            Home
          </Link>
          <Link
            to="/products"
            onClick={() => setMenuOpen(false)}
            className="text-sm font-medium text-gray-600
                       hover:text-indigo-600"
          >
            Products
          </Link>
          {user && (
            <Link
              to="/orders"
              onClick={() => setMenuOpen(false)}
              className="text-sm font-medium text-gray-600
                         hover:text-indigo-600"
            >
              My Orders
            </Link>
          )}
          {user && user.role === "admin" && (
            <Link
              to="/admin"
              onClick={() => setMenuOpen(false)}
              className="text-sm font-medium text-gray-600
                         hover:text-indigo-600"
            >
              Dashboard
            </Link>
          )}
          {user && (
            <div
              className="flex items-center gap-1 text-sm
                            font-medium text-gray-700"
            >
              <UserIcon className="w-5 h-5 text-gray-600" />
              {user.name}
            </div>
          )}
          <button
            onClick={() => {
              handleButton();
              setMenuOpen(false);
            }}
            className="border border-gray-300 text-gray-700
                       text-sm font-medium px-4 py-2 rounded-lg
                       w-fit"
          >
            {user ? "Logout" : "Login"}
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
