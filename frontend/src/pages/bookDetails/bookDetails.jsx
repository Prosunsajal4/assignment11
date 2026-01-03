import Container from "../../components/Shared/Container";
import PurchaseModal from "../../components/Modal/PurchaseModal";
import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import LoadingSpinner from "../../components/Shared/LoadingSpinner";
import ReviewForm from "../../components/Book/ReviewForm";

const BookDetails = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const { id } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [hasPaid, setHasPaid] = useState(false);
  const [relatedBooks, setRelatedBooks] = useState([]);

  const {
    data: book,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["book", id],
    queryFn: async () => {
      const result = await axios(`${import.meta.env.VITE_API_URL}/books/${id}`);
      return result.data;
    },
  });

  // Check if book is wishlisted
  useEffect(() => {
    if (!user?.email || !id) return;
    axiosSecure
      .get(`/wishlist/check?email=${user.email}&bookId=${id}`)
      .then((res) => setWishlisted(res.data?.wishlisted))
      .catch(() => setWishlisted(false));
  }, [user?.email, id, axiosSecure]);

  const handleWishlist = async () => {
    if (!user?.email) return;
    setWishlistLoading(true);
    try {
      if (wishlisted) {
        await axiosSecure.delete(`/wishlist?email=${user.email}&bookId=${id}`);
        setWishlisted(false);
      } else {
        await axiosSecure.post(`/wishlist`, { email: user.email, bookId: id });
        setWishlisted(true);
      }
    } catch (err) {
      console.error("Wishlist toggle failed", err);
    }
    setWishlistLoading(false);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  // Fetch reviews
  useEffect(() => {
    if (!id) return;
    let isMounted = true;
    axios
      .get(`${import.meta.env.VITE_API_URL}/reviews?bookId=${id}`)
      .then((res) => {
        if (isMounted) {
          setReviews(res.data || []);
          setReviewsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setReviewsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [id]);

  const refreshReviews = () => {
    setReviewsLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_URL}/reviews?bookId=${id}`)
      .then((res) => setReviews(res.data || []))
      .finally(() => setReviewsLoading(false));
  };

  // Check payment/ordering status using axiosSecure (protected route)
  useEffect(() => {
    if (!user?.email || !id) return;
    axiosSecure
      .get(`/orders/check?email=${user.email}&bookId=${id}`)
      .then((res) => {
        setHasPaid(res.data?.ordered);
      })
      .catch(() => {
        setHasPaid(false);
      });
  }, [user?.email, id, axiosSecure]);

  // Fetch related books by category
  useEffect(() => {
    if (!book?.category || !id) return;
    axios
      .get(`${import.meta.env.VITE_API_URL}/books`)
      .then((res) => {
        const related = (res.data || [])
          .filter((b) => b.category === book.category && b._id !== id)
          .slice(0, 4);
        setRelatedBooks(related);
      })
      .catch(() => setRelatedBooks([]));
  }, [book?.category, id]);

  if (isLoading) return <LoadingSpinner />;
  if (isError || !book)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-red-50 rounded-2xl">
          <svg
            className="w-16 h-16 text-red-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h3 className="text-xl font-bold text-red-600 mb-2">
            Oops! Book Not Found
          </h3>
          <p className="text-red-500">
            The book you're looking for doesn't exist or server error occurred.
          </p>
        </div>
      </div>
    );

  const { image, name, description, category, quantity, price, seller } = book;
  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
        ).toFixed(1)
      : 0;

  return (
    <Container>
      <div className="min-h-screen py-8">
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left - Image Section */}
          <div className="space-y-4">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition duration-500" />
              <div className="relative bg-white rounded-2xl overflow-hidden shadow-xl">
                <img
                  className="w-full h-[500px] object-cover transform group-hover:scale-105 transition duration-700"
                  src={image}
                  alt={name}
                />
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-sm font-semibold text-indigo-600 shadow-lg">
                    📚 {category}
                  </span>
                </div>
                {/* Quantity Badge */}
                <div className="absolute top-4 right-4">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold shadow-lg ${
                      quantity > 5
                        ? "bg-green-100 text-green-700"
                        : quantity > 0
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {quantity > 0 ? `${quantity} in stock` : "Out of stock"}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-4 text-center">
                <div className="text-2xl mb-1">⭐</div>
                <div className="text-2xl font-bold text-indigo-600">
                  {avgRating}
                </div>
                <div className="text-xs text-indigo-500">Rating</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4 text-center">
                <div className="text-2xl mb-1">💬</div>
                <div className="text-2xl font-bold text-purple-600">
                  {reviews.length}
                </div>
                <div className="text-xs text-purple-500">Reviews</div>
              </div>
              <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl p-4 text-center">
                <div className="text-2xl mb-1">📦</div>
                <div className="text-2xl font-bold text-pink-600">
                  {quantity}
                </div>
                <div className="text-xs text-pink-500">Available</div>
              </div>
            </div>
          </div>

          {/* Right - Details Section */}
          <div className="space-y-6">
            {/* Title & Price */}
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2 leading-tight">
                {name}
              </h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-5 h-5 ${
                        star <= Math.round(avgRating)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="text-gray-500 ml-2">
                    ({reviews.length} reviews)
                  </span>
                </div>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  ${price}
                </span>
                <span className="text-lg text-gray-400 line-through">
                  ${(price * 1.2).toFixed(2)}
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
                  20% OFF
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-indigo-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Description
              </h3>
              <p className="text-gray-600 leading-relaxed">{description}</p>
            </div>

            {/* Seller Info */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6">
              <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-indigo-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Seller Information
              </h3>
              <div className="flex items-center gap-4">
                <img
                  className="w-14 h-14 rounded-full object-cover ring-4 ring-white shadow-lg"
                  alt="Seller"
                  referrerPolicy="no-referrer"
                  src={seller?.image || "https://via.placeholder.com/56"}
                />
                <div>
                  <p className="font-semibold text-gray-800">
                    {seller?.name || "Unknown Seller"}
                  </p>
                  <p className="text-sm text-gray-500">{seller?.email}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-green-500">✓</span>
                    <span className="text-xs text-green-600 font-medium">
                      Verified Seller
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => setIsOpen(true)}
                disabled={quantity === 0}
                className="flex-1 py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                {quantity > 0 ? "Buy Now" : "Out of Stock"}
              </button>

              {user?.email && (
                <button
                  onClick={handleWishlist}
                  disabled={wishlistLoading}
                  className={`py-4 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 ${
                    wishlisted
                      ? "bg-pink-100 text-pink-600 hover:bg-pink-200"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {wishlistLoading ? (
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className={`w-5 h-5 ${wishlisted ? "fill-current" : ""}`}
                      fill={wishlisted ? "currentColor" : "none"}
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  )}
                  {wishlisted ? "Wishlisted" : "Wishlist"}
                </button>
              )}
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              <div className="text-center">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-xs text-gray-600 font-medium">
                  Secure Payment
                </p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
                <p className="text-xs text-gray-600 font-medium">
                  Fast Delivery
                </p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg
                    className="w-5 h-5 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <p className="text-xs text-gray-600 font-medium">
                  100% Authentic
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section - Everyone can see */}
        <div className="mt-16">
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                <span className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  ⭐
                </span>
                Reviews & Ratings
              </h2>
              {reviews.length > 0 && (
                <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-full">
                  <span className="text-2xl font-bold text-yellow-600">
                    {avgRating}
                  </span>
                  <span className="text-yellow-600">/5</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-500">
                    {reviews.length} reviews
                  </span>
                </div>
              )}
            </div>

            {/* Reviews List */}
            {reviewsLoading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-2xl">
                    <div className="text-6xl mb-4">📝</div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      No Reviews Yet
                    </h3>
                    <p className="text-gray-500">
                      Be the first to review this book!
                    </p>
                  </div>
                ) : (
                  reviews.map((review, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-50 rounded-2xl p-6 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {review.email?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-800">
                              {review.email}
                            </h4>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <svg
                                  key={star}
                                  className={`w-4 h-4 ${
                                    star <= review.rating
                                      ? "text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-600">{review.review}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Review Form - Only for those who purchased */}
            {hasPaid && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <ReviewForm bookId={id} onReviewAdded={refreshReviews} />
              </div>
            )}

            {!hasPaid && user?.email && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <p className="text-gray-500 flex items-center justify-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Purchase this book to leave a review
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Related Books Section */}
        {relatedBooks.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 flex items-center gap-3">
              <span className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white text-xl">
                📚
              </span>
              Related Books
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedBooks.map((relatedBook) => (
                <div
                  key={relatedBook._id}
                  onClick={() => navigate(`/book/${relatedBook._id}`)}
                  className="group cursor-pointer bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={relatedBook.image}
                      alt={relatedBook.name}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-4">
                    <span className="inline-block px-2 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 text-xs font-semibold rounded-full mb-2">
                      {relatedBook.category}
                    </span>
                    <h3 className="font-bold text-gray-800 dark:text-white line-clamp-1 mb-1">
                      {relatedBook.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                        ${relatedBook.price}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {relatedBook.quantity > 0
                          ? `${relatedBook.quantity} in stock`
                          : "Out of stock"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <PurchaseModal book={book} closeModal={closeModal} isOpen={isOpen} />
      </div>
    </Container>
  );
};

export default BookDetails;
