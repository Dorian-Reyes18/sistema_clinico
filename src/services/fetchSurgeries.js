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
