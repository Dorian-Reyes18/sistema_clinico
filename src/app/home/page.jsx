"use client";

import { Spin } from "antd";
import Layout from "../components/layout";
import useAuth from "../hooks/useAuth"; 

const HomePage = () => {
  const { user, loading, error } = useAuth(); 

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
        <Spin size="large" className="custom-spinner" />
      </div>
    );
  }

  if (error) {
    return <p style={{ textAlign: "center" }}>{error}</p>;
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
        <h1>Bienvenido, {user.username}!</h1>
        <p>ID: {user.id}</p>
        <p>Teléfono: {user.phone}</p>
        <p>Fecha de expiración: {new Date(user.exp * 1000).toLocaleString()}</p>
      </div>
    </Layout>
  );
};

export default HomePage;
