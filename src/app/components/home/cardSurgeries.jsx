import { useState } from "react";
import Image from "next/image";

import DefaultIcon from "@images/home/todas.png";

const CardSurgeries = ({ Icon, Title, count }) => {
  const statusText = count === 1 ? "finalizada" : "finalizadas";

  return (
    <div className="card-surgeries">
      <Image className="img" src={Icon || DefaultIcon} alt={Title} />

      <span className="title">
        {Title === "Total" ? "Total finalizadas" : `Cirugía ${Title}`}
      </span>

      <span className="final">
        <strong>
          <strong style={{ fontSize: 25, marginRight: 10 }}>{count}</strong>{" "}
          {statusText}
        </strong>
      </span>
    </div>
  );
};

export default CardSurgeries;
