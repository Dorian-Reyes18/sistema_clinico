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

const CirugiaNerviosoCentralForm = ({
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
      mielomeningocele: false,
      meningocele: false,
      raquisquisis: false,
      mieloquisis: false,
      mielocistocele: false,
      lipomielomeningocele: false,
      cierreReconstruccionTuboNeural: false,
      senoDermico: false,
      lipomaIntramedularSacro: false,
      diasteamtomelia: false,
      dilomielia: false,
      colaDeFauno: false,
      medulaAnclada: false,
      cierreReconstruccionEncefalocele: false,
      quisteNeuroenterico: false,
      cierreReconsCranioraquisquisis: false,
      colocacionSistemasDerivativosProte: false,
      endoscopiaTranscraneal: false,
      lavadoVentricularEndoscopico: false,
      puncionTranscraneal: false,
      colocacionDeVentriculostomia: false,
      LavadoVentricularTranscraneal: false,
      derivacionSubduralExterna: false,
      derivacionSubDuroperiotoneal: false,
      reseccionQuistesAracnoideos: false,
      fenestracionDeQuistes: false,
      derivacionQuiste: false,
      reseccionTumoresCongenitos: false,
      derivacionSubDuroperiotonealBilateral: false,
      otros: "",
    },
    onSubmit: (values) => {
      const formData = {
        ...values,
        ...(mode === "isEditMode" && initialValues?.id != null
          ? { id: initialValues.id }
          : {}),
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
      if (mode === "isEditMode") {
        formik.setValues({
          id: initialValues?.id,
          cirugiaId: initialValues?.cirugiaId,
          mielomeningocele: initialValues?.mielomeningocele,
          meningocele: initialValues?.meningocele,
          raquisquisis: initialValues?.raquisquisis,
          mieloquisis: initialValues?.mieloquisis,
          lipomielomeningocele: initialValues?.lipomielomeningocele,
          mielocistocele: initialValues?.mielocistocele,
          cierreReconstruccionTuboNeural:
            initialValues?.cierreReconstruccionTuboNeural,
          senoDermico: initialValues?.senoDermico,
          lipomaIntramedularSacro: initialValues?.lipomaIntramedularSacro,
          diasteamtomelia: initialValues?.diasteamtomelia,
          dilomielia: initialValues?.dilomielia,
          colaDeFauno: initialValues?.colaDeFauno,
          medulaAnclada: initialValues?.medulaAnclada,
          cierreReconstruccionEncefalocele:
            initialValues?.cierreReconstruccionEncefalocele,
          quisteNeuroenterico: initialValues?.quisteNeuroenterico,
          cierreReconsCranioraquisquisis:
            initialValues?.cierreReconsCranioraquisquisis,
          colocacionSistemasDerivativosProte:
            initialValues?.colocacionSistemasDerivativosProte,
          endoscopiaTranscraneal: initialValues?.endoscopiaTranscraneal,
          lavadoVentricularEndoscopico:
            initialValues?.lavadoVentricularEndoscopico,
          puncionTranscraneal: initialValues?.puncionTranscraneal,
          colocacionDeVentriculostomia:
            initialValues?.colocacionDeVentriculostomia,
          LavadoVentricularTranscraneal:
            initialValues?.LavadoVentricularTranscraneal,
          derivacionSubduralExterna: initialValues?.derivacionSubduralExterna,
          derivacionSubDuroperiotoneal:
            initialValues?.derivacionSubDuroperiotoneal,
          reseccionQuistesAracnoideos:
            initialValues?.reseccionQuistesAracnoideos,
          fenestracionDeQuistes: initialValues?.fenestracionDeQuistes,
          derivacionQuiste: initialValues?.derivacionQuiste,
          reseccionTumoresCongenitos: initialValues?.reseccionTumoresCongenitos,
          derivacionSubDuroperiotonealBilateral:
            initialValues?.derivacionSubDuroperiotonealBilateral,
          otros: initialValues?.otros,
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
        <label htmlFor="mielomeningocele">Mielomeningocele:</label>
        <Switch
          checked={formik.values.mielomeningocele}
          onChange={(checked) => {
            formik.setFieldValue("mielomeningocele", checked);
            formik.setFieldTouched("mielomeningocele", true);
          }}
        />
      </div>
      <div className="item-switch">
        <label htmlFor="meningocele">Meningocele:</label>
        <Switch
          checked={formik.values.meningocele}
          onChange={(checked) => {
            formik.setFieldValue("meningocele", checked);
            formik.setFieldTouched("meningocele", true);
          }}
        />
      </div>
      <div className="item-switch">
        <label htmlFor="raquisquisis">Raquisquisis:</label>
        <Switch
          checked={formik.values.raquisquisis}
          onChange={(checked) => {
            formik.setFieldValue("raquisquisis", checked);
            formik.setFieldTouched("raquisquisis", true);
          }}
        />
      </div>
      <div className="item-switch">
        <label htmlFor="mieloquisis">Mieloquisis:</label>
        <Switch
          checked={formik.values.mieloquisis}
          onChange={(checked) => {
            formik.setFieldValue("mieloquisis", checked);
            formik.setFieldTouched("mieloquisis", true);
          }}
        />
      </div>
      <div className="item-switch">
        <label htmlFor="mielocistocele">Mielocistocele:</label>
        <Switch
          checked={formik.values.mielocistocele}
          onChange={(checked) => {
            formik.setFieldValue("mielocistocele", checked);
            formik.setFieldTouched("mielocistocele", true);
          }}
        />
      </div>

      <div className="item-switch">
        <label htmlFor="senoDermico">Seno dérmico:</label>
        <Switch
          checked={formik.values.senoDermico}
          onChange={(checked) => {
            formik.setFieldValue("senoDermico", checked);
            formik.setFieldTouched("senoDermico", true);
          }}
        />
      </div>
      <div className="item-switch">
        <label htmlFor="diasteamtomelia">Diasteamtomelia:</label>
        <Switch
          checked={formik.values.diasteamtomelia}
          onChange={(checked) => {
            formik.setFieldValue("diasteamtomelia", checked);
            formik.setFieldTouched("diasteamtomelia", true);
          }}
        />
      </div>
      <div className="item-switch">
        <label htmlFor="dilomielia">Dilomielia:</label>
        <Switch
          checked={formik.values.dilomielia}
          onChange={(checked) => {
            formik.setFieldValue("dilomielia", checked);
            formik.setFieldTouched("dilomielia", true);
          }}
        />
      </div>
      <div className="item-switch">
        <label htmlFor="colaDeFauno">Cola de fauno:</label>
        <Switch
          checked={formik.values.colaDeFauno}
          onChange={(checked) => {
            formik.setFieldValue("colaDeFauno", checked);
            formik.setFieldTouched("colaDeFauno", true);
          }}
        />
      </div>
      <div className="item-switch">
        <label htmlFor="medulaAnclada">Médula anclada:</label>
        <Switch
          checked={formik.values.medulaAnclada}
          onChange={(checked) => {
            formik.setFieldValue("medulaAnclada", checked);
            formik.setFieldTouched("medulaAnclada", true);
          }}
        />
      </div>
      <div className="item-switch">
        <label htmlFor="lipomielomeningocele">Lipomielo meningocele:</label>
        <Switch
          checked={formik.values.lipomielomeningocele}
          onChange={(checked) => {
            formik.setFieldValue("lipomielomeningocele", checked);
            formik.setFieldTouched("lipomielomeningocele", true);
          }}
        />
      </div>
      <div className="item-switch">
        <label htmlFor="lipomaIntramedularSacro">
          Lipoma intramedular sacro:
        </label>
        <Switch
          checked={formik.values.lipomaIntramedularSacro}
          onChange={(checked) => {
            formik.setFieldValue("lipomaIntramedularSacro", checked);
            formik.setFieldTouched("lipomaIntramedularSacro", true);
          }}
        />
      </div>
      <div className="item-switch">
        <label htmlFor="cierreReconstruccionEncefalocele">
          Cierre de encefalocele:
        </label>
        <Switch
          checked={formik.values.cierreReconstruccionEncefalocele}
          onChange={(checked) => {
            formik.setFieldValue("cierreReconstruccionEncefalocele", checked);
            formik.setFieldTouched("cierreReconstruccionEncefalocele", true);
          }}
        />
      </div>
      <div className="item-switch">
        <label htmlFor="cierreReconstruccionTuboNeural">
          Cierre y reconstrucc tubo neural:
        </label>
        <Switch
          checked={formik.values.cierreReconstruccionTuboNeural}
          onChange={(checked) => {
            formik.setFieldValue("cierreReconstruccionTuboNeural", checked);
            formik.setFieldTouched("cierreReconstruccionTuboNeural", true);
          }}
        />
      </div>
      <div className="item-switch">
        <label htmlFor="quisteNeuroenterico">Quiste neuroenterico:</label>
        <Switch
          checked={formik.values.quisteNeuroenterico}
          onChange={(checked) => {
            formik.setFieldValue("quisteNeuroenterico", checked);
            formik.setFieldTouched("quisteNeuroenterico", true);
          }}
        />
      </div>
      <div className="item-switch">
        <label htmlFor="cierreReconsCranioraquisquisis">
          Cierre cranioraquisquisis:
        </label>
        <Switch
          checked={formik.values.cierreReconsCranioraquisquisis}
          onChange={(checked) => {
            formik.setFieldValue("cierreReconsCranioraquisquisis", checked);
            formik.setFieldTouched("cierreReconsCranioraquisquisis", true);
          }}
        />
      </div>

      <div className="item-switch">
        <label htmlFor="endoscopiaTranscraneal">Endoscopia transcraneal:</label>
        <Switch
          checked={formik.values.endoscopiaTranscraneal}
          onChange={(checked) => {
            formik.setFieldValue("endoscopiaTranscraneal", checked);
            formik.setFieldTouched("endoscopiaTranscraneal", true);
          }}
        />
      </div>
      <div className="item-switch">
        <label htmlFor="lavadoVentricularEndoscopico">
          Lavado ventricular endoscópico:
        </label>
        <Switch
          checked={formik.values.lavadoVentricularEndoscopico}
          onChange={(checked) => {
            formik.setFieldValue("lavadoVentricularEndoscopico", checked);
            formik.setFieldTouched("lavadoVentricularEndoscopico", true);
          }}
        />
      </div>
      <div className="item-switch">
        <label htmlFor="puncionTranscraneal">Punción transcraneal:</label>
        <Switch
          checked={formik.values.puncionTranscraneal}
          onChange={(checked) => {
            formik.setFieldValue("puncionTranscraneal", checked);
            formik.setFieldTouched("puncionTranscraneal", true);
          }}
        />
      </div>
      <div className="item-switch">
        <label htmlFor="colocacionDeVentriculostomia">
          Colocación de ventriculostomía:
        </label>
        <Switch
          checked={formik.values.colocacionDeVentriculostomia}
          onChange={(checked) => {
            formik.setFieldValue("colocacionDeVentriculostomia", checked);
            formik.setFieldTouched("colocacionDeVentriculostomia", true);
          }}
        />
      </div>
      <div className="item-switch">
        <label htmlFor="LavadoVentricularTranscraneal">
          Lavado ventricular transcraneal:
        </label>
        <Switch
          checked={formik.values.LavadoVentricularTranscraneal}
          onChange={(checked) => {
            formik.setFieldValue("LavadoVentricularTranscraneal", checked);
            formik.setFieldTouched("LavadoVentricularTranscraneal", true);
          }}
        />
      </div>
      <div className="item-switch">
        <label htmlFor="derivacionSubduralExterna">
          Derivación subdural externa:
        </label>
        <Switch
          checked={formik.values.derivacionSubduralExterna}
          onChange={(checked) => {
            formik.setFieldValue("derivacionSubduralExterna", checked);
            formik.setFieldTouched("derivacionSubduralExterna", true);
          }}
        />
      </div>
      <div className="item-switch">
        <label htmlFor="derivacionSubDuroperiotoneal">
          Derivación subduro periotoneal:
        </label>
        <Switch
          checked={formik.values.derivacionSubDuroperiotoneal}
          onChange={(checked) => {
            formik.setFieldValue("derivacionSubDuroperiotoneal", checked);
            formik.setFieldTouched("derivacionSubDuroperiotoneal", true);
          }}
        />
      </div>
      <div className="item-switch">
        <label htmlFor="reseccionQuistesAracnoideos">
          Resección quistes aracnoideos:
        </label>
        <Switch
          checked={formik.values.reseccionQuistesAracnoideos}
          onChange={(checked) => {
            formik.setFieldValue("reseccionQuistesAracnoideos", checked);
            formik.setFieldTouched("reseccionQuistesAracnoideos", true);
          }}
        />
      </div>
      <div className="item-switch">
        <label htmlFor="fenestracionDeQuistes">Fenestración de quiste</label>
        <Switch
          checked={formik.values.fenestracionDeQuistes}
          onChange={(checked) => {
            formik.setFieldValue("fenestracionDeQuistes", checked);
            formik.setFieldTouched("fenestracionDeQuistes", true);
          }}
        />
      </div>
      <div className="item-switch">
        <label htmlFor="derivacionQuiste">derivación del quiste</label>
        <Switch
          checked={formik.values.derivacionQuiste}
          onChange={(checked) => {
            formik.setFieldValue("derivacionQuiste", checked);
            formik.setFieldTouched("derivacionQuiste", true);
          }}
        />
      </div>
      <div className="item-switch">
        <label htmlFor="reseccionTumoresCongenitos">
          resección tumores congénitos
        </label>
        <Switch
          checked={formik.values.reseccionTumoresCongenitos}
          onChange={(checked) => {
            formik.setFieldValue("reseccionTumoresCongenitos", checked);
            formik.setFieldTouched("reseccionTumoresCongenitos", true);
          }}
        />
      </div>
      <div className="item-switch">
        <label htmlFor="colocacionSistemasDerivativosProte">
          Colocación de derivación proteica
        </label>
        <Switch
          checked={formik.values.colocacionSistemasDerivativosProte}
          onChange={(checked) => {
            formik.setFieldValue("colocacionSistemasDerivativosProte", checked);
            formik.setFieldTouched("colocacionSistemasDerivativosProte", true);
          }}
        />
      </div>
      <div className="item-switch">
        <label htmlFor="derivacionSubDuroperiotonealBilateral">
          Deriv. Subduro Bilateral
        </label>
        <Switch
          checked={formik.values.derivacionSubDuroperiotonealBilateral}
          onChange={(checked) => {
            formik.setFieldValue(
              "derivacionSubDuroperiotonealBilateral",
              checked
            );
            formik.setFieldTouched(
              "derivacionSubDuroperiotonealBilateral",
              true
            );
          }}
        />
      </div>
      {/* Campo de Complicaciones */}
      <div className="item">
        <label htmlFor="otros">Otros</label>
        <Input.TextArea
          rows={1}
          className="textarea-md"
          id="otros"
          name="otros"
          value={formik.values.otros || ""}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.otros && formik.errors.otros && (
          <div className="requerido" style={{ color: "red" }}>
            {formik.errors.otros}
          </div>
        )}
      </div>
    </form>
  );
};

export default CirugiaNerviosoCentralForm;
