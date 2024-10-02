"use client";

import { useAuth } from "../hooks/authContext";
import Layout from "../components/layout";
import { Spin } from "antd";
import HeaderUser from "../components/headerUser";
import { usePathname } from "next/navigation";
import RecentSurgeries from "../components/home/welcomeMessage";
import TotalCardSurgeries from "../components/home/totalCardSurgeries";

const HomePage = () => {
  const currentPath = usePathname();
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
    return (
      <Layout>
        <p style={{ textAlign: "center", color: "red" }}>{error}</p>
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
      <HeaderUser currentPath={currentPath} />
      <div
        style={{
          padding: 30,
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <RecentSurgeries />
        <TotalCardSurgeries />
      </div>
    </Layout>
  );
};

export default HomePage;
