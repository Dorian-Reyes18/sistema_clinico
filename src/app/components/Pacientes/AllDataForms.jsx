import React, { useState } from "react";
import ConyugeForm from "./formsData/ConyugeForm";
import PacienteForm from "./formsData/PacienteForm";
import DiabetesForm from "./formsData/DiabetesForm";
import AntecedentesFamiliaresForm from "./formsData/AntecedentesFamiliaresForm";
import AntecedentesObstForm from "./formsData/antecedentesObstetricos";
import AntecedentePersonalesForm from "./formsData/AntecedentesPersonalesForm";

const AllDataForms = () => {
  const [conyugeData, setConyugeData] = useState(null);
  const [pacienteData, setPacienteData] = useState(null);
  const [diabetesData, setDiabetesData] = useState(null);
  const [antecedentesData, setAntecedentesData] = useState({
    opcion: false,
    descripcion: "",
  });
  const [antObstetricos, setAntObstetricos] = useState({
    pacienteId: 0,
    gesta: "0",
    parto: "0",
    aborto: "0",
    cesarea: "0",
    legrado: "0",
  });
  const [antecedentesPersonales, setAntecedentesPersonales] = useState();

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

  const handleAntecedentesObstetricosSubmit = (data) => {
    setAntObstetricos(data);
    console.log("Datos obstétricos recibidos:", data);
  };

  const handleAntecedentespersonalesForm = (data) => {
    console.log("Antecedentes personales recibidos", data);
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
        <div className="group-form">
          <div className="header">
            <span>
              <strong>Antecedentes Obstetricos</strong>
            </span>
          </div>
          <div className="body">
            <AntecedentesObstForm
              pacienteId={pacienteData?.id}
              onSubmit={handleAntecedentesObstetricosSubmit}
              initialValues={antObstetricos}
            />
          </div>
        </div>
        <div className="group-form">
          <div className="header">
            <strong>Antecedentes Personales</strong>
          </div>
          <div className="body">
            <AntecedentePersonalesForm
              pacienteId={pacienteData?.id}
              diabetesId={diabetesData?.id}
              onSubmit={handleAntecedentespersonalesForm}
              initialValues={antecedentesPersonales}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllDataForms;
