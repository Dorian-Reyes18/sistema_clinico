import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs"; 


<div className="item">
        <label htmlFor="fechaNac">Fecha de Nacimiento:</label>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            id="fechaNac"
            name="fechaNac"
            value={
              formik.values.fechaNac ? dayjs(formik.values.fechaNac) : null
            }
            onChange={(date) => {
              formik.setFieldValue(
                "fechaNac",
                date ? date.toISOString() : null
              );
              formik.submitForm();
            }}
            onBlur={formik.handleBlur}
            renderInput={(params) => <Input {...params} />}
          />
        </LocalizationProvider>
        {formik.touched.fechaNac && formik.errors.fechaNac ? (
          <div className="requerido" style={{ color: "red" }}>
            {formik.errors.fechaNac}
          </div>
        ) : null}
      </div>
