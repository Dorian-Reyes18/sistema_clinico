import React, { useEffect, useState } from "react";
import { useAuth } from "@/app/hooks/authContext";
import { Skeleton } from "antd";
import Image from "next/image";

const getGreetingMessage = (user) => {
  if (!user || !user.rol) return null;

  if (user.rol.nombreRol.toLowerCase() === "developer") {
    return <strong>Desarrollador</strong>;
  } else if (user.rol.nombreRol.toLowerCase() === "administrador") {
    return <strong>Doctor</strong>;
  } else {
    return null;
  }
};

const RecentSurgeries = () => {
  const { user, loading, recentSurgeries, error } = useAuth(); // Obtener recentSurgeries y error del contexto
  const [surgeryCount, setSurgeryCount] = useState(0);
  const [recentSurgery, setRecentSurgery] = useState(null);

  useEffect(() => {
    if (!loading && user) {
      if (recentSurgeries) {
        const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);
        const recentSurgeryList = recentSurgeries.filter((surgery) => {
          const surgeryDate = new Date(surgery.fechaDeCreacion);
          return surgeryDate >= fiveDaysAgo;
        });

        setSurgeryCount(recentSurgeryList.length);

        if (recentSurgeryList.length > 0) {
          setRecentSurgery(recentSurgeryList[0]);
        } else {
          setRecentSurgery(
            recentSurgeries.reduce((latest, surgery) => {
              return new Date(surgery.fechaDeCreacion) >
                new Date(latest.fechaDeCreacion)
                ? surgery
                : latest;
            }, recentSurgeries[0])
          );
        }
      }
    }
  }, [loading, user, recentSurgeries]);

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
        <div className="welcome-message">
          <Image
            src="/images/Vector.png"
            alt="Icono saludo"
            width={54}
            height={55}
          />
          <div className="info">
            <h4>
              Saludos {getGreetingMessage(user)}, {user.nombreYApellido}
              {""} !
            </h4>
            <p>
              Se han agregado <strong>{surgeryCount} cirugías nuevas</strong> en
              los últimos 5 días.
            </p>
            {recentSurgery && (
              <div>
                La cirugía más reciente fue el{" "}
                {formatDate(recentSurgery.fechaDeCreacion)}.
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          {recentSurgery && (
            <div className="welcome-message">
              <Image
                src="/images/Vector.png"
                alt="Icono saludo"
                width={54}
                height={55}
                style={{ marginRight: 20 }}
              />
              <div className="info">
                {user && (
                  <h4>
                    Saludos {getGreetingMessage(user)}, {user.nombreYApellido}
                    {""} !
                  </h4>
                )}
                <strong>{error}</strong>
                <p>
                  La cirugía más reciente fue de la paciente con{" "}
                  <strong>
                    N° de expd. ({recentSurgery.paciente.numeroExpediente}){" "}
                    {recentSurgery.paciente.primerNombre}{" "}
                    {recentSurgery.paciente.primerApellido}
                  </strong>{" "}
                  el día {formatDate(recentSurgery.fechaDeCreacion)}.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RecentSurgeries;
