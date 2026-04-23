import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaTimes,
  FaHeart,
  FaShoppingCart,
  FaShare,
  FaCheck,
  FaStar,
} from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import useWishlist from "../../hooks/useWishlist";
import toast from "react-hot-toast";

const QuickViewModal = ({ book, isOpen, onClose }) => {
  const { user } = useAuth();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);

  if (!isOpen || !book) return null;

  const inWishlist = isInWishlist(book._id);

  const handleWishlistToggle = async () => {
    if (!user) {
      toast.error("Please login to add to wishlist");
      return;
    }

    if (inWishlist) {
      await removeFromWishlist(book._id);
    } else {
      await addToWishlist(book._id);
    }
  };

  const handleAddToCart = () => {
    // Add to cart logic here
    toast.success(`Added ${quantity} item(s) to cart`);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: book.name,
        text: `Check out "${book.name}" on BookCourier!`,
        url: window.location.origin + `/book/${book._id}`,
      });
    } else {
      navigator.clipboard.writeText(
        window.location.origin + `/book/${book._id}`,
      );
      toast.success("Link copied to clipboard");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row animate-scaleIn">
        {/* Image Section */}
        <div className="md:w-1/2 relative bg-gray-100 dark:bg-gray-900">
          <img
            src={book.image}
            alt={book.name}
            className="w-full h-64 md:h-full object-cover"
          />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {book.originalPrice > book.price && (
              <span className="px-3 py-1 bg-red-500 text-white rounded-full text-sm font-bold">
                {Math.round(
                  ((book.originalPrice - book.price) / book.originalPrice) *
                    100,
                )}
                % OFF
              </span>
            )}
            <span className="px-3 py-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-indigo-600 dark:text-indigo-400 rounded-full text-sm font-semibold">
              {book.category}
            </span>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/90 dark:bg-gray-800/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors md:hidden"
          >
            <FaTimes />
          </button>
        </div>

        {/* Content Section */}
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                {book.name}
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                by {book.author || "Unknown Author"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="hidden md:flex w-10 h-10 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <FaTimes className="text-gray-500" />
            </button>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  className={`w-5 h-5 ${
                    star <= (book.rating || 4)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300 dark:text-gray-600"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              ({book.reviewsCount || 0} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
              ${book.price}
            </span>
            {book.originalPrice > book.price && (
              <span className="text-xl text-gray-400 line-through">
                ${book.originalPrice}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-3">
            {book.description || "No description available."}
          </p>

          {/* Stock Status */}
          <div className="flex items-center gap-2 mb-6">
            <span
              className={`w-3 h-3 rounded-full ${
                book.quantity > 10
                  ? "bg-green-500"
                  : book.quantity > 0
                    ? "bg-yellow-500"
                    : "bg-red-500"
              }`}
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {book.quantity > 10
                ? "In Stock"
                : book.quantity > 0
                  ? `Only ${book.quantity} left`
                  : "Out of Stock"}
            </span>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Quantity:
            </span>
            <div className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                -
              </button>
              <span className="w-8 text-center font-medium">{quantity}</span>
              <button
                onClick={() =>
                  setQuantity(Math.min(book.quantity, quantity + 1))
                }
                className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-auto">
            <button
              onClick={handleAddToCart}
              disabled={book.quantity === 0}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaShoppingCart />
              Add to Cart
            </button>

            <button
              onClick={handleWishlistToggle}
              className={`w-14 h-14 flex items-center justify-center rounded-xl border-2 transition-all ${
                inWishlist
                  ? "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-500"
                  : "border-gray-200 dark:border-gray-700 hover:border-indigo-500 hover:text-indigo-500"
              }`}
            >
              <FaHeart className={inWishlist ? "fill-current" : ""} />
            </button>

            <button
              onClick={handleShare}
              className="w-14 h-14 flex items-center justify-center rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-indigo-500 hover:text-indigo-500 transition-all"
            >
              <FaShare />
            </button>
          </div>

          {/* View Full Details */}
          <Link
            to={`/book/${book._id}`}
            onClick={onClose}
            className="mt-4 text-center text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
          >
            View Full Details →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
