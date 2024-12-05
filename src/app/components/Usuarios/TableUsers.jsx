import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { Modal, notification, Spin } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { useAuth } from "@/app/hooks/authContext";
import SearchUser from "./componentUsers/SearchUsers";
import Pagination from "antd/es/pagination";
import { fetchAllUsers } from "@/services/fetchAllData";
import { deleteUsers } from "@/services/Delete/Users/deleteUsers";

const TableUsers = () => {
  const { user, token } = useAuth();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(20);
  const [loading, setLoading] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]); // Nuevo estado para los usuarios completos
  const [isLoading, setIsLoading] = useState(false);

  const startLoading = () => setLoading(true);
  const stopLoading = () => setLoading(false);

  useMemo(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await fetchAllUsers(token);
        const data = response.usuarios;
        setAllUsers(data); // Guardamos la lista completa
        setFilteredUsers(data); // Inicializamos filteredUsers con la lista completa
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * usersPerPage;
    return filteredUsers.slice(startIndex, startIndex + usersPerPage);
  }, [currentPage, filteredUsers, usersPerPage]);

  const handleDelete = (id) => {
    Modal.confirm({
      title: "¿Está seguro de eliminar este usuario?",
      content:
        "El usuario y todos sus datos relacionados serán eliminados permanentemente. ¿Desea continuar?",
      okText: "Sí",
      cancelText: "No",
      centered: true,
      onOk() {
        deleteUsersAction(id);
      },
      onCancel() {
        console.log("Eliminación cancelada.");
      },
    });
  };

  const deleteUsersAction = async (id) => {
    setIsLoading(true);
    try {
      const response = await deleteUsers(id, token);
      if (response.message) {
        setIsLoading(false);
        Modal.confirm({
          title: "Usuario eliminado exitosamente",
          content:
            "El usuario y todos sus datos relacionados se han eliminado correctamente.",
          icon: (
            <CheckCircleOutlined
              style={{ color: "#52c41a", fontSize: "32px" }}
            />
          ),
          okText: "Aceptar",
          centered: true,
          cancelButtonProps: { style: { display: "none" } },
          onOk() {
            setFilteredUsers(filteredUsers.filter((user) => user.id !== id));
            router.push("/usuarios");
          },
        });
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error al eliminar usuario:", error);
    }
  };

  const renderUserRow = (usuario) => (
    <tr key={usuario.id}>
      <td className="center">
        <strong>{usuario.rol?.nombreRol || "No especificado"}</strong>
      </td>
      <td className="center">{usuario.nombreYApellido || "Sin nombre"}</td>
      <td className="center">{usuario.telefono || "Sin Telefono"}</td>
      <td className="center">{usuario.correo || "Sin correo"}</td>
      <td className="place">
        <div style={{ display: "flex", padding: "0 12px", gap: 12 }}>
          <div
            className="btn-edit"
            onClick={() => {
              setIsLoading(true);
              router.push(
                `/usuarios/gestionarUsuarios?mode=isEditMode&id=${usuario.id}`
              );
            }}
          ></div>
          <div
            className="btn-delete"
            onClick={() => handleDelete(usuario.id)}
          ></div>
        </div>
      </td>
    </tr>
  );

  const handleCreateUser = () => {
    setIsLoading(true);
    router.push("/usuarios/gestionarUsuarios?mode=isCreateMode");
  };

  return (
    <div className="base">
      <div className="actions-inputs">
        {/* Botón de Crear Usuario */}
        <div>
          <button className="btn btn-azul" onClick={handleCreateUser}>
            Nuevo Usuario
          </button>
          {isLoading && (
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
        </div>

        <SearchUser data={allUsers} onSearch={setFilteredUsers} />
      </div>

      <Modal
        className="modal-confirm"
        open={isLoading}
        footer={null}
        closable={false}
        centered
      >
        <Spin size="large" />
      </Modal>

      {loading && !isLoading ? (
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
      ) : filteredUsers.length > 0 ? (
        <div className="month-container">
          <div className="section">
            <div className="text-head">
              <h3>Usuarios</h3>
              <span className="record">
                {`${user.length} ${
                  user.length === 1 ? "registro en total" : "registros totales"
                }`}
              </span>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th className="co">Rol</th>
                  <th className="co">Nombre</th>
                  <th className="co">Teléfono</th>
                  <th className="co">Correo</th>
                  <th className="co">Acción</th>
                </tr>
              </thead>
              <tbody>{paginatedUsers.map(renderUserRow)}</tbody>
            </table>
          </div>
        </div>
      ) : (
        <span>No hay datos para mostrar</span>
      )}

      {!loading && filteredUsers.length > 0 && (
        <div className="pag-container">
          <Pagination
            current={currentPage}
            pageSize={usersPerPage}
            total={filteredUsers.length}
            onChange={(page) => setCurrentPage(page)}
            style={{ marginTop: "20px" }}
          />
        </div>
      )}
    </div>
  );
};

export default TableUsers;
