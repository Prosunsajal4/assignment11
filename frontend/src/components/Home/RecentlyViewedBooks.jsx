import { Link } from "react-router-dom";
import {
  FaHistory,
  FaTrash,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import useRecentlyViewed from "../../hooks/useRecentlyViewed";
import { useRef } from "react";

const RecentlyViewedBooks = () => {
  const { recentBooks, clearRecentlyViewed, removeFromRecentlyViewed } =
    useRecentlyViewed();
  const scrollRef = useRef(null);

  if (recentBooks.length === 0) return null;

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center">
              <FaHistory className="text-2xl text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                Recently Viewed
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {recentBooks.length} book{recentBooks.length > 1 ? "s" : ""} you
                viewed recently
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Scroll Buttons */}
            <button
              onClick={() => scroll("left")}
              className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-md flex items-center justify-center hover:shadow-lg transition-shadow"
            >
              <FaChevronLeft className="text-gray-600 dark:text-gray-400" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-md flex items-center justify-center hover:shadow-lg transition-shadow"
            >
              <FaChevronRight className="text-gray-600 dark:text-gray-400" />
            </button>

            {/* Clear Button */}
            <button
              onClick={clearRecentlyViewed}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-sm font-medium"
            >
              <FaTrash />
              Clear
            </button>
          </div>
        </div>

        {/* Books Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {recentBooks.map((book) => (
            <div key={book._id} className="shrink-0 w-48 snap-start group">
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                {/* Image */}
                <Link
                  to={`/book/${book._id}`}
                  className="block relative h-64 overflow-hidden"
                >
                  <img
                    src={book.image}
                    alt={book.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>

                {/* Remove Button */}
                <button
                  onClick={() => removeFromRecentlyViewed(book._id)}
                  className="absolute top-2 right-2 w-8 h-8 bg-white/90 dark:bg-gray-800/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                >
                  <FaTrash className="text-red-500 text-sm" />
                </button>

                {/* Info */}
                <div className="p-4">
                  <Link to={`/book/${book._id}`}>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 line-clamp-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                      {book.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {book.category}
                  </p>
                  <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400 mt-2">
                    ${book.price}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentlyViewedBooks;
