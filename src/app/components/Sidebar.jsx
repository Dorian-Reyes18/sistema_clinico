import React, { useState } from "react";
import { Layout, Menu, Button, notification } from "antd";
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
import { usePathname } from "next/navigation";
import LogoClinica from "@images/logo.svg";
import { useAuth } from "../hooks/authContext"; // Asegúrate de importar el hook

const { Sider } = Layout;

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { setToken, setUser } = useAuth();

  const handleLogout = () => {
    // Eliminar el token de las cookies
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // Limpiar el estado del token y user en el contexto
    setToken(null); 
    setUser(null); 

    // Mostrar notificación
    notification.success({
      message: "Éxito",
      description: "Sesión cerrada correctamente",
      placement: "topRight",
      duration: 2,
    });

    // Redirigir al login
    router.push("/login");
  };

  const toggleMenu = () => {
    setCollapsed(!collapsed);
  };

  const menuItems = [
    {
      key: "/home",
      icon: <HomeOutlined />,
      label: <Link href="/home">General</Link>,
    },
    {
      key: "/pacientes",
      icon: <UsergroupAddOutlined />,
      label: <Link href="/pacientes">Pacientes</Link>,
    },
    {
      key: "/cirugias",
      icon: <MedicineBoxOutlined />,
      label: <Link href="/cirugias">Cirugías</Link>,
    },
    {
      key: "/usuarios",
      icon: <UserOutlined />,
      label: <Link href="/usuarios">Usuarios</Link>,
    },
    {
      key: "/configuracion",
      icon: <UserOutlined />,
      label: "Configuración",
      onClick: () => router.push("/configuracion"),
      style: { marginTop: "auto" },
    },
    {
      key: "logout",
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
        selectedKeys={[
          pathname.startsWith("/pacientes")
            ? "/pacientes"
            : pathname.startsWith("/cirugias")
            ? "/cirugias"
            : pathname.startsWith("/usuarios")
            ? "/usuarios"
            : pathname === "/"
            ? "/"
            : pathname,
        ]}
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
