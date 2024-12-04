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

import { malformacionesBronco, estomago } from "./DataSurgerisObject2";
dayjs.locale("es");
dayjs.extend(utc);

const { Option } = Select;

const CirugiaNeonatalForm = ({
  onSubmit,
  mode,
  initialValues,
  confirmButton,
  setShowCirugiaForm,
}) => {
  const { metadata } = useAuth();

  const formik = useFormik({
    initialValues: {
      cirugiaId: null,
      minimaInvasion: false,
      cirugiaConvencional: false,
      malformacionesBroncoPulmonares: false,
      enfisemaLobarCongenito: false,
      lesionesQuisticasDupliacionEsesofagicas: false,
      atresiaEsofagica: false,
      herniaDiafragmatica: false,
      estomago: false,
      estenosisAtresiaDuodenal: false,
      estenosisAtresiaIntestinales: false,
      malRotacionIntestinal: false,
      enfermedadMeconial: false,
      enterocolitisNecrotizante: false,
      enfermedadDeHirschsprung: false,
      defectosParedAbdominalGastrosquisis: false,
      defectosParedabdominalOnfalocele: false,
      tumorDeOvario: false,
      Otros: "",
    },
    onSubmit: (values) => {
      const formData = {
        ...values,
        cirugiaId:
          mode === "isEditMode" && formik.values.cirugiaId
            ? formik.values.cirugiaId
            : undefined,
      };

      onSubmit(formData);
    },
  });

  // Sincronizar valores cuando initialValues cambian
  useEffect(() => {
    if (initialValues !== null) {
      console.log(initialValues);
      if (mode === "isEditMode") {
        formik.setValues({
          cirugiaId: initialValues?.cirugiaId,
          minimaInvasion: initialValues?.minimaInvasion,
          cirugiaConvencional: initialValues?.cirugiaConvencional,
          malformacionesBroncoPulmonares:
            initialValues?.malformacionesBroncoPulmonares,
          enfisemaLobarCongenito: initialValues?.enfisemaLobarCongenito,
          lesionesQuisticasDupliacionEsesofagicas:
            initialValues?.lesionesQuisticasDupliacionEsesofagicas,
          atresiaEsofagica: initialValues?.atresiaEsofagica,
          herniaDiafragmatica: initialValues?.herniaDiafragmatica,
          estomago: initialValues?.estomago,
          estenosisAtresiaDuodenal: initialValues?.estenosisAtresiaDuodenal,
          estenosisAtresiaIntestinales:
            initialValues?.estenosisAtresiaIntestinales,
          malRotacionIntestinal: initialValues?.malRotacionIntestinal,
          enfermedadMeconial: initialValues?.enfermedadMeconial,
          enterocolitisNecrotizante: initialValues?.enterocolitisNecrotizante,
          enfermedadDeHirschsprung: initialValues?.enfermedadDeHirschsprung,
          defectosParedAbdominalGastrosquisis:
            initialValues?.defectosParedAbdominalGastrosquisis,
          defectosParedabdominalOnfalocele:
            initialValues?.defectosParedabdominalOnfalocele,
          tumorDeOvario: initialValues?.tumorDeOvario,
          Otros: initialValues?.Otros,
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
        <label htmlFor="malformacionesBroncoPulmonares">
          Malformaciones pulmonares: <span className="señal-req"> *</span>
        </label>
        <Select
          className="select-rg"
          placeholder="Seleccione..."
          id="malformacionesBroncoPulmonares"
          name="malformacionesBroncoPulmonares"
          value={formik?.values?.malformacionesBroncoPulmonares || undefined}
          onChange={(value) =>
            formik.setFieldValue("malformacionesBroncoPulmonares", value)
          }
          onBlur={() =>
            formik.setFieldTouched("malformacionesBroncoPulmonares", true)
          }
        >
          {malformacionesBronco.map((option) => (
            <Option key={option} value={option}>
              {option}
            </Option>
          ))}
        </Select>
      </div>
      <div className="item">
        <label htmlFor="estomago">
          Estomago: <span className="señal-req"> *</span>
        </label>
        <Select
          className="select-rg"
          placeholder="Seleccione..."
          id="estomago"
          name="estomago"
          value={formik?.values?.estomago || undefined}
          onChange={(value) => formik.setFieldValue("estomago", value)}
          onBlur={() => formik.setFieldTouched("estomago", true)}
        >
          {estomago.map((option) => (
            <Option key={option} value={option}>
              {option}
            </Option>
          ))}
        </Select>
      </div>
      <div className="item-switch">
        <label htmlFor="cirugiaConvencional">Cirugía Convencional :</label>
        <Switch
          checked={formik.values.cirugiaConvencional}
          onChange={(checked) => {
            formik.setFieldValue("cirugiaConvencional", checked);
            formik.setFieldTouched("cirugiaConvencional", true);
          }}
        />
      </div>
      <div className="item-switch">
        <label htmlFor="enfisemaLobarCongenito">
          Enfisema Lobar Congénito :
        </label>
        <Switch
          checked={formik.values.enfisemaLobarCongenito}
          onChange={(checked) => {
            formik.setFieldValue("enfisemaLobarCongenito", checked);
            formik.setFieldTouched("enfisemaLobarCongenito", true);
          }}
        />
      </div>
      <div className="item-switch">
        <label htmlFor="lesionesQuisticasDupliacionEsesofagicas">
          Duplicaciones esofágicas:
        </label>
        <Switch
          checked={formik.values.lesionesQuisticasDupliacionEsesofagicas}
          onChange={(checked) => {
            formik.setFieldValue(
              "lesionesQuisticasDupliacionEsesofagicas",
              checked
            );
            formik.setFieldTouched(
              "lesionesQuisticasDupliacionEsesofagicas",
              true
            );
          }}
        />
      </div>
      <div className="item-switch">
        <label htmlFor="herniaDiafragmatica">Hernia Diafragmática :</label>
        <Switch
          checked={formik.values.herniaDiafragmatica}
          onChange={(checked) => {
            formik.setFieldValue("herniaDiafragmatica", checked);
            formik.setFieldTouched("herniaDiafragmatica", true);
          }}
        />
      </div>
      <div className="item-switch">
        <label htmlFor="estenosisAtresiaDuodenal">
          Estenosis / Atresia Duodenal :
        </label>
        <Switch
          checked={formik.values.estenosisAtresiaDuodenal}
          onChange={(checked) => {
            formik.setFieldValue("estenosisAtresiaDuodenal", checked);
            formik.setFieldTouched("estenosisAtresiaDuodenal", true);
          }}
        />
      </div>
      <div className="item-switch">
        <label htmlFor="estenosisAtresiaIntestinales">
          Estenosis / Atresia Intestinales :
        </label>
        <Switch
          checked={formik.values.estenosisAtresiaIntestinales}
          onChange={(checked) => {
            formik.setFieldValue("estenosisAtresiaIntestinales", checked);
            formik.setFieldTouched("estenosisAtresiaIntestinales", true);
          }}
        />
      </div>
      <div className="item-switch">
        <label htmlFor="malRotacionIntestinal">Malrotación Intestinal :</label>
        <Switch
          checked={formik.values.malRotacionIntestinal}
          onChange={(checked) => {
            formik.setFieldValue("malRotacionIntestinal", checked);
            formik.setFieldTouched("malRotacionIntestinal", true);
          }}
        />
      </div>
      <div className="item-switch">
        <label htmlFor="enfermedadMeconial">Enfermedad Meconial :</label>
        <Switch
          checked={formik.values.enfermedadMeconial}
          onChange={(checked) => {
            formik.setFieldValue("enfermedadMeconial", checked);
            formik.setFieldTouched("enfermedadMeconial", true);
          }}
        />
      </div>
      <div className="item-switch">
        <label htmlFor="enterocolitisNecrotizante">
          Enterocolitis Necrotizante :
        </label>
        <Switch
          checked={formik.values.enterocolitisNecrotizante}
          onChange={(checked) => {
            formik.setFieldValue("enterocolitisNecrotizante", checked);
            formik.setFieldTouched("enterocolitisNecrotizante", true);
          }}
        />
      </div>
      <div className="item-switch">
        <label htmlFor="enfermedadDeHirschsprung">
          Enfermedad de Hirschsprung :
        </label>
        <Switch
          checked={formik.values.enfermedadDeHirschsprung}
          onChange={(checked) => {
            formik.setFieldValue("enfermedadDeHirschsprung", checked);
            formik.setFieldTouched("enfermedadDeHirschsprung", true);
          }}
        />
      </div>
      <div className="item-switch">
        <label htmlFor="defectosParedAbdominalGastrosquisis">
          Defectos de Pared Abdominal:
        </label>
        <Switch
          checked={formik.values.defectosParedAbdominalGastrosquisis}
          onChange={(checked) => {
            formik.setFieldValue(
              "defectosParedAbdominalGastrosquisis",
              checked
            );
            formik.setFieldTouched("defectosParedAbdominalGastrosquisis", true);
          }}
        />
      </div>
      <div className="item-switch">
        <label htmlFor="defectosParedabdominalOnfalocele">
          Defectos de Pared Abdominal:
        </label>
        <Switch
          checked={formik.values.defectosParedabdominalOnfalocele}
          onChange={(checked) => {
            formik.setFieldValue("defectosParedabdominalOnfalocele", checked);
            formik.setFieldTouched("defectosParedabdominalOnfalocele", true);
          }}
        />
      </div>
      <div className="item-switch">
        <label htmlFor="tumorDeOvario">Tumor de Ovario :</label>
        <Switch
          checked={formik.values.tumorDeOvario}
          onChange={(checked) => {
            formik.setFieldValue("tumorDeOvario", checked);
            formik.setFieldTouched("tumorDeOvario", true);
          }}
        />
      </div>
      <div className="item-switch">
        <label htmlFor="minimaInvasion">Mínima Invasión :</label>
        <Switch
          checked={formik.values.minimaInvasion}
          onChange={(checked) => {
            formik.setFieldValue("minimaInvasion", checked);
            formik.setFieldTouched("minimaInvasion", true);
          }}
        />
      </div>
      <div className="item-switch">
        <label htmlFor="atresiaEsofagica">Atresia esofágica:</label>
        <Switch
          checked={formik.values.atresiaEsofagica}
          onChange={(checked) => {
            formik.setFieldValue("atresiaEsofagica", checked);
            formik.setFieldTouched("atresiaEsofagica", true);
          }}
        />
      </div>
      {/* Campo de Complicaciones */}
      <div className="item">
        <label htmlFor="Otros">Otros</label>
        <Input.TextArea
          rows={1}
          className="textarea-md"
          id="Otros"
          name="Otros"
          value={formik.values.Otros || ""}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.Otros && formik.errors.Otros && (
          <div className="requerido" style={{ color: "red" }}>
            {formik.errors.Otros}
          </div>
        )}
      </div>
    </form>
  );
};

export default CirugiaNeonatalForm;
