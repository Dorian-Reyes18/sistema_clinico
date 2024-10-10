import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Select, Input } from "antd";
import { useAuth } from "@/app/hooks/authContext";

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

  useEffect(() => {
    // Enviar los datos automáticamente cuando los campos requeridos estén llenos
    if (
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
      !formik.errors.telefono1
    ) {
      formik.submitForm();
    }
  }, [formik.values, formik.errors]);

  const handleDepartamentoChange = (value) => {
    setDepartamentoId(value);
    const municipios = metadata.municipios.filter(
      (m) => m.departamentoId === value
    );
    setMunicipiosFiltrados(municipios);
    formik.setFieldValue("municipioId", null);
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
            formik.submitForm(); // Enviar si se cambia este campo
          }} // Agrega esto
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
            formik.submitForm(); // Enviar si se cambia este campo
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
        <label htmlFor="numeroExpediente">Número de Expediente:</label>
        <Input
          id="numeroExpediente"
          name="numeroExpediente"
          onChange={(e) => {
            formik.handleChange(e);
            formik.submitForm(); // Enviar si se cambia este campo
          }}
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
        <label htmlFor="primerNombre">Primer Nombre:</label>
        <Input
          id="primerNombre"
          name="primerNombre"
          onChange={(e) => {
            formik.handleChange(e);
            formik.submitForm(); // Enviar si se cambia este campo
          }}
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
          id="segundoNombre"
          name="segundoNombre"
          onChange={(e) => {
            formik.handleChange(e);
            formik.submitForm();
          }}
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
          id="primerApellido"
          name="primerApellido"
          onChange={(e) => {
            formik.handleChange(e);
            formik.submitForm(); // Enviar si se cambia este campo
          }}
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
          id="segundoApellido"
          name="segundoApellido"
          onChange={(e) => {
            formik.handleChange(e);
            formik.submitForm();
          }}
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
        <label htmlFor="fechaNac">Fecha de Nacimiento:</label>
        <Input
          id="fechaNac"
          name="fechaNac"
          type="date"
          onChange={(e) => {
            formik.handleChange(e);
            formik.submitForm(); // Enviar si se cambia este campo
          }}
          onBlur={formik.handleBlur}
          value={formik.values.fechaNac}
        />
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
          type="number"
          value={formik.values.edad}
          disabled
        />
      </div>

      <div className="item">
        <label htmlFor="telefono1">Teléfono 1:</label>
        <Input
          className="tlf"
          id="telefono1"
          name="telefono1"
          type="text"
          onChange={(e) => {
            formik.handleChange(e);
            formik.submitForm();
          }}
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
          type="text"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.telefono2}
        />
      </div>

      <div className="item">
        <label htmlFor="domicilio">Domicilio:</label>
        <Input.TextArea
          id="domicilio"
          name="domicilio"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.domicilio}
        />
      </div>
    </form>
  );
};

export default PacienteForm;
