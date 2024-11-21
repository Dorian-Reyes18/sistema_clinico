import * as Yup from "yup";
import { useFormik } from "formik";
import { Input, Switch } from "antd";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { useEffect, useState } from "react";

const EmbarazoActual = ({
  mode,
  pacienteId,
  onSubmit,
  initialValues,
  confirmButton,
}) => {
  const [hasSubmitted, setHasSubmitted] = useState(false); // Estado para controlar si ya se envió

  const formikInitialValues = {
    pacienteId: initialValues.pacienteId,
    fechaEmbarazo: initialValues.fechaEmbarazo,
    pesoKg: initialValues.pesoKg,
    talla: initialValues.talla,
    ultimaRegla: initialValues.ultimaRegla,
    edadGestacional: initialValues.edadGestacional,
    imc: initialValues.imc,
    consumoAF: initialValues.consumoAF,
    fechaInicioConsumo: initialValues.fechaInicioConsumo,
  };

  const formik = useFormik({
    initialValues:
      mode === "isEditMode"
        ? formikInitialValues
        : {
            fechaEmbarazo: null,
            pesoKg: 0,
            talla: 0,
            ultimaRegla: null,
            edadGestacional: 0,
            imc: 0,
            consumoAF: false,
            fechaInicioConsumo: null,
          },
    validationSchema: Yup.object({
      fechaEmbarazo: Yup.date().required("*Requerido"),
      pesoKg: Yup.number()
        .required("*Requerido")
        .min(1, "*Debe ser mayor que 0"),
      talla: Yup.number()
        .required("*Requerido")
        .min(1, "*Debe ser mayor que 0"),
      ultimaRegla: Yup.date().required("*Requerido"),
      fechaInicioConsumo: Yup.date().nullable(),
    }),
    onSubmit: (values) => {
      calcularEdadGestacional();
      const formData = {
        pacienteId:
          mode === "isEditMode" ? formik.values.pacienteId : pacienteId,
        ...values,
      };
      onSubmit(formData);
      setHasSubmitted(true);
    },
  });

  useEffect(() => {
    const { pesoKg, talla } = formik.values;

    if (pesoKg > 0 && talla > 0) {
      calcularIMC(pesoKg, talla);
    }
  }, [formik.values.pesoKg, formik.values.talla]);

  useEffect(() => {
    if (confirmButton && !hasSubmitted) {
      formik.submitForm();
      setHasSubmitted(true);
    }
  }, [confirmButton, hasSubmitted, formik]);

  const handleFieldBlur = (e) => {
    formik.handleBlur(e);
  };

  const calcularEdadGestacional = () => {
    const { fechaEmbarazo, ultimaRegla } = formik.values;

    if (fechaEmbarazo && ultimaRegla) {
      const fechaEmbarazoParsed = dayjs(fechaEmbarazo);
      const ultimaReglaParsed = dayjs(ultimaRegla);

      if (fechaEmbarazoParsed.isAfter(ultimaReglaParsed)) {
        const diferenciaEnDias = fechaEmbarazoParsed.diff(
          ultimaReglaParsed,
          "days"
        );

        const semanasDeDiferencia = Math.floor(diferenciaEnDias / 7);

        formik.setFieldValue("edadGestacional", semanasDeDiferencia);
      } else {
        formik.setFieldValue("edadGestacional", 0);
        console.warn(
          "La fecha de embarazo no puede ser anterior a la última regla."
        );
      }
    } else {
      formik.setFieldValue("edadGestacional", 0);
    }
  };

  const calcularIMC = (pesoKg, talla) => {
    if (pesoKg > 0 && talla > 0) {
      let imc = pesoKg / (talla * talla);
      imc = parseFloat(imc.toFixed(2));
      if (isFinite(imc) && imc > 0) {
        formik.setFieldValue("imc", imc);
      } else {
        formik.setFieldValue("imc", 0);
      }
    } else {
      formik.setFieldValue("imc", 0);
    }
  };

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <div className="item">
          <label htmlFor="talla">Talla (m)</label>
          <Input
            placeholder="valor en metros"
            className="value"
            id="talla"
            type="number"
            name="talla"
            onChange={(data) => {
              const value = Math.max(Number(data.target.value), 0);
              formik.setFieldValue("talla", value);
            }}
            value={formik.values.talla}
            onBlur={handleFieldBlur}
          />
          {formik.touched.talla && formik.errors.talla ? (
            <div className="requerido" style={{ color: "red" }}>
              {formik.errors.talla}
            </div>
          ) : null}
        </div>

        <div className="item">
          <label htmlFor="pesoKg">Peso (kg)</label>
          <Input
            placeholder="valor"
            className="value"
            id="pesoKg"
            type="number"
            name="pesoKg"
            onChange={(data) => {
              const value = Math.max(Number(data.target.value), 0);
              formik.setFieldValue("pesoKg", value);
            }}
            value={formik.values.pesoKg}
            onBlur={handleFieldBlur}
          />
          {formik.touched.pesoKg && formik.errors.pesoKg ? (
            <div className="requerido" style={{ color: "red" }}>
              {formik.errors.pesoKg}
            </div>
          ) : null}
        </div>

        <div className="item">
          <label htmlFor="imc">IMC</label>
          <Input
            className="value"
            id="imc"
            name="imc"
            disabled={true}
            value={formik.values.imc}
            style={{
              color: "#4b4b4b",
              backgroundColor: "#fff",
              opacity: 1,
              cursor: "not-allowed",
            }}
            onBlur={handleFieldBlur}
          />
        </div>
        <div className="item-switch">
          <label htmlFor="consumoAF">Consumo AF</label>
          <Switch
            id="consumoAF"
            name="consumoAF"
            checked={formik.values.consumoAF}
            onChange={(checked) => {
              formik.setFieldValue("consumoAF", checked);
              formik.setFieldValue("fechaInicioConsumo", null);
            }}
            onBlur={handleFieldBlur}
          />
        </div>
        <div className="item">
          <label htmlFor="fechaInicioConsumo">Fecha Inicio Consumo</label>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
            <DatePicker
              id="fechaInicioConsumo"
              name="fechaInicioConsumo"
              className="calendar"
              disabled={!formik.values.consumoAF}
              value={
                formik.values.fechaInicioConsumo
                  ? dayjs(formik.values.fechaInicioConsumo)
                  : null
              }
              onChange={(date) => {
                formik.setFieldValue(
                  "fechaInicioConsumo",
                  date ? date.toISOString() : null
                );
              }}
              onBlur={handleFieldBlur}
              renderInput={(params) => <Input {...params} />}
            />
          </LocalizationProvider>
        </div>

        <div className="item">
          <label htmlFor="ultmaRegla">Última regla</label>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
            <DatePicker
              id="ultmaRegla"
              name="ultimaRegla"
              className="calendar"
              value={
                formik.values.ultimaRegla
                  ? dayjs(formik.values.ultimaRegla)
                  : null
              }
              onChange={(date) => {
                formik.setFieldValue(
                  "ultimaRegla",
                  date ? date.toISOString() : null
                );
                calcularEdadGestacional();
              }}
              onBlur={handleFieldBlur}
              renderInput={(params) => <Input {...params} />}
            />
          </LocalizationProvider>
          {formik.touched.ultimaRegla && formik.errors.ultimaRegla ? (
            <div className="requerido" style={{ color: "red" }}>
              {formik.errors.ultimaRegla}
            </div>
          ) : null}
        </div>

        <div className="item">
          <label htmlFor="fechaEmbarazo">Fecha de embarazo</label>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
            <DatePicker
              id="fechaEmbarazo"
              name="fechaEmbarazo"
              className="calendar"
              value={
                formik.values.fechaEmbarazo
                  ? dayjs(formik.values.fechaEmbarazo)
                  : null
              }
              onChange={(date) => {
                formik.setFieldValue(
                  "fechaEmbarazo",
                  date ? date.toISOString() : null
                );
                calcularEdadGestacional();
              }}
              onBlur={handleFieldBlur}
              renderInput={(params) => <Input {...params} />}
            />
          </LocalizationProvider>
          {formik.touched.fechaEmbarazo && formik.errors.fechaEmbarazo ? (
            <div className="requerido" style={{ color: "red" }}>
              {formik.errors.fechaEmbarazo}
            </div>
          ) : null}
        </div>

        <div className="item">
          <label htmlFor="edadGestacional">Gesta(sem):</label>
          <Input
            className="value"
            id="edadGestacional"
            name="edadGestacional"
            disabled={true}
            value={formik.values.edadGestacional}
            style={{
              color: "#4b4b4b",
              backgroundColor: "#fff",
              opacity: 1,
              cursor: "not-allowed",
            }}
            onBlur={handleFieldBlur}
          />
        </div>
      </form>
    </div>
  );
};

export default EmbarazoActual;
