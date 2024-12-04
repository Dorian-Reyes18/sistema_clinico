import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { Spin } from "antd";
import { useAuth } from "@/app/hooks/authContext";
import {
  fetchRecentSurgeries,
  fetchOrdenPrenatalCompleta,
} from "@/services/fetchAllData";
import CreateIntraButton from "../CreateIntraButton";
import SearchIntra from "../SearchIntra";
import Pagination from "antd/es/pagination";

const TableSurgeriesIntra = () => {
  const {
    prenatalSurgeries,
    setPrenatalSurgeries,
    recentSurgeries,
    setRecentSurgeries,
    token,
  } = useAuth();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [surgeriesPerPage] = useState(20);
  const [loading, setLoading] = useState(false);
  const [filteredSurgeries, setFilteredSurgeries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useMemo(() => {
    const fetchSurgeries = async () => {
      setLoading(true);
      try {
        const data = await fetchRecentSurgeries(token);
        const dataPosnatal = await fetchOrdenPrenatalCompleta(token);
        setPrenatalSurgeries(dataPosnatal);
        setRecentSurgeries(data);
        setFilteredSurgeries(data);
      } catch (error) {
        console.error("Error fetching surgeries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSurgeries();
  }, [setRecentSurgeries, setPrenatalSurgeries, token]);

  const paginatedSurgeries = useMemo(() => {
    const startIndex = (currentPage - 1) * surgeriesPerPage;
    return filteredSurgeries.slice(startIndex, startIndex + surgeriesPerPage);
  }, [currentPage, filteredSurgeries, surgeriesPerPage]);

  const formatDate = (isoDate) => {
    if (!isoDate) return "No disponible";
    const date = new Date(isoDate);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const renderPatientrowIntra = (cirugia) => (
    <tr key={cirugia.id}>
      <td className="center">
        <strong>{cirugia?.paciente?.numeroExpediente}</strong>
      </td>
      <td className="center">{formatDate(cirugia?.fechaDeCreacion)}</td>
      <td className="center">
        {cirugia?.paciente?.primerNombre} {cirugia?.paciente?.primerApellido}
      </td>
      <td className="center">{cirugia.teniaDiagnostico ? "Sí" : "No"}</td>
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
        style={cirugia.estado ? { color: "#02A81D" } : { color: "#BD3548" }}
      >
        <strong>{cirugia.estado ? "Activa" : "Finalizada"}</strong>
      </td>
      <td className="place">
        <div
          className="btn-edit"
          onClick={() => {
            setIsLoading(true);
            router.push(
              `/cirugias/gestionarCirugias?mode=isEditMode&id=${cirugia.id}`
            );
          }}
        ></div>
      </td>
    </tr>
  );

  return (
    <div className="base">
      <div className="actions-inputs">
        <CreateIntraButton />
        <SearchIntra data={recentSurgeries} onSearch={setFilteredSurgeries} />
      </div>

      {loading || isLoading ? (
        <div
          style={{
            background: "rgba(0, 0, 0, 0.3)",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            pointerEvents: "none",
          }}
        >
          <Spin size="large" />
        </div>
      ) : filteredSurgeries.length > 0 ? (
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
                    <th className="co">N°-Exp</th>
                    <th className="co">Creación</th>
                    <th className="co">Paciente</th>
                    <th className="co">Diag.Previo</th>
                    <th className="co">Diag.Prenatal</th>
                    <th className="co">Eval.Actual</th>
                    <th className="co">Cirugia</th>
                    <th className="co">Riesgos</th>
                    <th className="co">Estado</th>
                    <th className="co">Acción</th>
                  </tr>
                </thead>
                <tbody>{paginatedSurgeries.map(renderPatientrowIntra)}</tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <span>No hay datos para mostrar</span>
      )}

      {!loading && filteredSurgeries.length > 0 && (
        <div className="pag-container">
          <Pagination
            current={currentPage}
            pageSize={surgeriesPerPage}
            total={filteredSurgeries.length}
            onChange={(page) => setCurrentPage(page)}
            style={{ marginTop: "20px" }}
          />
        </div>
      )}
    </div>
  );
};

export default TableSurgeriesIntra;
