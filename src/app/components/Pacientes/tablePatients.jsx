import { useAuth } from "@/app/hooks/authContext";
import { Popover, Pagination } from "antd";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation"; // Asegúrate de importar useRouter
import SearchBar from "./Search";
import CreatePatientButton from "./CreatePatientBtn";

const TablePatients = () => {
  const { patients } = useAuth();
  const router = useRouter(); // Inicializa el hook useRouter
  const [isMobile, setIsMobile] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [patientsPerPage] = useState(50);
  const [depMunicData, setDepMunicData] = useState(new Map());
  const [allMonths, setAllMonths] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState(patients);

  useEffect(() => {
    const fetchMunicData = async () => {
      try {
        const response = await fetch("/data/dep-munic.json");
        if (!response.ok)
          throw new Error("Error al obtener datos de municipios");
        const data = await response.json();

        const depMunicMap = new Map();
        data.departamentos.forEach((departamento) => {
          departamento.municipios.forEach((municipio) => {
            depMunicMap.set(municipio, departamento.nombre);
          });
        });
        setDepMunicData(depMunicMap);
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
    return filteredPatients.reduce((acc, paciente) => {
      const date = new Date(paciente.fechaIngreso);
      const year = date.getFullYear();
      const month = date
        .toLocaleString("default", { month: "long" })
        .toLowerCase();

      if (!acc[year]) acc[year] = {};
      if (!acc[year][month]) acc[year][month] = [];

      acc[year][month].push(paciente);
      return acc;
    }, {});
  }, [filteredPatients]);

  useEffect(() => {
    const monthsArray = Object.keys(groupedPatients)
      .sort((a, b) => b - a)
      .flatMap((year) =>
        Object.keys(groupedPatients[year]).map((month) => ({
          year,
          month,
          patients: groupedPatients[year][month],
        }))
      );
    setAllMonths(monthsArray);
  }, [groupedPatients]);

  const paginatedMonths = useMemo(() => {
    const startIndex = (currentPage - 1) * patientsPerPage;
    return allMonths.slice(startIndex, startIndex + patientsPerPage);
  }, [currentPage, allMonths, patientsPerPage]);

  const findDepartmentByMunicipio = useCallback(
    (municipio) => depMunicData.get(municipio) || "Desconocido",
    [depMunicData]
  );

  const formatFullName = (paciente) => {
    return `${paciente.primerNombre} ${paciente.segundoNombre} ${paciente.primerApellido} ${paciente.segundoApellido}`.trim();
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

  const truncateAddress = (address) => {
    const maxLength = isMobile ? 25 : 40;
    return address.length > maxLength
      ? `${address.slice(0, maxLength)}...`
      : address;
  };

  const renderPatientRow = (paciente) => (
    <tr key={paciente.id}>
      <td className="center">
        <strong>{paciente.numeroExpediente}</strong>
      </td>
      <td>{formatDate(paciente.fechaIngreso)}</td>
      <td>{formatFullName(paciente)}</td>
      <td className="center">{paciente.edad}</td>
      <td className="center">{formatDate(paciente.fechaNac)}</td>
      <td className="center">{paciente.telefono1}</td>
      <td className="center">{paciente.telefono2}</td>
      <td>{`${paciente.municipio.nombre} - ${findDepartmentByMunicipio(
        paciente.municipio.nombre
      )}`}</td>
      <td>
        <Popover
          content={paciente.domicilio}
          title="Dirección Completa"
          trigger="hover"
        >
          <span>{truncateAddress(paciente.domicilio)}</span>
        </Popover>
      </td>
      <td className="center">
        {paciente.conyuge ? `${paciente.conyuge.edad} años` : "No"}
      </td>
      <td className="place">
        <div
          className="btn-edit "
          onClick={() => {
            router.push(
              `/pacientes/crearPaciente?mode=isEditMode&id=${paciente.id}`
            );
          }}
        ></div>
      </td>
    </tr>
  );

  return (
    <div className="base">
      <div className="actions-inputs">
        <CreatePatientButton />{" "}
        <SearchBar data={patients} onSearch={setFilteredPatients} />
      </div>

      {paginatedMonths.length > 0 ? (
        paginatedMonths.map(({ year, month, patients }) => (
          <div key={`${year}-${month}`} className="month-container">
            <div className="text-head">
              <h3>{`${month} - ${year}`}</h3>
              <span className="record">
                {`${patients.length} ${
                  patients.length === 1 ? "registro" : "registros"
                }`}
              </span>
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
                    <th key={heading} scope="col" className="co">
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
        <div>Ninguna coincidencia de búsqueda</div>
      )}

      {filteredPatients.length === patients.length && (
        <div className="pag-container">
          <Pagination
            current={currentPage}
            pageSize={patientsPerPage}
            total={allMonths.length}
            onChange={setCurrentPage}
            style={{ marginTop: "20px" }}
          />
        </div>
      )}
    </div>
  );
};

export default TablePatients;
