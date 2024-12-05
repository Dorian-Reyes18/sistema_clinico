import { useAuth } from "@/app/hooks/authContext";
import { Pagination, Spin, Button, Input, Modal } from "antd";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import SearchPost from "../SearchPost";
import { fetchSurgeriesPost } from "@/services/fetchAllData";
import CreatePosnatalButtons from "../CreatePosnatlButtons";
import { CheckCircleOutlined } from "@ant-design/icons";

import { deleteSurgeryPostCompleta } from "@/services/Delete/Cirugias/deletePost";

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
  const [isLoading, setIsLoading] = useState(false);

  // Estados para manejar la visibilidad de las secciones
  const [showNeonatal, setShowNeonatal] = useState(true);
  const [showNerviosoCentral, setShowNerviosoCentral] = useState(true);
  const [isSearchActive, setIsSearchActive] = useState(false);

  const [isEditing, setIsEditing] = useState(false);

  const startLoading = () => setLoading(true);
  const stopLoading = () => setLoading(false);

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

  const handleDelete = (id) => {
    Modal.confirm({
      title: "¿Está seguro de eliminar esta cirugía?",
      content:
        "La cirugía y todos sus datos relacionados serán eliminados permanentemente. ¿Desea continuar?",
      okText: "Sí",
      cancelText: "No",
      centered: true,
      onOk() {
        deleteSurgery(id);
      },
      onCancel() {
        console.log("Eliminación cancelada.");
      },
    });
  };

  const deleteSurgery = async (id) => {
    setIsLoading(true);
    try {
      const response = await deleteSurgeryPostCompleta(id, token);
      if (response.message) {
        // Después de la eliminación, recargamos las cirugías
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

        setIsLoading(false);

        Modal.confirm({
          title: "Cirugía eliminada exitosamente",
          content:
            "La cirugía y todos sus datos relacionados se han eliminado correctamente.",
          icon: (
            <CheckCircleOutlined
              style={{ color: "#52c41a", fontSize: "32px" }}
            />
          ),
          okText: "Aceptar",
          centered: true,
          cancelButtonProps: { style: { display: "none" } },
          onOk() {
            router.push("/cirugias"); 
          },
        });
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error al eliminar cirugía:", error);
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
          <div style={{ display: "flex", padding: "0 12px", gap: 12 }}>
            <div
              className="btn-edit"
              onClick={() => {
                setLoading(true);
                setTimeout(() => {
                  router.push(
                    `/cirugias/gestionarCirugiaPostnatal?mode=isEditMode&id=${cirugia.id}`
                  );
                }, 300);
              }}
            ></div>
            <div
              className="btn-delete"
              onClick={() => handleDelete(cirugia.id)}
            ></div>
          </div>
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
      {/* Spinner de carga global */}
      {loading && (
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
      )}

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
      {/* Spin de eliminación aparece solo cuando se está eliminando */}
      <Modal
        className="modal-confirm"
        open={isLoading}
        footer={null}
        closable={false}
        centered
      >
        <Spin size="large" />
      </Modal>

      {loading || isEditing ? (
        <div className="loading-message">
          {/* <Spin /> <span>Consultando datos...</span> */}
        </div>
      ) : isSearchActive ? (
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
                  showSizeChanger={false}
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
                  showSizeChanger={false}
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
