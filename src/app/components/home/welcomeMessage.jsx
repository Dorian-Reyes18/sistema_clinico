import React, { useEffect, useState } from "react";
import { useAuth } from "@/app/hooks/authContext";
import { fetchRecentSurgeries } from "@/services/fetchSurgerys"; // Asegúrate de ajustar la ruta

const RecentSurgeries = () => {
  const { user, loading } = useAuth();
  const [surgeryCount, setSurgeryCount] = useState(0);
  const [recentSurgery, setRecentSurgery] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!loading && user) {
      loadRecentSurgeries();
    }
  }, [loading, user]);

  const loadRecentSurgeries = async () => {
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        .split("=")[1];
      const surgeries = await fetchRecentSurgeries(token);

      const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);
      const recentSurgeries = surgeries.filter((surgery) => {
        const surgeryDate = new Date(surgery.fechaDeCreacion);
        return surgeryDate >= fiveDaysAgo;
      });

      setSurgeryCount(recentSurgeries.length);

      if (recentSurgeries.length > 0) {
        setRecentSurgery(recentSurgeries[0]); // Guardar la cirugía más reciente
      } else if (surgeries.length > 0) {
        setRecentSurgery(
          surgeries.reduce((latest, surgery) => {
            return new Date(surgery.fechaDeCreacion) >
              new Date(latest.fechaDeCreacion)
              ? surgery
              : latest;
          })
        );
        setError("No ha habido cirugías en los últimos 5 días.");
      }
    } catch (error) {
      console.error("Error al cargar cirugías recientes:", error);
      setError("No se pudieron cargar las cirugías recientes.");
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      {surgeryCount > 0 ? (
        <div>
          Se han agregado {surgeryCount} cirugías nuevas en los últimos 5 días.
        </div>
      ) : (
        recentSurgery && (
          <div>
            La cirugía más reciente fue el{" "}
            {new Date(recentSurgery.fechaDeCreacion).toLocaleDateString()}
            del paciente {recentSurgery.paciente.primerNombre}{" "}
            {recentSurgery.paciente.primerApellido}.
          </div>
        )
      )}
    </div>
  );
};

export default RecentSurgeries; // Asegúrate de exportar el componente
