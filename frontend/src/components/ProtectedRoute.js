import { useContext, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // If not loading and not authenticated, navigate to login
    if (!isLoading && !isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isLoading, isAuthenticated, navigate]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="content">
        <h2>Loading...</h2>
      </div>
    );
  }

  // This will handle the initial check
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
