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
    pacienteId: initialValues?.pacienteId || null,
    diabetesId: initialValues?.diabetesId || null,
    teratogenicos: initialValues?.teratogenicos || false,
    sangreRh: initialValues?.sangreRhId || null, // Mantén el valor de sangreRh como sangreRhId
    licor: initialValues?.licor || false,
    drogas: initialValues?.drogas || false,
    fuma: initialValues?.fuma || false,
    hipertension: initialValues?.hipertension || false,
    epilepsia: initialValues?.epilepsia || false,
    tiroidea: initialValues?.tiroidea || false,
    neoplasicas: initialValues?.neoplasicas || false,
    cardiopatia: initialValues?.cardiopatia || false,
    inmunologia: initialValues?.inmunologia || false,
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
      // Cambiar solo aquí el nombre de la propiedad sangreRh a sangreRhId
      const formData = {
        pacienteId: formik.values.pacienteId || pacienteId,
        diabetesId: formik.values.diabetesId || diabetesId,
        sangreRhId: formik.values.sangreRh, // Aquí se convierte sangreRh en sangreRhId
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

  const renderSwitchField = (label, name) => (
    <div className="item-switch">
      <label htmlFor={name}>{label}</label>
      <Switch
        checked={formik.values[name]}
        onChange={(checked) => {
          formik.setFieldValue(name, checked);
          if (name === "sangreRh") {
            formik.setFieldTouched(name, true);
          }
        }}
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
          placeholder="Seleccione..."
          id="sangreRh"
          name="sangreRh"
          onChange={(value) => formik.setFieldValue("sangreRh", value)} // Aquí se mantiene como sangreRh
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
