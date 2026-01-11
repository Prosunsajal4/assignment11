import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useOptimistic, useTransition, useCallback } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Container from "../../components/Shared/Container";
import Heading from "../../components/Shared/Heading";
import BookCourierSpinner from "../../components/Shared/BookCourierSpinner";
import { Link } from "react-router-dom";

const MyWishlist = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();

  const { data: wishlist = [], isLoading } = useQuery({
    queryKey: ["wishlist", user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      const res = await axiosSecure.get(`/wishlist?email=${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  // Modern: useOptimistic for instant UI updates
  const [optimisticWishlist, setOptimisticWishlist] = useOptimistic(
    wishlist,
    (state, action) => {
      switch (action.type) {
        case "remove":
          return state.filter((book) => book._id !== action.bookId);
        default:
          return state;
      }
    }
  );

  const { mutateAsync: removeFromWishlist } = useMutation({
    mutationFn: async (bookId) =>
      axiosSecure.delete(`/wishlist?email=${user.email}&bookId=${bookId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["wishlist", user?.email],
      });
    },
  });

  // Modern: useCallback for stable function references
  const handleRemoveFromWishlist = useCallback(
    async (bookId) => {
      // Optimistic update
      setOptimisticWishlist({ type: "remove", bookId });

      startTransition(async () => {
        try {
          await removeFromWishlist(bookId);
        } catch (error) {
          // Revert optimistic update on error
          setOptimisticWishlist({ type: "revert", bookId });
          console.error("Failed to remove from wishlist:", error);
        }
      });
    },
    [removeFromWishlist, setOptimisticWishlist, startTransition]
  );

  if (isLoading) return <BookCourierSpinner />;

  return (
    <Container>
      <Heading title="My Wishlist" />
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
        layout
      >
        <AnimatePresence mode="popLayout">
          {optimisticWishlist.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="col-span-full text-center py-16"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="text-6xl mb-4"
              >
                📚
              </motion.div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Your wishlist is empty
              </h3>
              <p className="text-gray-500 mb-6">
                Start adding books you love to your wishlist!
              </p>
              <Link
                to="/books"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
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
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Browse Books
              </Link>
            </motion.div>
          )}
          {optimisticWishlist.map((book, index) => (
            <motion.div
              key={book._id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{
                opacity: 0,
                scale: 0.8,
                transition: { duration: 0.2 },
              }}
              transition={{
                delay: index * 0.1,
                type: "spring",
                stiffness: 100,
              }}
              className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center gap-4 hover:shadow-2xl transition-all duration-300 border border-transparent hover:border-indigo-200 group"
            >
              <Link
                to={`/book/${book._id}`}
                className="flex flex-col items-center w-full"
              >
                <motion.div
                  className="relative mb-4"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <img
                    src={book.image}
                    alt={book.name}
                    className="h-40 w-32 object-cover rounded-xl shadow-md"
                    loading="lazy"
                  />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={false}
                  />
                </motion.div>
                <motion.h3
                  className="font-bold text-gray-800 text-lg mb-2 text-center line-clamp-2 group-hover:text-indigo-600 transition-colors"
                  whileHover={{ scale: 1.02 }}
                >
                  {book.name}
                </motion.h3>
                <p className="text-sm text-gray-500 mb-1">{book.category}</p>
                <motion.span
                  className="font-bold text-indigo-600 text-lg"
                  whileHover={{ scale: 1.1 }}
                >
                  ${book.price}
                </motion.span>
              </Link>

              <motion.button
                className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-2 px-4 rounded-full font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                disabled={isPending}
                onClick={() => handleRemoveFromWishlist(book._id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <motion.span
                  key={isPending ? "removing" : "remove"}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {isPending ? (
                    <div className="flex items-center justify-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                      Removing...
                    </div>
                  ) : (
                    "Remove from Wishlist"
                  )}
                </motion.span>
              </motion.button>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </Container>
  );
};

export default MyWishlist;
