import React from "react";
import { useFormik } from "formik";
import { Switch, Input } from "antd";

const AntecedentesFamiliaresForm = ({
  mode,
  pacienteId,
  onSubmit,
  initialValues = {}, // Asegúrate de proporcionar un valor por defecto
}) => {
  // Configura los valores iniciales de forma segura
  const formik = useFormik({
    initialValues: {
      opcion: mode === "isEditMode" ? initialValues.opcion || false : false,
      descripcion: mode === "isEditMode" ? initialValues.descripcion || "" : "",
    },
    onSubmit: (values) => {
      const formData = {
        pacienteId,
        ...values,
      };
      onSubmit(formData);
    },
  });

  console.log(initialValues);

  const handleSwitchChange = (checked) => {
    formik.setFieldValue("opcion", checked);
    if (!checked) {
      formik.setFieldValue("descripcion", ""); // Limpia la descripción si está desactivado
    }
  };

  const handleBlur = () => {
    formik.submitForm(); // Envía el formulario al perder el foco
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
          rows={1}
          name="descripcion"
          value={formik.values.descripcion}
          onChange={formik.handleChange}
          onBlur={handleBlur}
          disabled={!formik.values.opcion} // Deshabilita si "opcion" es false
        />
      </div>
    </form>
  );
};

export default AntecedentesFamiliaresForm;
