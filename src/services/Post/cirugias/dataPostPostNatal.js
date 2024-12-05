// services/PostData.js
import axios from "axios";
import createAuthHeaders from "@/services/authUtils";
import apiUrl from "@/global/apiURL";

// Función para hacer post de los datos
const postDataIntra = async (endpoint, data, token) => {
  const dataJson = JSON.stringify(data, null, 2);
  try {
    const headers = createAuthHeaders(token);
    const response = await axios.post(
      `${apiUrl}/protected/${endpoint}`,
      dataJson,
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error(`Error al enviar los datos a ${endpoint}:`, error);
    throw new Error(`Hubo un error al enviar los datos. Intenta nuevamente.`);
  }
};

// Función para crear antecedentes familiares
export const postOrdenQuirugica = (data, token) =>
  postDataIntra("orden_quirurgica_post", data, token);

export const postNeonatal = (data, token) =>
  postDataIntra("cirugia_neonatal", data, token);

export const postNerviosoCentral = (data, token) =>
  postDataIntra("cirugia_nervioso_central", data, token);