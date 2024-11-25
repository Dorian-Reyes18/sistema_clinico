import React from "react";
import { Tabs } from "antd";
import TableSurgeriesIntra from "./TableSurgeriesIntra";
// import AnotherComponent from "./AnotherComponent"; // Componente adicional si lo necesitas

const { TabPane } = Tabs;

const PadreSurgeries = () => {
  return (
    <div className="container-surgeries">
      <div className="container-t">
        <Tabs className="tabs-clinico" defaultActiveKey="1" type="card">
          <TabPane tab="Cirugías Intrauterinas" key="1">
            <TableSurgeriesIntra />
          </TabPane>
          <TabPane tab="Cirugías Postoperatorias" key="2">
            {/* <AnotherComponent /> */}
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default PadreSurgeries;
// 