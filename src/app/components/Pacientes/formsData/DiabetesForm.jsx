import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Switch } from "antd";

const DiabetesForm = ({ pacienteId, onSubmit }) => {
  const formik = useFormik({
    initialValues: {
      mellitusTipo1: false,
      mellitusTipo2: false,
      mellitusGestacional: false,
      ninguna: false,
    },
    validationSchema: Yup.object({
      mellitusTipo1: Yup.boolean(),
      mellitusTipo2: Yup.boolean(),
      mellitusGestacional: Yup.boolean(),
      ninguna: Yup.boolean().test(
        "onlyOneSelected",
        "Si seleccionas 'Ninguna', los otros no pueden estar seleccionados.",
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
        pacienteid: pacienteId,
        ...values,
      };
      onSubmit(formData);
    },
  });

  useEffect(() => {
    const { mellitusTipo1, mellitusTipo2, mellitusGestacional, ninguna } =
      formik.values;

    if (mellitusTipo1 || mellitusTipo2 || mellitusGestacional || ninguna) {
      formik.submitForm();
    }
  }, [formik.values]);

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

  return (
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

      {formik.errors.ninguna ? (
        <div style={{ color: "red" }}>{formik.errors.ninguna}</div>
      ) : null}
    </form>
  );
};

export default DiabetesForm;
