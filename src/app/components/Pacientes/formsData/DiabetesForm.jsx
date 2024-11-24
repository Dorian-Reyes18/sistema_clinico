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
    pacienteid: initialValues.pacienteid,
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
        pacienteid:
          mode === "isEditMode" ? initialValues.pacienteid : pacienteId,
        ...values,
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

  const handleSwitchChange = (field, checked) => {
    if (field === "ninguna" && checked) {
      formik.setFieldValue("mellitusTipo1", false, false);
      formik.setFieldValue("mellitusTipo2", false, false);
      formik.setFieldValue("mellitusGestacional", false, false);
    } else if (field !== "ninguna" && checked) {
      formik.setFieldValue("ninguna", false, false);
    }
    formik.setFieldValue(field, checked, false);
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
          />
        </div>
        <div className="item-switch">
          <label>Gestacional</label>
          <Switch
            checked={formik.values.mellitusGestacional}
            onChange={(checked) =>
              handleSwitchChange("mellitusGestacional", checked)
            }
          />
        </div>
        <div className="item-switch">
          <label>Ninguna</label>
          <Switch
            checked={formik.values.ninguna}
            onChange={(checked) => handleSwitchChange("ninguna", checked)}
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
