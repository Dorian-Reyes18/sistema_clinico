import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "@/app/hooks/authContext";
import { Select, Input } from "antd";

const ConyugeForm = ({
  onSubmit,
  mode,
  conyugeRhId,
  initialValues,
  confirmButton = {},
}) => {
  const { metadata } = useAuth();
  const valuesProp = initialValues?.conyuge;

  const [hasSubmitted, setHasSubmitted] = useState(false);

  const formikInitialValues = {
    sangreRhId: valuesProp?.sangreRhId || null,
    telefono: valuesProp?.telefono || "",
    edad: valuesProp?.edad || "",
  };

  const formik = useFormik({
    initialValues:
      mode === "isEditMode"
        ? formikInitialValues
        : {
            sangreRhId: null,
            telefono: "",
            edad: "",
          },
    validationSchema: Yup.object({
      sangreRhId: Yup.number().required("*Requerido"),
      telefono: Yup.string()
        .required("*Requerido")
        .matches(/^[0-9]+$/, "*Númerico"),
    }),
    onSubmit: (values) => {
      onSubmit(values);
      setHasSubmitted(true);
    },
  });

  useEffect(() => {
    if (confirmButton && confirmButton !== hasSubmitted) {
      formik.submitForm();
      setHasSubmitted(confirmButton);
    }
  }, [confirmButton, hasSubmitted, formik]);

  return (
    <form>
      <div className="item">
        <label htmlFor="sangreRhId">
          Sangre y Rh: <span className="señal-req"> *</span>
        </label>
        <Select
          className="select"
          placeholder="Seleccione..."
          id="sangreRhId"
          name="sangreRhId"
          onBlur={formik.handleBlur}
          onChange={(value) => formik.setFieldValue("sangreRhId", value)}
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
        <label htmlFor="telefono">
          Teléfono: <span className="señal-req"> *</span>
        </label>
        <Input
          className="tlf"
          id="telefono"
          name="telefono"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.telefono}
          onBlur={formik.handleBlur}
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
          value={formik.values.edad}
          onBlur={formik.handleBlur}
        />
        {formik.touched.edad && formik.errors.edad ? (
          <div className="requerido" style={{ color: "red" }}>
            {formik.errors.edad}
          </div>
        ) : null}
      </div>
    </form>
  );
};

export default ConyugeForm;
