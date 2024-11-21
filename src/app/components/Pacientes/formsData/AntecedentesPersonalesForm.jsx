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
      sangreRh: Yup.number().required("*Requerido"),
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
    if (confirmButton && !hasSubmitted) {
      formik.submitForm();
      setHasSubmitted(true);
    }
  }, [confirmButton, hasSubmitted, formik]);

  const handleBlurFinalField = (e) => {
    formik.handleBlur(e);
    if (formik.values.sangreRh && !formik.errors.sangreRh) {
      formik.submitForm();
    }
  };

  const handleFieldBlur = (e) => {
    formik.handleBlur(e);
    formik.submitForm();
  };

  // Función para renderizar los switches
  const renderSwitchField = (label, name) => (
    <div className="item-switch">
      <label htmlFor={name}>{label}</label>
      <Switch
        checked={formik.values[name]}
        onChange={(checked) => formik.setFieldValue(name, checked)}
        onBlur={handleFieldBlur}
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
        <label htmlFor="sangreRh">Sangre y Rh</label>
        <Select
          className="switch"
          placeholder="seleccione..."
          id="sangreRh"
          name="sangreRh"
          onChange={(value) => formik.setFieldValue("sangreRh", value)}
          onBlur={handleBlurFinalField}
          value={formik.values.sangreRh}
        >
          {metadata.sangreRH.map((item) => (
            <Select.Option key={item.id} value={item.id}>
              {item.tipo}
            </Select.Option>
          ))}
        </Select>
        {formik.touched.sangreRh && formik.errors.sangreRh ? (
          <div className="requerido" style={{ color: "red" }}>
            {formik.errors.sangreRh}
          </div>
        ) : null}
      </div>
    </form>
  );
};

export default AntecedentePersonalesForm;
