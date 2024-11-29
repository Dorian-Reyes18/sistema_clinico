import React, { useEffect } from "react";
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

  const formik = useFormik({
    initialValues: {
      expediente: "",
      paciente: "",
      fechaDeCreacion:
        mode === "isEditMode" ? initialValues?.fechaDeCreacion || null : null,
      tipoCirugia:
        mode === "isEditMode" ? initialValues?.tipoCirugia || "" : "",
      teniaDiagnostico:
        mode === "isEditMode"
          ? initialValues?.teniaDiagnostico || false
          : false,
      complicacionesQuirurgicas:
        mode === "isEditMode"
          ? initialValues?.complicacionesQuirurgicas || ""
          : "",
      estado: mode === "isEditMode" ? initialValues?.estado || false : false,
      pacienteId:
        mode === "isEditMode" ? initialValues?.pacienteId || "" : null,
    },
    validationSchema: Yup.object({
      fechaDeCreacion: Yup.date().optional(),
      tipoCirugia: Yup.string().required("*Requerido"),
      teniaDiagnostico: Yup.boolean().optional(),
      complicacionesQuirurgicas: Yup.string().optional(),
      estado: Yup.boolean().required("*Requerido"),
      pacienteId: Yup.string().required("*Requerido"),
    }),
    onSubmit: (values) => {
      const formData = {
        ...values,
        pacienteId:
          mode === "isEditMode" ? formik.values.pacienteId || null : null,
      };
      console.log("Formulario enviado:", formData);
      onSubmit(formData);
    },
  });

  // Sincroniza todos los datos relacionados en un solo useEffect
  useEffect(() => {
    if (mode === "isEditMode") {
      // Sincroniza los datos del paciente
      if (initialValues?.pacienteId) {
        const pacienteEncontrado = patients.find(
          (paciente) => paciente.id === initialValues.pacienteId
        );
        if (pacienteEncontrado) {
          formik.setFieldValue(
            "expediente",
            pacienteEncontrado.numeroExpediente
          );
          formik.setFieldValue(
            "paciente",
            `${pacienteEncontrado.primerNombre} ${pacienteEncontrado.segundoNombre} ${pacienteEncontrado.primerApellido} ${pacienteEncontrado.segundoApellido}`
          );
        }
      }

      // Sincroniza el tipo de cirugía
      if (initialValues?.tipoCirugia) {
        const opcionesValidas = ["Percutanea", "Endoscopica", "Abierta"];
        const valorMapeado = opcionesValidas.find(
          (opcion) =>
            opcion.toLowerCase() === initialValues.tipoCirugia.toLowerCase()
        );
        formik.setFieldValue("tipoCirugia", valorMapeado || "");
      }

      // Sincroniza el estado
      if (initialValues?.estado !== undefined) {
        formik.setFieldValue(
          "estado",
          initialValues.estado ? "Activa" : "Finalizada"
        );
      }
    }
  }, [mode, initialValues, patients]);

  // Enviar formulario automáticamente al cambiar confirmButton
  useEffect(() => {
    if (confirmButton) {
      formik.submitForm();
    }
  }, [confirmButton]);

  // Manejador para cambiar el expediente
  const handlePaciente = (e) => {
    const expediente = e.target.value;
    const pacienteEncontrado = patients.find(
      (paciente) => paciente.numeroExpediente === expediente
    );

    if (pacienteEncontrado) {
      formik.setFieldValue("pacienteId", pacienteEncontrado.id);
      formik.setFieldValue(
        "paciente",
        `${pacienteEncontrado.primerNombre} ${pacienteEncontrado.segundoNombre} ${pacienteEncontrado.primerApellido} ${pacienteEncontrado.segundoApellido}`
      );
    } else {
      formik.setFieldValue("pacienteId", "");
      formik.setFieldValue("paciente", expediente ? "No existe" : "");
    }
    formik.setFieldValue("expediente", expediente);
  };

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
          value={formik.values.expediente}
          onChange={handlePaciente}
          onBlur={formik.handleBlur}
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
          value={formik.values.paciente}
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
          value={formik.values.tipoCirugia || undefined}
          onChange={(value) => formik.setFieldValue("tipoCirugia", value)}
          onBlur={() => formik.setFieldTouched("tipoCirugia", true)}
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
          value={formik.values.estado ? "Activa" : "Finalizada"}
          onChange={(value) =>
            formik.setFieldValue("estado", value === "Activa")
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
          value={formik.values.complicacionesQuirurgicas || ""}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
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
