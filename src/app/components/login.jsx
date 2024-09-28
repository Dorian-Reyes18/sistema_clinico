"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import jwt from "jsonwebtoken";
import { useAuth } from "../hooks/authContext";
import { Button, Spin, notification } from "antd";

const Login = () => {
  const [telefono, setTelefono] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { fetchUserData } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ telefono, contrasena }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Error inesperado");
        setLoading(false);
        return;
      }

      const { token } = await response.json();
      const expirationDate = new Date(Date.now() + 86400e3).toUTCString();
      document.cookie = `token=${token}; path=/; expires=${expirationDate};`;

      const decodedToken = jwt.decode(token);
      if (decodedToken) {
        await fetchUserData(decodedToken.id, token);
      }

      notification.success({
        message: "Éxito",
        description: "Sesión iniciada correctamente",
        placement: "topRight",
        duration: 4,
      });
      router.push("/home");
    } catch (error) {
      console.error("Error inesperado:", error);
      setError("Error inesperado al iniciar sesión");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <div className="form-group">
        <label>
          <strong style={{ fontSize: 14 }}>Teléfono:</strong>
        </label>
        <input
          type="text"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          required
          className="form-control"
          placeholder="Escriba su teléfono"
          disabled={loading}
        />
      </div>
      <div className="form-group">
        <label>
          <strong style={{ fontSize: 14 }}>Contraseña:</strong>
        </label>
        <input
          type="password"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          required
          className="form-control"
          placeholder="Escriba su contraseña"
          disabled={loading}
        />
      </div>
      <button
        className="btn btn-primary btn-rosa"
        type="submit"
        disabled={loading}
      >
        {loading ? <Spin size="small" /> : <strong>Iniciar Sesión</strong>}{" "}
      </button>
      {error && <p style={{ color: "red", fontSize: 14 }}>*{error}</p>}
    </form>
  );
};

export default Login;
