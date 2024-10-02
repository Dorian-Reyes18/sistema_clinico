"use client";
import { useAuth } from "@/app/hooks/authContext";
import { useState, useEffect } from "react";
import {
  FaSyringe,
  FaScalpel,
  FaEye,
  FaBrain,
  FaHospitalAlt,
} from "react-icons/fa";

const TotalCardSurgeries = () => {
  const { user, loading, surgeriesPost, recentSurgeries, error } = useAuth();
  const [surgeryCounts, setSurgeryCounts] = useState({
    percutanea: 0,
    abierta: 0,
    endoscopica: 0,
    neonatal: 0,
    nerviosoCentral: 0,
  });

  const surgeryTypes = {
    Intrauterinas: [
      { id: 1, nombre: "Cirugía Percutánea", icon: <FaSyringe /> },
      { id: 2, nombre: "Cirugía Abierta", icon: <FaScalpel /> },
      { id: 3, nombre: "Cirugía Endoscópica", icon: <FaEye /> },
    ],
    PostOperatorias: [
      { id: 1, nombre: "Cirugía Neonatal", icon: <FaHospitalAlt /> },
      { id: 2, nombre: "Cirugía Nervioso Central", icon: <FaBrain /> },
    ],
  };

  const DataSurgeries = async () => {
    const res = await fetch("/data/Data.Surgeries.json");
    const data = await res.json();
    return data;
  };

  useEffect(() => {
    const countSurgeries = async () => {
      if (!loading && user) {
        try {
          const data = await DataSurgeries();
          const counts = {
            percutanea: 0,
            abierta: 0,
            endoscopica: 0,
            neonatal: 0,
            nerviosoCentral: 0,
          };

          if (recentSurgeries && Array.isArray(recentSurgeries)) {
            recentSurgeries.forEach((s) => {
              if (!s.estado) {
                if (s.tipo === "Cirugía Percutánea") counts.percutanea++;
                if (s.tipo === "Cirugía Abierta") counts.abierta++;
                if (s.tipo === "Cirugía Endoscópica") counts.endoscopica++;
              }
            });
          }

          if (surgeriesPost && Array.isArray(surgeriesPost)) {
            surgeriesPost.forEach((s) => {
              if (!s.estado) {
                if (s.tipo === "Cirugía Neonatal") counts.neonatal++;
                if (s.tipo === "Cirugía Nervioso Central")
                  counts.nerviosoCentral++;
              }
            });
          }

          setSurgeryCounts(counts);
        } catch (error) {
          console.error("Error fetching surgery data:", error);
        }
      }
    };

    countSurgeries();
  }, [loading, user, surgeriesPost, recentSurgeries]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Object.keys(surgeryTypes).map((category) =>
        surgeryTypes[category].map((surgery) => (
          <div key={surgery.id} className="border rounded p-4 shadow">
            <div className="flex items-center mb-2">
              {surgery.icon}
              <h3 className="ml-2 font-bold">{surgery.nombre}</h3>
            </div>
            <p>
              Total:{" "}
              {surgeryCounts[surgery.nombre.toLowerCase().replace(/\s/g, "")] ||
                0}{" "}
              completadas
            </p>
          </div>
        ))
      )}
      {error && <p>Error al cargar las cirugías: {error}</p>}{" "}
    </div>
  );
};

export default TotalCardSurgeries;
