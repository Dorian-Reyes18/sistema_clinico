import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Select, Input } from "antd";
import { useAuth } from "@/app/hooks/authContext";

const { Option } = Select;

const OrdenIntrauterinaForm = ({
  onSubmit,
  mode,
  initialValues,
  confirmButton,
}) => {
  const { patients } = useAuth();
  const [localValues, setLocalValues] = useState({
    pacienteId: initialValues?.pacienteId || null,
    fechaDeCreacion: initialValues?.fechaDeCreacion || null,
    tipoCirugia: initialValues?.tipoCirugia || "", // Aseguramos que tipoCirugia se inicializa correctamente
    teniaDiagnostico: initialValues?.teniaDiagnostico || false,
    complicacionesQuirurgicas: initialValues?.complicacionesQuirurgicas || "",
    estado: initialValues?.estado || false,
    expediente: "",
    paciente: "",
  });

  const [hasSubmitted, setHasSubmitted] = useState(false);

  const formik = useFormik({
    initialValues: {
      fechaDeCreacion: null,
      tipoCirugia: initialValues?.tipoCirugia || "", // Aseguramos que tipoCirugia se inicializa correctamente
      teniaDiagnostico: initialValues?.teniaDiagnostico || false,
      complicacionesQuirurgicas: initialValues?.complicacionesQuirurgicas || "",
      estado: initialValues?.estado || false,
      pacienteId: initialValues?.pacienteId || "",
    },
    validationSchema: Yup.object({
      fechaDeCreacion: Yup.date().optional().notRequired(),
      tipoCirugia: Yup.string().required("*Requerido"),
      teniaDiagnostico: Yup.boolean().optional().notRequired(),
      complicacionesQuirurgicas: Yup.string().optional().notRequired(),
      estado: Yup.boolean().required("*Requerido"),
      pacienteId: Yup.string().required("*Requerido"),
    }),
    onSubmit: (values) => {
      onSubmit(values);
      setHasSubmitted(true);
    },
  });

  // Sincroniza los valores locales con Formik solo en eventos clave
  const handleBlurAndSync = (e) => {
    const { name } = e.target;
    formik.setFieldValue(name, localValues[name]);
    formik.handleBlur(e);
  };

  // Manejadores para los campos
  const handleLocalChange = (e) => {
    const { name, value } = e.target;
    setLocalValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePaciente = (e) => {
    const expediente = e.target.value;
    const pacienteEncontrado = patients.find(
      (paciente) => paciente.numeroExpediente === expediente
    );

    if (pacienteEncontrado) {
      formik.setFieldValue("pacienteId", pacienteEncontrado.id);
      setLocalValues((prev) => ({
        ...prev,
        expediente: expediente,
        pacienteId: pacienteEncontrado.id,
        paciente: `${pacienteEncontrado.primerNombre} ${pacienteEncontrado.segundoNombre} ${pacienteEncontrado.primerApellido} ${pacienteEncontrado.segundoApellido}`,
      }));
    } else {
      formik.setFieldValue("pacienteId", "");
      setLocalValues((prev) => ({
        ...prev,
        expediente: expediente,
        paciente: expediente ? "No existe" : "", // Mostrar "No existe" solo si hay un expediente
      }));
    }
  };

  // Sincroniza la información del paciente cuando entras en modo edición
  useEffect(() => {
    if (mode === "isEditMode" && initialValues?.pacienteId) {
      const pacienteEncontrado = patients.find(
        (paciente) => paciente.id === initialValues.pacienteId
      );
      if (pacienteEncontrado) {
        setLocalValues({
          ...initialValues,
          expediente: pacienteEncontrado.numeroExpediente,
          paciente: `${pacienteEncontrado.primerNombre} ${pacienteEncontrado.segundoNombre} ${pacienteEncontrado.primerApellido} ${pacienteEncontrado.segundoApellido}`,
        });
        formik.setFieldValue("tipoCirugia", initialValues.tipoCirugia); // Precargamos tipoCirugia en Formik
      }
    }
  }, [mode, initialValues, patients]);

  useEffect(() => {
    if (confirmButton && confirmButton !== hasSubmitted) {
      formik.submitForm();
      setHasSubmitted(confirmButton);
    }
  }, [confirmButton, hasSubmitted, formik]);

  return (
    <form onSubmit={formik.handleSubmit}>
      {/* Campo de Expediente */}
      <div className="item">
        <label htmlFor="expediente">
          Expediente: <span className="señal-req"> *</span>
        </label>
        <Input
          type="number"
          className="text"
          id="expediente"
          name="expediente"
          value={localValues.expediente || ""}
          onChange={(e) => {
            handleLocalChange(e);
            handlePaciente(e);
          }}
          onBlur={handleBlurAndSync}
        />
      </div>

      {/* Campo de Paciente */}
      <div className="item">
        <label htmlFor="paciente">Paciente</label>
        <Input
          className="textarea"
          id="paciente"
          name="paciente"
          disabled={true}
          value={localValues.paciente || ""}
          style={{
            color: "#4b4b4b",
            backgroundColor: "#fff",
            opacity: 1,
            cursor: "not-allowed",
          }}
        />
      </div>

      {/* Campo de Tipo de Cirugía */}
      <div className="item">
        <label htmlFor="tipoCirugia">
          Cirugía: <span className="señal-req"> *</span>
        </label>
        <Select
          className="select"
          placeholder="Seleccione..."
          id="tipoCirugia"
          name="tipoCirugia"
          value={formik.values.tipoCirugia} // Usamos Formik para este campo
          onChange={(value) => formik.setFieldValue("tipoCirugia", value)} // Actualizamos directamente en Formik
          onBlur={() => formik.setFieldTouched("tipoCirugia", true)} // Seguimos gestionando el toque
        >
          <Option value="Percutanea">Percutánea</Option>
          <Option value="Endoscopica">Endoscópica</Option>
          <Option value="Abierta">Abierta</Option>
        </Select>

        {formik.touched.tipoCirugia && formik.errors.tipoCirugia && (
          <div className="requerido" style={{ color: "red" }}>
            {formik.errors.tipoCirugia}
          </div>
        )}
      </div>

      {/* Campo de Estado */}
      <div className="item">
        <label htmlFor="estado">
          Estado: <span className="señal-req"> *</span>
        </label>
        <Select
          placeholder="Seleccione..."
          id="estado"
          name="estado"
          value={localValues.estado ? "Activa" : "Finalizada"}
          onChange={(value) =>
            setLocalValues((prev) => ({
              ...prev,
              estado: value === "Activa",
            }))
          }
          onBlur={() => formik.setFieldTouched("estado", true)}
        >
          <Option value="Activa">Activa</Option>
          <Option value="Finalizada">Finalizada</Option>
        </Select>

        {formik.touched.estado && formik.errors.estado && (
          <div className="requerido" style={{ color: "red" }}>
            {formik.errors.estado}
          </div>
        )}
      </div>

      {/* Campo de Complicaciones */}
      <div className="item">
        <label htmlFor="complicacionesQuirurgicas">Complicaciones</label>
        <Input.TextArea
          rows={1}
          className="textarea"
          id="complicacionesQuirurgicas"
          name="complicacionesQuirurgicas"
          value={localValues.complicacionesQuirurgicas || ""}
          onChange={handleLocalChange}
          onBlur={handleBlurAndSync}
        />
        {formik.touched.complicacionesQuirurgicas &&
          formik.errors.complicacionesQuirurgicas && (
            <div className="requerido" style={{ color: "red" }}>
              {formik.errors.complicacionesQuirurgicas}
            </div>
          )}
      </div>
    </form>
  );
};

export default OrdenIntrauterinaForm;
