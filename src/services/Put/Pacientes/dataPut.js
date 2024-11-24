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
export const putAntecedentesFamiliares = (id, data, token) =>
  putData("ant_fam_defectos", id, data, token);

// Función para actualizar antecedentes obstétricos
export const putAntecedentesObstetricos = (id, data, token) =>
  putData("ant_obstetricos", id, data, token);

// Función para actualizar antecedentes personales
export const putAntecedentesPersonales = (id, data, token) =>
  putData("ant_personales", id, data, token);

// Función para actualizar el cónyuge
export const putConyuge = (id, data, token) =>
  putData("conyuge", id, data, token);

// Función para actualizar diabetes
export const putDiabetes = (id, data, token) =>
  putData("tipo_diabetes", id, data, token);

// Función para actualizar embarazo actual
export const putEmbarazoActual = (id, data, token) =>
  putData("embarazo_actual", id, data, token);

// Función para actualizar paciente
export const putPaciente = (id, data, token) =>
  putData("pacientes", id, data, token);
