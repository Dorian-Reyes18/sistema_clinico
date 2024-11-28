import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/authContext";
import { Modal, Spin, notification } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";

// Formularios
import OrdenIntrauterinaForm from "./formsData/OrdenIntrauterinaForm";

// Servicios

const FormulariosIntrauterinos = ({ mode, id }) => {
  const router = useRouter();
  const { patients, prenatalSurgeries, token } = useAuth(); //de un array de objeto y cada objeto es un paciente en el hay un id y un numeroExpediente
  const [confirmButton, setConfirmButton] = useState(false);
  const [currentSurgery, setCurrentSurgery] = useState(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const formConfig = [
    {
      name: "OrdenIntrauterinaForm",
      label: "Datos generales",
      formComponent: OrdenIntrauterinaForm,
      initialValues: {},
    },
  ];

  // Efectos

  // Guardamos la cirugía actual si estamos en edición
  useEffect(() => {
    if (mode === "isEditMode") {
      const data = prenatalSurgeries?.ordenesQuirurgicas;
      const surgery = data.find((orden) => orden.id === parseInt(id));
      setCurrentSurgery(surgery || null);
      // console.log("Current Surgery asignado :", surgery);
      // console.log("pacientes", patients);
    }
  }, [id, prenatalSurgeries]);

  // Funciones

  const handleSave = () => {
    const modalTitle = "isCreateMode"
      ? "¿Está seguro de crear la cirugía?"
      : "¿Está seguro de guardar los cambios?";
    const modalContent = "isCreateMode"
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
        {formConfig.map(
          ({ name, label, formComponent: FormComponent, initialValues }) => (
            <div className="group-form" key={name}>
              <div className="header">
                <strong>{label}</strong>
              </div>
              <div className="body">
                <FormComponent
                  mode={mode}
                  initialValues={currentSurgery}
                  id={id}
                />
              </div>
            </div>
          )
        )}
      </div>
      <div className="btn-opt">
        <button className="btn btn-azul" onClick={handleSave}>
          {mode === "isCreateMode" ? "Crear cirugia" : "Guardar Cambios"}
        </button>
        <button onClick={handleCancelBtn} className="btn btn-gris">
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default FormulariosIntrauterinos;
