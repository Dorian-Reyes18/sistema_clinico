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
  const { user, loading, recentSurgeries, error } = useAuth();
  const [surgeryCount, setSurgeryCount] = useState(0);
  const [recentSurgery, setRecentSurgery] = useState(null);

  useEffect(() => {
    if (!loading && user) {
      // Filtrar las cirugías recientes que fueron agregadas en los últimos 5 días
      if (recentSurgeries.length > 0) {
        const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);

        const recentSurgeryList = recentSurgeries.filter((surgery) => {
          const surgeryDate = new Date(surgery.fechaDeCreacion);
          return surgeryDate >= fiveDaysAgo;
        });

        setSurgeryCount(recentSurgeryList.length);

        if (recentSurgeryList.length > 0) {
          // Buscar la cirugía más reciente
          const mostRecentSurgery = recentSurgeryList.reduce(
            (latest, surgery) => {
              const currentSurgeryDate = new Date(surgery.fechaDeCreacion);
              const latestSurgeryDate = new Date(latest.fechaDeCreacion);
              return currentSurgeryDate > latestSurgeryDate ? surgery : latest;
            }
          );

          setRecentSurgery(mostRecentSurgery);
        }
      }
    }
  }, [loading, user, recentSurgeries]);

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
                  Se han agregado{" "}
                  <strong>{surgeryCount} cirugías Fetales Intrauterinas</strong>
                </span>
              )}{" "}
              en los últimos 5 días.
            </p>
            {recentSurgery && (
              <div>
                <p>
                  La cirugía más reciente fue de la paciente con el numero de{" "}
                  <strong>
                    Expediente: ({recentSurgery.paciente.numeroExpediente}){" "}
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
