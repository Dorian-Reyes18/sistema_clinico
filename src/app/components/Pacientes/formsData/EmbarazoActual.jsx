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
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const formikInitialValues = {
    pacienteId: initialValues.pacienteId,
    pesoKg: initialValues.pesoKg || 0,
    talla: initialValues.talla || 0,
    ultimaRegla: initialValues.ultimaRegla || null,
    edadGestacional: initialValues.edadGestacional || 0,
    imc: initialValues.imc || 0,
    consumoAF: initialValues.consumoAF || false,
    fechaInicioConsumo: initialValues.fechaInicioConsumo || null,
  };

  const formik = useFormik({
    initialValues:
      mode === "isEditMode"
        ? formikInitialValues
        : {
            pesoKg: 0,
            talla: 0,
            ultimaRegla: null,
            edadGestacional: 0,
            imc: 0,
            consumoAF: false,
            fechaInicioConsumo: null,
          },
    validationSchema: Yup.object({
      pesoKg: Yup.number().required("*Requerido").min(1, "*no puede ser cero"),
      talla: Yup.number().required("*Requerido").min(1, "*no puede ser cero"),
      ultimaRegla: Yup.date().nullable().notRequired(),
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
    if (confirmButton && confirmButton !== hasSubmitted) {
      formik.submitForm();
      setHasSubmitted(confirmButton);
    }
  }, [confirmButton, hasSubmitted, formik]);

  useEffect(() => {
    calcularEdadGestacional();
  }, [formik.values.ultimaRegla]);

  const calcularEdadGestacional = () => {
    const { ultimaRegla } = formik.values;

    if (ultimaRegla) {
      const ultimaReglaParsed = dayjs(ultimaRegla);
      const hoy = dayjs();
      const diferenciaEnDias = hoy.diff(ultimaReglaParsed, "days");
      const semanasDeDiferencia = Math.floor(diferenciaEnDias / 7);
      const diasRestantes = diferenciaEnDias % 7;
      const semanasTexto = semanasDeDiferencia === 1 ? "sem" : "semanas";
      const diasTexto = diasRestantes === 1 ? "día" : "días";

      const edadGestacional = `${semanasDeDiferencia} ${semanasTexto}, ${diasRestantes} ${diasTexto}`;
      formik.setFieldValue("edadGestacional", edadGestacional);
    } else {
      formik.setFieldValue("edadGestacional", "0 sem, 0 días");
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

  // Función para obtener la categoría del IMC según la OMS
  const obtenerCategoriaIMC = (imc) => {
    if (imc < 18.5) {
      return "Bajo peso";
    } else if (imc >= 18.5 && imc < 24.9) {
      return "Normal";
    } else if (imc >= 25 && imc < 29.9) {
      return "Sobrepeso";
    } else if (imc >= 30) {
      return "Obesidad";
    }
    return "";
  };

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        {/* Formulario con los campos existentes */}
        <div className="item">
          <label htmlFor="talla">
            Talla (m) <span className="señal-req"> *</span>
          </label>
          <Input
            placeholder="valor en metros"
            className="value"
            id="talla"
            type="number"
            name="talla"
            step={"0.01"}
            onChange={(data) => {
              const value = Math.max(Number(data.target.value), 0);
              formik.setFieldValue("talla", value);
            }}
            value={formik.values.talla}
            onBlur={formik.handleBlur}
          />
          {formik.touched.talla && formik.errors.talla ? (
            <div className="requerido-msj">{formik.errors.talla}</div>
          ) : null}
        </div>

        <div className="item">
          <label htmlFor="pesoKg">
            Peso (kg) <span className="señal-req"> *</span>
          </label>
          <Input
            placeholder="valor"
            className="value"
            id="pesoKg"
            type="number"
            name="pesoKg"
            step={"0.01"}
            onChange={(data) => {
              const value = Math.max(Number(data.target.value), 0);
              formik.setFieldValue("pesoKg", value);
            }}
            value={formik.values.pesoKg}
            onBlur={formik.handleBlur}
          />
          {formik.touched.pesoKg && formik.errors.pesoKg ? (
            <div className="requerido-msj">{formik.errors.pesoKg}</div>
          ) : null}
        </div>

        <div className="item">
          <label htmlFor="imc">IMC</label>
          <Input
            className="value"
            id="imc"
            name="imc"
            value={formik.values.imc}
            disabled={true}
            style={{
              color: "#4b4b4b",
              backgroundColor: "#fff",
              opacity: 1,
              cursor: "not-allowed",
            }}
            onBlur={formik.handleBlur}
          />
        </div>

        {/* Campo que muestra la categoría del IMC */}
        <div className="item">
          <label htmlFor="categoriaIMC">Categoría IMC</label>
          <Input
            className="text"
            id="categoriaIMC"
            name="categoriaIMC"
            value={obtenerCategoriaIMC(formik.values.imc)}
            disabled={true}
            style={{
              color: "#4b4b4b",
              backgroundColor: "#fff",
              opacity: 1,
              cursor: "not-allowed",
            }}
          />
        </div>

        <div className="item">
          <label htmlFor="ultmaRegla">
            Última regla <span className="señal-req"> *</span>
          </label>
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
                formik.validateField("ultimaRegla");
              }}
              onBlur={() => formik.setFieldTouched("ultimaRegla", true)}
              renderInput={(params) => <Input {...params} />}
            />
          </LocalizationProvider>
          {formik.touched.ultimaRegla && formik.errors.ultimaRegla ? (
            <div className="requerido-msj">{formik.errors.ultimaRegla}</div>
          ) : null}
        </div>

        <div className="item">
          <label htmlFor="edadGestacional">Gestación</label>
          <Input
            className="text"
            id="edadGestacional"
            name="edadGestacional"
            value={formik.values.edadGestacional}
            disabled={true}
            style={{
              color: "#4b4b4b",
              backgroundColor: "#fff",
              opacity: 1,
              cursor: "not-allowed",
            }}
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
            onBlur={formik.handleBlur}
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
              onBlur={formik.handleBlur}
              renderInput={(params) => <Input {...params} />}
            />
          </LocalizationProvider>
        </div>
      </form>
    </div>
  );
};

export default EmbarazoActual;
