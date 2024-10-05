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

  const sortPatientsByDate = (patients) => {
    return patients.sort(
      (a, b) => new Date(b.fechaIngreso) - new Date(a.fechaIngreso)
    );
  };

  const groupedPatients = groupPatientsByYearAndMonth(patients);
  const sortedYears = Object.keys(groupedPatients).sort((a, b) => b - a);

  return (
    <div className="base">
      {sortedYears.length > 0 ? (
        sortedYears.map((year) => (
          <div
            key={year}
            className="year-container"
            style={{ marginBottom: "20px" }}
          >
            <h3>{year}</h3>
            <div className="months-container">
              {sortMonths(Object.keys(groupedPatients[year])).map((month) => {
                const monthPatients = groupedPatients[year][month];
                const recordCount = monthPatients.length;
                const recordText = recordCount === 1 ? "registro" : "registros";

                return (
                  <div
                    key={month}
                    className="month-container"
                    style={{ marginBottom: "15px" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: " center",
                        gap: 15,
                      }}
                    >
                      <h5>{month}</h5>
                      <span className="record">
                        {recordCount} {recordText}
                      </span>
                    </div>
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
                        {recordCount > 0 ? (
                          sortPatientsByDate(monthPatients).map((paciente) => (
                            <tr key={paciente.id}>
                              <td className="center">
                                <strong>{paciente.numeroExpediente}</strong>
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
                                {isMobile ? (
                                  paciente.domicilio.length > 30 ? (
                                    <Popover
                                      content={paciente.domicilio}
                                      title="Dirección Completa"
                                      trigger="hover"
                                    >
                                      <span>
                                        {paciente.domicilio.slice(0, 25)}...
                                      </span>
                                    </Popover>
                                  ) : (
                                    <span>{paciente.domicilio}</span>
                                  )
                                ) : paciente.domicilio.length > 45 ? (
                                  <Popover
                                    content={paciente.domicilio}
                                    title="Dirección Completa"
                                    trigger="hover"
                                  >
                                    <span>
                                      {paciente.domicilio.slice(0, 40)}...
                                    </span>
                                  </Popover>
                                ) : (
                                  <span>{paciente.domicilio}</span>
                                )}
                              </td>
                              <td className="center">
                                {paciente.conyuge
                                  ? `${paciente.conyuge.edad} años`
                                  : "No"}
                              </td>
                              <td>
                                <span className="btnedit center">
                                  <div>Ed</div>
                                  <div>El</div>
                                </span>
                              </td>
                            </tr>
                          ))
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
                );
              })}
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
