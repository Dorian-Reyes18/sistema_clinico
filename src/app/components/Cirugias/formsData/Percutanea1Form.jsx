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

dayjs.locale("es");
dayjs.extend(utc);

const { Option } = Select;

const CirugiaPercutanea1 = ({
  onSubmit,
  mode,
  initialValues,
  confirmButton,
}) => {
  const { metadata } = useAuth();

  const formik = useFormik({
    initialValues: {
      fechaCirugia: null,
      horaInicioAnestesia: null,
      horaInicioCirugiaFetal: null,
      horaFinalizacionCirugia: null,
      ordenQuirurgicaId: null,
      ubicacionPlacentaria: "",
      ablacionDeVasoTumoral: false,
      ablacionDeVasoNutricioSistemico: false,
      ablacionDeVasoNutricioFetal: false,
      derivacionToracoAmnioticaUnilateral: false,
      derivacionToracoAmnioticaBilateral: false,
      cordocentesis: false,
      drenajeDeMasaQuisticaRenal: false,
      drenajeDeMasaQuisticaPulmonar: false,
      toracocentesis: false,
      cateterismoCardiaco: false,
      tipoAnestesiaId: "",
      frecuenciaCardiacaFetalInicio: "",
      bolsilloUnicoInicialDeLiquidoAmniotico: false,
      diferenciaPorcentualDePeso: "",
      sangradoEstimado: "",
      frecuenciaCardiacaFetalFinalizacion: "",
      complicacionesQuirurgicas: "",
      complicacionesAnestesicas: "",
      anastomosisCoaguladas: "",
      proceso: "",
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
    if (initialValues?.length > 0) {
      if (mode === "isEditMode") {
        initialValues = initialValues[0];
        formik.setValues({
          ordenQuirurgicaId: initialValues.ordenQuirurgicaId || null,
          fechaCirugia: initialValues.fechaCirugia,
          horaInicioAnestesia: initialValues.horaInicioAnestesia,
          horaInicioCirugiaFetal: initialValues.horaInicioCirugiaFetal,
          horaFinalizacionCirugia: initialValues.horaFinalizacionCirugia,
          tipoAnestesiaId: initialValues.tipoAnestesiaId,
          complicacionesAnestesicas: initialValues.complicacionesAnestesicas,
          anastomosisCoaguladas: initialValues.anastomosisCoaguladas,
          sangradoEstimado: initialValues.sangradoEstimado,
          complicacionesQuirurgicas: initialValues.complicacionesQuirurgicas,
          proceso: initialValues.proceso,
          ablacionDeVasoTumoral: initialValues.ablacionDeVasoTumoral,
          ablacionDeVasoNutricioFetal:
            initialValues.ablacionDeVasoNutricioFetal,
          derivacionToracoAmnioticaUnilateral:
            initialValues.derivacionToracoAmnioticaUnilateral,
          derivacionToracoAmnioticaBilateral:
            initialValues.derivacionToracoAmnioticaBilateral,
          cordocentesis: initialValues.cordocentesis,
          drenajeDeMasaQuisticaRenal: initialValues.drenajeDeMasaQuisticaRenal,
          drenajeDeMasaQuisticaPulmonar:
            initialValues.drenajeDeMasaQuisticaPulmonar,
          toracocentesis: initialValues.toracocentesis,
          cateterismoCardiaco: initialValues.cateterismoCardiaco,
          ablacionDeVasoNutricioSistemico:
            initialValues.ablacionDeVasoNutricioSistemico,
          diferenciaPorcentualDePeso: initialValues.diferenciaPorcentualDePeso,
          bolsilloUnicoInicialDeLiquidoAmniotico:
            initialValues.bolsilloUnicoInicialDeLiquidoAmniotico,
          frecuenciaCardiacaFetalInicio:
            initialValues.frecuenciaCardiacaFetalInicio,
          ubicacionPlacentaria: initialValues.ubicacionPlacentaria,
          frecuenciaCardiacaFetalFinalizacion:
            initialValues.frecuenciaCardiacaFetalFinalizacion,
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

      {/* TimePicker para horaInicioAnestesia */}
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
            format="hh:mm A" // 12 horas con AM/PM
            ampm
          />
        </LocalizationProvider>
      </div>

      {/* TimePicker para horaInicioCirugiaFetal */}
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

      {/* TimePicker para horaFinalizacionCirugia */}
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

      <div className="item-2">
        <label htmlFor="tipoEmbarazo">
          Bolsillo único inicial de líquido amniótico:{" "}
          <span className="señal-req"> *</span>
        </label>
        <Select
          className="select-mdrg"
          placeholder="Seleccione..."
          id="tipoEmbarazo"
          name="tipoEmbarazo"
          value={formik?.values?.tipoEmbarazo || undefined}
          onChange={(value) => formik.setFieldValue("tipoEmbarazo", value)}
          onBlur={() => formik.setFieldTouched("tipoEmbarazo", true)}
        >
          <Option value="Menor de 2 cms">Menor de 2 cms</Option>
          <Option value="De 2 a 8 cms">De 2 a 8 cms</Option>
          <Option value="Mayor a 8 cms">Mayor a 8 cms</Option>
        </Select>
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
          <Option value="General + Bloqueo regional">
            General + Bloqueo regional
          </Option>
          <Option value="Bloqueo epidural">Bloqueo epidural</Option>
          <Option value="Bloqueo espinal">Bloqueo espinal</Option>
          <Option value="Sedación, Local + Sedación">
            Sedación, Local + Sedación
          </Option>
          <Option value="Anestesia mixta">Anestesia mixta</Option>
        </Select>
      </div>

      <div className="item-switch">
        <label htmlFor="ablacionDeVasoTumoral">Ablación de vaso tumoral</label>
        <Switch
          checked={formik.values.ablacionDeVasoTumoral}
          onChange={(checked) => {
            formik.setFieldValue("ablacionDeVasoTumoral", checked);
            formik.setFieldTouched("ablacionDeVasoTumoral", true);
          }}
        />
      </div>
      <div className="item-switch">
        <label htmlFor="ablacionDeVasoNutricioSistemico">
          Ablación de vaso nutricio sistémico
        </label>
        <Switch
          checked={formik.values.ablacionDeVasoNutricioSistemico}
          onChange={(checked) => {
            formik.setFieldValue("ablacionDeVasoNutricioSistemico", checked);
            formik.setFieldTouched("ablacionDeVasoNutricioSistemico", true);
          }}
        />
      </div>
      <div className="item-switch">
        <label htmlFor="ablacionDeVasoNutricioSistemico">
          Ablación de vaso nutricio sistémico
        </label>
        <Switch
          checked={formik.values.bolsilloUnicoInicialDeLiquidoAmniotico}
          onChange={(checked) => {
            formik.setFieldValue(
              "bolsilloUnicoInicialDeLiquidoAmniotico",
              checked
            );
            formik.setFieldTouched(
              "bolsilloUnicoInicialDeLiquidoAmniotico",
              true
            );
          }}
        />
      </div>
    </form>
  );
};

export default CirugiaPercutanea1;
