import apiUrl from "@/global/apiURL";

export const fetchSurgeriesPost = async (token) => {
  const response = await fetch(`${apiUrl}/protected/orden_quirurgica_post`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Error al obtener cirugías recientes");
  }
  const data = await response.json();
  return data;
};
