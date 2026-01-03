import Container from "../Container";
import { AiOutlineMenu } from "react-icons/ai";
import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import avatarImg from "../../../assets/images/placeholder.jpg";
import {
  FaBook,
  FaHeart,
  FaShoppingBag,
  FaUser,
  FaTachometerAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import { BsSunFill, BsMoonStarsFill } from "react-icons/bs";

const Navbar = () => {
  const { user, logOut } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "light";
    }
    return "light";
  });

  // Handle scroll for sticky effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sync theme on load and when theme changes
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/books", label: "All Books" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg py-2"
          : "bg-white dark:bg-gray-900 py-4"
      }`}
    >
      <Container>
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
              <FaBook className="text-xl text-white" />
            </div>
            <span className="font-bold text-xl text-gray-800 dark:text-white hidden sm:block">
              Book<span className="text-indigo-600">Courier</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `font-medium transition-colors duration-200 ${
                    isActive
                      ? "text-indigo-600 dark:text-indigo-400"
                      : "text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <BsSunFill className="w-5 h-5 text-yellow-500" />
              ) : (
                <BsMoonStarsFill className="w-5 h-5 text-indigo-600" />
              )}
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 p-2 px-3 border-2 border-gray-200 dark:border-gray-700 rounded-full hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-md transition-all duration-200"
              >
                <AiOutlineMenu className="text-gray-600 dark:text-gray-300" />
                <img
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-100 dark:ring-indigo-900"
                  referrerPolicy="no-referrer"
                  src={user?.photoURL || avatarImg}
                  alt="profile"
                />
              </button>

              {/* Dropdown Menu */}
              {isOpen && (
                <div className="absolute right-0 top-14 w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-fadeIn">
                  {user ? (
                    <>
                      {/* User Info */}
                      <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-700">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.photoURL || avatarImg}
                            alt={user.displayName}
                            className="w-12 h-12 rounded-full object-cover ring-2 ring-white dark:ring-gray-600"
                          />
                          <div>
                            <p className="font-semibold text-gray-800 dark:text-white truncate">
                              {user.displayName || "User"}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="p-2">
                        <Link
                          to="/dashboard"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-gray-700 rounded-xl transition-colors duration-200"
                        >
                          <FaTachometerAlt className="text-indigo-500" />
                          Dashboard
                        </Link>
                        <Link
                          to="/dashboard/my-wishlist"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-gray-700 rounded-xl transition-colors duration-200"
                        >
                          <FaHeart className="text-pink-500" />
                          My Wishlist
                        </Link>
                        <Link
                          to="/dashboard/my-orders"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-gray-700 rounded-xl transition-colors duration-200"
                        >
                          <FaShoppingBag className="text-emerald-500" />
                          My Orders
                        </Link>
                        <Link
                          to="/dashboard/profile"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-gray-700 rounded-xl transition-colors duration-200"
                        >
                          <FaUser className="text-purple-500" />
                          Profile
                        </Link>
                        <button
                          onClick={() => {
                            logOut();
                            setIsOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors duration-200"
                        >
                          <FaSignOutAlt />
                          Logout
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="p-2">
                      {/* Mobile Nav Links */}
                      <div className="lg:hidden border-b border-gray-100 dark:border-gray-700 pb-2 mb-2">
                        {navLinks.map((link) => (
                          <Link
                            key={link.to}
                            to={link.to}
                            onClick={() => setIsOpen(false)}
                            className="block px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-gray-700 rounded-xl transition-colors duration-200"
                          >
                            {link.label}
                          </Link>
                        ))}
                      </div>
                      <Link
                        to="/login"
                        onClick={() => setIsOpen(false)}
                        className="block px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-gray-700 rounded-xl transition-colors duration-200 font-medium"
                      >
                        Login
                      </Link>
                      <Link
                        to="/signup"
                        onClick={() => setIsOpen(false)}
                        className="block px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl text-center font-medium mt-2 hover:shadow-lg transition-shadow duration-200"
                      >
                        Sign Up
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </nav>
  );
};

export default Navbar;
