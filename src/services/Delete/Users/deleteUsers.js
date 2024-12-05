// services/DeleteData.js
import axios from "axios";
import createAuthHeaders from "@/services/authUtils";
import apiUrl from "@/global/apiURL";

// Función genérica para realizar DELETE
const deleteUser = async (endpoint, id, token) => {
  try {
    const headers = createAuthHeaders(token);
    const response = await axios.delete(
      `${apiUrl}/protected/${endpoint}/${id}`,
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar los datos de ${endpoint}:`, error);
    throw new Error(`Hubo un error al eliminar los datos. Intenta nuevamente.`);
  }
};

// Función específica para eliminar cirugías
export const deleteUsers = (id, token) => deleteUser("usuarios", id, token);
