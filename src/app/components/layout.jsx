import React from "react";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  return (
    <div style={{ display: "flex", width: "100%", height: "100%" }}>
      <Sidebar />
      <main style={{ flexGrow: 1, padding: "16px" }}>{children}</main>
    </div>
  );
};

export default Layout;
