import Container from "../Container";
import { AiOutlineMenu, AiOutlineSearch } from "react-icons/ai";
import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "light";
    }
    return "light";
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  useEffect(() => {
    if (!isOpen) return;
    const onDocumentClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    const onKey = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("click", onDocumentClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onDocumentClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/books?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setShowSearch(false);
    }
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/books", label: "All Books" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
    { to: "/blog", label: "Blog" },
    { to: "/help", label: "Help" },
  ];

  return (
    <>
      {/* Search Overlay */}
      {showSearch && (
        <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm animate-fadeIn" onClick={() => setShowSearch(false)}>
          <div
            className="max-w-2xl mx-auto mt-24 mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSearch} className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-2 animate-scaleIn">
              <div className="flex items-center gap-3 px-4">
                <AiOutlineSearch className="text-gray-400 text-xl" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search books, authors, categories..."
                  className="flex-1 py-3 bg-transparent text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none text-lg"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg shadow-lg shadow-gray-200/50 dark:shadow-gray-900/50 py-2"
            : "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md py-3"
        }`}
      >
        <Container>
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 shadow-lg shadow-indigo-500/30">
                <FaBook className="text-lg text-white" />
              </div>
              <span className="font-bold text-xl text-gray-800 dark:text-white hidden sm:block">
                Book<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Courier</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${
                      isActive
                        ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30"
                        : "text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2">
              {/* Search Button */}
              <button
                onClick={() => setShowSearch(true)}
                className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Search"
              >
                <AiOutlineSearch className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>

              {/* Theme Toggle */}
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <BsSunFill className="w-5 h-5 text-amber-500" />
                ) : (
                  <BsMoonStarsFill className="w-5 h-5 text-indigo-600" />
                )}
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  aria-haspopup="menu"
                  aria-expanded={isOpen}
                  className="flex items-center gap-2 p-1.5 pr-3 border-2 border-gray-200 dark:border-gray-700 rounded-full hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-md transition-all duration-200"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <AiOutlineMenu className="text-gray-600 dark:text-gray-300" />
                  </div>
                  <img
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-100 dark:ring-indigo-900"
                    referrerPolicy="no-referrer"
                    src={user?.photoURL || avatarImg}
                    alt="profile"
                  />
                </button>

                {/* Dropdown Menu */}
                {isOpen && (
                  <div
                    ref={menuRef}
                    role="menu"
                    aria-label="User menu"
                    className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-scaleIn z-[999]"
                  >
                    {user ? (
                      <>
                        <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-700">
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

                        <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Navigation</p>
                          <div className="grid grid-cols-2 gap-1">
                            {navLinks.map((link) => (
                              <Link
                                key={link.to}
                                to={link.to}
                                onClick={() => setIsOpen(false)}
                                className="px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                              >
                                {link.label}
                              </Link>
                            ))}
                          </div>
                        </div>

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
    </>
  );
};

export default Navbar;
