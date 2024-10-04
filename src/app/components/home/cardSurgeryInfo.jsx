import { useEffect, useState } from "react";
import { useAuth } from "@/app/hooks/authContext";
import Image from "next/image";
import PacienteInfo from "@images/home/pacienteinfo.png";

const CardSurgeryInfo = () => {
  const { recentSurgeries, surgeriesPost } = useAuth();
  const [allsurgerysFinish, setAllsurgerysFinish] = useState([]);
  const [cirugiaMasReciente, setCirugiaMasReciente] = useState(null);

  useEffect(() => {
    const finishSurgerys = [
      ...recentSurgeries,
      ...(surgeriesPost?.registros || []),
    ].filter((cirugia) => cirugia.estado === false);

    if (finishSurgerys.length > 0) {
      const recentSurgeryObject = finishSurgerys.reduce((acc, cirugia) => {
        return new Date(cirugia.fechaDeCreacion) > new Date(acc.fechaDeCreacion)
          ? cirugia
          : acc;
      }, finishSurgerys[0]);

      setAllsurgerysFinish(finishSurgerys);
      setCirugiaMasReciente(recentSurgeryObject);
    }
  }, [recentSurgeries, surgeriesPost]);

  return (
    <>
      <div className="c-recent-surgery-container">
        <Image src={PacienteInfo} alt="paicente info imagen" />
        <span>
          <strong>Cirugía más reciente</strong>
        </span>

        {cirugiaMasReciente && cirugiaMasReciente.paciente ? (
          <>
            <span>
              {cirugiaMasReciente.paciente.primerNombre}{" "}
              {cirugiaMasReciente.paciente.primerApellido}
            </span>
            <span>{cirugiaMasReciente.paciente.edad} años de edad</span>
            <hr className="hr" />
            <span>Tipo de cirugía</span>

            <span>
              <strong> {cirugiaMasReciente.tipoCirugia}</strong>
            </span>
          </>
        ) : (
          <span>No hay cirugías recientes disponibles.</span>
        )}
      </div>
    </>
  );
};

export default CardSurgeryInfo;
