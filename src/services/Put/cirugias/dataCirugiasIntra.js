// services/PutData.js
import axios from "axios";
import createAuthHeaders from "@/services/authUtils";
import apiUrl from "@/global/apiURL";

// Función para hacer put de los datos
const putData = async (id, data, token) => {
  const dataJson = JSON.stringify(data, null, 2);
  try {
    const headers = createAuthHeaders(token);
    const response = await axios.put(
      `${apiUrl}/protected/orden_intra_completa/${id}`,
      dataJson,
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error(`Error al enviar los datos de cirugia}:`, error);
    throw new Error(`Hubo un error al enviar los datos. Intenta nuevamente.`);
  }
};

// Función para actualizar antecedentes familiares
export const putCirugiaPrenatalCompleta = (id, data, token) =>
  putData(id, data, token);
