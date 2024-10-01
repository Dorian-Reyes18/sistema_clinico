import React, { useEffect, useState } from "react";
import { useAuth } from "@/app/hooks/authContext";
import { fetchRecentSurgeries } from "@/services/fetchSurgerys";
import { Skeleton } from "antd";

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
        setRecentSurgery(recentSurgeries[0]);
        setError(null);
      } else {
        setRecentSurgery(
          surgeries.reduce((latest, surgery) => {
            return new Date(surgery.fechaDeCreacion) >
              new Date(latest.fechaDeCreacion)
              ? surgery
              : latest;
          }, surgeries[0])
        );
        setError("No han habido cirugías en los últimos 5 días.");
      }
    } catch (error) {
      console.error("Error al cargar cirugías recientes:", error);
      setError("No se pudieron cargar las cirugías recientes.");
    }
  };

  const formatDate = (dateString) => {
    const options = { day: "numeric", month: "long", year: "numeric" };
    return new Date(dateString).toLocaleDateString("es-ES", options);
  };

  if (loading) {
    return (
      <div className="saludo">
        <Skeleton active paragraph={{ rows: 4 }} />
      </div>
    );
  }

  return (
    <div className="saludo">
      {surgeryCount > 0 ? (
        <div>
          {user && <h2>Saludos {user.nombreYApellido}!</h2>}
          Se han agregado {surgeryCount} cirugías nuevas en los últimos 5 días.
          {recentSurgery && (
            <div>
              La cirugía más reciente fue el{" "}
              {formatDate(recentSurgery.fechaDeCreacion)}
            </div>
          )}
        </div>
      ) : (
        <div>
          {recentSurgery && (
            <div className="welcome-message">
              {user && <h2>Saludos {user.nombreYApellido}!</h2>}
              <strong>{error} </strong>
              <p>
                {""} La cirugía masreciente fue en la paciente con{" "}
                <strong>
                  N° de expd. ( {recentSurgery.paciente.numeroExpediente}){" "}
                  {recentSurgery.paciente.primerNombre}{" "}
                  {recentSurgery.paciente.primerApellido}
                </strong>{" "}
                el día {formatDate(recentSurgery.fechaDeCreacion)}.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RecentSurgeries;
