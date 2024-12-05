import { Input } from "antd";
import { useState, useEffect } from "react";

const SearchUser = ({ data, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [originalData, setOriginalData] = useState(data);
  
  useEffect(() => {
    setOriginalData(data);
  }, [data]);

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    const lowerCaseValue = value.toLowerCase();

    if (!value) {
      onSearch(originalData); 
    } else {
      const filteredData = originalData.filter((usuario) => {
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
    }
  };

  return (
    <div className="wrapper">
      <div className="input-wrapper">
        <Input
          placeholder="Buscar por Nombre, correo, rol, tel."
          value={searchTerm}
          onChange={handleChange}
          className="form-control mb-3"
        />
      </div>
    </div>
  );
};

export default SearchUser;
