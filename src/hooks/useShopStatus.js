// src/hooks/useShopStatus.js
import { useState, useEffect, useCallback } from "react";
import { shopService } from "@/api";

export const useShopStatus = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStatus = useCallback(async () => {
    try {
      setLoading(true);
      const res = await shopService.getShopStatus();
      setStatus(res);
      setError(null);
    } catch (err) {
      console.error("Error fetching shop status:", err);
      setError(err.message);
      setStatus(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  return {
    status,
    loading,
    error,
    refetch: fetchStatus,
  };
};
