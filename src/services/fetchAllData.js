import apiUrl from "@/global/apiURL";
import createAuthHeaders from "./authUtils";

const fetchData = async (endpoint, token) => {
  const response = await fetch(`${apiUrl}${endpoint}`, {
    method: "GET",
    headers: createAuthHeaders(token),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Error al obtener datos");
  }

  return await response.json();
};

export const fetchPatients = async (token) => {
  return fetchData("/protected/pacientes", token);
};

export const fetchUserData = async (userId, token) => {
  return fetchData(`/protected/usuarios/${userId}`, token);
};

export const fetchRecentSurgeries = async (token) => {
  return fetchData("/protected/orden_quirurgica_intra", token);
};

export const fetchSurgeriesPost = async (token) => {
  return fetchData("/protected/orden_quirurgica_post", token);
};
