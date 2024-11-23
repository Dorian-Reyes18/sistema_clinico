import axios from "axios";
import createAuthHeaders from "@/services/authUtils";
import apiUrl from "@/global/apiURL";

// Función para crear el cónyuge
export const postConyuge = async (data, token) => {
  const dataParset = data.find((f) =>
    f.formName === "ConyugeForm" ? f.data : null
  );
  const dataJson = JSON.stringify(dataParset.data, null, 2);
  try {
    const headers = createAuthHeaders(token);

    const response = await axios.post(`${apiUrl}/protected/conyuge`, dataJson, {
      headers,
    });

    // Retornar la respuesta del servidor
    return response.data;
  } catch (error) {
    console.error("Error al crear el cónyuge:", error);
    throw new Error("Hubo un error al crear el cónyuge. Intenta nuevamente.");
  }
};
