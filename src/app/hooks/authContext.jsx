"use client";

import { createContext, useContext, useEffect, useState } from "react";
import jwt from "jsonwebtoken";
// Servicios
import { fetchRecentSurgeries } from "@/services/fetchSurgerys";
import { fetchUserData } from "@/services/fetchUsers";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [recentSurgeries, setRecentSurgeries] = useState([]);
  const [loadingSurgeries, setLoadingSurgeries] = useState(true);

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
          setUser(null);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error al decodificar el token:", err);
        setError("Error al verificar sesión");
        setLoading(false);
      }
    } else {
      setUser(null);
      setLoading(false);
    }
  }, []);

  const loadData = async (userId, token) => {
    setLoading(true);
    setLoadingSurgeries(true);
    try {
      const userData = await fetchUserData(userId, token);
      setUser(userData);

      const recentSurgeriesData = await fetchRecentSurgeries(token);
      setRecentSurgeries(recentSurgeriesData);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
      setLoadingSurgeries(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, error, recentSurgeries, loadingSurgeries }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
