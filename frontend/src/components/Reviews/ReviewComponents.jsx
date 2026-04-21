import { FaStar, FaThumbsUp, FaCheckCircle, FaEdit, FaTrash, FaFlag } from "react-icons/fa";
import { useState } from "react";
import useAuth from "../../hooks/useAuth";

const StarRating = ({ rating, maxStars = 5, size = "md", interactive = false, onRate }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <div className="flex gap-1">
      {Array.from({ length: maxStars }).map((_, i) => {
        const starValue = i + 1;
        const isFilled = interactive
          ? starValue <= (hoverRating || rating)
          : starValue <= rating;

        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onRate?.(starValue)}
            onMouseEnter={() => interactive && setHoverRating(starValue)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            className={`${interactive ? "cursor-pointer hover:scale-110" : "cursor-default"} transition-transform`}
          >
            <FaStar
              className={`${sizeClasses[size]} ${
                isFilled ? "text-yellow-400 fill-current" : "text-gray-300 dark:text-gray-600"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};

const ReviewCard = ({ review, onLike, onHelpful, onEdit, onDelete, isOwner }) => {
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);

  const truncateLength = 150;
  const shouldTruncate = review.comment?.length > truncateLength;
  const displayComment = isExpanded
    ? review.comment
    : shouldTruncate
    ? review.comment?.slice(0, truncateLength) + "..."
    : review.comment;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <img
            src={review.userImage || "/placeholder-avatar.jpg"}
            alt={review.userName}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-100 dark:ring-gray-700"
          />
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                {review.userName}
              </h4>
              {review.verifiedPurchase && (
                <span className="flex items-center gap-1 text-xs text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
                  <FaCheckCircle />
                  Verified Purchase
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {new Date(review.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Rating */}
        <div className="flex flex-col items-end">
          <StarRating rating={review.rating} size="sm" />
          <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 mt-1">
            {review.rating}/5
          </span>
        </div>
      </div>

      {/* Review Content */}
      <div className="mb-4">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {displayComment}
        </p>
        {shouldTruncate && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-indigo-600 dark:text-indigo-400 text-sm font-medium mt-2 hover:underline"
          >
            {isExpanded ? "Show less" : "Read more"}
          </button>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onLike?.(review._id)}
            className={`flex items-center gap-2 text-sm transition-colors ${
              review.likes?.includes(user?.uid)
                ? "text-indigo-600"
                : "text-gray-500 dark:text-gray-400 hover:text-indigo-600"
            }`}
          >
            <FaThumbsUp />
            <span>Helpful ({review.likes?.length || 0})</span>
          </button>

          <button
            onClick={() => onHelpful?.(review._id)}
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 transition-colors"
          >
            Mark as Helpful
          </button>
        </div>

        {isOwner && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit?.(review)}
              className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
              title="Edit review"
            >
              <FaEdit />
            </button>
            <button
              onClick={() => onDelete?.(review._id)}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              title="Delete review"
            >
              <FaTrash />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const ReviewForm = ({ onSubmit, initialData = null, onCancel }) => {
  const [rating, setRating] = useState(initialData?.rating || 0);
  const [comment, setComment] = useState(initialData?.comment || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return;

    setIsSubmitting(true);
    await onSubmit(rating, comment);
    setIsSubmitting(false);
    if (!initialData) {
      setRating(0);
      setComment("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
        {initialData ? "Edit your review" : "Write a review"}
      </h3>

      {/* Rating */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Your Rating
        </label>
        <StarRating
          rating={rating}
          interactive
          onRate={setRating}
          size="lg"
        />
        {rating === 0 && (
          <p className="text-sm text-red-500 mt-1">Please select a rating</p>
        )}
      </div>

      {/* Comment */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Your Review
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your thoughts about this book..."
          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
          rows={4}
          required
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={rating === 0 || isSubmitting}
          className="px-6 py-2.5 bg-linear-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Submitting..." : initialData ? "Update Review" : "Submit Review"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

const ReviewStats = ({ stats }) => {
  const { averageRating, totalReviews, ratingDistribution } = stats;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md">
      <div className="flex items-center gap-8 mb-6">
        {/* Average Rating */}
        <div className="text-center">
          <div className="text-5xl font-bold text-gray-800 dark:text-gray-100 mb-1">
            {averageRating.toFixed(1)}
          </div>
          <StarRating rating={Math.round(averageRating)} size="md" />
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {totalReviews} reviews
          </p>
        </div>

        {/* Distribution */}
        <div className="flex-1 space-y-2">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = ratingDistribution[star] || 0;
            const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

            return (
              <div key={star} className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-3">
                  {star}
                </span>
                <FaStar className="text-yellow-400 w-4 h-4" />
                <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400 w-8 text-right">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export { ReviewCard, ReviewForm, ReviewStats, StarRating };
