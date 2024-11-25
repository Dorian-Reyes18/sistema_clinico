import { useAuth } from "@/app/hooks/authContext";
import { Popover, Pagination, Spin } from "antd";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import SearchBar from "./Search";
import CreatePatientButton from "./CreatePatientBtn";
import { fetchPatients } from "@/services/fetchAllData";
import { LoadingOutlined, ReloadOutlined } from "@ant-design/icons";

const TablePatients = () => {
  const { patients, setPatients, token } = useAuth();
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [patientsPerPage] = useState(15);
  const [depMunicData, setDepMunicData] = useState(new Map());
  const [filteredPatients, setFilteredPatients] = useState(patients);
  const [loading, setLoading] = useState(false);

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

  const sortedPatients = useMemo(() => {
    return filteredPatients.sort(
      (a, b) => new Date(b.fechaIngreso) - new Date(a.fechaIngreso)
    );
  }, [filteredPatients]);

  const paginatedPatients = useMemo(() => {
    const startIndex = (currentPage - 1) * patientsPerPage;
    return sortedPatients.slice(startIndex, startIndex + patientsPerPage);
  }, [currentPage, sortedPatients, patientsPerPage]);

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

  // Función para refrescar los pacientes
  const handleRefresh = async () => {
    setLoading(true);
    try {
      const fetchedPatients = await fetchPatients(token);
      console.log("Datos recibidos correctamente", fetchedPatients);
      setPatients(fetchedPatients);
      setFilteredPatients(fetchedPatients);
    } catch (error) {
      console.error("Error al obtener los pacientes:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="base">
      <div className="actions-inputs">
        <div onClick={handleRefresh} className="btn-refresh">
          {loading ? (
            <Spin indicator={<LoadingOutlined />} />
          ) : (
            <ReloadOutlined />
          )}
        </div>
        <CreatePatientButton />
        <SearchBar data={patients} onSearch={setFilteredPatients} />
      </div>

      {loading ? (
        <div className="loading-message">
          <Spin /> <span>Consultando datos...</span>
        </div>
      ) : paginatedPatients.length > 0 ? (
        <div className="month-container">
          <table className="table">
            <thead>
              <tr>
                {[
                  "Exped",
                  "Ingreso",
                  "Nombre completo",
                  "Edad",
                  "Nacimiento",
                  "Telf.1",
                  "Telf.2",
                  "Ubicación",
                  "Domicilio",
                  "Conyuge",
                  "Acción",
                ].map((heading) => (
                  <th key={heading} scope="col" className="co">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>{paginatedPatients.map(renderPatientRow)}</tbody>
          </table>
        </div>
      ) : (
        <div>No hay pacientes registrados</div>
      )}

      {/* Mostrar el paginador solo si no estamos cargando */}
      {!loading && (
        <div className="pag-container">
          <Pagination
            current={currentPage}
            pageSize={patientsPerPage}
            total={filteredPatients.length}
            onChange={setCurrentPage}
            style={{ marginTop: "20px" }}
          />
        </div>
      )}
    </div>
  );
};

export default TablePatients;
