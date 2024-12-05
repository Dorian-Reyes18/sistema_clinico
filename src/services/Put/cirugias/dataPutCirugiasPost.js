// services/PutData.js
import axios from "axios";
import createAuthHeaders from "@/services/authUtils";
import apiUrl from "@/global/apiURL";

// Función para hacer put de los datos
const putData = async (endpoint, id, data, token) => {
  const dataJson = JSON.stringify(data, null, 2);
  try {
    const headers = createAuthHeaders(token);
    const response = await axios.put(
      `${apiUrl}/protected/${endpoint}/${id}`,
      dataJson,
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error(`Error al enviar los datos a ${endpoint}:`, error);
    throw new Error(`Hubo un error al enviar los datos. Intenta nuevamente.`);
  }
};

// Función para actualizar antecedentes familiares
export const putOrdenPosnatal = (id, data, token) =>
  putData("orden_quirurgica_post", id, data, token);

// Función para actualizar antecedentes obstétricos
export const putNeonatal = (id, data, token) =>
  putData("cirugia_neonatal", id, data, token);

// Función para actualizar antecedentes personales
export const putNerviosoCentral = (id, data, token) =>
  putData("cirugia_nervioso_central", id, data, token);
