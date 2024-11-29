import React, { useEffect } from "react";
import { useFormik } from "formik";
import { Select, Input, Switch } from "antd";
import { useAuth } from "@/app/hooks/authContext";

const { Option } = Select;

const DiagnosticoPrenatalForm = ({
  onSubmit,
  mode,
  initialValues,
  confirmButton,
}) => {
  const { metadata } = useAuth();

  const formik = useFormik({
    initialValues: {
      cirugiaIntraId: null,
      categoriaId: null,
      tipoDefectoId: null,
      tipoCirugiaRealizada: "",
      estudioGen: false,
      resultadoEstGen: "",
      tipoEmbarazo: "",
    },
    onSubmit: (values) => {
      const formData = {
        cirugiaIntraId:
          mode === "isEditMode" ? formik.values.cirugiaIntraId || null : null,
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
          cirugiaIntraId: initialValues.cirugiaIntraId || null,
          categoriaId: initialValues.categoriaId || null,
          tipoDefectoId: initialValues.tipoDefectoId || null,
          tipoCirugiaRealizada: initialValues.tipoCirugiaRealizada || "",
          estudioGen: initialValues.estudioGen || false,
          resultadoEstGen: initialValues.resultadoEstGen || "",
          tipoEmbarazo: initialValues.tipoEmbarazo || "",
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
      {/* Campo de Categoría */}
      <div className="item">
        <label htmlFor="categoria">
          Categoría: <span className="señal-req"> *</span>
        </label>
        <Select
          className="select-lg"
          placeholder="Seleccione la categoría"
          id="categoria"
          name="categoria"
          value={formik?.values?.categoriaId || undefined}
          onChange={(value) => formik.setFieldValue("categoriaId", value)}
          onBlur={handleFieldBlur}
        >
          {metadata.categorias.map((cat) => (
            <Select.Option key={cat.id} value={cat.id}>
              {cat.opcion}
            </Select.Option>
          ))}
        </Select>
      </div>

      {/* Campo de tipo de Defecto */}
      <div className="item">
        <label htmlFor="defecto">
          Tipo de defecto: <span className="señal-req"> *</span>
        </label>
        <Select
          className="select-md"
          placeholder="Seleccione el tipo de defecto."
          id="defecto"
          name="defecto"
          value={formik?.values?.tipoDefectoId || undefined}
          onChange={(value) => formik.setFieldValue("tipoDefectoId", value)}
          onBlur={handleFieldBlur}
        >
          {metadata.tipoDefectos.map((def) => (
            <Select.Option key={def.id} value={def.id}>
              {def.nombreDefecto}
            </Select.Option>
          ))}
        </Select>
      </div>

      {/* Campo de Tipo de Cirugía */}
      <div className="item">
        <label htmlFor="tipoEmbarazo">
          Embarazo: <span className="señal-req"> *</span>
        </label>
        <Select
          className="select"
          placeholder="Seleccione..."
          id="tipoEmbarazo"
          name="tipoEmbarazo"
          value={formik?.values?.tipoEmbarazo || undefined}
          onChange={(value) => formik.setFieldValue("tipoEmbarazo", value)}
          onBlur={() => formik.setFieldTouched("tipoEmbarazo", true)}
        >
          <Option value="Único">Único</Option>
          <Option value="Gemelos">Gemelos</Option>
          <Option value="Triple">Triple</Option>
        </Select>
      </div>

      {/* Campo de Resultados genéticos */}
      <div className="item-switch">
        <label htmlFor="estudioGen">Estudio genético</label>
        <Switch
          checked={formik.values.estudioGen}
          onChange={(checked) => {
            formik.setFieldValue("estudioGen", checked);
            formik.setFieldTouched("estudioGen", true);
          }}
        />
      </div>

      {/* Campo de Resultados geneticos */}
      <div className="item">
        <label htmlFor="resultadoEstGen">Resultados estudios geneticos</label>
        <Input.TextArea
          rows={1}
          className="textarea-lg"
          id="resultadoEstGen"
          name="resultadoEstGen"
          value={formik.values.resultadoEstGen || ""}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
      </div>
    </form>
  );
};

export default DiagnosticoPrenatalForm;
