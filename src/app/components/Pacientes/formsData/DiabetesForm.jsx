import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Switch } from "antd";

const DiabetesForm = ({
  pacienteId,
  onSubmit,
  mode,
  initialValues,
  confirmButton,
}) => {
  const [hasSubmitted, setHasSubmitted] = useState(false); 

  const formikInitialValues = {
    pacienteId: initialValues.pacienteid,
    mellitusTipo1: initialValues.mellitusTipo1 || false,
    mellitusTipo2: initialValues.mellitusTipo2 || false,
    ninguna: initialValues.ninguna || false,
    mellitusGestacional: initialValues.mellitusGestacional || false,
  };

  const formik = useFormik({
    initialValues:
      mode === "isEditMode"
        ? formikInitialValues
        : {
            mellitusTipo1: false,
            mellitusTipo2: false,
            ninguna: false,
            mellitusGestacional: false,
          },
    validationSchema: Yup.object({
      mellitusTipo1: Yup.boolean(),
      mellitusTipo2: Yup.boolean(),
      mellitusGestacional: Yup.boolean(),
      ninguna: Yup.boolean().test(
        "onlyOneSelected",
        "Si seleccionas 'Ninguna', los otras opciones no pueden estar seleccionadas o viceversa.",
        function () {
          const { mellitusTipo1, mellitusTipo2, mellitusGestacional, ninguna } =
            this.parent;
          if (ninguna) {
            return !(mellitusTipo1 || mellitusTipo2 || mellitusGestacional);
          }
          return true;
        }
      ),
    }),
    onSubmit: (values) => {
      const formData = {
        pacienteId:
          mode === "isEditMode" ? initialValues.pacienteid : pacienteId,
        ...values,
      };
      onSubmit(formData);
      setHasSubmitted(true);
    },
  });

  // Enviar el formulario solo cuando confirmButton es true y no se ha enviado antes
  useEffect(() => {
    if (confirmButton && !hasSubmitted) {
      formik.submitForm(); 
    }
  }, [confirmButton, hasSubmitted, formik]);

  const handleSwitchChange = (field, checked) => {
    if (field === "ninguna" && checked) {
      formik.setFieldValue("mellitusTipo1", false);
      formik.setFieldValue("mellitusTipo2", false);
      formik.setFieldValue("mellitusGestacional", false);
    } else if (field !== "ninguna" && checked) {
      formik.setFieldValue("ninguna", false);
    }
    formik.setFieldValue(field, checked);
  };

  const handleSwitchBlur = () => {
    formik.submitForm();
  };

  return (
    <div>
      <form>
        <div className="item-switch">
          <label>Tipo 1</label>
          <Switch
            checked={formik.values.mellitusTipo1}
            onChange={(checked) => handleSwitchChange("mellitusTipo1", checked)}
          />
        </div>
        <div className="item-switch">
          <label>Tipo 2</label>
          <Switch
            checked={formik.values.mellitusTipo2}
            onChange={(checked) => handleSwitchChange("mellitusTipo2", checked)}
            onBlur={handleSwitchBlur}
          />
        </div>
        <div className="item-switch">
          <label>Gestacional</label>
          <Switch
            checked={formik.values.mellitusGestacional}
            onChange={(checked) =>
              handleSwitchChange("mellitusGestacional", checked)
            }
            onBlur={handleSwitchBlur}
          />
        </div>
        <div className="item-switch">
          <label>Ninguna</label>
          <Switch
            checked={formik.values.ninguna}
            onChange={(checked) => handleSwitchChange("ninguna", checked)}
            onBlur={handleSwitchBlur}
          />
        </div>
      </form>

      <div style={{ color: "red", fontSize: 13.5, width: 358, marginTop: 10 }}>
        {formik.errors.ninguna ? formik.errors.ninguna : null}
      </div>
    </div>
  );
};

export default DiabetesForm;
