import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/authContext";
import { Modal, notification, Spin } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";

// Formularios
import OrdenPosnatalForm from "./formsData/OrdenPostnatalForm";
import CirugiaNeonatalForm from "./formsData/NeonatalForm";

// Servicios
import { postCirugiaIntraCompleta } from "@/services/Post/cirugias/dataPostIntra";
import { putCirugiaPrenatalCompleta } from "@/services/Put/cirugias/dataCirugiasIntra";

const FormulariosPostNatales = ({ mode, id }) => {
  const router = useRouter();
  const { patients, surgeriesPost, token } = useAuth();
  const [confirmButton, setConfirmButton] = useState(false);
  const [currentOrderSurgery, setCurrentOrderSurgery] = useState(null);
  const [showCirugiaForm, setShowCirugiaForms] = useState({
    nerviosoCentral: false,
    neonatal: false,
  });
  const [sendData, setSendData] = useState({
    Endoscopicas: [],
  });
  const [loading, setLoading] = useState(false);

  const startLoading = () => setLoading(true);
  const stopLoading = () => setLoading(false);

  useEffect(() => {
    if (mode === "isEditMode") {
      const data = surgeriesPost?.registros;
      const surgery = data?.find((orden) => orden.id === parseInt(id));
      setCurrentOrderSurgery(surgery || null);
    }
  }, [id, surgeriesPost]);

  const handleFormSubmit = (formName) => (data) => {
    console.log(`data recibida de`, formName, data);
  };

  useEffect(() => {
    if (showCirugiaForm) {
      console.log("Valores de ", showCirugiaForm);
    }
  }, [showCirugiaForm]);

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

            if (response?.message && response?.ordenQuirurgica?.id) {
              stopLoading();
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
            const response = await putCirugiaPrenatalCompleta(
              id,
              sendData,
              token
            );
            console.log(response);

            // Verificar que la respuesta sea correcta para la actualización
            if (response?.message && response?.ordenActualizada?.id) {
              stopLoading();
              Modal.confirm({
                title: "Cirugía actualizada exitosamente",
                content:
                  "La cirugía y todos sus datos relacionados se han actualizado correctamente.",
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
      name: "OrdenPosnatalForm",
      label: "Datos generales",
      formComponent: OrdenPosnatalForm,
      initialValues: mode === "isCreateMode" ? {} : currentOrderSurgery,
      isVisible: true,
    },
    {
      name: "CirugiaNeonatalForm",
      label: "Datos de la cirugía Neonatal",
      formComponent: CirugiaNeonatalForm,
      initialValues:
        mode === "isCreateMode"
          ? {}
          : currentOrderSurgery?.cirugiaNeonatal?.[0],
      isVisible: showCirugiaForm.neonatal,
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

export default FormulariosPostNatales;
