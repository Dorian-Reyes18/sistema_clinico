import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/authContext";
import { Modal, notification, Spin } from "antd";
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

// Servicios
import { postCirugiaIntraCompleta } from "@/services/Post/cirugias/dataPostIntra";

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
    Endoscopicas: [],
  });
  const [loading, setLoading] = useState(false);

  const startLoading = () => setLoading(true);
  const stopLoading = () => setLoading(false);

  useEffect(() => {
    if (mode === "isEditMode") {
      const data = prenatalSurgeries?.ordenesQuirurgicas;
      const surgery = data?.find((orden) => orden.id === parseInt(id));
      setCurrentSurgery(surgery || null);
    }
  }, [id, prenatalSurgeries]);

  const handleFormSubmit = (formName) => (data) => {
    setSendData((prevState) => {
      const updatedState = { ...prevState };

      // Actualizamos según el formulario
      switch (formName) {
        case "OrdenIntrauterinaForm":
          updatedState.OrdenQuirurgicaIntrauterina = data;
          break;

        case "DiagnosticoPrenatalForm":
          updatedState.DiagnosticoPrenatal = data;
          break;

        case "CirugiaAbierta":
          updatedState.IntrauterinaAbierta = data;
          break;

        case "CirugiaPercutanea":
          updatedState.IntrauterinaPercutanea = data;
          break;

        case "CirugiaEndoscopica1":
        case "CirugiaEndoscopica2":
        case "CirugiaEndoscopica3":
          updatedState.Endoscopicas = [...updatedState.Endoscopicas, data];
          break;

        case "ResultadosPerinatales":
          updatedState.ResultadosPerinatales = data;

          const cleanedState = Object.fromEntries(
            Object.entries(updatedState).filter(
              ([, value]) =>
                value &&
                (Array.isArray(value)
                  ? value.length > 0
                  : Object.keys(value).length > 0)
            )
          );
          break;

        default:
          console.warn(`Formulario desconocido: ${formName}`);
          break;
      }

      return updatedState;
    });
  };

  useEffect(() => {
    const hasValidData = Object.values(sendData).some(
      (value) =>
        value &&
        (Array.isArray(value)
          ? value.length > 0
          : Object.keys(value).length > 0)
    );

    if (hasValidData) {
      console.log("Valores de sendData:", JSON.stringify(sendData, null, 2));

      const createSurgery = async () => {
        if (mode === "isCreateMode") {
          startLoading();

          try {
            const response = await postCirugiaIntraCompleta(sendData, token);
            console.log(response);

            // Asegúrate de que la respuesta sea la esperada
            if (response?.message && response?.ordenQuirurgica?.id) {
              stopLoading();

              // Modal de confirmación con icono de check y sin botón de cancelar
              Modal.confirm({
                title: "Cirugía creada exitosamente",
                content:
                  "La cirugía y todos sus datos relacionados se han registrado correctamente.",
                icon: (
                  <CheckCircleOutlined
                    style={{ color: "#52c41a", fontSize: "32px" }}
                  />
                ),
                okText: "Aceptar",
                centered: true,
                cancelButtonProps: { style: { display: "none" } },
                onOk() {
                  router.push("/cirugias");
                },
              });
            } else {
              stopLoading();
              notification.error({
                message: "Error",
                description: "Hubo un problema al crear la cirugía.",
              });
            }
          } catch (error) {
            stopLoading();
            console.error("Error al crear la cirugía:", error);
            notification.error({
              message: "Error",
              description:
                error.message || "Hubo un error al crear la cirugía.",
            });
            router.push("/cirugias");
          }
        } else {
          startLoading();

          try {
            const response = await postCirugiaIntraCompleta(sendData, token);

            // Verificar que la respuesta sea correcta para la actualización
            if (response?.message && response?.ordenQuirurgica?.id) {
              stopLoading();
              notifySuccess();
              router.push("/cirugias");
            } else {
              stopLoading();
              notification.error({
                message: "Error",
                description: "Hubo un problema al actualizar la cirugía.",
              });
              router.push("/cirugias");
            }
          } catch (error) {
            stopLoading();
            console.error("Error al actualizar la cirugía:", error);
            notification.error({
              message: "Error",
              description:
                error.message || "Hubo un error al actualizar la cirugía.",
            });
            router.push("/cirugias");
          }
        }
      };

      createSurgery();
    }
  }, [sendData]);

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
      <Modal
        className="modal-confirm"
        open={loading}
        footer={null}
        closable={false}
        centered
      >
        <Spin size="large" />
      </Modal>
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
