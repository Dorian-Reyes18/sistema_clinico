// services/PostData.js
import axios from "axios";
import createAuthHeaders from "@/services/authUtils";
import apiUrl from "@/global/apiURL";

// Función para hacer post de los datos
const postData = async (endpoint, data, token) => {
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
export const postAntecedentesFamiliares = (data, token) =>
  postData("ant_fam_defectos", data, token);

// Función para crear antecedentes obstétricos
export const postAntecedentesObstetricos = (data, token) =>
  postData("ant_obstetricos", data, token);

// Función para crear antecedentes personales
export const postAntecedentesPersonales = (data, token) =>
  postData("ant_personales", data, token);

// Función para crear el cónyuge
export const postConyuge = (data, token) => postData("conyuge", data, token);

// Función para crear diabetes
export const postDiabetes = (data, token) =>
  postData("tipo_diabetes", data, token);

// Función para crear embarazo actual
export const postEmbarazoActual = (data, token) =>
  postData("embarazo_actual", data, token);

// Función para crear paciente
export const postPaciente = (data, token) => postData("pacientes", data, token);
