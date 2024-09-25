"use client"; // Asegúrate de que este componente se ejecute en el lado del cliente
import { useEffect, useState } from "react";
import jwt from "jsonwebtoken"; // Importación del paquete jsonwebtoken

const HomePage = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        // Decodifica el token usando jsonwebtoken
        const decodedToken = jwt.decode(token);

        // Verifica si el token ha expirado
        if (decodedToken && decodedToken.exp * 1000 > Date.now()) {
          setUser(decodedToken); // Almacena los datos del usuario
        } else {
          setError(
            "El token ha expirado. Por favor, inicia sesión nuevamente."
          );
        }
      } catch (error) {
        console.error("Error al decodificar el token:", error);
        setError("Error al decodificar el token.");
      }
    } else {
      setError("No hay un token encontrado. Por favor, inicia sesión.");
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
