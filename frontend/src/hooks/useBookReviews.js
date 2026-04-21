import { useState, useEffect, useCallback } from "react";
import useAuth from "./useAuth";
import axios from "axios";
import toast from "react-hot-toast";

const useBookReviews = (bookId) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userReview, setUserReview] = useState(null);
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  });

  const fetchReviews = useCallback(async () => {
    if (!bookId) return;
    
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/reviews/${bookId}`
      );
      setReviews(response.data.reviews || []);
      setStats({
        averageRating: response.data.averageRating || 0,
        totalReviews: response.data.totalReviews || 0,
        ratingDistribution: response.data.ratingDistribution || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      });
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setIsLoading(false);
    }
  }, [bookId]);

  // Check if user has already reviewed
  const checkUserReview = useCallback(async () => {
    if (!user || !bookId) return;
    
    try {
      const token = await user.getIdToken();
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/reviews/user/${bookId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.review) {
        setUserReview(response.data.review);
      }
    } catch {
      // No review found or error - that's ok
    }
  }, [user, bookId]);

  useEffect(() => {
    fetchReviews();
    checkUserReview();
  }, [fetchReviews, checkUserReview]);

  const submitReview = async (rating, comment) => {
    if (!user) {
      toast.error("Please login to leave a review");
      return { success: false };
    }

    try {
      const token = await user.getIdToken();
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/reviews`,
        { bookId, rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success("Review submitted successfully");
      setUserReview(response.data.review);
      await fetchReviews(); // Refresh reviews
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review");
      return { success: false };
    }
  };

  const updateReview = async (reviewId, rating, comment) => {
    if (!user) return { success: false };

    try {
      const token = await user.getIdToken();
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/reviews/${reviewId}`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success("Review updated successfully");
      setUserReview(response.data.review);
      await fetchReviews();
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update review");
      return { success: false };
    }
  };

  const deleteReview = async (reviewId) => {
    if (!user) return { success: false };

    try {
      const token = await user.getIdToken();
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/reviews/${reviewId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success("Review deleted");
      setUserReview(null);
      await fetchReviews();
      return { success: true };
    } catch (error) {
      toast.error("Failed to delete review");
      return { success: false };
    }
  };

  const likeReview = async (reviewId) => {
    if (!user) {
      toast.error("Please login to like reviews");
      return;
    }

    try {
      const token = await user.getIdToken();
      await axios.post(
        `${import.meta.env.VITE_API_URL}/reviews/${reviewId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchReviews();
    } catch {
      toast.error("Failed to like review");
    }
  };

  const markHelpful = async (reviewId) => {
    if (!user) {
      toast.error("Please login to mark reviews as helpful");
      return;
    }

    try {
      const token = await user.getIdToken();
      await axios.post(
        `${import.meta.env.VITE_API_URL}/reviews/${reviewId}/helpful`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchReviews();
    } catch {
      toast.error("Failed to mark review as helpful");
    }
  };

  return {
    reviews,
    isLoading,
    userReview,
    stats,
    submitReview,
    updateReview,
    deleteReview,
    likeReview,
    markHelpful,
    refreshReviews: fetchReviews,
  };
};

export default useBookReviews;
