"use client";
import { useAuth } from "@/app/hooks/authContext";
import { useState, useEffect } from "react";

const TotalCardSurgeries = () => {
  const { user, loading, surgeriesPost, recentSurgeries, error } = useAuth();
  const [surgeryCounts, setSurgeryCounts] = useState({
    percutanea: 0,
    abierta: 0,
    endoscopica: 0,
    neonatal: 0,
    nerviosoCentral: 0,
    todas: 0,
  });
  const [surgerysIntra, setSurgerysIntra] = useState([]);
  const [surgerysPost, setSurgerysPost] = useState([]);

  useEffect(() => {
    const saveSurgerys = () => {
      const surgerysIntraFinish = recentSurgeries.filter(
        (cirugia) => cirugia.estado === false
      );
      const surgerysPostFinish = surgeriesPost.registros.filter(
        (cirugia) => cirugia.estado === false
      );

      setSurgerysIntra(surgerysIntraFinish);
      setSurgerysPost(surgerysPostFinish);

      console.log(surgeriesPost);
      const todas = surgerysIntraFinish.length + surgerysPostFinish.length;

      // Conteo de cirugías
      const counts = {
        percutanea: 0,
        abierta: 0,
        endoscopica: 0,
        neonatal: 0,
        nerviosoCentral: 0,
        todas: 0,
      };

      // Contar cirugías intra
      surgerysIntra.forEach((cirugia) => {
        if (cirugia.tipoCirugia == "Cirugía percutánea") {
          counts.percutanea++;
        } else if (cirugia.tipoCirugia == "Cirugía abierta") {
          counts.abierta++;
        } else if (cirugia.tipoCirugia == "Cirugía endoscópica") {
          counts.endoscopica++;
        } else if (cirugia.tipoCirugia == "Cirugía neonatal") {
          counts.neonatal++;
        } else if (cirugia.tipoCirugia == "Cirugía nervioso central") {
          counts.nerviosoCentral++;
        }
      });

      // Contar cirugías post
      surgerysPost.forEach((cirugia) => {
        if (cirugia.tipoCirugia === "Cirugía neonatal") {
          counts.neonatal++;
        } else if (cirugia.tipoCirugia === "Cirugía nervioso central") {
          counts.nerviosoCentral++;
        }
      });
      console.log(counts);

      // Actualizar el estado con el conteo total
      setSurgeryCounts({
        ...counts,
        todas: todas,
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div>Cirugías Percutáneas: {surgeryCounts.percutanea}</div>
      <div>Cirugías Abiertas: {surgeryCounts.abierta}</div>
      <div>Cirugías Endoscópicas: {surgeryCounts.endoscopica}</div>
      <div>Cirugías Neonatales: {surgeryCounts.neonatal}</div>
      <div>Cirugías de Nervioso Central: {surgeryCounts.nerviosoCentral}</div>
      <div>Total de Cirugías: {surgeryCounts.todas}</div>
    </div>
  );
};

export default TotalCardSurgeries;
