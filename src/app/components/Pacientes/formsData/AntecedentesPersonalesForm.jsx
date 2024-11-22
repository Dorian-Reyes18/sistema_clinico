import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Switch, Select } from "antd";
import { useAuth } from "@/app/hooks/authContext";

const AntecedentePersonalesForm = ({
  pacienteId,
  mode,
  onSubmit,
  diabetesId,
  initialValues,
  confirmButton,
  setValidateForms, // Recibimos la función para actualizar el estado de validación
}) => {
  const { metadata } = useAuth();
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const formikInitialValues = {
    pacienteId: initialValues.pacienteId,
    diabetesId: initialValues.diabetesId,
    teratogenicos: initialValues.teratogenicos,
    sangreRh: initialValues.sangreRhId,
    licor: initialValues.licor,
    drogas: initialValues.drogas,
    fuma: initialValues.fuma,
    hipertension: initialValues.hipertension,
    epilepsia: initialValues.epilepsia,
    tiroidea: initialValues.tiroidea,
    neoplasicas: initialValues.neoplasicas,
    cardiopatia: initialValues.cardiopatia,
    inmunologia: initialValues.inmunologia,
  };

  const formik = useFormik({
    initialValues:
      mode === "isEditMode"
        ? formikInitialValues
        : {
            sangreRh: null,
            licor: false,
            drogas: false,
            fuma: false,
            teratogenicos: false,
            hipertension: false,
            epilepsia: false,
            tiroidea: false,
            neoplasicas: false,
            cardiopatia: false,
            inmunologia: false,
            ...initialValues,
          },
    validationSchema: Yup.object({
      sangreRh: Yup.number().nullable().required("*Requerido"),
      licor: Yup.boolean(),
      drogas: Yup.boolean(),
      fuma: Yup.boolean(),
      teratogenicos: Yup.boolean(),
      hipertension: Yup.boolean(),
      epilepsia: Yup.boolean(),
      tiroidea: Yup.boolean(),
      neoplasicas: Yup.boolean(),
      cardiopatia: Yup.boolean(),
      inmunologia: Yup.boolean(),
    }),
    onSubmit: (values) => {
      const formData = {
        pacienteId: formik.values.pacienteId || pacienteId,
        diabetesId: formik.values.diabetesId || diabetesId,
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

  useEffect(() => {
    if (mode === "isCreateMode") {
      const validateOnBlur = () => {
        formik.validateForm().then((errors) => {
          const isFormValid =
            !Object.keys(errors).length &&
            formik.touched.sangreRh &&
            !formik.errors.sangreRh &&
            Object.keys(formik.touched).length > 0;

          setValidateForms((prev) => ({
            ...prev,
            antPersonales: isFormValid,
          }));
        });
      };

      if (formik.touched.sangreRh) {
        validateOnBlur();
      }
    }
  }, [
    formik.values,
    formik.touched.sangreRh,
    formik.errors,
    setValidateForms,
    mode,
  ]); // Asegúrate de observar solo lo necesario

  // Función para renderizar los switches
  const renderSwitchField = (label, name) => (
    <div className="item-switch">
      <label htmlFor={name}>{label}</label>
      <Switch
        checked={formik.values[name]}
        onChange={(checked) => formik.setFieldValue(name, checked)}
      />
    </div>
  );

  return (
    <form>
      {renderSwitchField("Licor", "licor")}
      {renderSwitchField("Drogas", "drogas")}
      {renderSwitchField("Fuma", "fuma")}
      {renderSwitchField("Teratogenicos", "teratogenicos")}
      {renderSwitchField("Hipertensión", "hipertension")}
      {renderSwitchField("Epilepsia", "epilepsia")}
      {renderSwitchField("Tiroidea", "tiroidea")}
      {renderSwitchField("Neoplásicas", "neoplasicas")}
      {renderSwitchField("Cardiopatía", "cardiopatia")}
      {renderSwitchField("Inmunología", "inmunologia")}

      <div className="item">
        <label htmlFor="sangreRh">
          Sangre y Rh
          <span className="señal-req"> *</span>
        </label>
        <Select
          className="switch"
          placeholder="seleccione..."
          id="sangreRh"
          name="sangreRh"
          onChange={(value) => formik.setFieldValue("sangreRh", value)}
          value={formik.values.sangreRh}
          onBlur={formik.handleBlur}
        >
          {metadata.sangreRH.map((item) => (
            <Select.Option key={item.id} value={item.id}>
              {item.tipo}
            </Select.Option>
          ))}
        </Select>
        {formik.touched.sangreRh && formik.errors.sangreRh ? (
          <div className="requerido-msj" style={{ color: "red" }}>
            {formik.errors.sangreRh}
          </div>
        ) : null}
      </div>
    </form>
  );
};

export default AntecedentePersonalesForm;
