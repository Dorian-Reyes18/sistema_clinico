import React from "react";
import { useAuth } from "../hooks/authContext";
import { Spin } from "antd"; // Importar el spinner de Ant Design
import Sidebar from "./Sidebar";
import { useRouter } from "next/navigation";

const Layout = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100vh", // Asegúrate de que ocupe toda la altura de la ventana
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spin size="large" /> {/* Spinner de Ant Design */}
      </div>
    );
  }

  if (!user) {
    return (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <p>No has iniciado sesión. Por favor, inicia sesión.</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", width: "100%", height: "100%" }}>
      <Sidebar />
      <main className="content-space" style={{ flexGrow: 1 }}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
