import React from "react";
import { useFormik } from "formik";
import { Switch, Input } from "antd";

const AntecedentesFamiliaresForm = ({
  pacienteId,
  onSubmit,
  initialValues,
}) => {
  const formik = useFormik({
    initialValues: {
      opcion: initialValues.opcion || false,
      descripcion: initialValues.descripcion || "",
    },
    onSubmit: (values) => {
      const formData = {
        pacienteId: pacienteId,
        ...values,
      };
      onSubmit(formData);
    },
  });

  const handleSwitchChange = (checked) => {
    formik.setFieldValue("opcion", checked);
    if (!checked) {
      formik.setFieldValue("descripcion", "");
    }
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
