import { useAuth } from "@/app/hooks/authContext";
import { Popover, Pagination } from "antd";
import { useEffect, useState, useMemo } from "react";

const TablePatients = () => {
  const { patients } = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [patientsPerPage] = useState(50);
  const [depMunicData, setDepMunicData] = useState([]);
  const [allMonths, setAllMonths] = useState([]);

  useEffect(() => {
    const fetchMunicData = async () => {
      try {
        const response = await fetch("/data/dep-munic.json");
        if (!response.ok)
          throw new Error("Error al obtener datos de municipios");
        const data = await response.json();
        setDepMunicData(data);
      } catch (error) {
        console.error("Error fetching dep-munic data:", error);
      }
    };

    const handleResize = () => setIsMobile(window.innerWidth < 1400);

    handleResize();
    fetchMunicData();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const groupedPatients = useMemo(() => {
    return patients.reduce((acc, paciente) => {
      const date = new Date(paciente.fechaIngreso);
      const year = date.getFullYear();
      const month = date
        .toLocaleString("default", { month: "long" })
        .toLowerCase();

      acc[year] = acc[year] || {};
      acc[year][month] = acc[year][month] || [];
      acc[year][month].push(paciente);
      return acc;
    }, {});
  }, [patients]);

  useEffect(() => {
    if (Object.keys(groupedPatients).length > 0) {
      const sortedYears = Object.keys(groupedPatients).sort((a, b) => b - a);
      const monthsArray = sortedYears.flatMap((year) =>
        Object.keys(groupedPatients[year]).map((month) => ({
          year,
          month,
          patients: groupedPatients[year][month],
        }))
      );
      setAllMonths(monthsArray);
    }
  }, [groupedPatients]);

  const paginatedMonths = useMemo(() => {
    const startIndex = (currentPage - 1) * patientsPerPage;
    return allMonths.slice(startIndex, startIndex + patientsPerPage);
  }, [currentPage, allMonths, patientsPerPage]);

  const findDepartmentByMunicipio = (municipio) => {
    if (!depMunicData.departamentos) return "Desconocido";
    const found = depMunicData.departamentos.find((departamento) =>
      departamento.municipios.includes(municipio)
    );
    return found ? found.nombre : "Desconocido";
  };

  const renderPatientRow = (paciente) => (
    <tr key={paciente.id}>
      <td className="center">
        <strong>{paciente.numeroExpediente}</strong>
      </td>
      <td>{new Date(paciente.fechaIngreso).toLocaleDateString()}</td>
      <td>{`${paciente.primerNombre} ${paciente.segundoNombre} ${paciente.primerApellido} ${paciente.segundoApellido}`}</td>
      <td className="center">{paciente.edad}</td>
      <td className="center">
        {new Date(paciente.fechaNac).toLocaleDateString()}
      </td>
      <td className="center">{paciente.telefono1}</td>
      <td className="center">{paciente.telefono2}</td>
      <td>{`${paciente.municipio.nombre} - ${findDepartmentByMunicipio(
        paciente.municipio.nombre
      )}`}</td>
      <td>{renderAddress(paciente.domicilio)}</td>
      <td className="center">
        {paciente.conyuge ? `${paciente.conyuge.edad} años` : "No"}
      </td>
      <td>
        <span className="btnedit center">
          <div>Ed</div>
          <div>El</div>
        </span>
      </td>
    </tr>
  );

  const renderAddress = (domicilio) => {
    const truncatedAddress =
      domicilio.length > (isMobile ? 30 : 45)
        ? domicilio.slice(0, isMobile ? 25 : 40) + "..."
        : domicilio;
    return (
      <Popover content={domicilio} title="Dirección Completa" trigger="hover">
        <span>{truncatedAddress}</span>
      </Popover>
    );
  };

  return (
    <div className="base">
      {paginatedMonths.length > 0 ? (
        paginatedMonths.map(({ year, month, patients }) => (
          <div key={`${year}-${month}`} className="month-container">
            <div className="text-head">
              <h3>{`${month} - ${year}`}</h3>
              <span className="record">{`${patients.length} ${
                patients.length === 1 ? "registro" : "registros"
              }`}</span>
            </div>
            <table className="table">
              <thead>
                <tr>
                  {[
                    "Expediente",
                    "Ingreso",
                    "Nombre completo",
                    "Edad",
                    "Nacimiento",
                    "Telf.1",
                    "Telf.2",
                    "Munic/Dep",
                    "Domicilio",
                    "Conyuge",
                    "Opciones",
                  ].map((heading) => (
                    <th key={heading} scope="col">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {patients.length > 0 ? (
                  patients.map(renderPatientRow)
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
        ))
      ) : (
        <div>No hay pacientes registrados</div>
      )}
      <div className="pag-container">
        <Pagination
          current={currentPage}
          pageSize={patientsPerPage}
          total={allMonths.length}
          onChange={setCurrentPage}
          style={{ marginTop: "20px" }}
        />
      </div>
    </div>
  );
};

export default TablePatients;
