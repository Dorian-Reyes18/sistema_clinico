import axios from "axios";
import createAuthHeaders from "@/services/authUtils";
import apiUrl from "@/global/apiURL";

// Función para crear el cónyuge
export const postDiabetes = async (data, token) => {
  const dataJson = JSON.stringify(data, null, 2);
  try {
    const headers = createAuthHeaders(token);

    const response = await axios.post(
      `${apiUrl}/protected/tipo_diabetes`,
      dataJson,
      {
        headers,
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error al crear el tipo de diabetes:", error);
    throw new Error("Hubo un error al crear tipo de diabetes. Intenta nuevamente.");
  }
};
