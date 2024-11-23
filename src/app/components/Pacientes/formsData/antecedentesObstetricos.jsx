import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { Input } from "antd";

const AntecedentesObstForm = ({
  pacienteId,
  onSubmit,
  mode,
  initialValues,
  confirmButton,
}) => {
  const [hasSubmitted, setHasSubmitted] = useState(false);

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
    <form onSubmit={formik.handleSubmit}>
      <div className="item">
        <label htmlFor="gesta">Gesta:</label>
        <Input
          placeholder="valor..."
          className="value"
          id="gesta"
          name="gesta"
          type="number"
          onChange={formik.handleChange}
          value={formik.values.gesta}
          onBlur={formik.handleBlur}
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
          value={formik.values.parto}
          onBlur={formik.handleBlur}
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
          value={formik.values.aborto}
          onBlur={formik.handleBlur}
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
          value={formik.values.cesarea}
          onBlur={formik.handleBlur}
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
          value={formik.values.legrado}
          onBlur={formik.handleBlur}
        />
      </div>
    </form>
  );
};

export default AntecedentesObstForm;
