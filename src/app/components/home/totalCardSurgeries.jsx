"use client";
import { useAuth } from "@/app/hooks/authContext";
import { useState, useEffect } from "react";
import {
  fetchRecentSurgeries,
  fetchSurgeriesPost,
} from "@/services/fetchAllData";
import CardSurgeries from "./cardSurgeries";
import DefaultIcon from "@images/home/cirugia.png";
import TotalIcon from "@images/home/todas.png";
import { Spin } from "antd";

const TotalCardSurgeries = () => {
  const { surgeriesPost, error, token } = useAuth();
  const [recentSurgeries, setRecentSurgeries] = useState([]);
  const [surgeryCounts, setSurgeryCounts] = useState({
    todas: 0,
    percutanea: 0,
    abierta: 0,
    endoscopica: 0,
    neonatal: 0,
    nerviosoCentral: 0,
  });
  const [loading, setLoading] = useState(true);

  const loadRecentSurgeries = async () => {
    try {
      const data = await fetchRecentSurgeries(token);
      setRecentSurgeries(data);
    } catch (error) {
      console.error("Error al obtener cirugías recientes:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await loadRecentSurgeries();
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  useEffect(() => {
    const contarCirugias = (cirugias) => {
      const counts = {
        percutanea: 0,
        abierta: 0,
        endoscopica: 0,
        neonatal: 0,
        nerviosoCentral: 0,
      };

      cirugias.forEach((cirugia) => {
        const tipoCirugia = cirugia.tipoCirugia.toLowerCase();

        switch (tipoCirugia) {
          case "percutanea":
            counts.percutanea++;
            break;
          case "abierta":
            counts.abierta++;
            break;
          case "endoscopica":
            counts.endoscopica++;
            break;
          case "neonatal":
            counts.neonatal++;
            break;
          case "nervioso central":
            counts.nerviosoCentral++;
            break;
          default:
            break;
        }
      });

      return counts;
    };

    const saveSurgerys = () => {
      if (!recentSurgeries.length || !surgeriesPost?.registros?.length) return;

      // Filtrar las cirugías recientes terminadas
      const surgerysIntraFinish = recentSurgeries.filter(
        (cirugia) => cirugia.estado === false
      );
      const surgerysPostFinish = surgeriesPost.registros.filter(
        (cirugia) => cirugia.estado === false
      );

      // Contar las cirugías por tipo
      const countsIntra = contarCirugias(surgerysIntraFinish);
      const countsPost = contarCirugias(surgerysPostFinish);

      // Calcular el total de cirugías
      const total = surgerysIntraFinish.length + surgerysPostFinish.length;

      // Actualizar el estado con los conteos
      setSurgeryCounts({
        todas: total,
        percutanea: countsIntra.percutanea + countsPost.percutanea,
        abierta: countsIntra.abierta + countsPost.abierta,
        endoscopica: countsIntra.endoscopica + countsPost.endoscopica,
        neonatal: countsIntra.neonatal + countsPost.neonatal,
        nerviosoCentral:
          countsIntra.nerviosoCentral + countsPost.nerviosoCentral,
      });
    };

    saveSurgerys();
  }, [recentSurgeries, surgeriesPost]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 0",
        }}
      >
        <div className="loading-message">
          <Spin /> <span>Calculando cirugías...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  const surgeryTypes = [
    { title: "Total", count: surgeryCounts.todas, Icon: TotalIcon },
    {
      title: "Percutánea",
      count: surgeryCounts.percutanea,
      Icon: DefaultIcon,
    },
    { title: "Abierta", count: surgeryCounts.abierta, Icon: DefaultIcon },
    {
      title: "Endoscópica",
      count: surgeryCounts.endoscopica,
      Icon: DefaultIcon,
    },
    { title: "Neonatal", count: surgeryCounts.neonatal, Icon: DefaultIcon },
    {
      title: "Nervioso Central",
      count: surgeryCounts.nerviosoCentral,
      Icon: DefaultIcon,
    },
  ];

  return (
    <div className="card-container">
      {surgeryTypes.map(({ title, count, Icon }) => (
        <CardSurgeries key={title} Icon={Icon} Title={title} count={count} />
      ))}
    </div>
  );
};

export default TotalCardSurgeries;
