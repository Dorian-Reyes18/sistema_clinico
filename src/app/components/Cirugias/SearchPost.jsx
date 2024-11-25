import { Input } from "antd";
import { useState } from "react";

const SearchIntra = ({ data, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    const lowerCaseValue = value.toLowerCase(); 

    const filteredData = data.filter((cirugia) => {
      // Propiedades de la cirugía a buscar
      const numeroExpediente = cirugia.paciente?.numeroExpediente
        ? String(cirugia.paciente.numeroExpediente)
        : "";
      const fechaCreacion = cirugia.fechaDeCreacion
        ? new Date(cirugia.fechaDeCreacion).toLocaleDateString()
        : "";
      const nombreCompleto = `${cirugia.paciente?.primerNombre || ""} ${
        cirugia.paciente?.primerApellido || ""
      }`.toLowerCase();
      const tipoCirugia = cirugia.tipoCirugia
        ? cirugia.tipoCirugia.toLowerCase()
        : "";
      const etapa = cirugia.etapa ? cirugia.etapa.toLowerCase() : "";
      const estado = cirugia.estado ? "activa" : "finalizada";

      return (
        numeroExpediente.toLowerCase().includes(lowerCaseValue) ||
        fechaCreacion.includes(lowerCaseValue) ||
        nombreCompleto.includes(lowerCaseValue) ||
        tipoCirugia.includes(lowerCaseValue) ||
        etapa.includes(lowerCaseValue) ||
        estado.includes(lowerCaseValue)
      );
    });

    onSearch(filteredData);
  };

  return (
    <div className="wrapper">
      <div className="input-wrapper">
        <Input
          placeholder="Exped, fecha, paciente, cirugia, estado..."
          value={searchTerm}
          onChange={handleChange}
          className="form-control mb-3"
        />
      </div>
    </div>
  );
};

export default SearchIntra;
