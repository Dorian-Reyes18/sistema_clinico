"use client";

import { useAuth } from "../hooks/authContext";
import Layout from "../components/layout";
import { Spin } from "antd";
import HeaderUser from "../components/headerUser";
import { usePathname } from "next/navigation";
import RecentSurgeries from "../components/home/welcomeMessage";
import TotalCardSurgeries from "../components/home/totalCardSurgeries";
import SectionCalendar from "../components/home/sectionCalendar";
import { useEffect, useState } from "react";
import { fetchOrdenPrenatalCompleta } from "@/services/fetchAllData";

const HomePage = () => {
  const currentPath = usePathname();
  const {
    user,
    loading,
    error,
    prenatalSurgeries,
    setPrenatalSurgeries,
    token,
  } = useAuth();

  // Aqui solicitamos los datos completos de una cirugia intrauterina
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (hasFetched || !token) return;

    const fetchPrenatalSurgeries = async () => {
      try {
        const response = await fetchOrdenPrenatalCompleta(token);
        setPrenatalSurgeries(response);
        setHasFetched(true);
      } catch (error) {
        console.log("Error al obtener las cirugías prenatales", error);
      }
    };

    fetchPrenatalSurgeries();
  }, [token, hasFetched]);

  useEffect(() => {
    console.log(prenatalSurgeries);
  }, [prenatalSurgeries]);

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
      <div className="content-container">
        <div className="son-container">
          <RecentSurgeries />
          <TotalCardSurgeries />
        </div>
        <SectionCalendar />
      </div>
    </Layout>
  );
};

export default HomePage;
