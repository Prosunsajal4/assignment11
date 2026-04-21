import { useState, useEffect, useCallback } from "react";
import useAuth from "./useAuth";
import axios from "axios";
import toast from "react-hot-toast";

const usePriceAlerts = () => {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAlerts = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const token = await user.getIdToken();
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/price-alerts?email=${user.email}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAlerts(response.data);
    } catch {
      // Silently fail
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const createAlert = async (bookId, targetPrice) => {
    if (!user) {
      toast.error("Please login to set price alerts");
      return { success: false };
    }

    try {
      const token = await user.getIdToken();
      await axios.post(
        `${import.meta.env.VITE_API_URL}/price-alerts`,
        { email: user.email, bookId, targetPrice },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Price alert created!");
      await fetchAlerts();
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create alert");
      return { success: false };
    }
  };

  const deleteAlert = async (alertId) => {
    if (!user) return { success: false };

    try {
      const token = await user.getIdToken();
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/price-alerts/${alertId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Alert removed");
      await fetchAlerts();
      return { success: true };
    } catch {
      toast.error("Failed to remove alert");
      return { success: false };
    }
  };

  const checkPriceAlert = (bookId) => {
    return alerts.find((alert) => alert.bookId === bookId);
  };

  return {
    alerts,
    isLoading,
    createAlert,
    deleteAlert,
    checkPriceAlert,
    refreshAlerts: fetchAlerts,
    alertCount: alerts.length,
  };
};

export default usePriceAlerts;
