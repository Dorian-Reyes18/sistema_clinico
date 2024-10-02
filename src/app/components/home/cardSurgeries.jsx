import { useState } from "react";
import Image from "next/image";

const CardSurgeries = ({ Icon, Title, count }) => {
  return (
    <div className="card-surgerie">
      <Image src={Icon} alt={Title} />
      <p>Cirugía {Title}</p>
      <p>
        <strong>{count} completadas</strong>
      </p>
    </div>
  );
};

export default CardSurgeries;
