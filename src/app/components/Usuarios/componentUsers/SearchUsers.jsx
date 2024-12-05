import { Input } from "antd";
import { useState } from "react";

const SearchUser = ({ data, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    const lowerCaseValue = value.toLowerCase();

    const filteredData = data.filter((usuario) => {
      // Propiedades del usuario a buscar
      const nombre = usuario.nombreYApellido
        ? usuario.nombreYApellido.toLowerCase()
        : "";
      const email = usuario.correo ? usuario.correo.toLowerCase() : "";
      const rol = usuario.rol?.nombreRol
        ? usuario.rol.nombreRol.toLowerCase()
        : "";
      const estado = usuario.activo ? "sí" : "no";
      const telefono = usuario.telefono ? usuario.telefono.toLowerCase() : "";

      return (
        nombre.includes(lowerCaseValue) ||
        email.includes(lowerCaseValue) ||
        rol.includes(lowerCaseValue) ||
        estado.includes(lowerCaseValue) ||
        telefono.includes(lowerCaseValue)
      );
    });

    onSearch(filteredData);
  };

  return (
    <div className="wrapper">
      <div className="input-wrapper">
        <Input
          placeholder="Buscar por nombre, correo, rol, teléfono o estado..."
          value={searchTerm}
          onChange={handleChange}
          className="form-control mb-3"
        />
      </div>
    </div>
  );
};

export default SearchUser;
