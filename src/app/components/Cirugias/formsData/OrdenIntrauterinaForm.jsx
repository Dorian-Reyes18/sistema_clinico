import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Select, Input } from "antd";
import { useAuth } from "@/app/hooks/authContext";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/es";
import utc from "dayjs/plugin/utc";

dayjs.locale("es");
dayjs.extend(utc);

const { Option } = Select;

const OrdenIntrauterinaForm = ({
  onSubmit,
  mode,
  initialValues = {},
  confirmButton,
}) => {
  const { metadata } = useAuth();
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const initialFormikValues = {
    pacienteId: initialValues?.ordenQuirurgica?.paciente?.id || null,
    fechaDeCreacion: initialValues?.ordenQuirurgica?.fechaDeCreacion || null,
    tipoCirugia: initialValues?.ordenQuirurgica?.tipoCirugia || "",
    teniaDiagnostico: initialValues?.ordenQuirurgica?.teniaDiagnostico || false,
    complicacionesQuirurgicas:
      initialValues?.ordenQuirurgica?.complicacionesQuirurgicas || "",
    estado: initialValues?.ordenQuirurgica?.estado || false,
  };

  const formik = useFormik({
    initialValues:
      mode === "isEditMode"
        ? initialFormikValues
        : {
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
      complicacionesQuirurgicas: Yup.string().optional().required(),
      estado: Yup.boolean().required("*Requerido"),
    }),
    onSubmit: (values) => {
      const pacienteData = {
        ...values,
        pacienteId: mode === "isEditMode" ? formik.values.pacienteId : null,
      };
      onSubmit(pacienteData);
      setHasSubmitted(true);
    },
  });

  const handleFieldBlur = (e) => {
    formik.handleBlur(e);
  };

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
        <label htmlFor="expediente">Expediente</label>
        <Input
          className="text"
          id="expediente"
          name="expediente"
          value={formik.values.expediente || ""}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
      </div>

      {/* Campo de Paciente */}
      <div className="item">
        <label htmlFor="Paciente">Paciente</label>
        <Input
          className="value"
          id="edad"
          name="edad"
          disabled={true}
          value={formik.values.edad || "0"}
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
          onChange={(value) => formik.setFieldValue("tipoCirugia", value)}
          onBlur={handleFieldBlur}
          value={formik.values.tipoCirugia}
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
          className="select"
          placeholder="Seleccione..."
          id="estado"
          name="estado"
          onChange={(value) =>
            formik.setFieldValue("estado", value === "Activa")
          }
          onBlur={handleFieldBlur}
          value={formik.values.estado ? "Activa" : "Finalizada"}
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
          onChange={(e) =>
            formik.setFieldValue("complicacionesQuirurgicas", e.target.value)
          }
          value={formik.values.complicacionesQuirurgicas}
          onBlur={(e) => {
            handleFieldBlur(e);
            formik.validateField("complicacionesQuirurgicas");
          }}
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
