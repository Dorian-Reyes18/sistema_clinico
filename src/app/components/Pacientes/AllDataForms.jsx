import React, { useState } from "react";
import ConyugeForm from "./formsData/ConyugeForm";
import PacienteForm from "./formsData/PacienteForm";
import DiabetesForm from "./formsData/DiabetesForm";
import AntecedentesFamiliaresForm from "./formsData/AntecedentesFamiliaresForm"; // Asegúrate de importar el nuevo componente

const AllDataForms = () => {
  const [conyugeData, setConyugeData] = useState(null);
  const [pacienteData, setPacienteData] = useState(null);
  const [diabetesData, setDiabetesData] = useState(null);
  const [antecedentesData, setAntecedentesData] = useState({
    opcion: false,
    descripcion: "",
  });

  const handleConyugeFormSubmit = (data) => {
    setConyugeData(data);
    console.log("Datos del cónyuge recibidos:", data);
  };

  const handlePacienteFormSubmit = (data) => {
    setPacienteData(data);
    console.log("Datos del paciente recibidos:", data);
  };

  const handleDiabetesFormSubmit = (data) => {
    setDiabetesData(data);
    console.log("Datos de diabetes recibidos:", data);
  };

  const handleAntecedentesSubmit = (data) => {
    setAntecedentesData(data);
    console.log("Datos de antecedentes familiares:", data);
  };

  return (
    <div className="patient-form-container">
      <h4>Datos generales del paciente</h4>

      <div className="forms-container">
        <div className="group-form">
          <div className="header">
            <span>
              <strong>Datos del Paciente</strong>
            </span>
          </div>
          <div className="body">
            <PacienteForm
              conyugeId={conyugeData?.id}
              onSubmit={handlePacienteFormSubmit}
            />
          </div>
        </div>

        <div className="group-form">
          <div className="header">
            <span>
              <strong>Datos del Cónyuge</strong>
            </span>
          </div>
          <div className="body">
            <ConyugeForm onSubmit={handleConyugeFormSubmit} />
          </div>
        </div>

        <div className="group-form">
          <div className="header">
            <span>
              <strong>Datos de Diabetes</strong>
            </span>
          </div>
          <div className="body">
            <DiabetesForm
              pacienteId={pacienteData?.id}
              onSubmit={handleDiabetesFormSubmit}
            />
          </div>
        </div>

        <div className="group-form">
          <div className="header">
            <span>
              <strong>Antecedentes familiares de defectos</strong>
            </span>
          </div>
          <div className="body">
            <AntecedentesFamiliaresForm
              pacienteId={pacienteData?.id}
              onSubmit={handleAntecedentesSubmit}
              initialValues={antecedentesData}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllDataForms;
