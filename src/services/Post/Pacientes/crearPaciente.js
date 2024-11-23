import axios from "axios";
import createAuthHeaders from "@/services/authUtils";
import apiUrl from "@/global/apiURL";

// Función para crear el cónyuge
export const postPaciente = async (data, token) => {
  const dataJson = JSON.stringify(data, null, 2);
  try {
    const headers = createAuthHeaders(token);

    const response = await axios.post(
      `${apiUrl}/protected/pacientes`,
      dataJson,
      {
        headers,
      }
    );

    
    return response.data;
  } catch (error) {
    console.error("Error al crear el paciente:", error);
    throw new Error("Hubo un error al crear el paciente. Intenta nuevamente.");
  }
};
