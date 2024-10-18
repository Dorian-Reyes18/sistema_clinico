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

// Función para guardar datos en el caché con un TTL (Time-To-Live)
const setCacheWithTTL = (key, data, ttl) => {
  const now = Date.now();
  localStorage.setItem(key, JSON.stringify({ data, expiry: now + ttl }));
};

// Función para obtener datos del caché y verificar si han expirado
const getCacheWithTTL = (key) => {
  const cachedItem = localStorage.getItem(key);
  if (!cachedItem) return null;

  const item = JSON.parse(cachedItem);
  const now = Date.now();

  // Verificar si el caché ha expirado
  if (now > item.expiry) {
    localStorage.removeItem(key); // Remover datos expirados
    return null;
  }

  return item.data;
};

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [recentSurgeries, setRecentSurgeries] = useState([]);
  const [surgeriesPost, setSurgeriesPost] = useState([]);
  const [patients, setPatients] = useState([]);
  const [metadata, setMetadata] = useState([]);

  // Tiempo de vida del caché (ej. 5 minutos)
  const CACHE_TTL = 5 * 60 * 1000;

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
      let userData = getCacheWithTTL("userData");
      if (!userData) {
        userData = await fetchUserData(userId, token);
        setCacheWithTTL("userData", userData, CACHE_TTL);
      }
      setUser(userData);

      // Cacheo para cirugías recientes
      let recentSurgeriesData = getCacheWithTTL("recentSurgeries");
      if (!recentSurgeriesData) {
        recentSurgeriesData = await fetchRecentSurgeries(token);
        setCacheWithTTL("recentSurgeries", recentSurgeriesData, CACHE_TTL);
      }
      setRecentSurgeries(recentSurgeriesData);

      // Cacheo para el post de cirugías
      let allSurgeriesPostData = getCacheWithTTL("surgeriesPost");
      if (!allSurgeriesPostData) {
        allSurgeriesPostData = await fetchSurgeriesPost(token);
        setCacheWithTTL("surgeriesPost", allSurgeriesPostData, CACHE_TTL);
      }
      setSurgeriesPost(allSurgeriesPostData);

      // Cacheo para pacientes
      let allPatients = getCacheWithTTL("patients");
      if (!allPatients) {
        allPatients = await fetchPatients(token);
        setCacheWithTTL("patients", allPatients, CACHE_TTL);
      }
      setPatients(allPatients);

      // Cacheo para metadata
      let metadataData = getCacheWithTTL("metadata");
      if (!metadataData) {
        metadataData = await fetchMetadata(token);
        setCacheWithTTL("metadata", metadataData, CACHE_TTL);
      }
      setMetadata(metadataData);
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
