import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import BookCourierSpinner from "../Shared/BookCourierSpinner";
import Container from "../Shared/Container";
import { Link } from "react-router-dom";
import { useState } from "react";
import BookCard from "../Shared/BookCard";
import { FaSearch, FaSortAmountDown } from "react-icons/fa";

const LatestBooks = () => {
  const { data: books = [], isLoading } = useQuery({
    queryKey: ["books"],
    queryFn: async () => {
      const result = await axios(`${import.meta.env.VITE_API_URL}/books`);
      return result.data;
    },
  });

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");

  if (isLoading) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center py-20">
          <BookCourierSpinner />
          <p className="mt-4 text-gray-500 dark:text-gray-400">Loading latest books...</p>
        </div>
      </Container>
    );
  }

  let filteredBooks = books.filter((book) =>
    book.name.toLowerCase().includes(search.toLowerCase()),
  );

  if (sort === "low") {
    filteredBooks = [...filteredBooks].sort((a, b) => a.price - b.price);
  } else if (sort === "high") {
    filteredBooks = [...filteredBooks].sort((a, b) => b.price - a.price);
  }

  const latestSix = filteredBooks.slice(-6).reverse();

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <Container>
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 text-indigo-700 dark:text-indigo-300 text-sm font-semibold rounded-full mb-4">
            Fresh Arrivals
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
            Latest{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Books
            </span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Discover our newest collection of handpicked books from various genres and authors
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10 items-center justify-center max-w-2xl mx-auto">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search books..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 text-gray-800 dark:text-white placeholder-gray-400"
            />
          </div>
          <div className="relative w-full sm:w-auto">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="appearance-none w-full pl-4 pr-10 py-3 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 cursor-pointer text-gray-800 dark:text-white"
            >
              <option value="">Sort by price</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <FaSortAmountDown className="text-gray-400" />
            </div>
          </div>
        </div>

        {/* Books Grid */}
        {latestSix.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestSix.map((book, index) => (
              <BookCard key={book._id} book={book} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
              No books found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Try adjusting your search or browse our full collection.
            </p>
          </div>
        )}

        {/* View All Button */}
        <div className="mt-12 flex justify-center">
          <Link
            to="/books"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all duration-300"
          >
            View All Books
            <svg
              className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </Container>
    </section>
  );
};

export default LatestBooks;
