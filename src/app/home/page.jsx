"use client";

import { useAuth } from "../hooks/authContext"; // Asegúrate de que la ruta sea correcta
import Layout from "../components/layout";
import { Spin } from "antd";

const HomePage = () => {
  const { user, loading, error } = useAuth(); // Usamos el hook useAuth

  // Mientras se carga, mostramos un spinner
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

  // Manejo de errores
  if (error) {
    return (
      <Layout>
        <p style={{ textAlign: "center", color: "red" }}>
          {error} {/* Muestra el mensaje de error */}
        </p>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <p style={{ textAlign: "center" }}>
          No has iniciado sesión. Por favor, inicia sesión.
        </p>
      </Layout>
    );
  }

  return (
    <Layout>
      <div>
        <h1>Bienvenido, {user.nombreYApellido}!</h1> <p>ID: {user.id}</p>
        <p>Usuario: {user.usuario}</p>
        <p>Teléfono: {user.telefono}</p>
        <p>Rol: {user.rol.nombreRol}</p>
      </div>
    </Layout>
  );
};

export default HomePage;
