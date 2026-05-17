import { memo, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaHeart, FaEye, FaStar } from "react-icons/fa";

const BookCard = memo(({ book, index = 0 }) => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const imgRef = useRef(null);

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

  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, delay: index * 0.08, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer border border-gray-100 dark:border-gray-700"
      onClick={() => navigate(`/book/${book._id}`)}
    >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden bg-gray-100 dark:bg-gray-700">
        <motion.img
          ref={imgRef}
          src={isVisible ? book.image : ""}
          alt={book.name}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
        />

        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
        )}

        {/* Gradient Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Category Badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className="px-3 py-1.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full text-xs font-semibold text-indigo-600 dark:text-indigo-400 shadow-sm">
            {book.category}
          </span>
        </div>

        {/* Quick Actions - Show on Hover */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsWishlisted(!isWishlisted);
            }}
            className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md shadow-lg transition-all ${
              isWishlisted
                ? "bg-pink-500 text-white"
                : "bg-white/90 dark:bg-gray-800/90 text-gray-600 dark:text-gray-300 hover:bg-pink-50 hover:text-pink-500"
            }`}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <FaHeart className="text-sm" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/book/${book._id}`);
            }}
            className="w-9 h-9 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-md text-gray-600 dark:text-gray-300 flex items-center justify-center hover:bg-indigo-50 hover:text-indigo-500 shadow-lg transition-all"
            aria-label="Quick view"
          >
            <FaEye className="text-sm" />
          </button>
        </div>

        {/* Price Badge */}
        <div className="absolute bottom-3 left-3 z-10 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
          <span className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full text-sm font-bold text-white shadow-lg">
            ${book.price}
          </span>
        </div>

        {/* Stock Status */}
        <div className="absolute bottom-3 right-3 z-10">
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
              book.quantity > 5
                ? "bg-green-100/90 text-green-700 backdrop-blur-sm"
                : book.quantity > 0
                  ? "bg-amber-100/90 text-amber-700 backdrop-blur-sm"
                  : "bg-red-100/90 text-red-700 backdrop-blur-sm"
            }`}
          >
            {book.quantity > 0 ? `${book.quantity} left` : "Out of stock"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              className={`text-xs ${
                star <= (book.rating || 4)
                  ? "text-amber-400"
                  : "text-gray-300 dark:text-gray-600"
              }`}
            />
          ))}
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
            ({book.rating || 4.0})
          </span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-1.5 line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {book.name}
        </h3>

        {/* Description */}
        <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-4 leading-relaxed">
          {book.description ||
            "Discover an amazing reading experience with this carefully selected book."}
        </p>

        {/* Seller Info */}
        {book.seller && (
          <div className="flex items-center gap-2.5 mb-4 pb-4 border-b border-gray-100 dark:border-gray-700">
            <img
              src={book.seller.image || "https://via.placeholder.com/32"}
              alt={book.seller.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-100 dark:ring-gray-600"
              loading="lazy"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-700 dark:text-gray-200 font-medium truncate">
                {book.seller.name || "Unknown"}
              </p>
              <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Verified
              </p>
            </div>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/book/${book._id}`);
          }}
          className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:from-indigo-500 hover:to-purple-500 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          View Details
        </button>
      </div>
    </motion.div>
  );
});

BookCard.displayName = "BookCard";

export default BookCard;
