import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { Switch, Input } from "antd";

const AntecedentesFamiliaresForm = ({
  mode,
  pacienteId,
  onSubmit,
  initialValues = {},
  confirmButton,
}) => {
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Inicializamos formik con los valores correctos para cada modo
  const formik = useFormik({
    initialValues: {
      pacienteId:
        mode === "isEditMode" ? initialValues.pacienteId || null : pacienteId,
      opcion: mode === "isEditMode" ? initialValues.opcion || false : false,
      descripcion: mode === "isEditMode" ? initialValues.descripcion || "" : "",
    },
    enableReinitialize: true, // Esto es clave para actualizar initialValues
    onSubmit: (values) => {
      const formData = {
        pacienteId: formik.values.pacienteId || pacienteId,
        ...values,
      };
      onSubmit(formData);
      setHasSubmitted(true);
    },
  });

  // Usamos un useEffect para manejar el confirmButton
  useEffect(() => {
    if (confirmButton && formik.dirty && !hasSubmitted) {
      formik.submitForm();
    }
  }, [confirmButton, formik.dirty, hasSubmitted]);

  // Manejo de cambio en el switch
  const handleSwitchChange = (checked) => {
    formik.setFieldValue("opcion", checked);
    if (!checked) {
      formik.setFieldValue("descripcion", "", true);
    }
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="item-switch">
        <label>Posee</label>
        <Switch checked={formik.values.opcion} onChange={handleSwitchChange} />
      </div>

      <div className="item-textarea">
        <label>Descripción:</label>
        <Input.TextArea
          className="textarea"
          rows={1}
          name="descripcion"
          value={formik.values.descripcion}
          onChange={formik.handleChange}
          disabled={!formik.values.opcion}
        />
      </div>
    </form>
  );
};

export default AntecedentesFamiliaresForm;
