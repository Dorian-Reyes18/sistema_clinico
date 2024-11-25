import { useAuth } from "@/app/hooks/authContext";
import { Popover, Pagination, Spin } from "antd";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
// import SearchBar from "./Search"; // Si tienes la barra de búsqueda
// import CreatePatientButton from "./CreatePatientBtn"; // Si tienes el botón de crear paciente
import { fetchRecentSurgeries } from "@/services/fetchAllData";

const TableSurgeries = () => {
  const { recentSurgeries, setRecentSurgeries, token } = useAuth();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [surgeriesPerPage] = useState(20);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSurgeries = async () => {
      setLoading(true);
      try {
        const data = await fetchRecentSurgeries(token);
        setRecentSurgeries(data);
      } catch (error) {
        console.error("Error fetching surgeries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSurgeries();
  }, [setRecentSurgeries, token]);

  const paginatedSurgeries = useMemo(() => {
    const startIndex = (currentPage - 1) * surgeriesPerPage;
    return recentSurgeries.slice(startIndex, startIndex + surgeriesPerPage);
  }, [currentPage, recentSurgeries, surgeriesPerPage]);

  const renderPatientrowIntra = (cirugia) => {
    return (
      <tr key={cirugia.id}>
        <td className="center">
          <strong>{cirugia?.paciente?.numeroExpediente}</strong>
        </td>
        <td>{cirugia?.fechaDeCreacion || "No disponible"}</td>
        <td>
          {cirugia?.paciente?.primerNombre} {cirugia?.paciente?.primerApellido}
        </td>
        <td>{cirugia.teniaDiagnostico ? "Sí" : "No"}</td>
        <td>{cirugia.diagnosticoPrenatal?.length > 0 ? "Sí" : "No llenado"}</td>
        <td>{cirugia.evaluacionActual ? "Sí" : "No llenado"}</td>
        <td>{cirugia.tipoCirugia || "No especificado"}</td>
        <td>{cirugia.complicacionesQuirurgicas || "No especificado"}</td>
        <td>{cirugia.etapa || "No especificado"}</td>
        <td>{cirugia.estado ? "Activa" : "Finalizada"}</td>
        <td>Editar</td>
      </tr>
    );
  };

  return (
    <div className="base">
      <div className="actions-inputs"></div>

      <div className="month-container">
        <div className="section">
          <h3>Cirugías Intrauterinas</h3>
          {loading ? (
            <Spin tip="Cargando cirugías..." />
          ) : (
            <>
              <table className="table">
                <thead>
                  <tr>
                    <th>N°-Exp</th>
                    <th>Creación</th>
                    <th>Paciente</th>
                    <th>Diag.Previo</th>
                    <th>Diag.Prenatal</th>
                    <th>Eval.Actual</th>
                    <th>Cirugia</th>
                    <th>Riesgos</th>
                    <th>Etapa</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedSurgeries.map((cirugia) =>
                    renderPatientrowIntra(cirugia)
                  )}
                </tbody>
              </table>

              <div className="pag-container">
                <Pagination
                  current={currentPage}
                  pageSize={surgeriesPerPage}
                  total={recentSurgeries.length}
                  onChange={(page) => setCurrentPage(page)}
                  style={{ marginTop: "20px" }}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TableSurgeries;
