import { useState } from "react";
import Image from "next/image";

import DefaultIcon from "@images/home/todas.png";

const CardSurgeries = ({ Icon, Title, count }) => {
  return (
    <div className="card-surgerie">
      <Image className="img" src={Icon || DefaultIcon} alt={Title} />

      <p className="title">{Title === "Total" ? "Total de Cirugías" : `Cirugía ${Title}`}</p>

      <p className="final">
        <strong>{count} Finalizadas</strong>
      </p>
    </div>
  );
};

export default CardSurgeries;
