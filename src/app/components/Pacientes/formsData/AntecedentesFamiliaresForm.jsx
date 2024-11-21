import React from "react";
import { useFormik } from "formik";
import { Switch, Input } from "antd";

const AntecedentesFamiliaresForm = ({
  mode,
  pacienteId,
  onSubmit,
  initialValues = {},
}) => {
  const formik = useFormik({
    initialValues: {
      pacienteId:
        mode === "isEditMode" ? initialValues.pacienteId || null : pacienteId,
      opcion: mode === "isEditMode" ? initialValues.opcion || false : false,
      descripcion: mode === "isEditMode" ? initialValues.descripcion || "" : "",
    },
    onSubmit: (values) => {
      const formData = {
        pacienteId: formik.values.pacienteId || pacienteId,
        ...values,
      };
      onSubmit(formData);
    },
  });

  const handleSwitchChange = (checked) => {
    formik.setFieldValue("opcion", checked, true);
    if (!checked) {
      formik.setFieldValue("descripcion", "", true);
    }
    formik.submitForm();
  };

  const handleBlur = () => {
    formik.submitForm();
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
          onBlur={handleBlur}
          disabled={!formik.values.opcion}
        />
      </div>
    </form>
  );
};

export default AntecedentesFamiliaresForm;
