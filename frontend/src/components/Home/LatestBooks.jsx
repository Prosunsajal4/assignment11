import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import LoadingSpinner from "../Shared/LoadingSpinner";
import Container from "../Shared/Container";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const LatestBooks = () => {
  const navigate = useNavigate();
  const { data: books = [], isLoading } = useQuery({
    queryKey: ["books"],
    queryFn: async () => {
      const result = await axios(`${import.meta.env.VITE_API_URL}/books`);
      return result.data;
    },
  });

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");

  if (isLoading) return <LoadingSpinner />;

  // Filter books by search
  let filteredBooks = books.filter((book) =>
    book.name.toLowerCase().includes(search.toLowerCase())
  );

  // Sort books by price
  if (sort === "low") {
    filteredBooks = [...filteredBooks].sort((a, b) => a.price - b.price);
  } else if (sort === "high") {
    filteredBooks = [...filteredBooks].sort((a, b) => b.price - a.price);
  }

  // Take last 6 items assuming API returns chronological list
  const latestSix = filteredBooks.slice(-6).reverse();

  return (
    <Container>
      {/* Section Header */}
      <div className="text-center mb-12">
        <span className="inline-block px-4 py-2 bg-indigo-100 text-indigo-700 text-sm font-semibold rounded-full mb-4">
          📚 Fresh Arrivals
        </span>
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Latest{" "}
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Books
          </span>
        </h2>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Discover our newest collection of handpicked books from various genres
          and authors
        </p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-10 items-center justify-center">
        <div className="relative w-full md:w-96">
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
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200"
          />
        </div>
        <div className="relative">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="appearance-none pl-4 pr-10 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 cursor-pointer"
          >
            <option value="">Sort by price</option>
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

      {/* Books Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {latestSix.map((book) => (
          <div
            key={book._id}
            className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
          >
            {/* Image Container */}
            <div className="relative h-64 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
              <img
                src={book.image}
                alt={book.name}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
              />
              {/* Category Badge */}
              <div className="absolute top-4 left-4 z-20">
                <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-indigo-600">
                  {book.category}
                </span>
              </div>
              {/* Price Badge */}
              <div className="absolute top-4 right-4 z-20">
                <span className="px-3 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full text-sm font-bold text-white shadow-lg">
                  ${book.price}
                </span>
              </div>
              {/* Quick Actions */}
              <div className="absolute bottom-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-indigo-50 transition-colors">
                  <svg
                    className="w-5 h-5 text-indigo-600"
                    fill="none"
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
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <h3 className="font-bold text-xl text-gray-800 mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                {book.name}
              </h3>
              <p className="text-gray-500 text-sm line-clamp-2 mb-4">
                {book.description ||
                  "Discover an amazing reading experience with this carefully selected book."}
              </p>

              {/* Seller Info */}
              {book.seller && (
                <div className="flex items-center gap-2 mb-4">
                  <img
                    src={book.seller.image || "https://via.placeholder.com/32"}
                    alt={book.seller.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-100"
                  />
                  <span className="text-sm text-gray-500">
                    by {book.seller.name || "Unknown"}
                  </span>
                </div>
              )}

              {/* Stock & Button */}
              <div className="flex items-center justify-between">
                <span
                  className={`text-sm font-medium ${
                    book.quantity > 5
                      ? "text-green-600"
                      : book.quantity > 0
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {book.quantity > 0
                    ? `${book.quantity} in stock`
                    : "Out of stock"}
                </span>
                <button
                  onClick={() => navigate(`/book/${book._id}`)}
                  className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  View Details
                </button>
              </div>
            </div>

            {/* Hover Border Effect */}
            <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-indigo-500/30 transition-colors duration-300 pointer-events-none" />
          </div>
        ))}
      </div>

      {/* View All Button */}
      <div className="mt-12 flex justify-center">
        <Link
          to="/books"
          className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transform hover:-translate-y-0.5 transition-all duration-200"
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
  );
};

export default LatestBooks;
