"use client";

import { useAuth } from "../../hooks/authContext";
import Layout from "../../components/layout";
import { Spin } from "antd";
import { usePathname, useSearchParams } from "next/navigation";
import HeaderUser from "../../components/headerUser";
import FormulariosUsuarios from "@/app/components/Usuarios/FormulariosUsers";

const GestionarUsuarios = () => {
  const currentPath = usePathname();
  const searchParams = useSearchParams();
  const { user, loading, error } = useAuth();

  const mode = searchParams.get("mode");
  const id = searchParams.get("id");

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
      <FormulariosUsuarios mode={mode} id={id} />
    </Layout>
  );
};

export default GestionarUsuarios;
