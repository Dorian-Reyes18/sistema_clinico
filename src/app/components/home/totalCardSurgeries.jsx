"use client";
import { useAuth } from "@/app/hooks/authContext";
import { useState, useEffect } from "react";
import CardSurgeries from "./cardSurgeries";
import DefaultIcon from "@images/home/cirugia.png";
import TotalIcon from "@images/home/todas.png";

const TotalCardSurgeries = () => {
  const { user, loading, surgeriesPost, recentSurgeries, error } = useAuth();
  const [surgeryCounts, setSurgeryCounts] = useState({
    todas: 0,
    percutanea: 0,
    abierta: 0,
    endoscopica: 0,
    neonatal: 0,
    nerviosoCentral: 0,
  });

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
        switch (cirugia.tipoCirugia) {
          case "Cirugía percutánea":
            counts.percutanea++;
            break;
          case "Cirugía abierta":
            counts.abierta++;
            break;
          case "Cirugía endoscópica":
            counts.endoscopica++;
            break;
          case "Cirugía neonatal":
            counts.neonatal++;
            break;
          case "Cirugía nervioso central":
            counts.nerviosoCentral++;
            break;
          default:
            break; // En caso de tipos de cirugía no esperados
        }
      });

      return counts;
    };

    const saveSurgerys = () => {
      const surgerysIntraFinish = recentSurgeries.filter(
        (cirugia) => cirugia.estado === false
      );
      const surgerysPostFinish = surgeriesPost.registros.filter(
        (cirugia) => cirugia.estado === false
      );

      const countsIntra = contarCirugias(surgerysIntraFinish);
      const countsPost = contarCirugias(surgerysPostFinish);

      const total = surgerysIntraFinish.length + surgerysPostFinish.length;

      setSurgeryCounts({
        todas: total,
        percutanea: countsIntra.percutanea,
        abierta: countsIntra.abierta,
        endoscopica: countsIntra.endoscopica,
        neonatal: countsIntra.neonatal + countsPost.neonatal,
        nerviosoCentral:
          countsIntra.nerviosoCentral + countsPost.nerviosoCentral,
      });
    };

    if (recentSurgeries.length > 0 && surgeriesPost.registros.length > 0) {
      saveSurgerys();
    }
  }, [recentSurgeries, surgeriesPost]);

  if (loading) {
    return <div>Cargando...</div>;
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {surgeryTypes.map(({ title, count, Icon }) => (
        <CardSurgeries key={title} Icon={Icon} Title={title} count={count} />
      ))}
    </div>
  );
};

export default TotalCardSurgeries;
