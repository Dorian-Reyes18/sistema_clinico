import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/authContext";
import { Modal, notification, Spin } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";

// Formularios
import OrdenPosnatalForm from "./formsData/OrdenPostnatalForm";
import CirugiaNeonatalForm from "./formsData/NeonatalForm";
import CirugiaNerviosoCentralForm from "./formsData/NerviosoCentralForm";

// Servicios
import {
  postOrdenQuirugica,
  postNeonatal,
  postNerviosoCentral,
} from "@/services/Post/cirugias/dataPostPostNatal";

const FormulariosPostNatales = ({ mode, id }) => {
  const router = useRouter();
  const { patients, surgeriesPost, token } = useAuth();
  const [confirmButton, setConfirmButton] = useState(false);
  const [currentOrderSurgery, setCurrentOrderSurgery] = useState(null);
  const [showCirugiaForm, setShowCirugiaForms] = useState({
    nerviosoCentral: false,
    neonatal: false,
  });
  const [sendData, setSendData] = useState({});
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
    setSendData((prevSendData) => {
      const updatedSendData = { ...prevSendData };

      if (formName === "OrdenPosnatalForm") {
        updatedSendData.ordenPrenatalForm = data;
      } else if (formName === "CirugiaNeonatalForm") {
        updatedSendData.cirugiaNeonatalForm = data;
      } else if (formName === "CirugiaNerviosoCentralForm") {
        updatedSendData.cirugiaNerviosoCentralForm = data;
      } else {
        console.error(`Formulario no reconocido: ${formName}`);
      }
      return updatedSendData;
    });
  };

  useEffect(() => {
    if (sendData && Object.keys(sendData).length > 0) {
      console.log("valores de sendData", sendData);

      const ordenData = JSON.stringify(sendData?.ordenPrenatalForm, null, 2);
      const cirugiaNCentral = JSON.stringify(
        sendData?.cirugiaNerviosoCentralForm,
        null,
        2
      );
      const cirugiaNeonatal = JSON.stringify(
        sendData?.cirugiaNeonatalForm,
        null,
        2
      );

      console.log(
        "log desde el efecto de creacion, estado de showsurgeri",
        showCirugiaForm
      );

      if (mode === "isCreateMode") {
        // startLoading();
        const createCompleteSurgery = async () => {
          try {
            // crear primero la orden quirurgica
            const responseOrder = await postOrdenQuirugica(ordenData, token);
            console.log(responseOrder);
            const orderId = responseOrder?.registro?.id;

            // crear la cirugia
            if (showCirugiaForm.neonatal) {
              cirugiaNeonatal.cirugiaId = orderId;
              const data = cirugiaNeonatal;
              const response = await postNeonatal(data, token);
              console.log(response);

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
                  router.push("/pacientes");
                },
              });
            }
            if (showCirugiaForm.neonatal) {
              cirugiaNCentral.cirugiaId = orderId;
              const data = cirugiaNeonatal;
              const response = await postNeonatal(data, token);
              console.log(response);

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
                  router.push("/pacientes");
                },
              });
            } else if (showCirugiaForm.nerviosoCentral) {
              cirugiaNeonatal.cirugiaId = orderId;
              const data = cirugiaNeonatal;
              const response = await postNeonatal(data, token);
              console.log(response);

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
                  router.push("/pacientes");
                },
              });
            }
          } catch (error) {}
          // Creación para la cirugia neonatal
        };
        // createCompleteSurgery();
      }
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
    {
      name: "CirugiaNerviosoCentralForm",
      label: "Datos de la cirugía Nervioso Central",
      formComponent: CirugiaNerviosoCentralForm,
      initialValues:
        mode === "isCreateMode"
          ? {}
          : currentOrderSurgery?.cirugiaNerviosoCentral?.[0],
      isVisible: showCirugiaForm.nerviosoCentral,
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
