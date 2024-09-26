"use client";

import { useEffect, useState } from "react";
import jwt from "jsonwebtoken";
import Layout from "../components/layout";
import { Spin } from "antd";

const HomePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cookies = document.cookie.split("; ");
    const tokenCookie = cookies.find((row) => row.startsWith("token="));
    const token = tokenCookie ? tokenCookie.split("=")[1] : null;

    if (token) {
      try {
        const decodedToken = jwt.decode(token);

        if (decodedToken && decodedToken.exp * 1000 > Date.now()) {
          setUser(decodedToken);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error al decodificar el token:", error);
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "50px",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spin size="large" className="custom-spinner" /> {/* Spinner rosado */}
      </div>
    );
  }

  if (!user) {
    return (
      <p style={{ textAlign: "center" }}>
        No has iniciado sesión. Por favor, inicia sesión.
      </p>
    );
  }

  return (
    <Layout>
      <div>
        <h1>Bienvenido a mi Dashboard</h1>
        <h1>Bienvenido, {user.username}!</h1>
        <p>ID: {user.id}</p>
        <p>Teléfono: {user.phone}</p>
        <p>Fecha de expiración: {new Date(user.exp * 1000).toLocaleString()}</p>
      </div>
    </Layout>
  );
};

export default HomePage;
