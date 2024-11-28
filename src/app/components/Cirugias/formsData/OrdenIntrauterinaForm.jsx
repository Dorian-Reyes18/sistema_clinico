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
  const { metadata } = useAuth();
  const [localValues, setLocalValues] = useState({
    pacienteId: initialValues?.pacienteId || null,
    fechaDeCreacion: initialValues?.fechaDeCreacion || null,
    tipoCirugia: initialValues?.tipoCirugia || "",
    teniaDiagnostico: initialValues?.teniaDiagnostico || false,
    complicacionesQuirurgicas: initialValues?.complicacionesQuirurgicas || "",
    estado: initialValues?.estado || false,
  });

  const [hasSubmitted, setHasSubmitted] = useState(false);

  const formik = useFormik({
    initialValues: {
      fechaDeCreacion: null,
      tipoCirugia: "",
      teniaDiagnostico: false,
      complicacionesQuirurgicas: "",
      estado: false,
    },
    validationSchema: Yup.object({
      fechaDeCreacion: Yup.date().optional().notRequired(),
      tipoCirugia: Yup.string().required("*Requerido"),
      teniaDiagnostico: Yup.boolean().optional().notRequired(),
      complicacionesQuirurgicas: Yup.string().optional().notRequired(),
      estado: Yup.boolean().required("*Requerido"),
    }),
    onSubmit: (values) => {
      onSubmit(values);
      setHasSubmitted(true);
    },
  });

  // Sincroniza los valores locales con Formik solo en eventos clave
  const handleBlurAndSync = (e) => {
    const { name } = e.target;
    formik.setFieldValue(name, localValues[name]); // Sincroniza con Formik
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

  useEffect(() => {
    if (mode === "isEditMode" && initialValues) {
      setLocalValues(initialValues);
    }
  }, [initialValues, mode]);

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
          onChange={handleLocalChange} // Cambia solo el estado local
          onBlur={handleBlurAndSync} // Sincroniza con Formik
        />
      </div>

      {/* Campo de Paciente */}
      <div className="item">
        <label htmlFor="edad">Paciente</label>
        <Input
          className="text"
          id="edad"
          name="edad"
          disabled={true}
          value={localValues.edad || "0"} // Suponiendo que se guarda un valor de edad en localValues
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
          value={localValues.tipoCirugia || ""}
          onChange={(value) =>
            setLocalValues((prev) => ({
              ...prev,
              tipoCirugia: value,
            }))
          }
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
