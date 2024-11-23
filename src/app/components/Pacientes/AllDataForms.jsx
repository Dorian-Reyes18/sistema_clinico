import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/authContext";
import { Spin, Modal } from "antd";

// Formularios
import ConyugeForm from "./formsData/ConyugeForm";
import PacienteForm from "./formsData/PacienteForm";
import DiabetesForm from "./formsData/DiabetesForm";
import AntecedentesFamiliaresForm from "./formsData/AntecedentesFamiliaresForm";
import AntecedentesObstForm from "./formsData/antecedentesObstetricos";
import AntecedentePersonalesForm from "./formsData/AntecedentesPersonalesForm";
import EmbarazoActual from "./formsData/EmbarazoActual";

// Servicios
import { postConyuge } from "@/services/Post/Pacientes/crearConyuge";

const AllDataForms = ({ mode, id }) => {
  const router = useRouter();
  const { patients, token } = useAuth();

  // Estados
  const [isCreateMode, setIsCreateMode] = useState(mode === "isCreateMode");
  const [recordId, setRecordId] = useState(id || null);
  const [patientData, setPacienteData] = useState(
    () => patients.find((p) => p.id === parseInt(id)) || null
  );
  const [confirmButton, setconfirmButton] = useState(0);
  const [allFormDataReceive, setAllFormDataReceive] = useState([]);
  const [validateForms, setValidateForms] = useState({
    dataPaciente: false,
    embarazoActual: false,
    antPersonales: false,
    antObstetricos: false,
    dataConyuge: false,
  });

  // Detectar cambios en los formularios (elminar mas tarde)
  useEffect(() => {
    const changes = Object.entries(validateForms).filter(
      ([key, value]) => value === true
    );
    changes.forEach(([key]) => {
      console.log(`El formulario ${key} es true`);
    });
  }, [validateForms]);

  // Actualizar datos de paciente en modo edición
  useEffect(() => {
    if (mode === "isEditMode" && id) {
      const patient = patients.find((p) => p.id === parseInt(id));
      if (patient) {
        setPacienteData(patient);
      }
    }
  }, [mode, id, patients]);

  // Manejar el envío de cada formulario
  const handleFormSubmit = (formName) => (data) => {
    setAllFormDataReceive((prevData) => {
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

  // Manejo de datos recibidos de formularios
  useEffect(() => {
    if (allFormDataReceive.length > 0) {
      console.log(allFormDataReceive);
      if (confirmButton) {
        setconfirmButton(false);
      }
    }
    // Mostrar un spinner estilo modal de carga de antd mientras ejecutamos el siguiente código
    else if (isCreateMode) {
      
      // Crear un post en un servicio externo que debemos importar y llamar aquí
      // y guardar lo que nos dé para crear el cónyuge y esperar la respuesta del backend
      // y guardar lo que recibamos
    }
  }, [allFormDataReceive]);

  // Configuración de los formularios
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

  // Función para guardar los datos
  const handleSave = async () => {
    const areAllFormsValid = Object.values(validateForms).every(
      (isValid) => isValid
    );

    if (isCreateMode) {
      if (!areAllFormsValid) {
        Modal.error({
          title: "Formulario incompleto",
          content:
            "Por favor, complete todos los campos requeridos antes de continuar.",
          centered: true,
          okText: "Entendido",
        });
        return;
      }
    }

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
        setconfirmButton((prev) => prev + 1);
      },
      onCancel() {
        console.log("Acción cancelada.");
      },
    });
  };

  // Función para cancelar cambios
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

  return (
    <div className="patient-form-container">
      <div className="titleForm">
        <h4>
          {mode === "isEditMode"
            ? "Editar - Datos generales del paciente"
            : "Crear - Datos generales del paciente"}
        </h4>
        <p className="aviso">Los campos con un asterisco son obligatorios</p>
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
                  setValidateForms={setValidateForms}
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
