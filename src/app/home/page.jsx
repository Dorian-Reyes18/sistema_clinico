"use client";

import { useEffect, useState } from "react";
import jwt from "jsonwebtoken";
import ProtectedRoute from "../components/protectedRoute";

const HomePage = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwt.decode(token);

        if (decodedToken && decodedToken.exp * 1000 > Date.now()) {
          setUser(decodedToken);
        } else {
          setError("Sesión expirada. Por favor, inicia sesión nuevamente.");
        }
      } catch (error) {
        console.error("Error al decodificar el token:", error);
        setError("Error al decodificar el token.");
      }
    } else {
      setError("Sesión no encontrada, por favor vuelve a inicia sesión.");
    }
  }, []);

  if (error) {
    return <p>{error}</p>;
  }

  if (!user) {
    return <p>No has iniciado sesión. Por favor, inicia sesión.</p>;
  }

  return (
    <div>
      <h1>Bienvenido, {user.username}!</h1>
      <p>ID: {user.id}</p>
      <p>Teléfono: {user.phone}</p>
      <p>Fecha de expiración: {new Date(user.exp * 1000).toLocaleString()}</p>
    </div>
  );
};

export default HomePage;
