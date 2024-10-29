import * as Yup from "yup";
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import { Input, Switch } from "antd";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import "dayjs/locale/es";

const EmbarazoActual = ({ mode, data, pacienteId, onSubmit }) => {
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
      pesoKg: Yup.number().required("*Requerido"),
      talla: Yup.number().required("*Requerido"),
    }),
    onSubmit: (values) => {
      const formData = {
        pacienteId: pacienteId,
        ...values,
      };

      onSubmit(formData);
    },
  });

  return (
    <div>
      <form></form>
    </div>
  );
};
export default EmbarazoActual;
