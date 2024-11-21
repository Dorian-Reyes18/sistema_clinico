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
import { Spin } from "antd";

const AllDataForms = ({ mode, id }) => {
  const router = useRouter();
  const { patients } = useAuth();

  const [isCreateMode, setIsCreateMode] = useState(mode === "isCreateMode");
  const [recordId, setRecordId] = useState(id || null);
  const [patientData, setPacienteData] = useState(() => {
    return patients.find((p) => p.id === parseInt(id)) || null;
  });

  useEffect(() => {
    if (mode === "isEditMode" && id) {
      const patient = patients.find((p) => p.id === parseInt(id));
      if (patient) {
        setPacienteData(patient);
      }
    }
  }, [mode, id, patients]);

  // Funciones de manejo para cada formulario
  const handleFormSubmit = (formName) => (data) => {
    console.log(`Datos del formulario ${formName} recibidos:`, data);
    if (formName === "PacienteForm") {
      setPacienteData(data);
    }
  };

  // Datos para inicializar los formularios
  const formConfig = [
    {
      name: "PacienteForm",
      label: "Datos del Paciente",
      formComponent: PacienteForm,
      initialValues: isCreateMode ? {} : patientData || {},
    },
    {
      name: "EmbarazoActual",
      label: "Embarazo actual",
      formComponent: EmbarazoActual,
      initialValues: isCreateMode ? {} : patientData?.embarazoActual?.[0] || {},
    },
    {
      name: "AntecedentePersonalesForm",
      label: "Antecedentes Personales",
      formComponent: AntecedentePersonalesForm,
      initialValues: isCreateMode
        ? {}
        : patientData?.antecedentesPersonales?.[0] || {},
    },
    {
      name: "AntecedentesFamiliaresForm",
      label: "Antecedentes familiares de defectos",
      formComponent: AntecedentesFamiliaresForm,
      initialValues: isCreateMode
        ? {}
        : patientData?.antecedentesFamiliaresDefectos?.[0] || {},
    },
    {
      name: "AntecedentesObstForm",
      label: "Antecedentes Obstetricos",
      formComponent: AntecedentesObstForm,
      initialValues: isCreateMode
        ? {}
        : patientData?.antecedentesObstetricos?.[0] || {},
    },
    {
      name: "ConyugeForm",
      label: "Datos del Cónyuge",
      formComponent: ConyugeForm,
      initialValues: isCreateMode ? {} : patientData || {},
    },
    {
      name: "DiabetesForm",
      label: "Datos de Diabetes",
      formComponent: DiabetesForm,
      initialValues: isCreateMode
        ? {}
        : patientData?.tipoDiabetes?.[0] || {},
    },
  ];

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
        {formConfig.map(({ name, label, formComponent: FormComponent, initialValues }) => (
          <div className="group-form" key={name}>
            <div className="header">
              <strong>{label}</strong>
            </div>
            <div className="body">
              <FormComponent
                mode={mode}
                onSubmit={handleFormSubmit(name)}
                initialValues={initialValues}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Botón para guardar los datos */}
      <button onClick={handleSave}>
        {isCreateMode ? "Crear paciente" : "Guardar Cambios"}
      </button>
    </div>
  );
};

export default AllDataForms;
