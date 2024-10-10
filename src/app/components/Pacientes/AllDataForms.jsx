import React, { useState } from "react";
import ConyugeForm from "./formsData/ConyugeForm";
import PacienteForm from "./formsData/PacienteForm";

const AllDataForms = () => {
  const [conyugeData, setConyugeData] = useState(null);
  const [pacienteData, setPacienteData] = useState(null);

  const handleConyugeFormSubmit = (data) => {
    setConyugeData(data);
    console.log("Datos del cónyuge recibidos:", data);
  };

  const handlePacienteFormSubmit = (data) => {
    setPacienteData(data);
    console.log("Datos del paciente recibidos:", data);
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
              <strong>Datos del Conyuge</strong>
            </span>
          </div>
          <div className="body">
            <ConyugeForm onSubmit={handleConyugeFormSubmit} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllDataForms;
