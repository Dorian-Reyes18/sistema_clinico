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

  //   Funciones
  const formatDate = (isoDate) => {
    if (!isoDate) return "No disponible";
    const date = new Date(isoDate);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const renderPatientrowIntra = (cirugia) => {
    return (
      <tr key={cirugia.id}>
        <td className="center">
          <strong>{cirugia?.paciente?.numeroExpediente}</strong>
        </td>
        <td>{formatDate(cirugia?.fechaDeCreacion)}</td>{" "}
        {/* Aquí formateamos la fecha */}
        <td>
          {cirugia?.paciente?.primerNombre} {cirugia?.paciente?.primerApellido}
        </td>
        <td>{cirugia.teniaDiagnostico ? "Sí" : "No"}</td>
        <td className="center">
          {cirugia.diagnosticoPrenatal?.length > 0 ? "Sí" : "No"}
        </td>
        <td className="center">{cirugia.evaluacionActual ? "Sí" : "No"}</td>
        <td className="center">{cirugia.tipoCirugia || "No especificado"}</td>
        <td className="center">
          {cirugia.complicacionesQuirurgicas ? "Si" : "No" || "No"}
        </td>
        <td
          className="center"
          style={
            cirugia.etapa === "Intra"
              ? { color: "#E2A70D" }
              : { color: "#1074BC" }
          }
        >
          <strong>{cirugia.etapa || "No especificado"}</strong>
        </td>
        <td
          className="center"
          style={cirugia.estado ? { color: "#02A81D" } : { color: "#BD3548" }}
        >
          <strong>{cirugia.estado ? "Activa" : "Finalizada"}</strong>
        </td>
        <td className="place">
          <div
            className="btn-edit "
            onClick={() => {
              router.push(
                `/cirugias/gestionarCirugias?mode=isEditMode&id=${cirugia.id}`
              );
            }}
          ></div>
        </td>
      </tr>
    );
  };
  return (
    <div className="base">
      <div className="actions-inputs"></div>

      {loading ? (
        <div className="loading-message">
          <Spin /> <span>Consultando datos...</span>
        </div>
      ) : (
        <>
          <div className="month-container">
            <div className="section">
              <div className="text-head">
                <h3>Cirugías Intrauterinas</h3>
                <span className="record">
                  {`${recentSurgeries.length} ${
                    recentSurgeries.length === 1
                      ? "registro en total"
                      : "registros totales"
                  }`}
                </span>
              </div>
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
            </div>
          </div>
        </>
      )}
      {!loading && (
        <div className="pag-container">
          <Pagination
            current={currentPage}
            pageSize={surgeriesPerPage}
            total={recentSurgeries.length}
            onChange={(page) => setCurrentPage(page)}
            style={{ marginTop: "20px" }}
          />
        </div>
      )}
    </div>
  );
};

export default TableSurgeries;
