"use client";

import { createContext, useContext, useEffect, useState } from "react";
import jwt from "jsonwebtoken";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          fetchUserData(decodedToken.id, token); 
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

  const fetchUserData = async (userId, token) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/protected/usuarios/${userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Error al obtener datos del usuario");
        return;
      }

      const userData = await response.json();
      console.log("Datos del usuario:", userData);
      setUser(userData);
    } catch (error) {
      console.error("Error al obtener datos del usuario:", error);
      setError("Error inesperado al obtener datos del usuario");
    } finally {
      setLoading(false); 
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, fetchUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
