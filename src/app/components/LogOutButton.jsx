"use client";

import { useRouter } from "next/navigation";
import IconLoGout from "@images/logouticon.svg";

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = () => {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    router.push("/login");
  };

  return (
    <div
      onClick={handleLogout}
      className="logout-btn"
      style={{
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        color: "#fff",
      }}
    >
      <IconLoGout />
      Cerrar Sesión
    </div>
  );
};

export default LogoutButton;
