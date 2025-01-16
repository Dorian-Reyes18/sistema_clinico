"use client";

export const dynamic = "force-dynamic";

import { useAuth } from "../../hooks/authContext";
import Layout from "../../components/layout";
import { Spin } from "antd";
import HeaderUser from "../../components/headerUser";
import FormulariosIntrauterinos from "@/app/components/Cirugias/FormulariosIntrauterinos";
import { Suspense } from "react";
import { useParams } from "next/navigation"; // Importa useParams

const GestionarCirugias = () => {
  const { user, loading, error } = useAuth();

  const { mode, id } = useParams(); // Obtén los parámetros de la URL

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
    <Suspense fallback={<Spin size="large" className="custom-spinner" />}>
      <Layout>
        <HeaderUser currentPath="/cirugias/gestionarCirugias" />
        <FormulariosIntrauterinos mode={mode} id={id} />
      </Layout>
    </Suspense>
  );
};

export default GestionarCirugias;
