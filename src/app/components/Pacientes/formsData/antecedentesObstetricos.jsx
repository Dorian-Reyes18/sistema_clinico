import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Input } from "antd";

const AntecedentesObstForm = ({ pacienteId, onSubmit }) => {
  const formik = useFormik({
    initialValues: {
      gesta: "",
      parto: "",
      aborto: "",
      cesarea: "",
      legrado: "",
      opcionMarcada: false,
    },
    validationSchema: Yup.object({
      gesta: Yup.string().required("*Requerido"),
      parto: Yup.string().required("*Requerido"),
      aborto: Yup.string().required("*Requerido"),
      cesarea: Yup.string().required("*Requerido"),
      legrado: Yup.string().required("*Requerido"),
    }),
    onSubmit: (values) => {
      const formData = {
        pacienteId: pacienteId,
        ...values,
      };
      onSubmit(formData);
    },
  });

  const handleBlurFinalField = (e) => {
    formik.handleBlur(e);

    const hasValues =
      formik.values.gesta !== "0" ||
      formik.values.parto !== "0" ||
      formik.values.aborto !== "0" ||
      formik.values.cesarea !== "0" ||
      formik.values.legrado !== "0";

    if (hasValues) {
      formik.submitForm();
    }
  };

  return (
    <form>
      <div className="item">
        <label htmlFor="gesta">Gesta:</label>
        <Input
          placeholder="valor..."
          className="value"
          id="gesta"
          name="gesta"
          type="text"
          onChange={formik.handleChange}
          onBlur={handleBlurFinalField}
          value={formik.values.gesta}
        />
      </div>
      <div className="item">
        <label htmlFor="parto">Parto:</label>
        <Input
          placeholder="valor..."
          className="value"
          id="parto"
          name="parto"
          type="text"
          onChange={formik.handleChange}
          onBlur={handleBlurFinalField}
          value={formik.values.parto}
        />
      </div>
      <div className="item">
        <label htmlFor="aborto">Aborto:</label>
        <Input
          placeholder="valor..."
          className="value"
          id="aborto"
          name="aborto"
          type="text"
          onChange={formik.handleChange}
          onBlur={handleBlurFinalField}
          value={formik.values.aborto}
        />
      </div>
      <div className="item">
        <label htmlFor="cesarea">Cesárea:</label>
        <Input
          placeholder="valor..."
          className="value"
          id="cesarea"
          name="cesarea"
          type="text"
          onChange={formik.handleChange}
          onBlur={handleBlurFinalField}
          value={formik.values.cesarea}
        />
      </div>
      <div className="item">
        <label htmlFor="legrado">Legrado:</label>
        <Input
          placeholder="valor..."
          className="value"
          id="legrado"
          name="legrado"
          type="text"
          onChange={formik.handleChange}
          onBlur={handleBlurFinalField}
          value={formik.values.legrado}
        />
      </div>
    </form>
  );
};

export default AntecedentesObstForm;
