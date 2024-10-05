import apiUrl from "@/global/apiURL";

export const fetchPatients = async (token) => {
  try {
    const response = await fetch(`${apiUrl}/protected/pacientes`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || "Hubo un error al obtener los datos del paciente"
      );
    }

    const patientData = await response.json();
    return patientData;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};
