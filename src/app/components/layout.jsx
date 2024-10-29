import React, { useEffect } from "react";
import { useAuth } from "../hooks/authContext";
import { Spin, message } from "antd";
import Sidebar from "./Sidebar";
import Main from "./Main";
import { useRouter } from "next/navigation";

const Layout = ({ children }) => {
  const { user, loading, error } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  // Si no hay usuario y no hay datos, mostrar la pantalla de carga
  if (loading && !user) {
    return (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100vh",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spin size="large" className="spinLayout" />
      </div>
    );
  }

  // Si no hay usuario pero ya se han cargado datos, no mostrar la pantalla de carga
  if (!user) {
    return null; 
  }

  return (
    <div style={{ display: "flex", width: "100%", height: "100%" }}>
      <Sidebar />
      <Main>{children}</Main>
    </div>
  );
};

export default Layout;
