import { Input } from "antd";
import { useState } from "react";

const SearchBar = ({ data, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    const filteredData = data.filter((item) => {
      const expediente = item.numeroExpediente
        ? String(item.numeroExpediente)
        : "";
      const fechaIngreso = new Date(item.fechaIngreso).toLocaleDateString();
      const nombreCompleto = `${item.primerNombre} ${
        item.segundoNombre || ""
      } ${item.primerApellido} ${item.segundoApellido || ""}`.toLowerCase();
      const edad = item.edad ? String(item.edad) : "";
      const fechaNac = new Date(item.fechaNac).toLocaleDateString();
      const telefono1 = item.telefono1 ? String(item.telefono1) : "";
      const telefono2 = item.telefono2 ? String(item.telefono2) : "";
      const municipio = item.municipio.nombre
        ? String(item.municipio.nombre)
        : "";
      const domicilio = item.domicilio ? String(item.domicilio) : "";
      const conyuge = item.conyuge ? `${item.conyuge.edad} años` : "No";

      return (
        expediente.includes(value) ||
        fechaIngreso.includes(value) ||
        nombreCompleto.includes(value.toLowerCase()) ||
        edad.includes(value) ||
        fechaNac.includes(value) ||
        telefono1.includes(value) ||
        telefono2.includes(value) ||
        municipio.includes(value) ||
        domicilio.includes(value) ||
        conyuge.includes(value)
      );
    });

    onSearch(filteredData);
  };

  return (
    <Input
      placeholder="Buscar..."
      value={searchTerm}
      onChange={handleChange}
      className="form-control mb-3"
    />
  );
};
export default SearchBar;
