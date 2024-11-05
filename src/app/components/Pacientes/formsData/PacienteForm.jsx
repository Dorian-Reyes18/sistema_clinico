import React, { useEffect, useState, useCallback } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Select, Input } from "antd";
import { useAuth } from "@/app/hooks/authContext";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import "dayjs/locale/es";

const useDebounce = (callback, delay) => {
  const timerRef = React.useRef();

  const debouncedCallback = useCallback(
    (...args) => {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );

  return debouncedCallback;
};

dayjs.locale("es");

const PacienteForm = ({ conyugeId, onSubmit }) => {
  const { metadata } = useAuth();
  const [departamentoId, setDepartamentoId] = useState(null);
  const [municipiosFiltrados, setMunicipiosFiltrados] = useState([]);

  const calcularEdad = (fechaNac) => {
    const hoy = new Date();
    const fechaNacimiento = new Date(fechaNac);
    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const mes = hoy.getMonth() - fechaNacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  const formik = useFormik({
    initialValues: {
      silaisId: null,
      municipioId: null,
      numeroExpediente: "",
      primerNombre: "",
      segundoNombre: "",
      primerApellido: "",
      segundoApellido: "",
      edad: 0,
      fechaNac: "",
      telefono1: "",
      telefono2: "",
      domicilio: "",
    },
    validationSchema: Yup.object({
      municipioId: Yup.number().required("*Requerido"),
      numeroExpediente: Yup.string().required("*Requerido"),
      primerNombre: Yup.string().required("*Requerido"),
      primerApellido: Yup.string().required("*Requerido"),
      fechaNac: Yup.string().required("*Requerido"),
      telefono1: Yup.string().required("*Requerido"),
    }),
    onSubmit: (values) => {
      const pacienteData = {
        ...values,
        conyugeId: conyugeId,
        edad: calcularEdad(values.fechaNac),
        fechaIngreso: new Date().toISOString(),
      };
      onSubmit(pacienteData);
    },
  });

  useEffect(() => {
    if (formik.values.fechaNac) {
      formik.setFieldValue("edad", calcularEdad(formik.values.fechaNac));
    }
  }, [formik.values.fechaNac]);

  const handleDebounceSubmit = useDebounce(() => {
    const isFormValid =
      formik.values.municipioId &&
      formik.values.numeroExpediente &&
      formik.values.primerNombre &&
      formik.values.primerApellido &&
      formik.values.fechaNac &&
      formik.values.telefono1 &&
      !formik.errors.municipioId &&
      !formik.errors.numeroExpediente &&
      !formik.errors.primerNombre &&
      !formik.errors.primerApellido &&
      !formik.errors.fechaNac &&
      !formik.errors.telefono1;

    if (isFormValid) {
      formik.submitForm();
    }
  }, 300); 

  useEffect(() => {
    handleDebounceSubmit();
  }, [formik.values, formik.errors]);

  const handleDepartamentoChange = (value) => {
    setDepartamentoId(value);
    const municipios = metadata.municipios.filter(
      (m) => m.departamentoId === value
    );
    setMunicipiosFiltrados(municipios);
    formik.setFieldValue("municipioId", null);
  };

  const handleChange = (e) => {
    formik.handleChange(e);
    handleDebounceSubmit();
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="item">
        <label htmlFor="silaisId">Silais:</label>
        <Select
          className="select"
          placeholder="Seleccione..."
          id="silaisId"
          name="silaisId"
          onChange={(value) => {
            formik.setFieldValue("silaisId", value);
            formik.submitForm();
          }}
          value={formik.values.silaisId}
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
          className="select"
          placeholder="Seleccione..."
          id="departamentoId"
          name="departamentoId"
          onChange={handleDepartamentoChange}
        >
          {metadata.departamentos.map((item) => (
            <Select.Option key={item.id} value={item.id}>
              {item.nombre}
            </Select.Option>
          ))}
        </Select>
      </div>

      <div className="item">
        <label htmlFor="municipioId">Municipio:</label>
        <Select
          className="select"
          placeholder="Seleccione..."
          id="municipioId"
          name="municipioId"
          onChange={(value) => {
            formik.setFieldValue("municipioId", value);
            formik.submitForm();
          }}
          onBlur={formik.handleBlur}
          value={formik.values.municipioId}
          disabled={!departamentoId}
        >
          {municipiosFiltrados.map((item) => (
            <Select.Option key={item.id} value={item.id}>
              {item.nombre}
            </Select.Option>
          ))}
        </Select>
        {formik.touched.municipioId && formik.errors.municipioId ? (
          <div className="requerido" style={{ color: "red" }}>
            {formik.errors.municipioId}
          </div>
        ) : null}
      </div>

      <div className="item">
        <label htmlFor="numeroExpediente">N° de Expediente:</label>
        <Input
          className="text"
          id="numeroExpediente"
          name="numeroExpediente"
          onChange={handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.numeroExpediente}
        />
        {formik.touched.numeroExpediente && formik.errors.numeroExpediente ? (
          <div className="requerido" style={{ color: "red" }}>
            {formik.errors.numeroExpediente}
          </div>
        ) : null}
      </div>

      <div className="item">
        <label htmlFor="fechaNac">Fecha de Nacimiento:</label>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
          <DatePicker
            id="fechaNac"
            name="fechaNac"
            className="calendar"
            value={
              formik.values.fechaNac ? dayjs(formik.values.fechaNac) : null
            }
            onChange={(date) => {
              formik.setFieldValue(
                "fechaNac",
                date ? date.toISOString() : null
              );
              formik.submitForm();
            }}
            onBlur={formik.handleBlur}
            renderInput={(params) => <Input {...params} />}
          />
        </LocalizationProvider>
        {formik.touched.fechaNac && formik.errors.fechaNac ? (
          <div className="requerido" style={{ color: "red" }}>
            {formik.errors.fechaNac}
          </div>
        ) : null}
      </div>

      <div className="item">
        <label htmlFor="edad">Edad:</label>
        <Input
          className="value"
          id="edad"
          name="edad"
          disabled={true}
          value={formik.values.edad}
          style={{
            color: "#4b4b4b", 
            backgroundColor: "#fff", 
            opacity: 1, 
            cursor: "not-allowed", 
          }}
        />
      </div>

      <div className="item">
        <label htmlFor="telefono1">Teléfono 1:</label>
        <Input
          className="tlf"
          id="telefono1"
          name="telefono1"
          onChange={handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.telefono1}
        />
        {formik.touched.telefono1 && formik.errors.telefono1 ? (
          <div className="requerido" style={{ color: "red" }}>
            {formik.errors.telefono1}
          </div>
        ) : null}
      </div>

      <div className="item">
        <label htmlFor="telefono2">Teléfono 2:</label>
        <Input
          className="tlf"
          id="telefono2"
          name="telefono2"
          onChange={handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.telefono2}
        />
        {formik.touched.telefono2 && formik.errors.telefono2 ? (
          <div className="requerido" style={{ color: "red" }}>
            {formik.errors.telefono2}
          </div>
        ) : null}
      </div>

      <div className="item">
        <label htmlFor="primerNombre">Primer Nombre:</label>
        <Input
          className="text"
          id="primerNombre"
          name="primerNombre"
          onChange={handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.primerNombre}
        />
        {formik.touched.primerNombre && formik.errors.primerNombre ? (
          <div className="requerido" style={{ color: "red" }}>
            {formik.errors.primerNombre}
          </div>
        ) : null}
      </div>

      <div className="item">
        <label htmlFor="segundoNombre">Segundo Nombre:</label>
        <Input
          className="text"
          id="segundoNombre"
          name="segundoNombre"
          onChange={handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.segundoNombre}
        />
        {formik.touched.segundoNombre && formik.errors.segundoNombre ? (
          <div className="requerido" style={{ color: "red" }}>
            {formik.errors.segundoNombre}
          </div>
        ) : null}
      </div>

      <div className="item">
        <label htmlFor="primerApellido">Primer Apellido:</label>
        <Input
          className="text"
          id="primerApellido"
          name="primerApellido"
          onChange={handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.primerApellido}
        />
        {formik.touched.primerApellido && formik.errors.primerApellido ? (
          <div className="requerido" style={{ color: "red" }}>
            {formik.errors.primerApellido}
          </div>
        ) : null}
      </div>

      <div className="item">
        <label htmlFor="segundoApellido">Segundo Apellido:</label>
        <Input
          className="text"
          id="segundoApellido"
          name="segundoApellido"
          onChange={handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.segundoApellido}
        />
        {formik.touched.segundoApellido && formik.errors.segundoApellido ? (
          <div className="requerido" style={{ color: "red" }}>
            {formik.errors.segundoApellido}
          </div>
        ) : null}
      </div>

      <div className="item">
        <label htmlFor="domicilio">Domicilio:</label>
        <Input.TextArea
          className="textarea"
          id="domicilio"
          name="domicilio"
          onChange={handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.domicilio}
          rows={1}
        />
      </div>
    </form>
  );
};

export default PacienteForm;
