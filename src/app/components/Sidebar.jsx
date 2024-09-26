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
    message.success("Sesión cerrada correctamente");
    router.push("/login");
  };

  const toggleMenu = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Sider trigger={null} collapsible collapsed={collapsed} width={250}>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "flex-end",
        }}
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
        style={{
          display: "flex",
          flexDirection: "column",
          height: collapsed ? "calc(100% - 90px)" : "calc(100% - 240px)",
          padding: "0 20px",
        }}
      >
        <Menu.Item key="1" icon={<HomeOutlined />}>
          <Link href="/" passHref>
            {collapsed ? null : "Inicio"}
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

        <Menu.Item
          key="6"
          icon={<UserOutlined />}
          onClick={() => router.push("/configuracion")}
          style={{ marginTop: "auto" }}
        >
          {collapsed ? null : "Configuración"}
        </Menu.Item>

        <Menu.Item
          key="5"
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          style={{ marginTop: "0", marginBottom: 10 }}
        >
          {collapsed ? null : "Cerrar Sesión"}
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default Sidebar;
