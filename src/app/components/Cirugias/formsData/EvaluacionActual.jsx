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

const EvaluacionActual = ({ onSubmit, mode, initialValues, confirmButton }) => {
  const { metadata } = useAuth();

  const formik = useFormik({
    initialValues: {
      ordenQuirurgicaId: null,
      tipoDiabetesId: null,
      lupusEritematosoSist: false,
      obesidad: false,
      hipertension: false,
      sindromeAntifosfo: false,
      cardiopatias: false,
      artritis: false,
      hipotiroidismo: false,
      hipertiroidismo: false,
      trombofilia: false,
      epilepsia: false,
      observaciones: false,
    },
    onSubmit: (values) => {
      const formData = {
        ...values,
        ordenQuirurgicaId:
          mode === "isEditMode"
            ? formik.values.ordenQuirurgicaId || null
            : null,
      };

      onSubmit(formData);
    },
  });

  // Sincronizar valores cuando initialValues cambian
  useEffect(() => {
    if (initialValues !== null) {
      if (mode === "isEditMode") {
        formik.setValues({
          ordenQuirurgicaId: initialValues?.ordenQuirurgicaId,
          tipoDiabetesId: initialValues?.tipoDiabetesId,
          lupusEritematosoSist: initialValues?.lupusEritematosoSist,
          obesidad: initialValues?.obesidad,
          hipertension: initialValues?.hipertension,
          sindromeAntifosfo: initialValues?.sindromeAntifosfo,
          cardiopatias: initialValues?.cardiopatias,
          artritis: initialValues?.artritis,
          hipotiroidismo: initialValues?.hipotiroidismo,
          hipertiroidismo: initialValues?.hipertiroidismo,
          trombofilia: initialValues?.trombofilia,
          epilepsia: initialValues?.epilepsia,
          observaciones: initialValues?.observaciones,
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
      <div className="item-switch">
        <label htmlFor="lupusEritematosoSist">
          Laser anastomosis placentaria:
        </label>
        <Switch
          checked={formik.values.lupusEritematosoSist}
          onChange={(checked) => {
            formik.setFieldValue("lupusEritematosoSist", checked);
            formik.setFieldTouched("lupusEritematosoSist", true);
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

export default EvaluacionActual;
