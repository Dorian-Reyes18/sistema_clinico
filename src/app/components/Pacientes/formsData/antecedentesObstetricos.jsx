import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Input } from "antd";

const AntecedentesObstForm = ({
  pacienteId,
  onSubmit,
  mode,
  initialValues,
  confirmButton,
}) => {
  const [hasSubmitted, setHasSubmitted] = useState(false); // Controla si ya se ha enviado el formulario

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
      setHasSubmitted(true); // Marca el formulario como enviado
    },
  });

  // Este effect se ejecuta cuando confirmButton cambia y el formulario no ha sido enviado
  useEffect(() => {
    // Verificamos que confirmButton sea true y que no se haya enviado previamente
    if (confirmButton && !hasSubmitted) {
      formik.submitForm(); // Envía el formulario si confirmButton es verdadero y no se ha enviado
      setHasSubmitted(true); // Marca el formulario como enviado
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
        />
      </div>
    </form>
  );
};

export default AntecedentesObstForm;
