import { useAuth } from "@/app/hooks/authContext";
import { Popover, Pagination } from "antd";
import { useEffect, useState } from "react";

const TablePatients = () => {
  const { patients } = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [patientsPerPage] = useState(5);
  const [paginatedMonths, setPaginatedMonths] = useState([]);

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

  const groupedPatients = groupPatientsByYearAndMonth(patients);
  const sortedYears = Object.keys(groupedPatients).sort((a, b) => b - a);
  const allMonths = [];

  sortedYears.forEach((year) => {
    const months = Object.keys(groupedPatients[year]);
    months.forEach((month) => {
      allMonths.push({ year, month, patients: groupedPatients[year][month] });
    });
  });

  useEffect(() => {
    const startIndex = (currentPage - 1) * patientsPerPage;
    const endIndex = startIndex + patientsPerPage;

    setPaginatedMonths(allMonths.slice(startIndex, endIndex));
  }, [currentPage, patients, allMonths, patientsPerPage]);

  const handleChangePage = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="base">
      {paginatedMonths.length > 0 ? (
        paginatedMonths.map(({ year, month, patients }) => {
          const recordCount = patients.length;
          const recordText = recordCount === 1 ? "registro" : "registros";

          return (
            <div key={`${year}-${month}`} className="month-container">
              <div className="text-head">
                <h3>
                  {month} - {year}
                </h3>
                <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
                  <span className="record">
                    {recordCount} {recordText}
                  </span>
                </div>
              </div>
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">
                      <strong>Expediente</strong>
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
                    patients.map((paciente) => (
                      <tr key={paciente.id}>
                        <td className="center">
                          <strong>{paciente.numeroExpediente}</strong>
                        </td>
                        <td>
                          {new Date(paciente.fechaIngreso).toLocaleDateString()}
                        </td>
                        <td>
                          <span>
                            {paciente.primerNombre} {paciente.segundoNombre}{" "}
                            {paciente.primerApellido} {paciente.segundoApellido}
                          </span>
                        </td>
                        <td className="center">{paciente.edad}</td>
                        <td className="center">
                          {new Date(paciente.fechaNac).toLocaleDateString()}
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
                              <span>{paciente.domicilio.slice(0, 40)}...</span>
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
        })
      ) : (
        <div>No hay pacientes registrados</div>
      )}
      <div className="pag-container">
        <Pagination
          current={currentPage}
          pageSize={patientsPerPage}
          total={allMonths.length}
          onChange={handleChangePage}
          style={{ marginTop: "20px" }}
        />
      </div>
    </div>
  );
};

export default TablePatients;
