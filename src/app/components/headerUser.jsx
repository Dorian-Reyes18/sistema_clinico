"use client";

// HeaderUser.js
import { useAuth } from "../hooks/authContext";
import LogoDoctor from "@images/doctorIcon.svg";
import LogoUser from "@images/userIcon.svg";
import Image from "next/image";
import VolverBtn from "./VolverBtn";

const HeaderUser = ({ currentPath }) => {
  const { user, loading, error } = useAuth();

  // Si no hay un user disponible, muestra un texto de carga o vacío
  if (loading) {
    return <div>Cargando...</div>;
  }

  // Manejo de error (opcional, si necesitas mostrar algo en caso de error)
  if (error) {
    return <div>Error al cargar los datos del usuario.</div>;
  }

  // Asegúrate de que los datos de `user` y `user.rol` estén disponibles
  const nombreYApellido = user?.nombreYApellido || "Usuario no disponible";
  const rol = user?.rol?.nombreRol || "Rol no disponible";

  const getPathData = (path) => {
    if (path === "/home") {
      return {
        label: "Datos generales",
        imageSrc: "/images/home/HomeIcon.png",
      };
    } else if (path === "/cirugias") {
      return {
        label: "Cirugías",
        imageSrc: "/images/home/CirugiasIcon.png",
      };
    } else if (path === "/cirugias/gestionarCirugias") {
      return {
        label: "Gestión de cirugías Intrauterinas",
        imageSrc: "/images/home/CirugiasIcon.png",
      };
    } else if (path === "/cirugias/gestionarCirugiaPostnatal") {
      return {
        label: "Gestión de cirugías PostNatales",
        imageSrc: "/images/home/CirugiasIcon.png",
      };
    } else if (path === "/pacientes") {
      return {
        label: "Pacientes",
        imageSrc: "/images/home/PacientesIcon.png",
      };
    } else if (path === "/pacientes/crearPaciente") {
      return {
        label: "Gestión de Pacientes",
        imageSrc: "/images/home/PacientesIcon.png",
      };
    } else if (path === "/usuarios") {
      return {
        label: "Usuarios",
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
          <VolverBtn currentPath={currentPath} />
          <Image src={imageSrc} alt="Icono saludo" width={20} height={20} />
          <span>{label}</span>
        </p>
      </div>
      <div style={{ display: "flex", flexDirection: "row", gap: 14 }}>
        <div className="name-rol">
          <p>
            <strong>{nombreYApellido}</strong>
          </p>
          <span
            style={{
              fontSize: 12,
              color:
                rol.toLowerCase() === "administrador" ? "#1074bc" : "#bd3548",
            }}
          >
            <strong>{rol}</strong>
          </span>
        </div>

        {rol.toLowerCase() === "administrador" ? <LogoDoctor /> : <LogoUser />}
      </div>
    </div>
  );
};

export default HeaderUser;
