import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/authContext";
import { Modal, Spin, notification } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";

// Formularios
import ConyugeForm from "./formsData/ConyugeForm";
import PacienteForm from "./formsData/PacienteForm";
import DiabetesForm from "./formsData/DiabetesForm";
import AntecedentesFamiliaresForm from "./formsData/AntecedentesFamiliaresForm";
import AntecedentesObstForm from "./formsData/antecedentesObstetricos";
import AntecedentePersonalesForm from "./formsData/AntecedentesPersonalesForm";
import EmbarazoActual from "./formsData/EmbarazoActual";

// Servicios
import {
  postAntecedentesFamiliares,
  postAntecedentesObstetricos,
  postAntecedentesPersonales,
  postConyuge,
  postDiabetes,
  postEmbarazoActual,
  postPaciente,
} from "@/services/Post/Pacientes/dataPost";
import {
  putAntecedentesFamiliares,
  putAntecedentesObstetricos,
  putAntecedentesPersonales,
  putConyuge,
  putDiabetes,
  putEmbarazoActual,
  putPaciente,
} from "@/services/Put/Pacientes/dataPut";

const AllDataForms = ({ mode, id }) => {
  const router = useRouter();
  const { patients, token } = useAuth();

  // Estados
  const [isCreateMode, setIsCreateMode] = useState(mode === "isCreateMode");
  const [patientData, setPacienteData] = useState(
    () => patients.find((p) => p.id === parseInt(id)) || null
  );
  const [confirmButton, setConfirmButton] = useState(false);
  const [DataFormsReceive, setDataFormsReceive] = useState([]);
  const [completeData, setCompleteData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Configuración de formularios
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

  // Efectos
  useEffect(() => {
    if (mode === "isEditMode" && id) {
      const patient = patients.find((p) => p.id === parseInt(id));
      if (patient) setPacienteData(patient);
    }
  }, [mode, id, patients]);

  useEffect(() => {
    if (DataFormsReceive.length === formConfig.length) {
      setCompleteData(DataFormsReceive);
    }
  }, [DataFormsReceive]);

  // Creación o edición en el backend
  useEffect(() => {
    if (completeData) {
      console.log("data completa", completeData);

      const getFormData = (formName) =>
        completeData.find((f) => f.formName === formName)?.data || null;

      const postData = async (data, postFunction) => {
        if (!data) return null;
        const response = await postFunction(data, token);
        console.log(`${postFunction.name} creada`, response);
        return response;
      };

      if (isCreateMode) {
        // Modo de Creación (POST)
        startLoading();

        const createPatient = async () => {
          try {
            // 1. Crear Conyuge
            const dataConyuge = getFormData("ConyugeForm");
            const respConyuge = await postData(dataConyuge, postConyuge);
            const conyugeId = respConyuge?.conyuge.id;

            // 2. Crear Paciente
            const dataPatient = getFormData("PacienteForm");
            dataPatient.conyugeId = conyugeId;
            const respPaciente = await postData(dataPatient, postPaciente);
            const pacienteId = respPaciente?.paciente.id;

            // 3. Crear Diabetes
            const dataDiabetes = getFormData("DiabetesForm");
            dataDiabetes.pacienteid = pacienteId;
            const respDiabetes = await postData(dataDiabetes, postDiabetes);
            const diabetesId = respDiabetes?.tipoDiabetes.id;

            // 4. Crear Antecedentes Personales
            const dataAntecedentesPersonales = getFormData(
              "AntecedentePersonalesForm"
            );
            dataAntecedentesPersonales.diabetesId = diabetesId;
            dataAntecedentesPersonales.pacienteId = pacienteId;
            await postData(
              dataAntecedentesPersonales,
              postAntecedentesPersonales
            );

            // 5. Crear Antecedentes Familiares
            const dataAntecedentesFamiliares = getFormData(
              "AntecedentesFamiliaresForm"
            );
            dataAntecedentesFamiliares.pacienteId = pacienteId;
            await postData(
              dataAntecedentesFamiliares,
              postAntecedentesFamiliares
            );

            // 6. Crear Antecedentes Obstétricos
            const dataAntecedentesObstetricos = getFormData(
              "AntecedentesObstForm"
            );
            dataAntecedentesObstetricos.pacienteId = pacienteId;
            await postData(
              dataAntecedentesObstetricos,
              postAntecedentesObstetricos
            );

            // 7. Crear Embarazo Actual
            const dataEmbarazoActual = getFormData("EmbarazoActual");
            dataEmbarazoActual.pacienteId = pacienteId;
            await postData(dataEmbarazoActual, postEmbarazoActual);

            stopLoading();

            // Modal de confirmación con icono de check y sin botón de cancelar
            Modal.confirm({
              title: "Paciente creado exitosamente",
              content:
                "El paciente y todos sus datos relacionados se han registrado correctamente.",
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
          } catch (error) {
            console.error("Error al procesar la consulta", error);
            stopLoading();
            notification.error({
              message: "Error al procesar la solicitud",
              description:
                "Hubo un problema al registrar los datos. Intente nuevamente.",
              duration: 10,
            });
          }
        };

        createPatient();
      } else {
        const dataEditIds = {
          conyugeId: patientData?.conyuge?.id || null,
          patientId: patientData?.id || null,
          diabetesId: patientData?.tipoDiabetes?.[0]?.id || null,
          antPersonalesId: patientData?.antecedentesPersonales?.[0]?.id || null,
          antFamiliaresId:
            patientData?.antecedentesFamiliaresDefectos?.[0]?.id || null,
          antObstetricosId:
            patientData?.antecedentesObstetricos?.[0]?.id || null,
          embActualId: patientData?.embarazoActual?.[0]?.id || null,
        };

        console.log(dataEditIds);

        // Modo de Edición (PUT)
        startLoading();

        const updatePatient = async () => {
          try {
            const getFormData = (formName) =>
              completeData.find((f) => f.formName === formName)?.data || null;

            const putData = async (data, putFunction, id) => {
              if (!data || !id) return null;
              const response = await putFunction(id, data, token);
              console.log(`${putFunction.name} actualizada`, response);
              return response;
            };

            // DataCompleta
            const dataConyuge = getFormData("ConyugeForm");
            const dataPatient = getFormData("PacienteForm");
            const dataDiabetes = getFormData("DiabetesForm");
            const dataAntecedentesPersonales = getFormData(
              "AntecedentePersonalesForm"
            );
            const dataAntecedentesFamiliares = getFormData(
              "AntecedentesFamiliaresForm"
            );
            const dataAntecedentesObstetricos = getFormData(
              "AntecedentesObstForm"
            );
            const dataEmbarazoActual = getFormData("EmbarazoActual");

            // 1. Actualizar Conyuge
            const conyugeId = dataEditIds.conyugeId;
            if (!conyugeId) {
              const respConyuge = await postData(dataConyuge, postConyuge);
              const newConyugeId = respConyuge?.conyuge.id;
              dataPatient.conyugeId = newConyugeId; // Asignar al paciente
            } else {
              await putData(dataConyuge, putConyuge, conyugeId);
            }

            // 2. Actualizar Paciente
            const pacienteId = dataEditIds.patientId;
            if (!pacienteId) {
              await postData(dataPatient, postPaciente);
            } else {
              await putData(dataPatient, putPaciente, pacienteId);
            }

            // 3. Actualizar Diabetes
            const diabetesId = dataEditIds.diabetesId;
            if (!diabetesId) {
              dataDiabetes.pacienteid = pacienteId;
              await postData(dataDiabetes, postDiabetes);
            } else {
              await putData(dataDiabetes, putDiabetes, diabetesId);
            }

            // 4. Actualizar Antecedentes Personales
            const antPersonalesId = dataEditIds.antPersonalesId;
            if (!antPersonalesId) {
              dataAntecedentesPersonales.pacienteId = dataEditIds.patientId;
              dataAntecedentesPersonales.diabetesId = diabetesId;
              await postData(
                dataAntecedentesPersonales,
                postAntecedentesPersonales
              );
            } else {
              await putData(
                dataAntecedentesPersonales,
                putAntecedentesPersonales,
                antPersonalesId
              );
            }

            // 5. Actualizar Antecedentes Familiares
            const antFamiliaresId = dataEditIds.antFamiliaresId;
            if (!antFamiliaresId) {
              dataAntecedentesFamiliares.pacienteId = dataEditIds.patientId;
              await postData(
                dataAntecedentesFamiliares,
                postAntecedentesFamiliares
              );
            } else {
              await putData(
                dataAntecedentesFamiliares,
                putAntecedentesFamiliares,
                antFamiliaresId
              );
            }

            // 6. Actualizar Antecedentes Obstétricos
            const antObstetricosId = dataEditIds.antObstetricosId;
            if (!antObstetricosId) {
              dataAntecedentesObstetricos.pacienteId = dataEditIds.patientId;
              await postData(
                dataAntecedentesObstetricos,
                postAntecedentesObstetricos
              );
            } else {
              await putData(
                dataAntecedentesObstetricos,
                putAntecedentesObstetricos,
                antObstetricosId
              );
            }

            // 7. Actualizar Embarazo Actual
            const embActualId = dataEditIds.embActualId;
            if (!embActualId) {
              dataEmbarazoActual.pacienteId = dataEditIds.patientId;
              await postData(dataEmbarazoActual, postEmbarazoActual);
            } else {
              await putData(dataEmbarazoActual, putEmbarazoActual, embActualId);
            }

            stopLoading();

            Modal.confirm({
              title: "Paciente actualizado exitosamente",
              content:
                "El paciente y todos sus datos relacionados han sido actualizados correctamente.",
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
          } catch (error) {
            console.error("Error al procesar la consulta", error);
            stopLoading();
            notification.error({
              message: "Error al procesar la solicitud",
              description:
                "Hubo un problema al actualizar los datos. Intente nuevamente.",
              duration: 10,
            });
          }
        };

        updatePatient();
      }
    }
  }, [patientData, completeData, token, isCreateMode]);

  const startLoading = () => setLoading(true);
  const stopLoading = () => setLoading(false);

  const handleSave = () => {
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
        router.push("/pacientes");
      },
      onCancel() {
        console.log("El usuario decidió no cancelar.");
      },
    });
  };

  // Manejar el envío de cada formulario
  const handleFormSubmit = (formName) => (data) => {
    setDataFormsReceive((prevData) => {
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

  // Renderizar formularios
  return (
    <div className="patient-form-container">
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
            ? "Editar - Datos generales del paciente"
            : "Crear - Datos generales del paciente"}
        </h4>
        {mode === isCreateMode ? (
          <p className="aviso">
            Los campos con un asterisco son obligatorios, Aseguerese de
            llenarlos todos
          </p>
        ) : null}
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
