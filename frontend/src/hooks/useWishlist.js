import { useCallback, useEffect, useState } from "react";
import useAuth from "./useAuth";
import axios from "axios";

const useWishlist = () => {
  const { user } = useAuth();
  const [wishlistCount, setWishlistCount] = useState(0);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (!user) {
      setWishlistCount(0);
      setWishlistItems([]);
      return;
    }
    setIsLoading(true);
    try {
      const token = await user.getIdToken();
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/wishlist?email=${user.email}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setWishlistCount(response.data.length);
      setWishlistItems(response.data);
    } catch {
      setWishlistCount(0);
      setWishlistItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const addToWishlist = async (bookId) => {
    if (!user) return { success: false, message: "Please login" };
    try {
      const token = await user.getIdToken();
      await axios.post(
        `${import.meta.env.VITE_API_URL}/wishlist`,
        { email: user.email, bookId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchWishlist();
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message };
    }
  };

  const removeFromWishlist = async (bookId) => {
    if (!user) return { success: false };
    try {
      const token = await user.getIdToken();
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/wishlist?email=${user.email}&bookId=${bookId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchWishlist();
      return { success: true };
    } catch {
      return { success: false };
    }
  };

  const isInWishlist = (bookId) => {
    return wishlistItems.some((item) => item._id === bookId || item.bookId === bookId);
  };

  return {
    wishlistCount,
    wishlistItems,
    isLoading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    refreshWishlist: fetchWishlist,
  };
};

export default useWishlist;
