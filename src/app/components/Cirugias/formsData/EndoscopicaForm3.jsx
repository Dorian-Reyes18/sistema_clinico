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
  optionsBUILA,
} from "./DataSurgerisObject";

dayjs.locale("es");
dayjs.extend(utc);

const { Option } = Select;

const CirugiaEndoscopica3 = ({
  onSubmit,
  mode,
  initialValues,
  confirmButton,
}) => {
  const { metadata } = useAuth();

  const formik = useFormik({
    initialValues: {
      ordenQuirurgicaId: null,
      fechaCirugia: null,
      horaInicioAnestesia: "",
      horaInicioCirugiaFetal: "",
      horaFinalizacionCirugia: "",
      tipoAnestesiaId: "",
      complicacionesAnestesicas: "",
      ubicacionPlacentaria: "",
      frecuenciaCardiacaFetalInicio: "",
      sangradoEstimado: "",
      complicacionesQuirurgicas: "",
      frecuenciaCardiacaFetalFinalizacion: "",
      bolsilloUnicoInicialDeLiquidoAmniotico: "",
      laserDeAnastomosisPlacentaria: false,
      coagulacionBipolarDeCordoneUmbilical: false,
      liberacionDeBandasAmnioticas: false,
      colocacionDeBalonEndotraqueal: false,
      retiroDeBalonEndotraqueal: false,
      reparacionDeMielomeningocele: false,
      cistoscopia: false,
      cistoscopiaMasLaserDeValvasUretralesPosteriores: false,
      intubacionEndotraquealIntrauterina: false,
    },
    onSubmit: (values) => {
      const formData = {
        ...values,
        ...(mode === "isEditMode" && initialValues?.id != null
          ? { id: initialValues.id }
          : {}),
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
          id: initialValues?.id,
          ordenQuirurgicaId: initialValues.ordenQuirurgicaId,
          fechaCirugia: initialValues.fechaCirugia,
          horaInicioAnestesia: initialValues.horaInicioAnestesia,
          horaInicioCirugiaFetal: initialValues.horaInicioCirugiaFetal,
          horaFinalizacionCirugia: initialValues.horaFinalizacionCirugia,
          tipoAnestesiaId: initialValues.tipoAnestesiaId,
          complicacionesAnestesicas: initialValues.complicacionesAnestesicas,
          ubicacionPlacentaria: initialValues.ubicacionPlacentaria,
          frecuenciaCardiacaFetalInicio:
            initialValues.frecuenciaCardiacaFetalInicio,
          sangradoEstimado: initialValues.sangradoEstimado,
          complicacionesQuirurgicas: initialValues.complicacionesQuirurgicas,
          frecuenciaCardiacaFetalFinalizacion:
            initialValues.frecuenciaCardiacaFetalFinalizacion,
          bolsilloUnicoInicialDeLiquidoAmniotico:
            initialValues.bolsilloUnicoInicialDeLiquidoAmniotico,
          laserDeAnastomosisPlacentaria:
            initialValues.laserDeAnastomosisPlacentaria,
          coagulacionBipolarDeCordoneUmbilical:
            initialValues.coagulacionBipolarDeCordoneUmbilical,
          liberacionDeBandasAmnioticas:
            initialValues.liberacionDeBandasAmnioticas,
          colocacionDeBalonEndotraqueal:
            initialValues.colocacionDeBalonEndotraqueal,
          retiroDeBalonEndotraqueal: initialValues.retiroDeBalonEndotraqueal,
          reparacionDeMielomeningocele:
            initialValues.reparacionDeMielomeningocele,
          cistoscopia: initialValues.cistoscopia,
          cistoscopiaMasLaserDeValvasUretralesPosteriores:
            initialValues.cistoscopiaMasLaserDeValvasUretralesPosteriores,
          intubacionEndotraquealIntrauterina:
            initialValues.intubacionEndotraquealIntrauterina,
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

      <div className="item-2">
        <label htmlFor="bolsilloUnicoInicialDeLiquidoAmniotico">
          Bolsillo único inicial de líquido amniótico:{" "}
          <span className="señal-req"> *</span>
        </label>
        <Select
          className="select-mdrg"
          placeholder="Seleccione..."
          id="bolsilloUnicoInicialDeLiquidoAmniotico"
          name="bolsilloUnicoInicialDeLiquidoAmniotico"
          value={
            formik?.values?.bolsilloUnicoInicialDeLiquidoAmniotico || undefined
          }
          onChange={(value) =>
            formik.setFieldValue(
              "bolsilloUnicoInicialDeLiquidoAmniotico",
              value
            )
          }
          onBlur={() =>
            formik.setFieldTouched(
              "bolsilloUnicoInicialDeLiquidoAmniotico",
              true
            )
          }
        >
          {optionsBUILA.map((option) => (
            <Option key={option} value={option}>
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
        <label htmlFor="sangradoEstimado">
          Sangrado estimado: <span className="señal-req"> *</span>
        </label>
        <Select
          className="select"
          placeholder="Seleccione..."
          id="sangradoEstimado"
          name="sangradoEstimado"
          value={formik?.values?.sangradoEstimado || undefined}
          onChange={(value) => formik.setFieldValue("sangradoEstimado", value)}
          onBlur={() => formik.setFieldTouched("sangradoEstimado", true)}
        >
          {optionsSE.map((option) => (
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
        <label htmlFor="intubacionEndotraquealIntrauterina">
          Intubación endotraqueal fetal:
        </label>
        <Switch
          checked={formik.values.intubacionEndotraquealIntrauterina}
          onChange={(checked) => {
            formik.setFieldValue("intubacionEndotraquealIntrauterina", checked);
            formik.setFieldTouched("intubacionEndotraquealIntrauterina", true);
          }}
        />
      </div>

      <div className="item-switch">
        <label htmlFor="laserDeAnastomosisPlacentaria">
          Laser anastomosis placentaria:
        </label>
        <Switch
          checked={formik.values.laserDeAnastomosisPlacentaria}
          onChange={(checked) => {
            formik.setFieldValue("laserDeAnastomosisPlacentaria", checked);
            formik.setFieldTouched("laserDeAnastomosisPlacentaria", true);
          }}
        />
      </div>

      <div className="item-switch">
        <label htmlFor="coagulacionBipolarDeCordoneUmbilical">
          Coagulación bipolar cordón umbilical:
        </label>
        <Switch
          checked={formik.values.coagulacionBipolarDeCordoneUmbilical}
          onChange={(checked) => {
            formik.setFieldValue(
              "coagulacionBipolarDeCordoneUmbilical",
              checked
            );
            formik.setFieldTouched(
              "coagulacionBipolarDeCordoneUmbilical",
              true
            );
          }}
        />
      </div>
      <div className="item-switch">
        <label htmlFor="liberacionDeBandasAmnioticas">
          Liberación de bandas amnióticas:
        </label>
        <Switch
          checked={formik.values.liberacionDeBandasAmnioticas}
          onChange={(checked) => {
            formik.setFieldValue("liberacionDeBandasAmnioticas", checked);
            formik.setFieldTouched("liberacionDeBandasAmnioticas", true);
          }}
        />
      </div>

      <div className="item-switch">
        <label htmlFor="colocacionDeBalonEndotraqueal">
          Colocación de balón endotraqueal:
        </label>
        <Switch
          checked={formik.values.colocacionDeBalonEndotraqueal}
          onChange={(checked) => {
            formik.setFieldValue("colocacionDeBalonEndotraqueal", checked);
            formik.setFieldTouched("colocacionDeBalonEndotraqueal", true);
          }}
        />
      </div>

      <div className="item-switch">
        <label htmlFor="retiroDeBalonEndotraqueal">
          Retiro de balón endotraqueal:
        </label>
        <Switch
          checked={formik.values.retiroDeBalonEndotraqueal}
          onChange={(checked) => {
            formik.setFieldValue("retiroDeBalonEndotraqueal", checked);
            formik.setFieldTouched("retiroDeBalonEndotraqueal", true);
          }}
        />
      </div>

      <div className="item-switch">
        <label htmlFor="reparacionDeMielomeningocele">
          Reparación de Mielomeningocele:
        </label>
        <Switch
          checked={formik.values.reparacionDeMielomeningocele}
          onChange={(checked) => {
            formik.setFieldValue("reparacionDeMielomeningocele", checked);
            formik.setFieldTouched("reparacionDeMielomeningocele", true);
          }}
        />
      </div>

      <div className="item-switch">
        <label htmlFor="cistoscopiaMasLaserDeValvasUretralesPosteriores">
          Cistoscopia con láser uretral:
        </label>
        <Switch
          checked={
            formik.values.cistoscopiaMasLaserDeValvasUretralesPosteriores
          }
          onChange={(checked) => {
            formik.setFieldValue(
              "cistoscopiaMasLaserDeValvasUretralesPosteriores",
              checked
            );
            formik.setFieldTouched(
              "cistoscopiaMasLaserDeValvasUretralesPosteriores",
              true
            );
          }}
        />
      </div>
      <div className="item-switch">
        <label htmlFor="cistoscopia">Cistoscopia:</label>
        <Switch
          checked={formik.values.cistoscopia}
          onChange={(checked) => {
            formik.setFieldValue("cistoscopia", checked);
            formik.setFieldTouched("cistoscopia", true);
          }}
        />
      </div>
    </form>
  );
};

export default CirugiaEndoscopica3;
