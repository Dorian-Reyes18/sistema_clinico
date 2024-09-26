import React, { useState } from "react";
import { Layout, Menu, Button } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  UsergroupAddOutlined,
  UserOutlined,
  MedicineBoxOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import LogoClinica from "@images/logo.svg";
import LogoutButton from "../components/LogoutButton";

const { Sider } = Layout;

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleMenu = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Sider trigger={null} collapsible collapsed={collapsed}>
      <div
        style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}
      >
        <Button
          type="text"
          onClick={toggleMenu}
          style={{ color: "white", marginBottom: "16px" }}
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </Button>
      </div>
      <div
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 25,
        }}
      >
        <LogoClinica style={{ minWidth: 20 }} />
      </div>
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={["1"]}
        style={{ position: "relative" }}
      >
        <Menu.Item key="1" icon={<HomeOutlined />}>
          <Link href="/" passHref>
            {collapsed ? null : "Inicio"}{" "}
          </Link>
        </Menu.Item>
        <Menu.Item key="2" icon={<MedicineBoxOutlined />}>
          <Link href="/cirugias" passHref>
            {collapsed ? null : "Cirugías"}
          </Link>
        </Menu.Item>
        <Menu.Item key="3" icon={<UsergroupAddOutlined />}>
          <Link href="/pacientes" passHref>
            {collapsed ? null : "Pacientes"}
          </Link>
        </Menu.Item>
        <Menu.Item key="4" icon={<UserOutlined />}>
          <Link href="/usuarios" passHref>
            {collapsed ? null : "Usuarios"}
          </Link>
        </Menu.Item>
      </Menu>
      <div
        style={{
          width: "100%",
          paddingLeft: "30px",
          position: "absolute",
          bottom: 0,
          marginBottom: 30,
        }}
      >
        <LogoutButton />
      </div>
    </Sider>
  );
};

export default Sidebar;
