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
  setValidateForms,
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
      setHasSubmitted(true);
    },
  });

  useEffect(() => {
    if (confirmButton && confirmButton !== hasSubmitted) {
      formik.submitForm();
      setHasSubmitted(confirmButton);
    }
  }, [confirmButton, hasSubmitted, formik]);

  useEffect(() => {
    if (mode === "isCreateMode") {
      // Solo validamos si todos los campos están completos
      const validateOnSubmit = () => {
        // Verificamos si los campos requeridos están llenos y si no hay errores
        const isFormValid =
          formik.touched.aborto &&
          formik.touched.cesarea &&
          formik.touched.gesta &&
          formik.touched.legrado &&
          formik.touched.parto &&
          !formik.errors.aborto &&
          !formik.errors.cesarea &&
          !formik.errors.gesta &&
          !formik.errors.legrado &&
          !formik.errors.parto;

        setValidateForms((prev) => ({
          ...prev,
          antObstetricos: isFormValid,
        }));
      };

      if (
        formik.touched.aborto &&
        formik.touched.cesarea &&
        formik.touched.gesta &&
        formik.touched.legrado &&
        formik.touched.parto
      ) {
        validateOnSubmit();
      }
    }
  }, [formik.values, formik.touched, formik.errors, mode, setValidateForms]);

  useEffect(() => {
    if (confirmButton && confirmButton !== hasSubmitted) {
      formik.submitForm();
      setHasSubmitted(confirmButton);
    }
  }, [confirmButton, hasSubmitted, formik]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="item">
        <label htmlFor="gesta">
          Gesta: <span className="señal-req"> *</span>
        </label>
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
        {formik.touched.gesta && formik.errors.gesta ? (
          <div className="requerido-msj">{formik.errors.gesta}</div>
        ) : null}
      </div>

      <div className="item">
        <label htmlFor="parto">
          Parto: <span className="señal-req"> *</span>
        </label>
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
        {formik.touched.parto && formik.errors.parto ? (
          <div className="requerido-msj">{formik.errors.parto}</div>
        ) : null}
      </div>

      <div className="item">
        <label htmlFor="aborto">
          Aborto: <span className="señal-req"> *</span>
        </label>
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
        {formik.touched.aborto && formik.errors.aborto ? (
          <div className="requerido-msj">{formik.errors.aborto}</div>
        ) : null}
      </div>

      <div className="item">
        <label htmlFor="cesarea">
          Cesárea: <span className="señal-req"> *</span>
        </label>
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
        {formik.touched.cesarea && formik.errors.cesarea ? (
          <div className="requerido-msj">{formik.errors.cesarea}</div>
        ) : null}
      </div>

      <div className="item">
        <label htmlFor="legrado">
          Legrado: <span className="señal-req"> *</span>
        </label>
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
        {formik.touched.legrado && formik.errors.legrado ? (
          <div className="requerido-msj">{formik.errors.legrado}</div>
        ) : null}
      </div>
    </form>
  );
};

export default AntecedentesObstForm;
