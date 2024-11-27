import { createContext, useContext, useEffect, useState } from "react";
import jwt from "jsonwebtoken";
import {
  fetchRecentSurgeries,
  fetchUserData,
  fetchSurgeriesPost,
  fetchPatients,
  fetchMetadata,
  fetchOrdenPostnatalCompleta,
  fetchOrdenPrenatalCompleta,
} from "@/services/fetchAllData";

const AuthContext = createContext();

let isFetchingData = false;

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [recentSurgeries, setRecentSurgeries] = useState([]);
  const [surgeriesPost, setSurgeriesPost] = useState([]);
  const [patients, setPatients] = useState([]);
  const [metadata, setMetadata] = useState([]);
  const [prenatalSurgeries, setPrenatalSurgeries] = useState([]);
  const [postnatalSurgeries, setPostnatalSurgeries] = useState([]);

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
          ñ;
          if (!user) {
            setToken(token);
            loadData(decodedToken.id, token);
          }
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
    setToken(null);
    setLoading(false);
  };

  const loadData = async (userId, token) => {
    if (isFetchingData) return;
    isFetchingData = true;

    setLoading(true);

    // Intentamos cargar los datos de la caché
    const cachedUserData = sessionStorage.getItem("userData");
    const cachedRecentSurgeriesData = sessionStorage.getItem(
      "recentSurgeriesData"
    );
    const cachedSurgeriesPostData = sessionStorage.getItem("surgeriesPostData");
    const cachedPatientsData = sessionStorage.getItem("patientsData");
    const cachedMetadataData = sessionStorage.getItem("metadataData");

    // Si hay datos en caché, los mostramos primero
    if (cachedUserData) setUser(JSON.parse(cachedUserData));
    if (cachedRecentSurgeriesData)
      setRecentSurgeries(JSON.parse(cachedRecentSurgeriesData));
    if (cachedSurgeriesPostData)
      setSurgeriesPost(JSON.parse(cachedSurgeriesPostData));
    if (cachedPatientsData) setPatients(JSON.parse(cachedPatientsData));
    if (cachedMetadataData) setMetadata(JSON.parse(cachedMetadataData));

    // Ahora hacemos los fetch para actualizar en el fondo
    try {
      const [
        newUserData,
        newRecentSurgeries,
        newSurgeriesPost,
        newPatients,
        newMetadata,
        newPostnatalSurgerie,
        newPrenatalSurgerie,
      ] = await Promise.all([
        fetchUserData(userId, token),
        fetchRecentSurgeries(token),
        fetchSurgeriesPost(token),
        fetchPatients(token),
        fetchMetadata(token),
        fetchOrdenPrenatalCompleta(token),
        fetchOrdenPostnatalCompleta(token),
      ]);

      // Actualizamos los estados y la caché
      setUser(newUserData);
      setRecentSurgeries(newRecentSurgeries);
      setSurgeriesPost(newSurgeriesPost);
      setPatients(newPatients);
      setMetadata(newMetadata);
      setPrenatalSurgeries(newPrenatalSurgerie);
      setPostnatalSurgeries(newPostnatalSurgerie);

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
      console.error("Error al actualizar los datos:", error);
      setError(error.message);
    } finally {
      setLoading(false);
      isFetchingData = false; // Restablece la bandera
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
        prenatalSurgeries,
        postnatalSurgeries,
        setRecentSurgeries,
        setSurgeriesPost,
        setPostnatalSurgeries,
        setPrenatalSurgeries,
        patients,
        metadata,
        loadData,
        setPatients,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
