import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/authContext";
import { Modal, notification } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";

// Formularios
import OrdenIntrauterinaForm from "./formsData/OrdenIntrauterinaForm";
import confirm from "antd/es/modal/confirm";

// Servicios

const FormulariosIntrauterinos = ({ mode, id }) => {
  const router = useRouter();
  const { patients, prenatalSurgeries, token } = useAuth();
  const [confirmButton, setConfirmButton] = useState(false);
  const [currentSurgery, setCurrentSurgery] = useState(null);

  const [dataFormsReceive, setDataFormsReceive] = useState([]);

  const formConfig = [
    {
      name: "OrdenIntrauterinaForm",
      label: "Datos generales",
      formComponent: OrdenIntrauterinaForm,
      initialValues: {},
    },
  ];

  // Efectos

  useEffect(() => {
    if (mode === "isEditMode") {
      const data = prenatalSurgeries?.ordenesQuirurgicas;
      const surgery = data.find((orden) => orden.id === parseInt(id));
      setCurrentSurgery(surgery || null);
    }
  }, [id, prenatalSurgeries]);

  // Manejar el envío de cada formulario
  const handleFormSubmit = (formName) => (data) => {
    console.log("Datos recibidos en el padre:", data);
  };

  // Funciones

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

  // Notificación de éxito
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
        {formConfig.map(({ name, label, formComponent: FormComponent }) => (
          <div className="group-form" key={name}>
            <div className="header">
              <strong>{label}</strong>
            </div>
            <div className="body">
              <FormComponent
                id={id}
                mode={mode}
                initialValues={mode === "isCreateMode" ? {} : currentSurgery}
                confirmButton={confirmButton}
                onSubmit={handleFormSubmit(name)}
              />
            </div>
          </div>
        ))}
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
