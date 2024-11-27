import { useAuth } from "@/app/hooks/authContext";
import { Pagination, Spin, Button, Input } from "antd";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import SearchPost from "../SearchPost";
import { fetchSurgeriesPost } from "@/services/fetchAllData";
import CreatePosnatalButtons from "../CreatePosnatlButtons";

const TableSurgeriesPost = () => {
  const { token, surgeriesPost, setSurgeriesPost } = useAuth();
  const router = useRouter();
  const [currentPageNeonatal, setCurrentPageNeonatal] = useState(1);
  const [currentPageNervioso, setCurrentPageNervioso] = useState(1);
  const [surgeriesPerPage] = useState(20);
  const [loading, setLoading] = useState(false);
  const [filteredSurgeries, setFilteredSurgeries] = useState([]);
  const [neonatalSurgeries, setNeonatalSurgeries] = useState([]);
  const [nerviosoCentralSurgeries, setNerviosoCentralSurgeries] = useState([]);

  // Estados para manejar la visibilidad de las secciones
  const [showNeonatal, setShowNeonatal] = useState(true);
  const [showNerviosoCentral, setShowNerviosoCentral] = useState(true);
  const [isSearchActive, setIsSearchActive] = useState(false);

  useEffect(() => {
    const fetchSurgeries = async () => {
      setLoading(true);
      try {
        const data = await fetchSurgeriesPost(token);
        setSurgeriesPost(data);
        setFilteredSurgeries(data.registros);

        const neonatal = data.registros.filter(
          (cirugia) => cirugia.tipoCirugia === "Neonatal"
        );
        const nerviosoCentral = data.registros.filter(
          (cirugia) => cirugia.tipoCirugia === "Nervioso central"
        );

        setNeonatalSurgeries(neonatal);
        setNerviosoCentralSurgeries(nerviosoCentral);
      } catch (error) {
        console.error("Error fetching surgeries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSurgeries();
  }, [setSurgeriesPost, token]);

  // Función para manejar el filtro de búsqueda
  const handleSearch = (searchResults) => {
    setIsSearchActive(searchResults.length > 0);
    setFilteredSurgeries(searchResults);

    if (searchResults.length === 0) {
      setShowNeonatal(true);
      setShowNerviosoCentral(true);
    }
  };

  // Paginación para cirugías neonatales
  const paginatedNeonatalSurgeries = useMemo(() => {
    const startIndex = (currentPageNeonatal - 1) * surgeriesPerPage;
    return neonatalSurgeries.slice(startIndex, startIndex + surgeriesPerPage);
  }, [currentPageNeonatal, neonatalSurgeries, surgeriesPerPage]);

  // Paginación para cirugías nervioso central
  const paginatedNerviosoCentralSurgeries = useMemo(() => {
    const startIndex = (currentPageNervioso - 1) * surgeriesPerPage;
    return nerviosoCentralSurgeries.slice(
      startIndex,
      startIndex + surgeriesPerPage
    );
  }, [currentPageNervioso, nerviosoCentralSurgeries, surgeriesPerPage]);

  const formatDate = (isoDate) => {
    if (!isoDate) return "No disponible";
    const date = new Date(isoDate);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const renderPatientRow = (cirugia) => {
    return (
      <tr key={cirugia.id}>
        <td className="center">
          <strong>{cirugia?.paciente?.numeroExpediente}</strong>
        </td>
        <td className="center">{formatDate(cirugia?.fechaDeCreacion)}</td>
        <td className="center">
          {cirugia?.paciente?.primerNombre} {cirugia?.paciente?.primerApellido}
        </td>
        <td className="center">{formatDate(cirugia?.fechaDeIntervencion)}</td>
        <td className="center">{cirugia?.tipoCirugia}</td>
        <td className="center">{cirugia?.doctor?.nombreYApellido}</td>
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
              router.push(
                `/cirugias/gestionarCirugiaPostnatal?mode=isEditMode&id=${cirugia.id}`
              );
            }}
          ></div>
        </td>
      </tr>
    );
  };

  // Efecto para restablecer las secciones cuando se borra la búsqueda
  useEffect(() => {
    if (!isSearchActive) {
      setShowNeonatal(true);
      setShowNerviosoCentral(true);
    }
  }, [isSearchActive]);

  return (
    <div className="base">
      <div className="actions-inputs">
        <CreatePosnatalButtons />
        {/* Componente de búsqueda */}
        <SearchPost
          data={[...neonatalSurgeries, ...nerviosoCentralSurgeries]}
          onSearch={handleSearch}
          setFilteredSurgeries={setFilteredSurgeries}
          setIsSearchActive={setIsSearchActive}
          setShowNeonatal={setShowNeonatal}
          setShowNerviosoCentral={setShowNerviosoCentral}
        />
      </div>

      {loading ? (
        <div className="loading-message">
          <Spin /> <span>Consultando datos...</span>
        </div>
      ) : isSearchActive ? (
        // Mostrar resultados de búsqueda como una única tabla
        <div className="month-container">
          <div className="section">
            <div className="text-head">
              <h3>Resultados de búsqueda</h3>
            </div>
            <div>
              <table className="table">
                <thead>
                  <tr>
                    <th className="co">N°-Exp</th>
                    <th className="co">Creación</th>
                    <th className="co">Paciente</th>
                    <th className="co">Intervención</th>
                    <th className="co">Cirugía</th>
                    <th className="co">Responsable</th>
                    <th className="co">Estado</th>
                    <th className="co">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSurgeries.map((cirugia) =>
                    renderPatientRow(cirugia)
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        // Mostrar las tablas divididas por secciones
        <div className="month-container">
          <div className="section">
            <div className="text-head">
              <h3>Cirugías Neonatales</h3>
              <span className="record">
                {`${neonatalSurgeries.length} ${
                  neonatalSurgeries.length === 1
                    ? "registro en total"
                    : "registros totales"
                }`}
              </span>
              <Button
                onClick={() => setShowNeonatal(!showNeonatal)}
                style={{ marginBottom: "10px" }}
              >
                {showNeonatal ? "Ocultar" : "Mostrar"}
              </Button>
            </div>
            {showNeonatal && (
              <div>
                <table className="table">
                  <thead>
                    <tr>
                      <th className="co">N°-Exp</th>
                      <th className="co">Creación</th>
                      <th className="co">Paciente</th>
                      <th className="co">Intervención</th>
                      <th className="co">Cirugía</th>
                      <th className="co">Responsable</th>
                      <th className="co">Estado</th>
                      <th className="co">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedNeonatalSurgeries.map((cirugia) =>
                      renderPatientRow(cirugia)
                    )}
                  </tbody>
                </table>
                <Pagination
                  current={currentPageNeonatal}
                  pageSize={surgeriesPerPage}
                  total={neonatalSurgeries.length}
                  onChange={(page) => setCurrentPageNeonatal(page)}
                  style={{ marginTop: "20px" }}
                />
              </div>
            )}
          </div>

          <div className="section">
            <div className="text-head">
              <h3>Cirugías Nervioso Central</h3>
              <span className="record">
                {`${nerviosoCentralSurgeries.length} ${
                  nerviosoCentralSurgeries.length === 1
                    ? "registro en total"
                    : "registros totales"
                }`}
              </span>
              <Button
                onClick={() => setShowNerviosoCentral(!showNerviosoCentral)}
                style={{ marginBottom: "10px" }}
              >
                {showNerviosoCentral ? "Ocultar" : "Mostrar"}
              </Button>
            </div>
            {showNerviosoCentral && (
              <div>
                <table className="table">
                  <thead>
                    <tr>
                      <th className="co">N°-Exp</th>
                      <th className="co">Creación</th>
                      <th className="co">Paciente</th>
                      <th className="co">Intervención</th>
                      <th className="co">Cirugía</th>
                      <th className="co">Responsable</th>
                      <th className="co">Estado</th>
                      <th className="co">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedNerviosoCentralSurgeries.map((cirugia) =>
                      renderPatientRow(cirugia)
                    )}
                  </tbody>
                </table>
                <Pagination
                  current={currentPageNervioso}
                  pageSize={surgeriesPerPage}
                  total={nerviosoCentralSurgeries.length}
                  onChange={(page) => setCurrentPageNervioso(page)}
                  style={{ marginTop: "20px" }}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TableSurgeriesPost;
