"use client";

// HeaderUser.js
import { useAuth } from "../hooks/authContext";
import LogoDoctor from "@images/doctorIcon.svg";
import LogoUser from "@images/userIcon.svg";
import Image from "next/image";

const HeaderUser = ({ currentPath }) => {
  const { user, loading, error } = useAuth();

  console.log(currentPath);

  if (loading) {
    return <p>Cargando usuario...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (!user) {
    return <p>No has iniciado sesión.</p>;
  }

  return (
    <div className="header-user">
      <div>
        <p style={{ fontSize: 18, display: "flex", alignItems: "center", gap: 15 }}>
          <Image
            src="/images/HomeIcon.png"
            alt="Icono saludo"
            width={20}
            height={18.18}
          />
          {currentPath === "/home" && <span>General / Datos generales</span>}
        </p>
      </div>
      <div style={{ display: "flex", flexDirection: "row", gap: 14 }}>
        <div className="name-rol">
          <p>
            <strong>{user.nombreYApellido}</strong>
          </p>
          <span
            style={{
              fontSize: 12,
              color:
                user.rol.nombreRol.toLowerCase() === "administrador"
                  ? "#1074bc"
                  : "#bd3548",
            }}
          >
            <strong>{user.rol.nombreRol}</strong>
          </span>
        </div>

        {user.rol.nombreRol.toLowerCase() === "administrador" ? (
          <LogoDoctor />
        ) : (
          <LogoUser />
        )}
      </div>
    </div>
  );
};

export default HeaderUser;
