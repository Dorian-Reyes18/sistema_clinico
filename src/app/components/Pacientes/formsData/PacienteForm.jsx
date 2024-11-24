import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Select, Input } from "antd";
import { useAuth } from "@/app/hooks/authContext";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import "dayjs/locale/es";
import utc from "dayjs/plugin/utc";

dayjs.locale("es");
dayjs.extend(utc);

const PacienteForm = ({
  conyugeId,
  onSubmit,
  mode,
  initialValues = {},
  confirmButton,
}) => {
  const { metadata } = useAuth();
  const [departamentoId, setDepartamentoId] = useState(null);
  const [municipiosFiltrados, setMunicipiosFiltrados] = useState([]);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const calcularEdad = (fechaNac) => {
    if (!fechaNac) return 0;

    const hoy = dayjs();
    const fechaNacimiento = dayjs(fechaNac);

    if (hoy.year() === fechaNacimiento.year()) {
      return 0;
    }

    let edad = hoy.year() - fechaNacimiento.year();

    if (
      hoy.month() < fechaNacimiento.month() ||
      (hoy.month() === fechaNacimiento.month() &&
        hoy.date() < fechaNacimiento.date())
    ) {
      edad--;
    }

    return edad;
  };

  const initialFormikValues = {
    conyugeId: initialValues.conyuge?.id || null,
    silaisId: initialValues.silais?.id || null,
    municipioId: initialValues.municipio?.id || "",
    numeroExpediente: initialValues.numeroExpediente || "",
    primerNombre: initialValues.primerNombre || "",
    segundoNombre: initialValues.segundoNombre || "",
    primerApellido: initialValues.primerApellido || "",
    segundoApellido: initialValues.segundoApellido || "",
    edad: initialValues.edad || 0,
    fechaNac: initialValues.fechaNac
      ? dayjs(initialValues.fechaNac).utc().format("YYYY-MM-DD")
      : "",
    telefono1: initialValues.telefono1 || "",
    telefono2: initialValues.telefono2 || "",
    domicilio: initialValues.domicilio || "",
  };

  const formik = useFormik({
    initialValues:
      mode === "isEditMode"
        ? initialFormikValues
        : {
            silaisId: null,
            municipioId: null,
            numeroExpediente: null,
            primerNombre: "",
            segundoNombre: "",
            primerApellido: "",
            segundoApellido: "",
            edad: 0,
            fechaNac: null,
            telefono1: null,
            telefono2: null,
            domicilio: "",
          },
    validationSchema: Yup.object({
      municipioId: Yup.number().required("*Requerido"),
      numeroExpediente: Yup.string().required("*Requerido"),
      primerNombre: Yup.string().required("*Requerido"),
      segundoNombre: Yup.string().optional(),
      primerApellido: Yup.string().required("*Requerido"),
      segundoApellido: Yup.string().optional(),
      fechaNac: Yup.string().optional().notRequired(),
      telefono1: Yup.string().required("*Requerido"),
      telefono2: Yup.string().optional().notRequired(),
      domicilio: Yup.string().optional(),
    }),

    onSubmit: (values) => {
      const pacienteData = {
        ...values,
        conyugeId: mode === "isEditMode" ? formik.values.conyugeId : conyugeId,
        edad: calcularEdad(values.fechaNac),
        fechaIngreso: new Date().toISOString(),
        fechaNac: values.fechaNac ? dayjs(values.fechaNac).toISOString() : "",
      };
      onSubmit(pacienteData);
      setHasSubmitted(true);
    },
  });

  const handleDepartamentoChange = (value) => {
    setDepartamentoId(value);

    setMunicipiosFiltrados((prevMunicipios) => {
      const municipios = metadata.municipios.filter(
        (m) => m.departamentoId === value
      );
      return municipios;
    });
  };

  useEffect(() => {
    if (mode === "isEditMode" && initialValues.municipio?.departamentoId) {
      setDepartamentoId(initialValues.municipio.departamentoId);
      const municipios = metadata.municipios.filter(
        (m) => m.departamentoId === initialValues.municipio.departamentoId
      );
      setMunicipiosFiltrados(municipios);
    }
  }, [mode, initialValues.municipio?.departamentoId, metadata.municipios]);

  useEffect(() => {
    if (confirmButton && confirmButton !== hasSubmitted) {
      formik.submitForm();
      setHasSubmitted(confirmButton);
    }
  }, [confirmButton, hasSubmitted, formik]);

  const renderField = (
    id,
    label,
    type = "text",
    clase = "item",
    disabled = false,
    isRequired = false
  ) => (
    <div className="item">
      <label htmlFor={id}>
        {label}
        {isRequired && <span className="señal-req"> *</span>}{" "}
      </label>
      {type === "textarea" ? (
        <Input.TextArea
          rows={1}
          className={clase || "textarea"}
          id={id}
          name={id}
          onChange={(e) => formik.setFieldValue(id, e.target.value)}
          value={formik.values[id]}
          disabled={disabled}
          onBlur={(e) => {
            handleFieldBlur(e);
            formik.validateField(id);
          }}
        />
      ) : (
        <Input
          className={clase || "text"}
          id={id}
          type={type}
          name={id}
          onChange={(e) => formik.setFieldValue(id, e.target.value)}
          onBlur={(e) => {
            handleFieldBlur(e);
            formik.validateField(id);
          }}
          value={formik.values[id]}
          disabled={disabled}
        />
      )}
      {formik.touched[id] && formik.errors[id] && !initialValues[id] && (
        <div className="requerido" style={{ color: "red" }}>
          {formik.errors[id]}
        </div>
      )}
    </div>
  );

  const handleFieldBlur = (e) => {
    formik.handleBlur(e);
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="item">
        <label htmlFor="silaisId">
          Silais: <span className="señal-req"> *</span>
        </label>

        <Select
          className="select"
          placeholder="Seleccione..."
          id="silaisId"
          name="silaisId"
          onChange={(value) => formik.setFieldValue("silaisId", value)}
          value={formik.values.silaisId}
          onBlur={handleFieldBlur}
        >
          {metadata.silais.map((item) => (
            <Select.Option key={item.id} value={item.id}>
              {item.nombre}
            </Select.Option>
          ))}
        </Select>
      </div>
      <div className="item">
        <label htmlFor="departamentoId">Departamento:</label>
        <Select
          value={initialValues.municipio?.departamentoId || departamentoId}
          className="select"
          placeholder="Seleccione..."
          id="departamentoId"
          onChange={handleDepartamentoChange}
          onBlur={handleFieldBlur}
        >
          {metadata.departamentos.map((item) => (
            <Select.Option key={item.id} value={item.id}>
              {item.nombre}
            </Select.Option>
          ))}
        </Select>
      </div>

      <div className="item">
        <label htmlFor="municipioId">
          Municipio:
          <span className="señal-req"> *</span>
        </label>
        <Select
          className="select"
          placeholder="Seleccione..."
          id="municipioId"
          name="municipioId"
          onChange={(value) => formik.setFieldValue("municipioId", value)}
          onBlur={handleFieldBlur}
          value={formik.values.municipioId || ""}
          disabled={!departamentoId && mode !== "isEditMode"}
        >
          {municipiosFiltrados.map((item) => (
            <Select.Option key={item.id} value={item.id}>
              {item.nombre}
            </Select.Option>
          ))}
        </Select>
        {formik.touched.municipioId && formik.errors.municipioId && (
          <div className="requerido" style={{ color: "red" }}>
            {formik.errors.municipioId}
          </div>
        )}
      </div>
      {renderField(
        "numeroExpediente",
        "N° de Expediente",
        "number",
        "text",
        false,
        true
      )}
      {renderField(
        "primerNombre",
        "Primer Nombre",
        "text",
        "text",
        false,
        true
      )}
      {renderField(
        "segundoNombre",
        "Segundo Nombre",
        "text",
        "text",
        false,
        false
      )}
      {renderField(
        "primerApellido",
        "Primer Apellido",
        "text",
        "text",
        false,
        true
      )}
      {renderField("segundoApellido", "Segundo Apellido", "text", "text")}
      {renderField("telefono1", "Teléfono 1", "number", "tlf", false, true)}
      {renderField("telefono2", "Teléfono 2", "number", "tlf")}
      <div className="item">
        <label htmlFor="fechaNac">
          Fecha de Nacimiento:
          <span className="señal-req"> *</span>
        </label>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
          <DatePicker
            id="fechaNac"
            name="fechaNac"
            className="calendar"
            value={
              formik.values.fechaNac ? dayjs(formik.values.fechaNac) : null
            }
            onChange={(date) => {
              formik.setFieldValue("fechaNac", date);
            }}
            onBlur={handleFieldBlur}
          />
        </LocalizationProvider>
        {formik.touched.fechaNac &&
          formik.errors.fechaNac &&
          !initialValues.fechaNac && (
            <div className="requerido" style={{ color: "red" }}>
              {formik.errors.fechaNac}
            </div>
          )}
      </div>
      <div className="item">
        <label htmlFor="edad">Edad:</label>
        <Input
          className="value"
          id="edad"
          name="edad"
          disabled={true}
          onBlur={handleFieldBlur}
          value={
            mode === "isCreateMode"
              ? calcularEdad(formik.values.fechaNac) || "0"
              : formik.values.edad || "0"
          }
          style={{
            color: "#4b4b4b",
            backgroundColor: "#fff",
            opacity: 1,
            cursor: "not-allowed",
          }}
        />
      </div>

      {renderField("domicilio", "Domicilio", "textarea", "textarea")}
    </form>
  );
};

export default PacienteForm;
