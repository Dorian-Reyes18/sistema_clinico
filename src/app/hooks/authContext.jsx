import { createContext, useContext, useEffect, useState } from "react";
import jwt from "jsonwebtoken";
// Servicios
import { fetchRecentSurgeries } from "@/services/fetchSurgerys";
import { fetchUserData } from "@/services/fetchUsers";
import { fetchSurgeriesPost } from "@/services/fetchSurgerysPost";
import { fetchPatients } from "@/services/fetchPatients";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [recentSurgeries, setRecentSurgeries] = useState([]);
  const [surgeriesPost, setSurgeriesPost] = useState([]);
  const [patients, setPatients] = useState([]);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  };

  useEffect(() => {
    const token = getCookie("token");

    if (token) {
      try {
        const decodedToken = jwt.decode(token);

        if (decodedToken && decodedToken.exp * 1000 > Date.now()) {
          loadData(decodedToken.id, token);
        } else {
          handleInvalidSession();
        }
      } catch (err) {
        console.error("Error al decodificar el token:", err);
        handleInvalidSession();
      }
    } else {
      handleInvalidSession();
    }
  }, []);

  const handleInvalidSession = () => {
    setUser(null);
    setLoading(false);
  };

  const loadData = async (userId, token) => {
    setLoading(true);
    try {
      const userData = await fetchUserData(userId, token);
      setUser(userData);

      const recentSurgeriesData = await fetchRecentSurgeries(token);
      setRecentSurgeries(recentSurgeriesData);

      const allSurgeriesPostData = await fetchSurgeriesPost(token);
      setSurgeriesPost(allSurgeriesPostData);

      const allPatients = await fetchPatients(token);
      setPatients(allPatients);
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
        patients,
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
