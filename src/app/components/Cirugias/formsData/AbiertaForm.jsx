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
  optionsTA,
  optionsCA,
  optionsSE,
  optionsC,
  optionsUP,
  incisionPiel,
  incisionUtero,
  nivelAnatomico,
  nivelFuncional,
  tamañoDefecto,
  ILAInicialFinal,
} from "./DataSurgerisObject";

dayjs.locale("es");
dayjs.extend(utc);

const { Option } = Select;

const CirugiaAbierta = ({
  onSubmit,
  mode,
  initialValues,
  confirmButton,
  setShowCirugiaForm,
}) => {
  const { metadata } = useAuth();

  const formik = useFormik({
    initialValues: {
      fechaCirugia: "",
      horaInicioAnestesia: "",
      horaInicioCirugiaMaterna: "",
      horaInicioCirugiaFetal: "",
      horaFinalizacionCirugia: "",
      tipoAnestesiaId: "",
      complicacionesAnestesicas: "",
      complicacionesQuirurgicas: "",
      ubicacionPlacentaria: "",
      sangreEstimado: "",
      incisionEnPiel: "",
      incisionEnUtero: "",
      nivelAnatomico: "",
      tamanoDelDefecto: "",
      nivelFuncional: "",
      ilaInicialDeLiquidoAmniotico: "",
      ilaFinalBolsilloUnicoInicialDeLiquidoAmniotico: "",
      frecuenciaCardiacaFetalInicio: "",
      frecuenciaCardiacaFetalFinalizacion: "",
      cierreDeMielomeningocele: false,
      derivacionVentriculoamniotica: false,
      cierreDeEncefalocele: false,
      drenajeDeQuistesCoroideosUniOBilaterales: false,
    },
    onSubmit: (values) => {
      const formData = {
        ...values,
        fechaCirugia: values.fechaCirugia
          ? dayjs(values.fechaCirugia).toISOString()
          : null,
        ordenQuirurgicaId:
          mode === "isEditMode" && formik.values.ordenQuirurgicaId
            ? formik.values.ordenQuirurgicaId
            : undefined,
      };

      onSubmit(formData);
    },
  });

  // Sincronizar valores cuando initialValues cambian
  useEffect(() => {
    if (initialValues !== null) {
      if (mode === "isEditMode") {
        formik.setValues({
          ordenQuirurgicaId: initialValues.ordenQuirurgicaId,
          fechaCirugia: initialValues.fechaCirugia,
          horaInicioAnestesia: initialValues.horaInicioAnestesia,
          horaInicioCirugiaMaterna: initialValues.horaInicioCirugiaMaterna,
          horaInicioCirugiaFetal: initialValues.horaInicioCirugiaFetal,
          horaFinalizacionCirugia: initialValues.horaFinalizacionCirugia,
          tipoAnestesiaId: initialValues.tipoAnestesiaId,
          complicacionesAnestesicas: initialValues.complicacionesAnestesicas,
          complicacionesQuirurgicas: initialValues.complicacionesQuirurgicas,
          ubicacionPlacentaria: initialValues.ubicacionPlacentaria,
          sangreEstimado: initialValues.sangreEstimado,
          incisionEnPiel: initialValues.incisionEnPiel,
          incisionEnUtero: initialValues.incisionEnUtero,
          nivelAnatomico: initialValues.nivelAnatomico,
          tamanoDelDefecto: initialValues.tamanoDelDefecto,
          nivelFuncional: initialValues.nivelFuncional,
          ilaInicialDeLiquidoAmniotico:
            initialValues.ilaInicialDeLiquidoAmniotico,
          ilaFinalBolsilloUnicoInicialDeLiquidoAmniotico:
            initialValues.ilaFinalBolsilloUnicoInicialDeLiquidoAmniotico,
          frecuenciaCardiacaFetalInicio:
            initialValues.frecuenciaCardiacaFetalInicio,
          frecuenciaCardiacaFetalFinalizacion:
            initialValues.frecuenciaCardiacaFetalFinalizacion,
          cierreDeMielomeningocele: initialValues.cierreDeMielomeningocele,
          derivacionVentriculoamniotica:
            initialValues.derivacionVentriculoamniotica,
          cierreDeEncefalocele: initialValues.cierreDeEncefalocele,
          drenajeDeQuistesCoroideosUniOBilaterales:
            initialValues.drenajeDeQuistesCoroideosUniOBilaterales,
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
        <label htmlFor="fechaCirugia">
          Fecha de cirugía:
          <span className="señal-req"> *</span>
        </label>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
          <DatePicker
            id="fechaCirugia"
            name="fechaCirugia"
            className="calendar"
            value={
              formik.values.fechaCirugia
                ? dayjs(formik.values.fechaCirugia)
                : null
            }
            onChange={(date) => {
              formik.setFieldValue("fechaCirugia", date);
            }}
            onBlur={handleFieldBlur}
          />
        </LocalizationProvider>
      </div>

      <div className="item">
        <label htmlFor="tipoAnestesiaId">
          Tipo de Anestesía: <span className="señal-req"> *</span>
        </label>
        <Select
          className="select-rg"
          placeholder="Seleccione..."
          id="tipoAnestesiaId"
          name="tipoAnestesiaId"
          value={formik?.values?.tipoAnestesiaId || undefined}
          onChange={(value) => formik.setFieldValue("tipoAnestesiaId", value)}
          onBlur={() => formik.setFieldTouched("tipoAnestesiaId", true)}
        >
          {optionsTA.map((option) => (
            <Option key={option} value={option}>
              {option}
            </Option>
          ))}
        </Select>
      </div>

      <div className="item">
        <label htmlFor="horaInicioAnestesia">
          Hora inicio anestesia:
          <span className="señal-req"> *</span>
        </label>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
          <TimePicker
            className="timer-mui"
            id="horaInicioAnestesia"
            name="horaInicioAnestesia"
            value={
              formik.values.horaInicioAnestesia
                ? dayjs(formik.values.horaInicioAnestesia, "hh:mm A")
                : null
            }
            onChange={(time) =>
              formik.setFieldValue(
                "horaInicioAnestesia",
                time ? time.format("hh:mm A") : null
              )
            }
            onBlur={handleFieldBlur}
            format="hh:mm A"
            ampm
          />
        </LocalizationProvider>
      </div>

      <div className="item">
        <label htmlFor="horaInicioCirugiaMaterna">
          Hor.Inicio cirugía Materna:
          <span className="señal-req"> *</span>
        </label>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
          <TimePicker
            className="timer-mui"
            id="horaInicioCirugiaMaterna"
            name="horaInicioCirugiaMaterna"
            value={
              formik.values.horaInicioCirugiaMaterna
                ? dayjs(formik.values.horaInicioCirugiaMaterna, "hh:mm A")
                : null
            }
            onChange={(time) =>
              formik.setFieldValue(
                "horaInicioCirugiaMaterna",
                time ? time.format("hh:mm A") : null
              )
            }
            onBlur={handleFieldBlur}
            format="hh:mm A"
            ampm
          />
        </LocalizationProvider>
      </div>

      <div className="item">
        <label htmlFor="horaInicioCirugiaFetal">
          Hora inicio cirugía fetal:
          <span className="señal-req"> *</span>
        </label>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
          <TimePicker
            className="timer-mui"
            id="horaInicioCirugiaFetal"
            name="horaInicioCirugiaFetal"
            value={
              formik.values.horaInicioCirugiaFetal
                ? dayjs(formik.values.horaInicioCirugiaFetal, "hh:mm A")
                : null
            }
            onChange={(time) =>
              formik.setFieldValue(
                "horaInicioCirugiaFetal",
                time ? time.format("hh:mm A") : null
              )
            }
            onBlur={handleFieldBlur}
            format="hh:mm A"
            ampm
          />
        </LocalizationProvider>
      </div>

      <div className="item">
        <label htmlFor="horaFinalizacionCirugia">
          Hora finalización cirugía:
          <span className="señal-req"> *</span>
        </label>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
          <TimePicker
            className="timer-mui"
            id="horaFinalizacionCirugia"
            name="horaFinalizacionCirugia"
            value={
              formik.values.horaFinalizacionCirugia
                ? dayjs(formik.values.horaFinalizacionCirugia, "hh:mm A")
                : null
            }
            onChange={(time) =>
              formik.setFieldValue(
                "horaFinalizacionCirugia",
                time ? time.format("hh:mm A") : null
              )
            }
            onBlur={handleFieldBlur}
            format="hh:mm A"
            ampm
          />
        </LocalizationProvider>
      </div>

      <div className="item">
        <label htmlFor="sangreEstimado">
          Sangrado estimado: <span className="señal-req"> *</span>
        </label>
        <Select
          className="select"
          placeholder="Seleccione..."
          id="sangreEstimado"
          name="sangreEstimado"
          value={formik?.values?.sangreEstimado || undefined}
          onChange={(value) => formik.setFieldValue("sangreEstimado", value)}
          onBlur={() => formik.setFieldTouched("sangreEstimado", true)}
        >
          {optionsSE.map((option) => (
            <Option key={option} value={option.toString()}>
              {option}
            </Option>
          ))}
        </Select>
      </div>

      <div className="item">
        <label htmlFor="complicacionesAnestesicas">
          Complicaciones anestésicas : <span className="señal-req"> *</span>
        </label>
        <Select
          className="select-rg"
          placeholder="Seleccione..."
          id="complicacionesAnestesicas"
          name="complicacionesAnestesicas"
          value={formik?.values?.complicacionesAnestesicas || undefined}
          onChange={(value) =>
            formik.setFieldValue("complicacionesAnestesicas", value)
          }
          onBlur={() =>
            formik.setFieldTouched("complicacionesAnestesicas", true)
          }
        >
          {optionsCA.map((option) => (
            <Option key={option} value={option}>
              {option}
            </Option>
          ))}
        </Select>
      </div>

      <div className="item">
        <label htmlFor="complicacionesQuirurgicas">
          Complicaciones quirurgícas: <span className="señal-req"> *</span>
        </label>
        <Select
          className="select-rg"
          placeholder="Seleccione..."
          id="complicacionesQuirurgicas"
          name="complicacionesQuirurgicas"
          value={formik?.values?.complicacionesQuirurgicas || undefined}
          onChange={(value) =>
            formik.setFieldValue("complicacionesQuirurgicas", value)
          }
          onBlur={() =>
            formik.setFieldTouched("complicacionesQuirurgicas", true)
          }
        >
          {optionsC.map((option) => (
            <Option key={option} value={option.toString()}>
              {option}
            </Option>
          ))}
        </Select>
      </div>

      <div className="item">
        <label htmlFor="incisionEnPiel">
          Incisión en piel:
          <span className="señal-req"> *</span>
        </label>
        <Select
          className="select"
          placeholder="Seleccione..."
          id="incisionEnPiel"
          name="incisionEnPiel"
          value={formik?.values?.incisionEnPiel || undefined}
          onChange={(value) => formik.setFieldValue("incisionEnPiel", value)}
          onBlur={() => formik.setFieldTouched("incisionEnPiel", true)}
        >
          {incisionPiel.map((option) => (
            <Option key={option} value={option}>
              {option}
            </Option>
          ))}
        </Select>
      </div>

      <div className="item">
        <label htmlFor="incisionEnUtero">
          Incisión en Utero:
          <span className="señal-req"> *</span>
        </label>
        <Select
          className="select"
          placeholder="Seleccione..."
          id="incisionEnUtero"
          name="incisionEnUtero"
          value={formik?.values?.incisionEnUtero || undefined}
          onChange={(value) => formik.setFieldValue("incisionEnUtero", value)}
          onBlur={() => formik.setFieldTouched("incisionEnUtero", true)}
        >
          {incisionUtero.map((option) => (
            <Option key={option} value={option}>
              {option}
            </Option>
          ))}
        </Select>
      </div>

      <div className="item">
        <label htmlFor="nivelAnatomico">
          Nivel Anatómico: <span className="señal-req"> *</span>
        </label>
        <Select
          className="select"
          placeholder="Seleccione..."
          id="nivelAnatomico"
          name="nivelAnatomico"
          value={formik?.values?.nivelAnatomico || undefined}
          onChange={(value) => formik.setFieldValue("nivelAnatomico", value)}
          onBlur={() => formik.setFieldTouched("nivelAnatomico", true)}
        >
          {nivelAnatomico.map((option) => (
            <Option key={option} value={option.toString()}>
              {option}
            </Option>
          ))}
        </Select>
      </div>

      <div className="item">
        <label htmlFor="nivelFuncional">
          Nivel funcional: <span className="señal-req"> *</span>
        </label>
        <Select
          className="select"
          placeholder="Seleccione..."
          id="nivelFuncional"
          name="nivelFuncional"
          value={formik?.values?.nivelFuncional || undefined}
          onChange={(value) => formik.setFieldValue("nivelFuncional", value)}
          onBlur={() => formik.setFieldTouched("nivelFuncional", true)}
        >
          {nivelFuncional.map((option) => (
            <Option key={option} value={option.toString()}>
              {option}
            </Option>
          ))}
        </Select>
      </div>

      <div className="item">
        <label htmlFor="ubicacionPlacentaria">
          Ubicación placentaria: <span className="señal-req"> *</span>
        </label>
        <Select
          className="select-rg"
          placeholder="Seleccione..."
          id="ubicacionPlacentaria"
          name="ubicacionPlacentaria"
          value={formik?.values?.ubicacionPlacentaria || undefined}
          onChange={(value) =>
            formik.setFieldValue("ubicacionPlacentaria", value)
          }
          onBlur={() => formik.setFieldTouched("ubicacionPlacentaria", true)}
        >
          {optionsUP.map((option) => (
            <Option key={option} value={option.toString()}>
              {option}
            </Option>
          ))}
        </Select>
      </div>

      <div className="item">
        <label htmlFor="tamanoDelDefecto">
          Tamaño del defecto: <span className="señal-req"> *</span>
        </label>
        <Select
          className="select"
          placeholder="Seleccione..."
          id="tamanoDelDefecto"
          name="tamanoDelDefecto"
          value={formik?.values?.tamanoDelDefecto || undefined}
          onChange={(value) => formik.setFieldValue("tamanoDelDefecto", value)}
          onBlur={() => formik.setFieldTouched("tamanoDelDefecto", true)}
        >
          {tamañoDefecto.map((option) => (
            <Option key={option} value={option.toString()}>
              {option}
            </Option>
          ))}
        </Select>
      </div>

      <div className="item">
        <label htmlFor="ilaInicialDeLiquidoAmniotico">
          ILA Inicial: <span className="señal-req"> *</span>
        </label>
        <Select
          className="select"
          placeholder="Seleccione..."
          id="ilaInicialDeLiquidoAmniotico"
          name="ilaInicialDeLiquidoAmniotico"
          value={formik?.values?.ilaInicialDeLiquidoAmniotico || undefined}
          onChange={(value) =>
            formik.setFieldValue("ilaInicialDeLiquidoAmniotico", value)
          }
          onBlur={() =>
            formik.setFieldTouched("ilaInicialDeLiquidoAmniotico", true)
          }
        >
          {ILAInicialFinal.map((option) => (
            <Option key={option} value={option.toString()}>
              {option}
            </Option>
          ))}
        </Select>
      </div>

      <div className="item">
        <label htmlFor="ilaFinalBolsilloUnicoInicialDeLiquidoAmniotico">
          ILA Final: <span className="señal-req"> *</span>
        </label>
        <Select
          className="select"
          placeholder="Seleccione..."
          id="ilaFinalBolsilloUnicoInicialDeLiquidoAmniotico"
          name="ilaFinalBolsilloUnicoInicialDeLiquidoAmniotico"
          value={
            formik?.values?.ilaFinalBolsilloUnicoInicialDeLiquidoAmniotico ||
            undefined
          }
          onChange={(value) =>
            formik.setFieldValue(
              "ilaFinalBolsilloUnicoInicialDeLiquidoAmniotico",
              value
            )
          }
          onBlur={() =>
            formik.setFieldTouched(
              "ilaFinalBolsilloUnicoInicialDeLiquidoAmniotico",
              true
            )
          }
        >
          {ILAInicialFinal.map((option) => (
            <Option key={option} value={option.toString()}>
              {option}
            </Option>
          ))}
        </Select>
      </div>

      <div className="item">
        <label htmlFor="frecuenciaCardiacaFetalInicio">
          Frecuencia cardi. Inicio: <span className="señal-req"> *</span>
        </label>
        <Input
          className="text"
          id="frecuenciaCardiacaFetalInicio"
          name="frecuenciaCardiacaFetalInicio"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.frecuenciaCardiacaFetalInicio}
          onBlur={formik.handleBlur}
        />
      </div>

      <div className="item">
        <label htmlFor="frecuenciaCardiacaFetalFinalizacion">
          Frecuencia cardi. Final: <span className="señal-req"> *</span>
        </label>
        <Input
          className="text"
          id="frecuenciaCardiacaFetalFinalizacion"
          name="frecuenciaCardiacaFetalFinalizacion"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.frecuenciaCardiacaFetalFinalizacion}
          onBlur={formik.handleBlur}
        />
      </div>

      <div className="item-switch">
        <label htmlFor="cierreDeMielomeningocele">
          Cierre de Mielomeningocele:
        </label>
        <Switch
          checked={formik.values.cierreDeMielomeningocele}
          onChange={(checked) => {
            formik.setFieldValue("cierreDeMielomeningocele", checked);
            formik.setFieldTouched("cierreDeMielomeningocele", true);
          }}
        />
      </div>
      <div className="item-switch">
        <label htmlFor="derivacionVentriculoamniotica">
          ventrículo-amniótica:
        </label>
        <Switch
          checked={formik.values.derivacionVentriculoamniotica}
          onChange={(checked) => {
            formik.setFieldValue("derivacionVentriculoamniotica", checked);
            formik.setFieldTouched("derivacionVentriculoamniotica", true);
          }}
        />
      </div>
      <div className="item-switch">
        <label htmlFor="cierreDeEncefalocele">Cierre de Encefalocele:</label>
        <Switch
          checked={formik.values.cierreDeEncefalocele}
          onChange={(checked) => {
            formik.setFieldValue("cierreDeEncefalocele", checked);
            formik.setFieldTouched("cierreDeEncefalocele", true);
          }}
        />
      </div>
      <div className="item-switch">
        <label htmlFor="drenajeDeQuistesCoroideosUniOBilaterales">
          Drenaje de quistes coroideos:
        </label>
        <Switch
          checked={formik.values.drenajeDeQuistesCoroideosUniOBilaterales}
          onChange={(checked) => {
            formik.setFieldValue(
              "drenajeDeQuistesCoroideosUniOBilaterales",
              checked
            );
            formik.setFieldTouched(
              "drenajeDeQuistesCoroideosUniOBilaterales",
              true
            );
          }}
        />
      </div>
    </form>
  );
};

export default CirugiaAbierta;
