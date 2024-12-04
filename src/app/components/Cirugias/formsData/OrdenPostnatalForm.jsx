import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Select, Input } from "antd";
import { useAuth } from "@/app/hooks/authContext";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import "dayjs/locale/es";
import utc from "dayjs/plugin/utc";

const { Option } = Select;
dayjs.locale("es");
dayjs.extend(utc);

const OrdenPosnatalForm = ({
  onSubmit,
  mode,
  initialValues,
  confirmButton,
  setShowCirugiaForms,
  showCirugiaForm,
}) => {
  const { patients, user } = useAuth();
  const [selectedCirugia, setSelectedCirugia] = useState("");

  const formik = useFormik({
    initialValues: {
      pacienteId: null,
      doctorId: null,
      tipoCirugia: "",
      estado: undefined,
      fechaDeIntervencion: null,
    },
    validationSchema: Yup.object({
      tipoCirugia: Yup.string().required("*Requerido"),
      pacienteId: Yup.string().required("*Requerido"),
    }),
    onSubmit: (values) => {
      const { expediente, paciente, fechaDeCreacion, ...formData } = values;

      // Agregar el id con spread
      const finalData = {
        ...formData,
        pacienteId:
          mode === "isEditMode" && initialValues?.pacienteId
            ? initialValues.pacienteId
            : formik.values.pacienteId,
        doctorId:
          mode === "isEditMode" && initialValues?.doctorId
            ? initialValues?.doctorId
            : user?.id,
        fechaDeIntervencion: values.fechaDeIntervencion
          ? dayjs(values.fechaDeIntervencion).toISOString()
          : null,
      };

      onSubmit(finalData);
    },
  });

  // Sincronizar valores cuando initialValues cambian
  useEffect(() => {
    if (mode === "isEditMode" && initialValues) {
      formik.setValues({
        id: initialValues?.id,
        pacienteId: initialValues.pacienteId,
        fechaDeCreacion: initialValues.fechaDeCreacion,
        doctorId: initialValues.doctorId,
        tipoCirugia: initialValues.tipoCirugia,
        estado: initialValues.estado,
        fechaDeIntervencion: initialValues.fechaDeCreacion,
      });

      if (initialValues.pacienteId) {
        const pacienteEncontrado = patients.find(
          (paciente) => paciente.id === initialValues.pacienteId
        );
        if (pacienteEncontrado) {
          formik.setFieldValue(
            "expediente",
            pacienteEncontrado.numeroExpediente
          );
          formik.setFieldValue(
            "paciente",
            `${pacienteEncontrado.primerNombre} ${pacienteEncontrado.segundoNombre} ${pacienteEncontrado.primerApellido} ${pacienteEncontrado.segundoApellido}`
          );
        }
      }
    }
  }, [initialValues, mode, patients]);

  useEffect(() => {
    if (confirmButton) {
      formik.submitForm();
    }
  }, [confirmButton]);

  useEffect(() => {
    if (showCirugiaForm) {
      if (mode === "isCreateMode") {
        if (
          selectedCirugia === "Nervioso Central" &&
          !showCirugiaForm.nerviosoCentral
        ) {
          setShowCirugiaForms({
            nerviosoCentral: true,
            neonatal: false,
          });
        } else if (
          selectedCirugia === "Neonatal" &&
          !showCirugiaForm.neonatal
        ) {
          setShowCirugiaForms({
            nerviosoCentral: false,
            neonatal: true,
          });
        }
      }
    }
  }, [selectedCirugia, showCirugiaForm, setShowCirugiaForms]);

  useEffect(() => {
    if (mode === "isEditMode" && initialValues) {
      if (
        initialValues?.tipoCirugia === "Nervioso Central" &&
        !showCirugiaForm.nerviosoCentral
      ) {
        setShowCirugiaForms({
          nerviosoCentral: true,
          neonatal: false,
        });
      } else if (
        initialValues?.tipoCirugia === "Neonatal" &&
        !showCirugiaForm.neonatal
      ) {
        setShowCirugiaForms({
          nerviosoCentral: true,
          neonatal: false,
        });
      }
    }
  }, [selectedCirugia, initialValues]);

  const handleSelectChange = (value) => {
    setSelectedCirugia(value);
    formik.setFieldValue("tipoCirugia", value);
  };

  // Manejador para cambiar el expediente
  const handlePaciente = (e) => {
    const expediente = e.target.value;
    const pacienteEncontrado = patients.find(
      (paciente) => paciente.numeroExpediente === expediente
    );

    if (pacienteEncontrado) {
      formik.setFieldValue("pacienteId", pacienteEncontrado.id);
      formik.setFieldValue(
        "paciente",
        `${pacienteEncontrado.primerNombre} ${pacienteEncontrado.segundoNombre} ${pacienteEncontrado.primerApellido} ${pacienteEncontrado.segundoApellido}`
      );
    } else {
      formik.setFieldValue("pacienteId", "");
      formik.setFieldValue("paciente", expediente ? "No existe" : "");
    }
    formik.setFieldValue("expediente", expediente);
  };

  const handleFieldBlur = (e) => {
    formik.handleBlur(e);
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="item">
        <label htmlFor="fechaDeIntervencion">
          Fecha de Intervención:
          <span className="señal-req"> *</span>
        </label>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
          <DatePicker
            id="fechaDeIntervencion"
            name="fechaDeIntervencion"
            className="calendar"
            value={
              formik.values.fechaDeIntervencion
                ? dayjs(formik.values.fechaDeIntervencion)
                : null
            }
            onChange={(date) => {
              formik.setFieldValue("fechaDeIntervencion", date);
            }}
            onBlur={handleFieldBlur}
          />
        </LocalizationProvider>
      </div>

      {/* Campo de Expediente */}
      <div className="item">
        <label htmlFor="expediente">
          Expediente: <span className="señal-req"> *</span>
        </label>
        <Input
          type="number"
          className="text"
          id="expediente"
          name="expediente"
          value={formik.values.expediente}
          onChange={handlePaciente}
          onBlur={formik.handleBlur}
        />
      </div>

      {/* Campo de Paciente */}
      <div className="item">
        <label htmlFor="paciente">Paciente</label>
        <Input
          className="textarea"
          id="paciente"
          name="paciente"
          disabled={true}
          value={formik.values.paciente}
          style={{
            color: "#4b4b4b",
            backgroundColor: "#fff",
            opacity: 1,
            cursor: "not-allowed",
          }}
        />
      </div>

      {/* Campo de Tipo de Cirugía */}
      <div className="item">
        <label htmlFor="tipoCirugia">
          Cirugía: <span className="señal-req"> *</span>
        </label>
        {mode === "isEditMode" ? (
          // Modo de edición, solo mostrar el valor seleccionado, sin opción de cambiar
          <Input
            className="text"
            id="tipoCirugia"
            name="tipoCirugia"
            value={formik.values.tipoCirugia || "Seleccionar..."}
            disabled={true}
            style={{
              color: "#4b4b4b",
              backgroundColor: "#fff",
              opacity: 1,
              cursor: "not-allowed",
            }}
          />
        ) : (
          // Modo de creación, permitir selección
          <Select
            className="select"
            placeholder="Seleccione..."
            id="tipoCirugia"
            name="tipoCirugia"
            value={formik?.values?.tipoCirugia || undefined}
            onChange={handleSelectChange}
            onBlur={() => formik.setFieldTouched("tipoCirugia", true)}
          >
            <Option value="Nervioso Central">Nervioso Central</Option>
            <Option value="Neonatal">Neonatal</Option>
          </Select>
        )}

        {formik.touched.tipoCirugia && formik.errors.tipoCirugia && (
          <div className="requerido" style={{ color: "red" }}>
            {formik.errors.tipoCirugia}
          </div>
        )}
      </div>

      {/* Campo de Estado */}
      <div className="item">
        <label htmlFor="estado">
          Estado: <span className="señal-req"> *</span>
        </label>
        <Select
          placeholder="Seleccione..."
          id="estado"
          name="estado"
          value={
            formik.values.estado !== undefined
              ? formik.values.estado
                ? "Activa"
                : "Finalizada"
              : undefined
          }
          onChange={(value) =>
            formik.setFieldValue("estado", value === "Activa")
          }
          onBlur={() => formik.setFieldTouched("estado", true)}
        >
          <Option value="Activa">Activa</Option>
          <Option value="Finalizada">Finalizada</Option>
        </Select>
        {formik.touched.estado && formik.errors.estado && (
          <div className="requerido" style={{ color: "red" }}>
            {formik.errors.estado}
          </div>
        )}
      </div>
    </form>
  );
};

export default OrdenPosnatalForm;
