import { useAuth } from "@/app/hooks/authContext";
import { Popover } from "antd";
import { useEffect, useState } from "react";

const TablePatients = () => {
  const { patients } = useAuth();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1400);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Agrupar los pacientes por año y mes
  const groupPatientsByYearAndMonth = (patients) => {
    return patients.reduce((acc, paciente) => {
      const date = new Date(paciente.fechaIngreso);
      const year = date.getFullYear();
      const month = date
        .toLocaleString("default", { month: "long" })
        .toLowerCase();

      if (!acc[year]) {
        acc[year] = {};
      }
      if (!acc[year][month]) {
        acc[year][month] = [];
      }
      acc[year][month].push(paciente);
      return acc;
    }, {});
  };

  // Función para ordenar los meses en orden descendente (de diciembre a enero)
  const sortMonths = (months) => {
    const monthOrder = [
      "december",
      "november",
      "october",
      "september",
      "august",
      "july",
      "june",
      "may",
      "april",
      "march",
      "february",
      "january",
    ];
    return months.sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b));
  };

  // Ordenar los pacientes dentro de cada mes por la fecha de ingreso, más recientes primero
  const sortPatientsByDate = (patients) => {
    return patients.sort(
      (a, b) => new Date(b.fechaIngreso) - new Date(a.fechaIngreso)
    );
  };

  const groupedPatients = groupPatientsByYearAndMonth(patients);
  const sortedYears = Object.keys(groupedPatients).sort((a, b) => b - a); // Años más recientes primero

  return (
    <div className="base">
      {sortedYears.length > 0 ? (
        sortedYears.map((year) => (
          <div
            key={year}
            className="year-container"
            style={{ marginBottom: "20px" }}
          >
            {/* Encabezado de año */}
            <h3>{year}</h3>
            <div className="months-container">
              {sortMonths(Object.keys(groupedPatients[year])).map((month) => (
                <div
                  key={month}
                  className="month-container"
                  style={{ marginBottom: "15px" }}
                >
                  {/* Encabezado de mes */}
                  <h5>{month}</h5>
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">
                          <strong>Exped</strong>
                        </th>
                        <th scope="col">Ingreso</th>
                        <th scope="col">Nombre completo</th>
                        <th scope="col">Edad</th>
                        <th scope="col">Nacimiento</th>
                        <th scope="col">Telf.1</th>
                        <th scope="col">Telf.2</th>
                        <th scope="col">Dep/Munic</th>
                        <th scope="col">Domicilio</th>
                        <th scope="col">Conyuge</th>
                        <th scope="col">Opciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {groupedPatients[year][month].length > 0 ? (
                        sortPatientsByDate(groupedPatients[year][month]).map(
                          (paciente) => (
                            <tr key={paciente.id}>
                              <td className="center">
                                {paciente.numeroExpediente}
                              </td>
                              <td>
                                {new Date(
                                  paciente.fechaIngreso
                                ).toLocaleDateString()}
                              </td>
                              <td>
                                <span>
                                  {paciente.primerNombre}{" "}
                                  {paciente.segundoNombre}{" "}
                                  {paciente.primerApellido}{" "}
                                  {paciente.segundoApellido}
                                </span>
                              </td>
                              <td className="center">{paciente.edad}</td>
                              <td className="center">
                                {new Date(
                                  paciente.fechaNac
                                ).toLocaleDateString()}
                              </td>
                              <td className="center">{paciente.telefono1}</td>
                              <td className="center">{paciente.telefono2}</td>
                              <td>{paciente.municipio.nombre}</td>
                              <td>
                                {paciente.domicilio.length >
                                (isMobile ? 20 : 50) ? (
                                  <Popover
                                    content={paciente.domicilio}
                                    title="Dirección Completa"
                                    trigger="hover"
                                  >
                                    <span>
                                      {paciente.domicilio.length > 10
                                        ? `${paciente.domicilio.slice(
                                            0,
                                            10
                                          )}...`
                                        : paciente.domicilio}
                                    </span>
                                  </Popover>
                                ) : (
                                  <span>{paciente.domicilio}</span>
                                )}
                              </td>
                              <td className="center">
                                {paciente.conyuge
                                  ? paciente.conyuge.edad
                                  : "Sin conyuge"}{" "}
                                años
                              </td>
                              <td>
                                <div>Ed</div>
                                <div>El</div>
                              </td>
                            </tr>
                          )
                        )
                      ) : (
                        <tr>
                          <td colSpan="11">
                            No hay pacientes registrados para este mes.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div>No hay pacientes registrados</div>
      )}
    </div>
  );
};

export default TablePatients;
