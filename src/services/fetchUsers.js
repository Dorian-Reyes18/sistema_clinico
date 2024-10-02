import apiUrl from "../global/apiURL";

export const fetchUserData = async (userId, token) => {
  try {
    const response = await fetch(`${apiUrl}/protected/usuarios/${userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al obtener datos del usuario");
    }

    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error("Error al obtener datos del usuario:", error);
    throw new Error("Error inesperado al obtener datos del usuario");
  }
};
