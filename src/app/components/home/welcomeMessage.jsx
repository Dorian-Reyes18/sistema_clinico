import React, { useEffect, useState } from "react";
import { useAuth } from "@/app/hooks/authContext";
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
  const { user, loading, recentSurgeries, surgeriesPost, error } = useAuth();
  const [surgeryCount, setSurgeryCount] = useState(0);
  const [recentSurgery, setRecentSurgery] = useState(null);

  useEffect(() => {
    if (!loading && user) {
      const validSurgeriesPost = Array.isArray(surgeriesPost)
        ? surgeriesPost
        : [];

      const allSurgeries = [...recentSurgeries, ...validSurgeriesPost];

      if (allSurgeries.length > 0) {
        const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);

        const recentSurgeryList = allSurgeries.filter((surgery) => {
          const surgeryDate = new Date(surgery.fechaDeCreacion);
          return surgeryDate >= fiveDaysAgo;
        });

        setSurgeryCount(recentSurgeryList.length);

        if (recentSurgeryList.length > 0) {
          setRecentSurgery(recentSurgeryList[0]);
        } else {
          setRecentSurgery(
            allSurgeries.reduce((latest, surgery) => {
              return new Date(surgery.fechaDeCreacion) >
                new Date(latest.fechaDeCreacion)
                ? surgery
                : latest;
            }, allSurgeries[0])
          );
        }
      }
    }
  }, [loading, user, recentSurgeries, surgeriesPost]);

  const formatDate = (dateString) => {
    const options = { day: "numeric", month: "long", year: "numeric" };
    return new Date(dateString).toLocaleDateString("es-ES", options);
  };

  return (
    <div className="saludo">
      {surgeryCount > 0 ? (
        <div className="welcome-message">
          <Image
            src="/images/Vector.png"
            alt="Icono saludo"
            width={54}
            height={55}
            style={{ marginRight: 20 }}
          />
          <div className="info">
            <h4>
              Saludos {getGreetingMessage(user)} {user.nombreYApellido}
            </h4>
            <p>
              {surgeryCount === 1 ? (
                <span>
                  Se agregó <strong>una cirugía nueva</strong>
                </span>
              ) : (
                <span>
                  Se agregaron <strong>{surgeryCount} cirugías nuevas</strong>
                </span>
              )}{" "}
              en los últimos 5 días.
            </p>
            {recentSurgery && (
              <div>
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
            )}
          </div>
        </div>
      ) : (
        recentSurgery && (
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
                  Saludos {getGreetingMessage(user)} {user.nombreYApellido}
                </h4>
              )}
              {error && <strong>{error}</strong>}
              <p>
                No se han agregado registros de cirugías en los últimos 5 días.
              </p>
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
        )
      )}
    </div>
  );
};

export default RecentSurgeries;
