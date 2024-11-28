import React, { useEffect } from "react";
import { Tabs } from "antd";
import TableSurgeriesIntra from "./TableSurgeriesIntra";
import TableSurgeriesPost from "./TableSurgeriesPost";

const PadreSurgeries = () => {
  const tabItems = [
    {
      label: "Cirugías Intrauterinas",
      key: "1",
      children: <TableSurgeriesIntra />,
    },
    {
      label: "Cirugías PostNatales",
      key: "2",
      children: <TableSurgeriesPost />,
    },
  ];

  return (
    <div className="container-surgeries">
      <div className="container-t">
        <Tabs
          className="tabs-clinico"
          defaultActiveKey="1"
          type="card"
          items={tabItems}
        />
      </div>
    </div>
  );
};

export default PadreSurgeries;
