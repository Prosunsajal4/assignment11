import { memo, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const BookCard = memo(({ book, index = 0 }) => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const imgRef = useRef(null);

  // Modern: Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Modern: Staggered animation variants
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const hoverVariants = {
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  const imageVariants = {
    hover: {
      scale: 1.1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      whileHover="hover"
      className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform cursor-pointer"
      onClick={() => navigate(`/book/${book._id}`)}
    >
      {/* Image Container */}
      <motion.div
        className="relative h-72 overflow-hidden"
        variants={hoverVariants}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"
          variants={imageVariants}
        />
        <motion.img
          ref={imgRef}
          src={isVisible ? book.image : ""}
          alt={book.name}
          className={`w-full h-full object-cover ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          variants={imageVariants}
          whileHover="hover"
        />
        {/* Modern: Skeleton loader while image loads */}
        {!imageLoaded && (
          <motion.div
            className="absolute inset-0 bg-gray-200 animate-pulse"
            initial={{ opacity: 1 }}
            animate={{ opacity: imageLoaded ? 0 : 1 }}
            transition={{ duration: 0.3 }}
          />
        )}

        {/* Animated Category Badge */}
        <motion.div
          className="absolute top-4 left-4 z-20"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 + index * 0.1 }}
        >
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-indigo-600">
            {book.category}
          </span>
        </motion.div>

        {/* Animated Price Badge */}
        <motion.div
          className="absolute top-4 right-4 z-20"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 + index * 0.1 }}
        >
          <span className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full text-sm font-bold text-white shadow-lg">
            ${book.price}
          </span>
        </motion.div>

        {/* Animated Stock Status */}
        <motion.div
          className="absolute bottom-4 left-4 z-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 + index * 0.1 }}
        >
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              book.quantity > 5
                ? "bg-green-100 text-green-700"
                : book.quantity > 0
                ? "bg-yellow-100 text-yellow-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {book.quantity > 0 ? `${book.quantity} in stock` : "Out of stock"}
          </span>
        </motion.div>
      </motion.div>

      {/* Content */}
      <motion.div
        className="p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 + index * 0.1 }}
      >
        <motion.h3
          className="font-bold text-xl text-gray-800 mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors"
          whileHover={{ scale: 1.02 }}
        >
          {book.name}
        </motion.h3>
        <p className="text-gray-500 text-sm line-clamp-2 mb-4">
          {book.description ||
            "Discover an amazing reading experience with this carefully selected book."}
        </p>

        {/* Seller Info */}
        {book.seller && (
          <motion.div
            className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 + index * 0.1 }}
          >
            <img
              src={book.seller.image || "https://via.placeholder.com/32"}
              alt={book.seller.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-100"
              loading="lazy"
            />
            <div>
              <span className="text-sm text-gray-700 font-medium">
                {book.seller.name || "Unknown"}
              </span>
              <span className="flex items-center gap-1 text-xs text-green-600">
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Verified
              </span>
            </div>
          </motion.div>
        )}

        {/* Animated Action Button */}
        <motion.button
          className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transform transition-all duration-200 flex items-center justify-center gap-2"
          whileHover={{
            scale: 1.05,
            boxShadow:
              "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 + index * 0.1 }}
        >
          <motion.svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
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
          </motion.svg>
          View Details
        </motion.button>
      </motion.div>

      {/* Animated Hover Border Effect */}
      <motion.div
        className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-indigo-500/30 transition-colors duration-300 pointer-events-none"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
});

BookCard.displayName = "BookCard";

export default BookCard;
