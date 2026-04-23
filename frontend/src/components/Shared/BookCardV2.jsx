import { memo, useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaEye, FaStar } from "react-icons/fa";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";

const BookCard = memo(({ book, index = 0 }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const imgRef = useRef(null);

  // Check wishlist status - declared before useEffect
  const checkWishlistStatus = useCallback(async () => {
    try {
      const token = await user.getIdToken();
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/wishlist/check?email=${user.email}&bookId=${book._id}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setIsWishlisted(response.data.wishlisted);
    } catch {
      // Silently fail
    }
  }, [user, book._id]);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "50px" },
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Check wishlist status
  useEffect(() => {
    if (user && book._id) {
      checkWishlistStatus();
    }
  }, [user, book._id, checkWishlistStatus]);

  const toggleWishlist = async (e) => {
    e.stopPropagation();
    if (!user) {
      toast.error("Please login to add to wishlist");
      return;
    }

    try {
      const token = await user.getIdToken();
      if (isWishlisted) {
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/wishlist?email=${user.email}&bookId=${book._id}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setIsWishlisted(false);
        toast.success("Removed from wishlist");
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/wishlist`,
          { email: user.email, bookId: book._id },
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setIsWishlisted(true);
        toast.success("Added to wishlist");
      }
    } catch {
      toast.error("Failed to update wishlist");
    }
  };

  const handleQuickView = (e) => {
    e.stopPropagation();
    navigate(`/book/${book._id}`);
  };

  // Calculate discount if original price exists
  const hasDiscount = book.originalPrice && book.originalPrice > book.price;
  const discountPercent = hasDiscount
    ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
    : 0;

  return (
    <div
      className={`group relative bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
      style={{ transitionDelay: `${index * 80}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/book/${book._id}`)}
    >
      {/* Image Container */}
      <div className="relative h-72 overflow-hidden">
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10 opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

        {/* Book Image */}
        <img
          ref={imgRef}
          src={isVisible ? book.image : ""}
          alt={book.name}
          className={`w-full h-full object-cover transition-all duration-700 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          } ${isHovered ? "scale-110" : "scale-100"}`}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
        />

        {/* Skeleton loader */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
        )}

        {/* Discount Badge */}
        {hasDiscount && (
          <div
            className="absolute top-4 left-4 z-20 animate-scaleIn"
            style={{ animationDelay: `${300 + index * 100}ms` }}
          >
            <span className="px-3 py-1.5 bg-red-500 text-white rounded-full text-xs font-bold shadow-lg">
              -{discountPercent}%
            </span>
          </div>
        )}

        {/* Category Badge */}
        <div
          className="absolute top-4 right-4 z-20 animate-fadeInRight"
          style={{ animationDelay: `${300 + index * 100}ms` }}
        >
          <span className="px-3 py-1.5 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-full text-xs font-semibold text-indigo-600 dark:text-indigo-400 shadow-md">
            {book.category}
          </span>
        </div>

        {/* Price Badge - Bottom Left */}
        <div
          className="absolute bottom-4 left-4 z-20 animate-fadeInUp"
          style={{ animationDelay: `${400 + index * 100}ms` }}
        >
          <div className="flex flex-col">
            {hasDiscount && (
              <span className="text-sm text-gray-300 line-through">
                ${book.originalPrice}
              </span>
            )}
            <span className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full text-lg font-bold text-white shadow-lg">
              ${book.price}
            </span>
          </div>
        </div>

        {/* Stock Status - Bottom Right */}
        <div
          className="absolute bottom-4 right-4 z-20 animate-fadeInUp"
          style={{ animationDelay: `${500 + index * 100}ms` }}
        >
          <span
            className={`px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm ${
              book.quantity > 10
                ? "bg-green-500/90 text-white"
                : book.quantity > 0
                  ? "bg-yellow-500/90 text-white"
                  : "bg-red-500/90 text-white"
            }`}
          >
            {book.quantity > 10
              ? "In Stock"
              : book.quantity > 0
                ? `Only ${book.quantity} left`
                : "Out of Stock"}
          </span>
        </div>

        {/* Hover Action Buttons */}
        <div
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 flex gap-3 transition-opacity duration-200 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <button
            onClick={toggleWishlist}
            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 active:scale-90 ${
              isWishlisted
                ? "bg-red-500 text-white"
                : "bg-white text-gray-700 hover:bg-red-50 hover:text-red-500"
            }`}
          >
            <FaHeart className={isWishlisted ? "fill-current" : ""} />
          </button>

          <button
            onClick={handleQuickView}
            className="w-12 h-12 bg-white text-gray-700 rounded-full flex items-center justify-center shadow-lg hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200 hover:scale-110 active:scale-90"
          >
            <FaEye />
          </button>
        </div>

        {/* Rating Stars - If available */}
        {book.rating && (
          <div className="absolute top-16 right-4 z-20 flex items-center gap-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-2 py-1 rounded-full">
            <FaStar className="text-yellow-400 text-xs" />
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              {book.rating}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title */}
        <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100 mb-2 line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {book.name}
        </h3>

        {/* Description */}
        <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-4">
          {book.description ||
            "Discover an amazing reading experience with this carefully selected book."}
        </p>

        {/* Seller Info */}
        {book.seller && (
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100 dark:border-gray-700">
            <img
              src={book.seller.image || "/placeholder-avatar.jpg"}
              alt={book.seller.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-100 dark:ring-gray-700"
              loading="lazy"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-700 dark:text-gray-300 font-medium truncate">
                {book.seller.name || "Unknown"}
              </p>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-xs text-green-600 dark:text-green-400">
                  Verified Seller
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <button className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg flex items-center justify-center gap-2 group-hover:from-indigo-700 group-hover:to-purple-700 transition-all hover:scale-[1.02] active:scale-[0.98]">
          <FaEye />
          View Details
        </button>
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10" />
      </div>
    </div>
  );
});

BookCard.displayName = "BookCard";

export default BookCard;
