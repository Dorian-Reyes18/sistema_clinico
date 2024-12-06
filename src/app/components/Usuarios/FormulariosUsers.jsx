import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/authContext";
import { Modal, notification, Spin } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";

// Formularios de usuarios
import UsuarioForm from "./componentUsers/UsuarioForm";

// Servicios

import { postUsuario } from "@/services/Post/Usuarios/dataPostUsuarios";
import { putUsuarios } from "@/services/Put/usuarios/dataPutUsers";

const FormulariosUsuarios = ({ mode, id }) => {
  const router = useRouter();
  const { users, token } = useAuth();
  const [confirmButton, setConfirmButton] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [sendData, setSendData] = useState({});
  const [loading, setLoading] = useState(false);

  const startLoading = () => setLoading(true);
  const stopLoading = () => setLoading(false);

  useEffect(() => {
    if (mode === "isEditMode") {
      const userArray = users?.usuarios || [];
      if (Array.isArray(userArray)) {
        const user = userArray.find((user) => user.id === parseInt(id));
        setCurrentUser(user || null);
      } else {
        console.error("`users.usuarios` no es un arreglo:", userArray);
      }
    }
  }, [id, users?.usuarios]);

  const handleFormSubmit = (formName) => (data) => {
    setSendData((prevSendData) => {
      const updatedSendData = { ...prevSendData };

      if (formName === "UsuarioForm") {
        updatedSendData.usuarioForm = data;
      } else {
        ñ;
      }
      return updatedSendData;
    });
  };

  useEffect(() => {
    if (sendData && Object.keys(sendData).length > 0) {
      console.log("valores de sendData", sendData);

      const usuarioData = sendData?.usuarioForm;

      //   if (mode === "isCreateMode") {
      //     startLoading();
      //     const createUsuario = async () => {
      //       try {
      //         const response = await postUsuario(usuarioData, token);
      //         console.log("Respuesta del usuario creado:", response);

      //         stopLoading();

      //         Modal.confirm({
      //           title: "Usuario creado exitosamente",
      //           content:
      //             "El usuario y todos sus datos relacionados se han registrado correctamente.",
      //           icon: (
      //             <CheckCircleOutlined
      //               style={{ color: "#52c41a", fontSize: "32px" }}
      //             />
      //           ),
      //           okText: "Aceptar",
      //           centered: true,
      //           cancelButtonProps: { style: { display: "none" } },
      //           onOk() {
      //             router.push("/usuarios");
      //           },
      //         });
      //       } catch (error) {
      //         console.error("Error al crear el usuario:", error);
      //       }
      //     };
      //     createUsuario();
      //   } else {
      //     startLoading();
      //     const editUsuario = async () => {
      //       const userId = usuarioData?.id;
      //       const response = await putUsuarios(userId, usuarioData, token);
      //       console.log(response);

      //       stopLoading();

      //       Modal.confirm({
      //         title: "Usuario actualizado exitosamente",
      //         content:
      //           "El usuario y todos sus datos relacionados se han actualizado correctamente.",
      //         icon: (
      //           <CheckCircleOutlined
      //             style={{ color: "#52c41a", fontSize: "32px" }}
      //           />
      //         ),
      //         okText: "Aceptar",
      //         centered: true,
      //         cancelButtonProps: { style: { display: "none" } },
      //         onOk() {
      //           router.push("/usuarios");
      //         },
      //       });
      //     };
      //     editUsuario();
      //   }
    }
  }, [sendData]);

  const handleSave = () => {
    const modalTitle =
      mode === "isCreateMode"
        ? "¿Está seguro de crear el usuario?"
        : "¿Está seguro de guardar los cambios?";
    const modalContent =
      mode === "isCreateMode"
        ? "Los datos se guardarán y se creará un nuevo usuario."
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
        router.push("/usuarios");
      },
      onCancel() {
        console.log("El usuario decidió no cancelar.");
      },
    });
  };

  // Configuración de los formularios
  const formConfig = [
    {
      name: "UsuarioForm",
      label: "Datos del Usuario",
      formComponent: UsuarioForm,
      initialValues: mode === "isCreateMode" ? {} : currentUser,
      isVisible: true,
    },
  ];

  return (
    <div className="usuario-form-container">
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
            ? "Editar - Datos del Usuario"
            : "Crear - Datos del Usuario"}
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
          {mode === "isCreateMode" ? "Crear Usuario" : "Guardar Cambios"}
        </button>
        <button onClick={handleCancelBtn} className="btn btn-gris">
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default FormulariosUsuarios;
