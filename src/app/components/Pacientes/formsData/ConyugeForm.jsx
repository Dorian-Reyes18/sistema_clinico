import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "@/app/hooks/authContext";
import { Select, Input } from "antd";

const ConyugeForm = ({ onSubmit }) => {
  const { metadata } = useAuth();

  const formik = useFormik({
    initialValues: {
      sangreRhId: null,
      telefono: "",
      edad: "",
    },
    validationSchema: Yup.object({
      sangreRhId: Yup.number().required("*Requerido"),
      telefono: Yup.string()
        .required("*Requerido")
        .matches(/^[0-9]+$/, "*Númerico"),
      edad: Yup.number().nullable(),
    }),
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  const handleBlurFinalField = (e) => {
    formik.handleBlur(e);

    if (
      formik.values.sangreRhId &&
      formik.values.telefono &&
      !formik.errors.sangreRhId &&
      !formik.errors.telefono
    ) {
      formik.submitForm();
    }
  };

  return (
    <form>
      <div className="item">
        <label htmlFor="sangreRhId">Sangre y Rh:</label>
        <Select
          className="select"
          placeholder="Seleccione..."
          id="sangreRhId"
          name="sangreRhId"
          onChange={(value) => formik.setFieldValue("sangreRhId", value)}
          onBlur={formik.handleBlur}
          value={formik.values.sangreRhId}
        >
          {metadata.sangreRH.map((item) => (
            <Select.Option key={item.id} value={item.id}>
              {item.tipo}
            </Select.Option>
          ))}
        </Select>
        {formik.touched.sangreRhId && formik.errors.sangreRhId ? (
          <div className="requerido" style={{ color: "red" }}>
            {formik.errors.sangreRhId}
          </div>
        ) : null}
      </div>

      <div className="item">
        <label htmlFor="telefono">Teléfono:</label>
        <Input
          className="tlf"
          id="telefono"
          name="telefono"
          type="text"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.telefono}
        />
        {formik.touched.telefono && formik.errors.telefono ? (
          <div className="requerido" style={{ color: "red" }}>
            {formik.errors.telefono}
          </div>
        ) : null}
      </div>

      <div className="item">
        <label htmlFor="edad">Edad:</label>
        <Input
          placeholder="Valor"
          className="value"
          id="edad"
          name="edad"
          type="number"
          onChange={formik.handleChange}
          onBlur={handleBlurFinalField}
          value={formik.values.edad}
        />
      </div>
    </form>
  );
};

export default ConyugeForm;
