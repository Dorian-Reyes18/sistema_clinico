import axios from "axios";
import createAuthHeaders from "@/services/authUtils";
import apiUrl from "@/global/apiURL";

// Función para crear antecedentes obstétricos
export const postAntecedentesObstetricos = async (data, token) => {
  const dataJson = JSON.stringify(data, null, 2);
  try {
    const headers = createAuthHeaders(token);

    const response = await axios.post(
      `${apiUrl}/protected/ant_obstetricos`,
      dataJson,
      {
        headers,
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error al crear los antecedentes obstétricos:", error);
    throw new Error("Hubo un error al crear los antecedentes obstétricos. Intenta nuevamente.");
  }
};
