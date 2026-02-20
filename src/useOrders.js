import { useEffect, useState } from "react";

function useOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("http://localhost:3001/orders");
      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();
      setOrders(data);
    } catch (err) {
      setError("Failed to fetch");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return { orders, setOrders, loading, error };
}

export default useOrders;