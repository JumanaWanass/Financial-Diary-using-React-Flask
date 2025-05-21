import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const useAuthFetch = (url) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { setIsAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          // No token found, clear authentication state
          setIsAuthenticated(false);
          throw new Error("No authentication token found");
        }

        const apiUrl = url.includes("/api/")
          ? url
          : url.replace("http://localhost:5000/", "http://localhost:5000/api/");

        const response = await fetch(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          if (response.status === 401) {
            // Token is invalid or expired
            localStorage.removeItem("token");
            setIsAuthenticated(false);
            throw new Error("Authentication expired. Please log in again.");
          }
          throw new Error(`Failed to fetch data: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
        setError(null);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, setIsAuthenticated]);

  return { data, error, loading };
};

export default useAuthFetch;
