import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Input } from "antd";

const AntecedentesObstForm = ({
  pacienteId,
  onSubmit,
  mode,
  initialValues,
}) => {
  const formikInitialValues = {
    pacienteId: initialValues.pacienteId,
    gesta: initialValues.gesta,
    parto: initialValues.parto,
    aborto: initialValues.aborto,
    cesarea: initialValues.cesarea,
    legrado: initialValues.legrado,
  };
  const formik = useFormik({
    initialValues:
      mode === "isEditMode"
        ? formikInitialValues
        : {
            gesta: "",
            parto: "",
            aborto: "",
            cesarea: "",
            legrado: "",
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
        pacienteId:
          mode === "isEditMode"
            ? formik.values.pacienteId || pacienteId
            : pacienteId,
        ...Object.fromEntries(
          Object.entries(values).map(([key, value]) => [
            key,
            key === "pacienteId" ? value : String(value),
          ])
        ),
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
          type="number"
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
          type="number"
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
          type="number"
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
          type="number"
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
          type="number"
          onChange={formik.handleChange}
          onBlur={handleBlurFinalField}
          value={formik.values.legrado}
        />
      </div>
    </form>
  );
};

export default AntecedentesObstForm;
