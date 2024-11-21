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
import { Spin, Modal } from "antd";

// Post consultas
import { postConyuge } from "@/services/Post/Pacientes/crearConyuge";

const AllDataForms = ({ mode, id }) => {
  const router = useRouter();
  const { patients, token } = useAuth();

  const [isCreateMode, setIsCreateMode] = useState(mode === "isCreateMode");
  const [recordId, setRecordId] = useState(id || null);
  const [patientData, setPacienteData] = useState(() => {
    return patients.find((p) => p.id === parseInt(id)) || null;
  });

  const [confirmButton, setconfirmButton] = useState(false);
  const [allFormDataReceive, setAllFormDataReceive] = useState([]);

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
    setAllFormDataReceive((prevData) => [...prevData, { formName, data }]);
    if (formName === "PacienteForm") {
      setPacienteData(data);
    }
  };

  // Aqui chatgpt
  useEffect(() => {
    // Si hay datos significa que recibimos correctamente los datos de cada formulario
    if (allFormDataReceive && allFormDataReceive.length > 5) {
      const conyugeData = JSON.stringify(allFormDataReceive[5].data, null, 2);
      console.log(conyugeData);

      // Mostrar un spinner estilo modal de carga de antd mientras ejecutamos el siguiente código
      if (isCreateMode) {
        // Crear un post en un servicio externo que debemos importar y llamar aquí
        // y guardar lo que nos dé para crear el cónyuge y esperar la respuesta del backend
        // y guardar lo que recibamos
      }
    }
  }, [allFormDataReceive]);

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
      initialValues: isCreateMode ? {} : patientData?.tipoDiabetes?.[0] || {},
    },
  ];

  // Función para manejar la creación en cadena
  const handleSave = async () => {
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
        setconfirmButton(true);
        if (isCreateMode) {
          alert("Datos creados exitosamente.");
        } else {
          alert("Cambios guardados exitosamente.");
        }
      },
      onCancel() {
        console.log("Acción cancelada.");
      },
    });
  };

  return (
    <div className="patient-form-container">
      <h4 className="titleForm">
        {mode === "isEditMode"
          ? "Editar - Datos generales del paciente"
          : "Crear - Datos generales del paciente"}
      </h4>

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

      <button onClick={handleSave}>
        {isCreateMode ? "Crear paciente" : "Guardar Cambios"}
      </button>
    </div>
  );
};

export default AllDataForms;
