import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/authContext";
import { Modal, notification } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";

// Formularios
import OrdenIntrauterinaForm from "./formsData/OrdenIntrauterinaForm";
import DiagnosticoPrenatalForm from "./formsData/DiagnosticoPrenatalForm";
import CirugiaPercutanea1 from "./formsData/Percutanea1Form";
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

  useEffect(() => {
    if (mode === "isEditMode") {
      const data = prenatalSurgeries?.ordenesQuirurgicas;
      const surgery = data?.find((orden) => orden.id === parseInt(id));
      setCurrentSurgery(surgery || null);
    }
  }, [id, prenatalSurgeries]);

  useEffect(() => {
    console.log("Estado de showCirugiaForms ha cambiado:", showCirugiaForm);
  }, [showCirugiaForm]);

  const handleFormSubmit = (formName) => (data) => {
    console.log("Datos recibidos en el padre:", data);
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
      name: "CirugiaPercutanea1",
      label: "Datos de la cirugía Percutánea",
      formComponent: CirugiaPercutanea1,
      initialValues:
        mode === "isCreateMode"
          ? {}
          : currentSurgery?.intrauterinaPercutanea?.[0] || null,
      isVisible: showCirugiaForm.percutanea,
    },
    {
      name: "ResultadosPerinatales",
      label: "Resultados perinatales",
      formComponent: ResultadosPerinatales,
      initialValues:
        mode === "isCreateMode"
          ? {}
          : currentSurgery?.intrauterinaPercutanea?.[0] || null,
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
