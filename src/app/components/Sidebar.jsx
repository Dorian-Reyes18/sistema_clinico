import React, { useState, useCallback } from "react";
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
import { useAuth } from "../hooks/authContext";

const { Sider } = Layout;

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { setToken, setUser } = useAuth();

  const handleLogout = useCallback(() => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
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
  }, [setToken, setUser, router]);

  const toggleMenu = () => {
    setCollapsed((prevState) => !prevState);
  };

  const menuItems = [
    {
      key: "/home",
      icon: <HomeOutlined />,
      label: (
        <Link href="/home" prefetch={false}>
          General
        </Link>
      ),
    },
    {
      key: "/pacientes",
      icon: <UsergroupAddOutlined />,
      label: (
        <Link href="/pacientes" prefetch={false}>
          Pacientes
        </Link>
      ),
    },
    {
      key: "/cirugias",
      icon: <MedicineBoxOutlined />,
      label: (
        <Link href="/cirugias" prefetch={false}>
          Cirugías
        </Link>
      ),
    },
    {
      key: "/usuarios",
      icon: <UserOutlined />,
      label: (
        <Link href="/usuarios" prefetch={false}>
          Usuarios
        </Link>
      ),
    },
    {
      key: "",
      icon: "", //<UserOutlined />,
      label: "",
      className: "disabled-menu-item",
      onClick: () => router.push("/configuracion"),
      style: { marginTop: "auto" },
      disabled: true, // Deshabilitar la opción
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Cerrar Sesión",
      onClick: handleLogout,
      style: { marginTop: "0", marginBottom: 10 },
    },
  ];

  // Determinar la ruta activa
  const getSelectedKey = () => {
    if (pathname.startsWith("/pacientes")) return "/pacientes";
    if (pathname.startsWith("/cirugias")) return "/cirugias";
    if (pathname.startsWith("/usuarios")) return "/usuarios";
    return pathname === "/" ? "/" : pathname;
  };

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
        selectedKeys={[getSelectedKey()]}
        items={menuItems}
        style={{
          display: "flex",
          flexDirection: "column",
          height: collapsed ? "calc(100% - 90px)" : "calc(100% - 240px)",
          padding: "0 20px",
        }}
        inlineCollapsed={collapsed}
      />
    </Sider>
  );
};

export default Sidebar;
