import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Switch, Select } from "antd";
import { useAuth } from "@/app/hooks/authContext";

const AntecedentePersonalesForm = ({
  pacienteId,
  onSubmit,
  diabetesId,
  initialValues,
}) => {
  const { metadata } = useAuth();

  const formik = useFormik({
    initialValues: {
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
      ...initialValues, // Incluye los valores iniciales
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
        pacienteId,
        diabetesId,
        ...values,
      };
      onSubmit(formData);
    },
  });

  const handleBlurFinalField = (e) => {
    formik.handleBlur(e);
    if (formik.values.sangreRh && !formik.errors.sangreRh) {
      formik.submitForm();
    }
  };

  const handleFieldBlur = (e) => {
    formik.handleBlur(e);
    formik.submitForm(); // Envía el formulario automáticamente al perder el foco
  };

  return (
    <form>
      <div className="item-switch">
        <label htmlFor="licor">Licor</label>
        <Switch
          checked={formik.values.licor}
          onChange={(checked) => formik.setFieldValue("licor", checked)}
          onBlur={handleFieldBlur} // Agregar onBlur aquí
        />
      </div>
      <div className="item-switch">
        <label htmlFor="drogas">Drogas</label>
        <Switch
          checked={formik.values.drogas}
          onChange={(checked) => formik.setFieldValue("drogas", checked)}
          onBlur={handleFieldBlur} // Agregar onBlur aquí
        />
      </div>
      <div className="item-switch">
        <label htmlFor="fuma">Fuma</label>
        <Switch
          checked={formik.values.fuma}
          onChange={(checked) => formik.setFieldValue("fuma", checked)}
          onBlur={handleFieldBlur} // Agregar onBlur aquí
        />
      </div>
      <div className="item-switch">
        <label htmlFor="teratogenicos">Teratogenicos</label>
        <Switch
          checked={formik.values.teratogenicos}
          onChange={(checked) => formik.setFieldValue("teratogenicos", checked)}
          onBlur={handleFieldBlur} // Agregar onBlur aquí
        />
      </div>
      <div className="item-switch">
        <label htmlFor="hipertension">Hipertensión</label>
        <Switch
          checked={formik.values.hipertension}
          onChange={(checked) => formik.setFieldValue("hipertension", checked)}
          onBlur={handleFieldBlur} // Agregar onBlur aquí
        />
      </div>
      <div className="item-switch">
        <label htmlFor="epilepsia">Epilepsia</label>
        <Switch
          checked={formik.values.epilepsia}
          onChange={(checked) => formik.setFieldValue("epilepsia", checked)}
          onBlur={handleFieldBlur} // Agregar onBlur aquí
        />
      </div>
      <div className="item-switch">
        <label htmlFor="tiroidea">Tiroidea</label>
        <Switch
          checked={formik.values.tiroidea}
          onChange={(checked) => formik.setFieldValue("tiroidea", checked)}
          onBlur={handleFieldBlur} // Agregar onBlur aquí
        />
      </div>
      <div className="item-switch">
        <label htmlFor="neoplasicas">Neoplásicas</label>
        <Switch
          checked={formik.values.neoplasicas}
          onChange={(checked) => formik.setFieldValue("neoplasicas", checked)}
          onBlur={handleFieldBlur} // Agregar onBlur aquí
        />
      </div>
      <div className="item-switch">
        <label htmlFor="cardiopatia">Cardiopatía</label>
        <Switch
          checked={formik.values.cardiopatia}
          onChange={(checked) => formik.setFieldValue("cardiopatia", checked)}
          onBlur={handleFieldBlur} // Agregar onBlur aquí
        />
      </div>
      <div className="item-switch">
        <label htmlFor="inmunologia">Inmunología</label>
        <Switch
          checked={formik.values.inmunologia}
          onChange={(checked) => formik.setFieldValue("inmunologia", checked)}
          onBlur={handleFieldBlur} // Agregar onBlur aquí
        />
      </div>
      <div className="item">
        <label htmlFor="sangreRh">Sangre y Rh</label>
        <Select
          className="switch"
          placeholder="seleccione..."
          id="sangreRh"
          name="sangreRh"
          onChange={(value) => formik.setFieldValue("sangreRh", value)}
          onBlur={handleBlurFinalField} // Se mantiene el comportamiento anterior
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
