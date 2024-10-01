export const fetchRecentSurgeries = async (token) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/protected/orden_quirurgica_intra`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Error al obtener cirugías");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en fetchRecentSurgeries:", error);
    throw error;
  }
};
