import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/authContext";
import { Modal } from "antd";

// Formularios
import ConyugeForm from "./formsData/ConyugeForm";
import PacienteForm from "./formsData/PacienteForm";
import DiabetesForm from "./formsData/DiabetesForm";
import AntecedentesFamiliaresForm from "./formsData/AntecedentesFamiliaresForm";
import AntecedentesObstForm from "./formsData/antecedentesObstetricos";
import AntecedentePersonalesForm from "./formsData/AntecedentesPersonalesForm";
import EmbarazoActual from "./formsData/EmbarazoActual";

const AllDataForms = ({ mode, id }) => {
  const router = useRouter();
  const { patients } = useAuth();

  // Estados
  const [isCreateMode, setIsCreateMode] = useState(mode === "isCreateMode");
  const [patientData, setPacienteData] = useState(
    () => patients.find((p) => p.id === parseInt(id)) || null
  );
  const [confirmButton, setConfirmButton] = useState(false);
  const [DataFormsReceive, setDataFormsReceive] = useState([]);
  const [completeData, setCompleteData] = useState(null);

  // Configuración de formularios
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
      initialValues: isCreateMode ? {} : patientData?.tipoDiabetes?.[0] || {},
    },
  ];

  // Efectos

  useEffect(() => {
    if (mode === "isEditMode" && id) {
      const patient = patients.find((p) => p.id === parseInt(id));
      if (patient) setPacienteData(patient);
    }
  }, [mode, id, patients]);

  useEffect(() => {
    if (DataFormsReceive.length === formConfig.length) {
      setCompleteData(DataFormsReceive);
    }
  }, [DataFormsReceive]);

  // Funciones para manejar el modal y guardado
  const handleSave = () => {
    const modalTitle = isCreateMode
      ? "¿Está seguro de crear el paciente?"
      : "¿Está seguro de guardar los cambios?";
    const modalContent = isCreateMode
      ? "Los datos se guardarán y se creará un nuevo paciente."
      : "Los cambios serán guardados y no podrás deshacerlos.";

    Modal.confirm({
      title: modalTitle,
      content: modalContent,
      okText: "Sí",
      cancelText: "No",
      centered: true,
      onOk() {
        setConfirmButton(true);
      },
      onCancel() {
        console.log("Acción cancelada.");
      },
    });
  };

  const handleCancelBtn = () => {
    Modal.confirm({
      title: "¿Está seguro que desea cancelar?",
      content: "Perderá todos los cambios que haya hecho.",
      okText: "Confirmar",
      cancelText: "Regresar",
      centered: true,
      onOk() {
        router.push("/pacientes");
      },
      onCancel() {
        console.log("El usuario decidió no cancelar.");
      },
    });
  };

  // Manejar el envío de cada formulario
  const handleFormSubmit = (formName) => (data) => {
    setDataFormsReceive((prevData) => {
      const existingIndex = prevData.findIndex(
        (entry) => entry.formName === formName
      );
      if (existingIndex > -1) {
        const updatedData = [...prevData];
        updatedData[existingIndex] = { formName, data };
        return updatedData;
      }
      return [...prevData, { formName, data }];
    });
  };

  // Renderizar formularios
  return (
    <div className="patient-form-container">
      <div className="titleForm">
        <h4>
          {mode === "isEditMode"
            ? "Editar - Datos generales del paciente"
            : "Crear - Datos generales del paciente"}
        </h4>
      </div>

      <div className="forms-container">
        {formConfig.map(
          ({ name, label, formComponent: FormComponent, initialValues }) => (
            <div className="group-form" key={name}>
              <div className="header">
                <strong>{label}</strong>
              </div>
              <div className="body">
                <FormComponent
                  mode={mode}
                  onSubmit={handleFormSubmit(name)}
                  initialValues={initialValues}
                  confirmButton={confirmButton}
                />
              </div>
            </div>
          )
        )}
      </div>

      <div className="btn-opt">
        <button className="btn btn-azul" onClick={handleSave}>
          {isCreateMode ? "Crear paciente" : "Guardar Cambios"}
        </button>
        <button onClick={handleCancelBtn} className="btn btn-gris">
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default AllDataForms;
