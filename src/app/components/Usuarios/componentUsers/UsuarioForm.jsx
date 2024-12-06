import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { Select, Input } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { useAuth } from "@/app/hooks/authContext";
import dayjs from "dayjs";
import "dayjs/locale/es";

import { Roles } from "./datausers";

dayjs.locale("es");
const { Option } = Select;

const UsuarioForm = ({
  onSubmit,
  mode,
  initialValues,
  confirmButton,
  setShowCirugiaForm,
}) => {
  const { metadata } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  // Formik setup
  const formik = useFormik({
    initialValues: {
      rolId: initialValues?.rol?.id || null,
      nombreYApellido: initialValues?.nombreYApellido || "",
      telefono: initialValues?.telefono || "",
      contrasena: "",
    },
    onSubmit: (values) => {
      const formData = {
        ...values,
        ...(mode === "isEditMode" && initialValues?.id != null
          ? { id: initialValues.id }
          : {}),
        ...(mode === "isEditMode" && !values.contrasena
          ? { contrasena: undefined }
          : {}),
      };

      onSubmit(formData);
    },
  });

  useEffect(() => {
    if (initialValues !== null) {
      if (mode === "isEditMode") {
        formik.setValues({
          id: initialValues?.id || null,
          rolId: initialValues?.rol?.id === 1 ? null : initialValues?.rol?.id,
          nombreYApellido: initialValues.nombreYApellido,
          telefono: initialValues?.telefono || "",
        });
      }
    }
  }, [initialValues, mode]);

  useEffect(() => {
    if (confirmButton) {
      formik.submitForm();
    }
  }, [confirmButton]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="item">
        <label htmlFor="rolId">
          Rol: <span className="señal-req"> *</span>
        </label>
        {formik.values.rolId === 1 ? (
          <Input
            value="Developer"
            disabled
            className="select"
            id="rolId"
            name="rolId"
          />
        ) : (
          <Select
            className="select"
            placeholder="Seleccione..."
            id="rolId"
            name="rolId"
            value={
              Roles.find((role) => role.id === formik.values.rolId)?.id ||
              undefined
            }
            onChange={(value) => formik.setFieldValue("rolId", value)}
            onBlur={() => formik.setFieldTouched("rolId", true)}
          >
            {Roles.filter((role) => role.name !== "Developer").map((role) => (
              <Option key={role.id} value={role.id}>
                {role.name}
              </Option>
            ))}
          </Select>
        )}
      </div>

      <div className="item">
        <label htmlFor="nombreYApellido">
          Nombre y Apellido: <span className="señal-req"> *</span>
        </label>
        <Input
          className="md-medium"
          id="nombreYApellido"
          name="nombreYApellido"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.nombreYApellido}
          onBlur={formik.handleBlur}
          disabled={formik.values.rolId === 1}
        />
      </div>

      <div className="item">
        <label htmlFor="telefono">
          Teléfono: <span className="señal-req"> *</span>
        </label>
        <Input
          className="text"
          id="telefono"
          name="telefono"
          type="text"
          onChange={(e) => {
            // Solo actualiza el teléfono si el valor ha cambiado
            if (e.target.value !== initialValues.telefono) {
              formik.setFieldValue("telefono", e.target.value);
            }
          }}
          value={formik.values.telefono}
          onBlur={formik.handleBlur}
          disabled={formik.values.rolId === 1}
        />
      </div>

      {formik.values.rolId !== 1 && (
        <div className="item">
          <label htmlFor="contrasena">
            Contraseña: <span className="señal-req"> *</span>
          </label>
          <Input
            placeholder={mode === "isCreateMode" ? "Nueva" : "Cambiar"}
            className="text"
            id="contrasena"
            name="contrasena"
            type={showPassword ? "text" : "password"}
            onChange={formik.handleChange}
            value={formik.values.contrasena}
            onBlur={formik.handleBlur}
            suffix={
              showPassword ? (
                <EyeTwoTone onClick={togglePasswordVisibility} />
              ) : (
                <EyeInvisibleOutlined onClick={togglePasswordVisibility} />
              )
            }
          />
        </div>
      )}
    </form>
  );
};

export default UsuarioForm;
