import { createContext, useContext, useEffect, useState } from "react";
import jwt from "jsonwebtoken";
// Servicios
import { fetchRecentSurgeries } from "@/services/fetchSurgerys";
import { fetchUserData } from "@/services/fetchUsers";
import { fetchSurgeriesPost } from "@/services/fetchSurgerysPost";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [recentSurgeries, setRecentSurgeries] = useState([]);
  const [surgeriesPost, setSurgeriesPost] = useState([]);

  // Helper function to get token from cookies
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  };

  // Effect to handle authentication and data loading
  useEffect(() => {
    const token = getCookie("token");
    
    if (token) {
      try {
        const decodedToken = jwt.decode(token);

        // Check if token is expired
        if (decodedToken && decodedToken.exp * 1000 > Date.now()) {
          loadData(decodedToken.id, token); // Load user data if valid token
        } else {
          // If token is expired or invalid, clear session
          handleInvalidSession();
        }
      } catch (err) {
        console.error("Error al decodificar el token:", err);
        handleInvalidSession();
      }
    } else {
      // If no token present, set user as null and stop loading
      handleInvalidSession();
    }
  }, []);

  // Function to handle invalid session (token expired, no token, etc.)
  const handleInvalidSession = () => {
    setUser(null);
    setLoading(false);
  };

  // Function to load user data and other data after verifying token
  const loadData = async (userId, token) => {
    setLoading(true);
    try {
      const userData = await fetchUserData(userId, token);
      setUser(userData);

      const recentSurgeriesData = await fetchRecentSurgeries(token);
      setRecentSurgeries(recentSurgeriesData);

      const allSurgeriesPostData = await fetchSurgeriesPost(token);
      setSurgeriesPost(allSurgeriesPostData);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        recentSurgeries,
        surgeriesPost,
        loadData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
