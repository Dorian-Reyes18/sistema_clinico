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
  const [token, setToken] = useState(null); // Almacena el token aquí
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
          setToken(token); // Guardamos el token aquí
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
  }, [token]);

  const handleInvalidSession = () => {
    setUser(null);
    setToken(null); // Limpiamos el token si la sesión es inválida
    setLoading(false);
  };

  const loadData = async (userId, token) => {
    setLoading(true);

    // Intentamos cargar los datos de la caché
    const cachedUserData = JSON.parse(sessionStorage.getItem("userData"));
    const cachedRecentSurgeriesData = JSON.parse(
      sessionStorage.getItem("recentSurgeriesData")
    );
    const cachedSurgeriesPostData = JSON.parse(
      sessionStorage.getItem("surgeriesPostData")
    );
    const cachedPatientsData = JSON.parse(
      sessionStorage.getItem("patientsData")
    );
    const cachedMetadataData = JSON.parse(
      sessionStorage.getItem("metadataData")
    );

    // Si hay datos en caché, los mostramos primero
    if (cachedUserData) setUser(cachedUserData);
    if (cachedRecentSurgeriesData)
      setRecentSurgeries(cachedRecentSurgeriesData);
    if (cachedSurgeriesPostData) setSurgeriesPost(cachedSurgeriesPostData);
    if (cachedPatientsData) setPatients(cachedPatientsData);
    if (cachedMetadataData) setMetadata(cachedMetadataData);

    // Ahora hacemos los fetch para actualizar en el fondo
    try {
      await refreshDataInBackground(userId, token);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshDataInBackground = async (userId, token) => {
    try {
      const newUserData = await fetchUserData(userId, token);
      const newRecentSurgeries = await fetchRecentSurgeries(token);
      const newSurgeriesPost = await fetchSurgeriesPost(token);
      const newPatients = await fetchPatients(token);
      const newMetadata = await fetchMetadata(token);

      // Actualizamos los estados y la caché
      setUser(newUserData);
      setRecentSurgeries(newRecentSurgeries);
      setSurgeriesPost(newSurgeriesPost);
      setPatients(newPatients);
      setMetadata(newMetadata);

      // Cacheamos los nuevos datos
      sessionStorage.setItem("userData", JSON.stringify(newUserData));
      sessionStorage.setItem(
        "recentSurgeriesData",
        JSON.stringify(newRecentSurgeries)
      );
      sessionStorage.setItem(
        "surgeriesPostData",
        JSON.stringify(newSurgeriesPost)
      );
      sessionStorage.setItem("patientsData", JSON.stringify(newPatients));
      sessionStorage.setItem("metadataData", JSON.stringify(newMetadata));
    } catch (error) {
      console.error("Error al actualizar en segundo plano:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        token,
        setUser,
        setToken,
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
