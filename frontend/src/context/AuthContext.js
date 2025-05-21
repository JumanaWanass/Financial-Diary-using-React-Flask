import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check for token on initial load
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      if (token) {
        // Instead of blindly accepting the token, validate its format
        // JWT tokens are in the format xxxxx.yyyyy.zzzzz
        const isValidTokenFormat = token.split(".").length === 3;

        if (isValidTokenFormat) {
          setIsAuthenticated(true);
        } else {
          // Token doesn't have valid format
          localStorage.removeItem("token");
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Add a method to handle logout
  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        isLoading,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
