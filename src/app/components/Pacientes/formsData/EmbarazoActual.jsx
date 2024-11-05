import * as Yup from "yup";
import { useFormik } from "formik";
import { Input, Switch } from "antd";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import "dayjs/locale/es";

const EmbarazoActual = ({ mode, pacienteId, onSubmit }) => {
  const formik = useFormik({
    initialValues: {
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
      const formData = {
        pacienteId: pacienteId,
        ...values,
      };

      onSubmit(formData);
    },
  });

  const calcularEdadGestacional = () => {
    if (formik.values.fechaEmbarazo && formik.values.ultimaRegla) {
      const fechaEmbarazo = dayjs(formik.values.fechaEmbarazo);
      const ultimaRegla = dayjs(formik.values.ultimaRegla);
      const diferencia = fechaEmbarazo.diff(ultimaRegla, "week");
      formik.setFieldValue("edadGestacional", diferencia);
    }
  };

  const calcularIMC = () => {
    if (formik.values.pesoKg && formik.values.talla) {
      const alturaMetros = formik.values.talla / 100;
      const imc = (
        formik.values.pesoKg /
        (alturaMetros * alturaMetros)
      ).toFixed(1);
      formik.setFieldValue("imc", imc);
    }
  };

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <div className="item-switch">
          <label htmlFor="consumoAF">Consumo AF</label>
          <Switch
            id="consumoAF"
            name="consumoAF"
            checked={formik.values.consumoAF}
            onChange={(checked) => {
              formik.setFieldValue("consumoAF", checked);
              formik.setFieldValue("fechaInicioConsumo", null); 
              formik.submitForm();
            }}
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
                formik.submitForm();
              }}
              onBlur={formik.handleBlur}
              renderInput={(params) => <Input {...params} />}
            />
          </LocalizationProvider>
        </div>

        <div className="item">
          <label htmlFor="fechaEmb">Fecha embarazo</label>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
            <DatePicker
              id="fechaEmb"
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
                formik.submitForm();
              }}
              onBlur={formik.handleBlur}
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
                formik.submitForm();
              }}
              onBlur={formik.handleBlur}
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
          <label htmlFor="pesoKg">Peso (kg)</label>
          <Input
            placeholder="valor"
            className="value"
            id="pesoKg"
            type="number"
            name="pesoKg"
            onChange={(data) => {
              const value = data.target.value ? Number(data.target.value) : 0;
              formik.setFieldValue("pesoKg", value);
              calcularIMC();
              if (value > 0) {
                formik.submitForm();
              }
            }}
            value={formik.values.pesoKg}
            onBlur={formik.handleBlur}
          />
          {formik.touched.pesoKg && formik.errors.pesoKg ? (
            <div className="requerido" style={{ color: "red" }}>
              {formik.errors.pesoKg}
            </div>
          ) : null}
        </div>

        <div className="item">
          <label htmlFor="talla">Talla (cm)</label>
          <Input
            placeholder="valor"
            className="value"
            id="talla"
            type="number"
            name="talla"
            onChange={(data) => {
              const value = data.target.value ? Number(data.target.value) : 0;
              formik.setFieldValue("talla", value);
              calcularIMC();
              if (value > 0) {
                formik.submitForm();
              }
            }}
            value={formik.values.talla}
            onBlur={formik.handleBlur}
          />
          {formik.touched.talla && formik.errors.talla ? (
            <div className="requerido" style={{ color: "red" }}>
              {formik.errors.talla}
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
          />
        </div>
        <div className="item">
          <label htmlFor="edadGestacional">Edad Gesta(sem):</label>
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
          />
        </div>
      </form>
    </div>
  );
};

export default EmbarazoActual;
