import { useState, useEffect, useCallback } from "react";

const RECENTLY_VIEWED_KEY = "recently_viewed_books";
const MAX_RECENT_ITEMS = 10;

const useRecentlyViewed = () => {
  const [recentBooks, setRecentBooks] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(RECENTLY_VIEWED_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setRecentBooks(parsed);
      } catch {
        localStorage.removeItem(RECENTLY_VIEWED_KEY);
      }
    }
  }, []);

  // Save to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(recentBooks));
  }, [recentBooks]);

  const addToRecentlyViewed = useCallback((book) => {
    setRecentBooks((prev) => {
      // Remove if already exists (to move to top)
      const filtered = prev.filter((b) => b._id !== book._id);
      // Add new book at the beginning
      const updated = [book, ...filtered].slice(0, MAX_RECENT_ITEMS);
      return updated;
    });
  }, []);

  const clearRecentlyViewed = useCallback(() => {
    setRecentBooks([]);
    localStorage.removeItem(RECENTLY_VIEWED_KEY);
  }, []);

  const removeFromRecentlyViewed = useCallback((bookId) => {
    setRecentBooks((prev) => prev.filter((b) => b._id !== bookId));
  }, []);

  return {
    recentBooks,
    addToRecentlyViewed,
    clearRecentlyViewed,
    removeFromRecentlyViewed,
    recentCount: recentBooks.length,
  };
};

export default useRecentlyViewed;
