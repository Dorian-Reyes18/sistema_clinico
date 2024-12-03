import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/authContext";
import { Modal, notification } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";

// Formularios
import OrdenIntrauterinaForm from "./formsData/OrdenIntrauterinaForm";
import DiagnosticoPrenatalForm from "./formsData/DiagnosticoPrenatalForm";
import CirugiaPercutanea from "./formsData/PercutaneaForm";
import CirugiaAbierta from "./formsData/AbiertaForm";
import CirugiaEndoscopica1 from "./formsData/EndoscopicaForm1";
import CirugiaEndoscopica2 from "./formsData/EndoscopicaForm2";
import CirugiaEndoscopica3 from "./formsData/EndoscopicaForm3";
import ResultadosPerinatales from "./formsData/ResultadosPerinatalesForm";

const FormulariosIntrauterinos = ({ mode, id }) => {
  const router = useRouter();
  const { patients, prenatalSurgeries, token } = useAuth();
  const [confirmButton, setConfirmButton] = useState(false);
  const [currentSurgery, setCurrentSurgery] = useState(null);
  const [showCirugiaForm, setShowCirugiaForms] = useState({
    percutanea: false,
    endoscopica: false,
    abierta: false,
  });
  const [sendData, setSendData] = useState({
    OrdenQuirurgicaIntrauterina: {},
    DiagnosticoPrenatal: {},
    Endoscopicas: [],
    IntrauterinaAbierta: {},
    IntrauterinaPercutanea: {},
    ResultadosPerinatales: {},
  });

  useEffect(() => {
    if (mode === "isEditMode") {
      const data = prenatalSurgeries?.ordenesQuirurgicas;
      const surgery = data?.find((orden) => orden.id === parseInt(id));
      setCurrentSurgery(surgery || null);
    }
  }, [id, prenatalSurgeries]);

  const expectedKeys = [
    "OrdenQuirurgicaIntrauterina",
    "DiagnosticoPrenatal",
    "Endoscopicas",
    "IntrauterinaAbierta",
    "IntrauterinaPercutanea",
    "ResultadosPerinatales",
  ];

  const handleFormSubmit = (formName) => (data) => {
    console.log(`Datos recibidos en el padre de ${formName}:`, data);

    setSendData((prevState) => {
      const updatedState = {
        ...prevState,
        ...(formName.startsWith("CirugiaEndoscopica")
          ? { Endoscopicas: [...prevState.Endoscopicas, data] }
          : { [getStateKey(formName)]: data }),
      };

      if (formName === "ResultadosPerinatales") {
        const cleanedState = Object.fromEntries(
          Object.entries(updatedState).filter(
            ([, value]) =>
              value &&
              (Array.isArray(value)
                ? value.length > 0
                : Object.keys(value).length > 0)
          )
        );
        console.log(
          "Estado final de sendData:",
          JSON.stringify(cleanedState, null, 2)
        );
      }

      return updatedState;
    });
  };

  const getStateKey = (formName) => {
    const mapping = {
      OrdenIntrauterinaForm: "OrdenQuirurgicaIntrauterina",
      DiagnosticoPrenatalForm: "DiagnosticoPrenatal",
      CirugiaAbierta: "IntrauterinaAbierta",
      CirugiaPercutanea: "IntrauterinaPercutanea",
      ResultadosPerinatales: "ResultadosPerinatale",
    };
    return (
      mapping[formName] || console.warn(`Formulario desconocido: ${formName}`)
    );
  };

  const handleSave = () => {
    const modalTitle =
      mode === "isCreateMode"
        ? "¿Está seguro de crear la cirugía?"
        : "¿Está seguro de guardar los cambios?";
    const modalContent =
      mode === "isCreateMode"
        ? "Los datos se guardarán y se creará una nueva cirugía."
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
        router.push("/cirugias");
      },
      onCancel() {
        console.log("El usuario decidió no cancelar.");
      },
    });
  };

  const notifySuccess = () => {
    notification.success({
      message: "Operación exitosa",
      description:
        mode === "isCreateMode"
          ? "La cirugía fue creada con éxito"
          : "Los cambios fueron guardados correctamente.",
      icon: <CheckCircleOutlined style={{ color: "#108ee9" }} />,
    });
  };

  // Configuración de los formularios
  const formConfig = [
    {
      name: "OrdenIntrauterinaForm",
      label: "Datos generales",
      formComponent: OrdenIntrauterinaForm,
      initialValues: mode === "isCreateMode" ? {} : currentSurgery,
      isVisible: true,
    },
    {
      name: "DiagnosticoPrenatalForm",
      label: "Diagnóstico Prenatal",
      formComponent: DiagnosticoPrenatalForm,
      initialValues:
        mode === "isCreateMode"
          ? {}
          : currentSurgery?.diagnosticoPrenatal || null,
      isVisible: true,
    },
    {
      name: "CirugiaAbierta",
      label: "Datos de la cirugía Abierta",
      formComponent: CirugiaAbierta,
      initialValues:
        mode === "isCreateMode"
          ? {}
          : currentSurgery?.intrauterinaAbierta?.[0] || null,
      isVisible: showCirugiaForm.abierta,
    },
    {
      name: "CirugiaPercutanea",
      label: "Datos de la cirugía Percutánea",
      formComponent: CirugiaPercutanea,
      initialValues:
        mode === "isCreateMode"
          ? {}
          : currentSurgery?.intrauterinaPercutanea?.[0] || null,
      isVisible: showCirugiaForm.percutanea,
    },
    {
      name: "CirugiaEndoscopica1",
      label: "Cirugía Endoscópica - Feto 1",
      formComponent: CirugiaEndoscopica1,
      initialValues:
        mode === "isCreateMode"
          ? {}
          : currentSurgery?.intrauterinaEndoscopica?.[0] || null,
      isVisible: showCirugiaForm.endoscopica,
    },
    {
      name: "CirugiaEndoscopica2",
      label: "Cirugía Endoscópica - Feto 2",
      formComponent: CirugiaEndoscopica2,
      initialValues:
        mode === "isCreateMode"
          ? {}
          : currentSurgery?.intrauterinaEndoscopica?.[1] || null,
      isVisible: showCirugiaForm.endoscopica,
    },
    {
      name: "CirugiaEndoscopica3",
      label: "Cirugía Endoscópica - Feto 3",
      formComponent: CirugiaEndoscopica3,
      initialValues:
        mode === "isCreateMode"
          ? {}
          : currentSurgery?.intrauterinaEndoscopica?.[2] || null,
      isVisible: showCirugiaForm.endoscopica,
    },

    {
      name: "ResultadosPerinatales",
      label: "Resultados perinatales",
      formComponent: ResultadosPerinatales,
      initialValues:
        mode === "isCreateMode"
          ? {}
          : currentSurgery?.resultadosPerinatales?.[0] || null,
      isVisible: true,
    },
  ];

  return (
    <div className="prenatal-form-container">
      <div className="titleForm">
        <h4>
          {mode === "isEditMode"
            ? "Editar - Datos generales de la cirugía"
            : "Crear - Datos generales de la cirugía"}
        </h4>
        {mode === "isCreateMode" && (
          <p className="aviso">
            Los campos con un asterisco son obligatorios. Asegúrese de llenarlos
            todos.
          </p>
        )}
      </div>

      <div className="forms-container">
        {formConfig
          .filter((form) => form.isVisible)
          .map(
            ({ name, label, formComponent: FormComponent, initialValues }) => (
              <div className="group-form" key={name}>
                <div className="header">
                  <strong>{label}</strong>
                </div>
                <div className="body">
                  <FormComponent
                    showCirugiaForm={showCirugiaForm}
                    setShowCirugiaForms={setShowCirugiaForms}
                    id={id}
                    mode={mode}
                    initialValues={initialValues}
                    confirmButton={confirmButton}
                    onSubmit={handleFormSubmit(name)}
                  />
                </div>
              </div>
            )
          )}
      </div>

      <div className="btn-opt">
        <button className="btn btn-azul" onClick={handleSave}>
          {mode === "isCreateMode" ? "Crear cirugía" : "Guardar Cambios"}
        </button>
        <button onClick={handleCancelBtn} className="btn btn-gris">
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default FormulariosIntrauterinos;
