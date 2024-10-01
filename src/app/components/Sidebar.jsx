import IconLogOut from "@images/logouticon.svg";
import React, { useState } from "react";
import { Layout, Menu, Button, message } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  UsergroupAddOutlined,
  UserOutlined,
  MedicineBoxOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LogoClinica from "@images/logo.svg";

const { Sider } = Layout;

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    message.success("Sesión cerrada correctamente");
    router.push("/login");
  };

  const toggleMenu = () => {
    setCollapsed(!collapsed);
  };

  const menuItems = [
    {
      key: "1",
      icon: <HomeOutlined />,
      label: <Link href="/">General</Link>,
    },
    {
      key: "2",
      icon: <MedicineBoxOutlined />,
      label: <Link href="/cirugias">Cirugías</Link>,
    },
    {
      key: "3",
      icon: <UsergroupAddOutlined />,
      label: <Link href="/pacientes">Pacientes</Link>,
    },
    {
      key: "4",
      icon: <UserOutlined />,
      label: <Link href="/usuarios">Usuarios</Link>,
    },
    {
      key: "6",
      icon: <UserOutlined />,
      label: "Configuración",
      onClick: () => router.push("/configuracion"),
      style: { marginTop: "auto" },
    },
    {
      key: "5",
      icon: <LogoutOutlined />,
      label: "Cerrar Sesión",
      onClick: handleLogout,
      style: { marginTop: "0", marginBottom: 10 },
    },
  ];

  return (
    <Sider trigger={null} collapsible collapsed={collapsed} width={250}>
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
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 25,
        }}
      >
        {!collapsed && <LogoClinica style={{ minWidth: 20 }} />}
      </div>

      <div style={{ textAlign: "center", color: "#fff", marginBottom: 25 }}>
        <strong>{!collapsed && "Sistema quirúrgico"}</strong>
      </div>

      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={["1"]}
        items={menuItems}
        style={{
          display: "flex",
          flexDirection: "column",
          height: collapsed ? "calc(100% - 90px)" : "calc(100% - 240px)",
          padding: "0 20px",
        }}
      />
    </Sider>
  );
};

export default Sidebar;
