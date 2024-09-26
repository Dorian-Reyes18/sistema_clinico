"use client";

import { useRouter } from "next/navigation";
import IconLogOut from "@images/logouticon.svg"; // Asegúrate de que el ícono se importe correctamente
import styles from "./LogoutButton.module.css"; // Importa el archivo CSS

const LogoutButton = ({ showText }) => {
  const router = useRouter();

  const handleLogout = () => {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/login");
  };

  return (
    <div
      onClick={handleLogout} // Este clic se aplica a todo el contenedor
      className="logout-btn"
      style={{
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        color: "#fff",
      }}
    >
      <IconLogOut />
      <span
        className={`${styles.logoutText} ${
          showText ? styles.show : styles.hide
        }`}
      >
        Cerrar Sesión
      </span>
    </div>
  );
};

export default LogoutButton;
