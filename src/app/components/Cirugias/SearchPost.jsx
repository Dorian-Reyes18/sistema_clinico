import { Input } from "antd";
import { useState } from "react";

const SearchPost = ({
  data,
  onSearch,
  setFilteredSurgeries,
  setIsSearchActive,
  setShowNeonatal,
  setShowNerviosoCentral,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() === "") {
      // Restaurar estado inicial cuando no hay texto
      setFilteredSurgeries(data);
      setIsSearchActive(false);
      setShowNeonatal(true);
      setShowNerviosoCentral(true);
      return;
    }

    const lowerCaseValue = value.toLowerCase();

    const filteredData = data.filter((cirugia) => {
      const numeroExpediente = cirugia?.paciente?.numeroExpediente
        ? String(cirugia.paciente.numeroExpediente)
        : "";
      const fechaCreacion = cirugia?.fechaDeCreacion
        ? new Date(cirugia.fechaDeCreacion).toLocaleDateString()
        : "";
      const nombreCompleto = `${cirugia?.paciente?.primerNombre || ""} ${
        cirugia?.paciente?.primerApellido || ""
      }`.toLowerCase();
      const fechaIntervencion = cirugia?.fechaDeIntervencion
        ? new Date(cirugia.fechaDeIntervencion).toLocaleDateString()
        : "";
      const tipoCirugia = cirugia?.tipoCirugia
        ? cirugia.tipoCirugia.toLowerCase()
        : "";
      const responsable = cirugia?.doctor?.nombreYApellido
        ? cirugia.doctor.nombreYApellido.toLowerCase()
        : "";
      const estado = cirugia?.estado ? "activa" : "finalizada";

      return (
        numeroExpediente.includes(lowerCaseValue) ||
        fechaCreacion.includes(lowerCaseValue) ||
        nombreCompleto.includes(lowerCaseValue) ||
        fechaIntervencion.includes(lowerCaseValue) ||
        tipoCirugia.includes(lowerCaseValue) ||
        responsable.includes(lowerCaseValue) ||
        estado.includes(lowerCaseValue)
      );
    });

    // Actualizar estados según los resultados
    setFilteredSurgeries(filteredData);
    setIsSearchActive(true);
    setShowNeonatal(false);
    setShowNerviosoCentral(false);
  };

  return (
    <div className="wrapper">
      <div className="input-wrapper">
        <Input
          placeholder="Exped, fecha, paciente, intervención, etc..."
          value={searchTerm}
          onChange={handleChange}
          className="form-control mb-3"
        />
      </div>
    </div>
  );
};

export default SearchPost;
