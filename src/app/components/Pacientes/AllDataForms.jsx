import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ConyugeForm from "./formsData/ConyugeForm";
import PacienteForm from "./formsData/PacienteForm";
import DiabetesForm from "./formsData/DiabetesForm";
import AntecedentesFamiliaresForm from "./formsData/AntecedentesFamiliaresForm";
import AntecedentesObstForm from "./formsData/antecedentesObstetricos";
import AntecedentePersonalesForm from "./formsData/AntecedentesPersonalesForm";
import EmbarazoActual from "./formsData/EmbarazoActual";
import { useAuth } from "@/app/hooks/authContext";
import { Spin } from "antd"; // Indicador de carga

const AllDataForms = ({ mode, id }) => {
  const router = useRouter();
  const { patients } = useAuth();

  const [isCreateMode, setIsCreateMode] = useState(mode === "isCreateMode");
  const [recordId, setRecordId] = useState(id || null);
  const [patientData, setPacienteData] = useState(() => {
    return patients.find((p) => p.id === parseInt(id)) || null;
  });

  // Estados para cada formulario
  const [antObstetricos, setAntObstetricos] = useState({
    pacienteId: 0,
    gesta: "0",
    parto: "0",
    aborto: "0",
    cesarea: "0",
    legrado: "0",
  });

  // Estado para antecedentes personales (añadido)
  const [antecedentesPersonales, setAntecedentesPersonales] = useState({});

  // Cargar datos del paciente si estamos en modo de edición
  useEffect(() => {
    if (mode === "isEditMode" && id) {
      const patient = patients.find((p) => p.id === parseInt(id));
      if (patient) {
        setPacienteData(patient);
      }
    }
  }, [mode, id, patients]);

  // Funciones de manejo para guardar cada formulario
  const handleConyugeFormSubmit = (data) => {
    console.log("Datos del cónyuge recibidos:", data);
  };

  const handlePacienteFormSubmit = (data) => {
    setPacienteData(data);
    console.log("Datos del paciente recibidos:", data);
  };

  const handleDiabetesFormSubmit = (data) => {
    console.log("Datos de diabetes recibidos:", data);
  };

  const handleAntecedentesSubmit = (data) => {
    console.log("Datos de antecedentes familiares:", data);
  };

  const handleAntecedentesObstetricosSubmit = (data) => {
    setAntObstetricos(data);
    console.log("Datos obstétricos recibidos:", data);
  };

  const handleAntecedentespersonalesForm = (data) => {
    setAntecedentesPersonales(data);
    console.log("Antecedentes personales recibidos", data);
  };

  const handleEmbarazoActualForm = (data) => {
    console.log("Embarazo actual recibido", data);
  };

  // Función para manejar la creación en cadena
  const handleSave = async () => {
    if (isCreateMode) {
      // Implementar el flujo de creación en cadena
      alert("Datos creados exitosamente.");
    } else {
      alert("Modo de edición aún no implementado.");
    }
  };

  return (
    <div className="patient-form-container">
      <h4 className="titleForm">Datos generales del paciente</h4>

      <div className="forms-container">
        <div className="group-form">
          <div className="header">
            <span>
              <strong>Datos del Paciente</strong>
            </span>
          </div>
          <div className="body">
            <PacienteForm
              mode={mode}
              onSubmit={handlePacienteFormSubmit}
              initialValues={isCreateMode ? {} : patientData || {}}
            />
          </div>
        </div>

        <div className="group-form">
          <div className="header">
            <strong>Embarazo actual</strong>
          </div>
          <div className="body">
            <EmbarazoActual
              mode={mode}
              onSubmit={handleEmbarazoActualForm}
              initialValues={
                isCreateMode
                  ? {}
                  : patientData?.embarazoActual?.length > 0
                  ? patientData.embarazoActual[0]
                  : {}
              }
            />
          </div>
        </div>

        <div className="group-form">
          <div className="header">
            <strong>Antecedentes Personales</strong>
          </div>
          <div className="body">
            <AntecedentePersonalesForm
              mode={mode}
              onSubmit={handleAntecedentespersonalesForm}
              initialValues={
                isCreateMode
                  ? {}
                  : patientData?.antecedentesPersonales?.length > 0
                  ? patientData.antecedentesPersonales[0]
                  : {}
              }
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
              mode={mode}
              onSubmit={handleAntecedentesSubmit}
              initialValues={
                isCreateMode
                  ? {}
                  : patientData?.antecedentesFamiliaresDefectos?.[0] || {
                      opcion: false,
                      descripcion: "",
                    }
              }
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
              mode={mode}
              onSubmit={handleAntecedentesObstetricosSubmit}
              initialValues={
                isCreateMode
                  ? {}
                  : patientData?.antecedentesObstetricos?.length > 0
                  ? patientData?.antecedentesObstetricos?.[0]
                  : {}
              }
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
            <ConyugeForm
              mode={mode}
              onSubmit={handleConyugeFormSubmit}
              initialValues={isCreateMode ? {} : patientData || {}}
            />
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
              onSubmit={handleDiabetesFormSubmit}
              initialValues={isCreateMode ? {} : patientData?.conyuge || null}
            />
          </div>
        </div>
      </div>
      {/* Botón para guardar los datos */}
      <button onClick={handleSave}>
        {isCreateMode ? "Crear en Cadena" : "Guardar Cambios"}
      </button>
    </div>
  );
};

export default AllDataForms;
