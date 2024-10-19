import { createContext, useContext, useEffect, useState } from "react";
import jwt from "jsonwebtoken";
import {
  fetchRecentSurgeries,
  fetchUserData,
  fetchSurgeriesPost,
  fetchPatients,
  fetchMetadata,
} from "@/services/fetchAllData";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [recentSurgeries, setRecentSurgeries] = useState([]);
  const [surgeriesPost, setSurgeriesPost] = useState([]);
  const [patients, setPatients] = useState([]);
  const [metadata, setMetadata] = useState([]);

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
      const metadata = await fetchMetadata(token);
      setMetadata(metadata);
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
        metadata,
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
