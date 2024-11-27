import React from "react";
import { Tabs } from "antd";
import TableSurgeriesIntra from "./TableSurgeriesIntra";
import TableSurgeriesPost from "./TableSurgeriesPost";

const { TabPane } = Tabs;

const PadreSurgeries = () => {
  return (
    <div className="container-surgeries">
      <div className="container-t">
        <Tabs className="tabs-clinico" defaultActiveKey="1" type="card">
          <TabPane tab="Cirugías Intrauterinas" key="1">
            <TableSurgeriesIntra />
          </TabPane>
          <TabPane tab="Cirugías PostNatales" key="2">
            <TableSurgeriesPost />
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default PadreSurgeries;
