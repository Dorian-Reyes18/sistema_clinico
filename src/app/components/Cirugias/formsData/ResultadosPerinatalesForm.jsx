import React, { useEffect } from "react";
import { useFormik } from "formik";
import { Select, Input, Switch } from "antd";
import { useAuth } from "@/app/hooks/authContext";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import "dayjs/locale/es";
import utc from "dayjs/plugin/utc";
import {
  numbers,
  optionsCA,
  optionsSE,
  optionsC,
  optionsPC,
  optionsUP,
  optionsPartos,
  edadFinalización,
  natalidad,
} from "./PercutaneaData";

dayjs.locale("es");
dayjs.extend(utc);

const { Option } = Select;

const ResultadosPerinatales = ({
  onSubmit,
  mode,
  initialValues,
  confirmButton,
}) => {
  const { metadata } = useAuth();

  const formik = useFormik({
    initialValues: {
      tipoDeParto: "", //select
      fechaNac: null,
      edadFinalizacion: "",
      natalidad: "", //select
      descripcionFetal: "",
      pesoGramos: "",
    },
    onSubmit: (values) => {
      const formData = {
        cirugiaIntraId:
          mode === "isEditMode"
            ? formik.values.ordenQuirurgicaId || null
            : null,
        ...values,
      };

      onSubmit(formData);
    },
  });

  // Sincronizar valores cuando initialValues cambian
  useEffect(() => {
    if (initialValues !== null) {
      if (mode === "isEditMode") {
        console.log(initialValues);
        formik.setValues({
          ordenQuirurgicaId: initialValues.ordenQuirurgicaId || null,
          tipoDeParto: initialValues.tipoDeParto,
          fechaNac: initialValues.fechaNac,
          edadFinalizacion: initialValues.edadFinalizacion,
          natalidad: initialValues.natalidad,
          descripcionFetal: initialValues.descripcionFetal,
          pesoGramos: initialValues.pesoGramos,
        });
      }
    }
  }, [initialValues, mode]);

  useEffect(() => {
    if (confirmButton) {
      formik.submitForm();
    }
  }, [confirmButton]);

  const handleFieldBlur = (e) => {
    formik.handleBlur(e);
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="item">
        <label htmlFor="fechaNac">
          Fecha de nacimiento:
          <span className="señal-req"> *</span>
        </label>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
          <DatePicker
            id="fechaNac"
            name="fechaNac"
            className="calendar"
            value={
              formik.values.fechaNac ? dayjs(formik.values.fechaNac) : null
            }
            onChange={(date) => {
              formik.setFieldValue("fechaNac", date);
            }}
            onBlur={handleFieldBlur}
          />
        </LocalizationProvider>
      </div>

      <div className="item">
        <label htmlFor="tipoDeParto">
          Tipo de parto: <span className="señal-req"> *</span>
        </label>
        <Select
          className="select-rg"
          placeholder="Seleccione..."
          id="tipoDeParto"
          name="tipoDeParto"
          value={formik?.values?.tipoDeParto || undefined}
          onChange={(value) => formik.setFieldValue("tipoDeParto", value)}
          onBlur={() => formik.setFieldTouched("tipoDeParto", true)}
        >
          {optionsPartos.map((option) => (
            <Option key={option} value={option}>
              {option}
            </Option>
          ))}
        </Select>
      </div>

      <div className="item">
        <label htmlFor="edadFinalizacion">
          Edad de finalización: <span className="señal-req"> *</span>
        </label>
        <Select
          className="select"
          placeholder="Seleccione..."
          id="edadFinalizacion"
          name="edadFinalizacion"
          value={formik?.values?.edadFinalizacion || undefined}
          onChange={(value) => formik.setFieldValue("edadFinalizacion", value)}
          onBlur={() => formik.setFieldTouched("edadFinalizacion", true)}
        >
          {edadFinalización.map((option) => (
            <Option key={option} value={option}>
              {option}
            </Option>
          ))}
        </Select>
      </div>

      <div className="item">
        <label htmlFor="natalidad">
          Natalidad : <span className="señal-req"> *</span>
        </label>
        <Select
          className="select"
          placeholder="Seleccione..."
          id="natalidad"
          name="natalidad"
          value={formik?.values?.natalidad || undefined}
          onChange={(value) => formik.setFieldValue("natalidad", value)}
          onBlur={() => formik.setFieldTouched("natalidad", true)}
        >
          {natalidad.map((option) => (
            <Option key={option} value={option}>
              {option}
            </Option>
          ))}
        </Select>
      </div>

      <div className="item">
        <label htmlFor="pesoGramos">
          Peso(g): <span className="señal-req"> *</span>
        </label>
        <Input
          className="value"
          id="pesoGramos"
          name="pesoGramos"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.pesoGramos}
          onBlur={formik.handleBlur}
        />
      </div>

      <div className="item">
        <label htmlFor="descripcionFetal">
          Descripción fetal: <span className="señal-req"> *</span>
        </label>
        <Input.TextArea
          rows={1}
          className="textarea-lg"
          id="descripcionFetal"
          name="descripcionFetal"
          value={formik.values.descripcionFetal || ""}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
      </div>
    </form>
  );
};

export default ResultadosPerinatales;
