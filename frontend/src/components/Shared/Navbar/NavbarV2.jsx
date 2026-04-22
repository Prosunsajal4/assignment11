import { useState, useEffect, useRef, useCallback } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  FaBook,
  FaHeart,
  FaShoppingBag,
  FaUser,
  FaTachometerAlt,
  FaSignOutAlt,
  FaSearch,
  FaBars,
  FaTimes,
  FaMoon,
  FaSun,
} from "react-icons/fa";
import useAuth from "../../../hooks/useAuth";
import axios from "axios";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "light";
    }
    return "light";
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const searchRef = useRef(null);

  // Fetch wishlist count - defined before useEffect
  const fetchWishlistCount = useCallback(async () => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/wishlist?email=${user.email}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setWishlistCount(response.data.length);
    } catch {
      // Silently fail
    }
  }, [user]);

  // Handle scroll for sticky effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sync theme
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  // Fetch wishlist count
  useEffect(() => {
    if (user) {
      fetchWishlistCount();
    }
  }, [user, fetchWishlistCount]);

  // Close search dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 2) {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/books`);
        const books = response.data || [];
        const filtered = books.filter((b) =>
          b.name.toLowerCase().includes(query.toLowerCase()),
        );
        setSearchResults(filtered.slice(0, 5));
        setShowSearchDropdown(true);
      } catch {
        setSearchResults([]);
      }
    } else {
      setShowSearchDropdown(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/books?search=${encodeURIComponent(searchQuery)}`);
      setShowSearchDropdown(false);
      setSearchQuery("");
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleLogout = async () => {
    try {
      await logOut();
      toast.success("Logged out successfully");
      navigate("/");
    } catch {
      toast.error("Failed to logout");
    }
  };

  const navLinks = [
    { to: "/", label: "Home", icon: FaBook },
    { to: "/books", label: "Books", icon: FaShoppingBag },
    { to: "/about", label: "About", icon: FaUser },
    { to: "/contact", label: "Contact", icon: FaShoppingBag },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg shadow-lg py-2"
          : "bg-white dark:bg-gray-900 py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
              <FaBook className="text-xl text-white" />
            </div>
            <span className="font-bold text-xl text-gray-800 dark:text-white hidden sm:block">
              Book
              <span className="text-indigo-600 dark:text-indigo-400">
                Courier
              </span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors duration-200 flex items-center gap-1 ${
                    isActive
                      ? "text-indigo-600 dark:text-indigo-400"
                      : "text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                  }`
                }
              >
                <link.icon className="text-xs" />
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Search Bar - Desktop */}
          <div ref={searchRef} className="hidden md:block flex-1 max-w-md mx-8">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search books..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border-0 rounded-full text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-gray-700 transition-all"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />

              {/* Search Dropdown */}
              {showSearchDropdown && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                  {searchResults.map((book) => (
                    <div
                      key={book._id}
                      onClick={() => {
                        navigate(`/book/${book._id}`);
                        setShowSearchDropdown(false);
                        setSearchQuery("");
                      }}
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                    >
                      <img
                        src={book.image}
                        alt={book.name}
                        className="w-10 h-14 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium text-sm text-gray-800 dark:text-gray-200">
                          {book.name}
                        </p>
                        <p className="text-xs text-gray-500">${book.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </form>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {theme === "light" ? <FaMoon /> : <FaSun />}
            </button>

            {/* Wishlist */}
            {user && (
              <Link
                to="/dashboard/my-wishlist"
                className="relative w-10 h-10 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <FaHeart />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-scaleIn">
                    {wishlistCount}
                  </span>
                )}
              </Link>
            )}

            {/* User Menu */}
            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-2 pl-2 pr-4 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <img
                    src={user.photoURL || "/placeholder-avatar.jpg"}
                    alt={user.displayName}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-100 dark:ring-gray-700"
                  />
                  <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {user.displayName?.split(" ")[0]}
                  </span>
                </button>

                {/* Dropdown */}
                <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
                  <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                    <p className="font-medium text-gray-800 dark:text-gray-200">
                      {user.displayName}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {user.email}
                    </p>
                  </div>
                  <div className="p-2">
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                    >
                      <FaTachometerAlt className="text-indigo-500" />
                      Dashboard
                    </Link>
                    <Link
                      to="/dashboard/my-orders"
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                    >
                      <FaShoppingBag className="text-indigo-500" />
                      My Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 transition-colors"
                    >
                      <FaSignOutAlt />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full hover:shadow-lg transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden absolute top-full left-0 right-0 bg-white dark:bg-gray-900 shadow-xl border-t border-gray-100 dark:border-gray-800 transition-all duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        {/* Mobile Search */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-800">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search books..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl text-sm"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </form>
        </div>

        {/* Mobile Nav Links */}
        <div className="p-4 space-y-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive
                    ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`
              }
            >
              <link.icon />
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Mobile User Actions */}
        {user && (
          <div className="p-4 border-t border-gray-100 dark:border-gray-800 space-y-2">
            <Link
              to="/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <FaTachometerAlt />
              Dashboard
            </Link>
            <button
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <FaSignOutAlt />
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
