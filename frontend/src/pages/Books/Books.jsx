import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Container from "../../components/Shared/Container";
import {
  useState,
  useMemo,
  useDeferredValue,
  useTransition,
  useCallback,
} from "react";
import { BookGridSkeleton } from "../../components/Shared/Skeleton/Skeleton";
import BookCard from "../../components/Shared/BookCard";

const ITEMS_PER_PAGE = 9;

const Books = () => {
  const { data: books = [], isLoading } = useQuery({
    queryKey: ["books"],
    queryFn: async () => {
      const result = await axios(`${import.meta.env.VITE_API_URL}/books`);
      return result.data;
    },
  });

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [category, setCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Modern React: useDeferredValue for search to prevent blocking UI
  const deferredSearch = useDeferredValue(search);

  // Modern React: useTransition for non-urgent updates
  const [isPending, startTransition] = useTransition();

  // Get unique categories
  const categories = useMemo(() => {
    const cats = [...new Set(books.map((b) => b.category))];
    return cats.filter(Boolean);
  }, [books]);

  // Filter and sort books - using deferred search for better performance
  const filteredBooks = useMemo(() => {
    let filtered = books.filter((b) =>
      b.name.toLowerCase().includes(deferredSearch.toLowerCase())
    );
    if (category) {
      filtered = filtered.filter((b) => b.category === category);
    }
    if (sort === "low") {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    } else if (sort === "high") {
      filtered = [...filtered].sort((a, b) => b.price - a.price);
    } else if (sort === "newest") {
      filtered = [...filtered].reverse();
    }
    return filtered;
  }, [books, deferredSearch, sort, category]);

  // Pagination
  const totalPages = Math.ceil(filteredBooks.length / ITEMS_PER_PAGE);
  const paginatedBooks = filteredBooks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Modern React: useCallback for event handlers to prevent unnecessary re-renders
  const handleFilterChange = useCallback(
    (setter) => (value) => {
      startTransition(() => {
        setter(value);
        setCurrentPage(1);
      });
    },
    []
  );

  const handleSearchChange = useCallback((value) => {
    setSearch(value);
    startTransition(() => {
      setCurrentPage(1);
    });
  }, []);

  const handlePageChange = useCallback((page) => {
    startTransition(() => {
      setCurrentPage(page);
    });
  }, []);

  const handleClearFilters = useCallback(() => {
    startTransition(() => {
      setSearch("");
      setCategory("");
      setSort("");
      setCurrentPage(1);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12">
      <Container>
        {/* Page Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 text-indigo-700 dark:text-indigo-300 text-sm font-semibold rounded-full mb-4">
            📖 Browse Collection
          </span>
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            All{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Books
            </span>
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Explore our extensive collection of books across various genres.
            Find your perfect read today!
          </p>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search books by name..."
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 focus:bg-white transition-all duration-200"
              />
              {/* Modern: Show loading indicator when search is being deferred */}
              {isPending && (
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                  <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>

            {/* Category Filter */}
            <div className="relative">
              <select
                value={category}
                onChange={(e) =>
                  handleFilterChange(setCategory)(e.target.value)
                }
                className="w-full appearance-none pl-4 pr-10 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 focus:bg-white transition-all duration-200 cursor-pointer"
                disabled={isPending}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => handleFilterChange(setSort)(e.target.value)}
                className="w-full appearance-none pl-4 pr-10 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 focus:bg-white transition-all duration-200 cursor-pointer"
                disabled={isPending}
              >
                <option value="">Sort by</option>
                <option value="newest">Newest First</option>
                <option value="low">Price: Low to High</option>
                <option value="high">Price: High to Low</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
            <span>
              Showing{" "}
              <span className="font-semibold text-indigo-600">
                {paginatedBooks.length}
              </span>{" "}
              of <span className="font-semibold">{filteredBooks.length}</span>{" "}
              books
            </span>
            {(search || category || sort) && (
              <button
                onClick={handleClearFilters}
                disabled={isPending}
                className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-medium disabled:opacity-50"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Books Grid */}
        {isLoading ? (
          <BookGridSkeleton count={9} />
        ) : filteredBooks.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-bold text-gray-700 dark:text-white mb-2">
              No Books Found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Try adjusting your search or filter criteria
            </p>
            <button
              onClick={handleClearFilters}
              disabled={isPending}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {paginatedBooks.map((book, index) => (
              <BookCard key={book._id} book={book} index={index} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1 || isPending}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-gray-200 rounded-xl font-medium text-gray-700 hover:border-indigo-500 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Previous
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => {
                  // Show first, last, current, and adjacent pages
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        disabled={isPending}
                        className={`w-10 h-10 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 ${
                          currentPage === page
                            ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30"
                            : "bg-white border-2 border-gray-200 text-gray-700 hover:border-indigo-500 hover:text-indigo-600"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (
                    page === currentPage - 2 ||
                    page === currentPage + 2
                  ) {
                    return (
                      <span key={page} className="text-gray-400">
                        ...
                      </span>
                    );
                  }
                  return null;
                }
              )}
            </div>

            <button
              onClick={() =>
                handlePageChange(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages || isPending}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-gray-200 rounded-xl font-medium text-gray-700 hover:border-indigo-500 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Next
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        )}
      </Container>
    </div>
  );
};

export default Books;
