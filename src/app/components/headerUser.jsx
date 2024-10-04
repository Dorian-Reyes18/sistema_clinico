"use client";

// HeaderUser.js
import { useAuth } from "../hooks/authContext";
import LogoDoctor from "@images/doctorIcon.svg";
import LogoUser from "@images/userIcon.svg";
import Image from "next/image";

const HeaderUser = ({ currentPath }) => {
  const { user, loading, error } = useAuth();

  const getPathData = (path) => {
    if (path === "/home") {
      return {
        label: "General / Datos generales",
        imageSrc: "/images/home/HomeIcon.png",
      };
    } else if (path === "/cirugias") {
      return {
        label: "Cirugías / Todas las cirugias",
        imageSrc: "/images/home/CirugiasIcon.png",
      };
    } else if (path === "/pacientes") {
      return {
        label: "Pacientes / Registro",
        imageSrc: "/images/home/PacientesIcon.png",
      };
    } else if (path === "/usuarios") {
      return {
        label: "Usuarios / Administración",
        imageSrc: "/images/home/UsuariosIcon.png",
      };
    } else {
      return {
        label: "Ruta no especificada",
        imageSrc: "/images/DefaultIcon.png",
      };
    }
  };

  const { label, imageSrc } = getPathData(currentPath);

  return (
    <div className="header-user">
      <div>
        <p
          style={{
            fontSize: 18,
            display: "flex",
            alignItems: "center",
            gap: 15,
          }}
        >
          <Image src={imageSrc} alt="Icono saludo" width={20} height={18.18} />
          <span>{label}</span>
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
