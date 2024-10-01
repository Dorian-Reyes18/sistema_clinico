import { useEffect, useState } from "react";
import { fetchRecentSurgeries } from "../../services/fetchSurgerys"; // Asegúrate de que la ruta es correcta
import { useAuth } from "../hooks/authContext";

const useRecentSurgeries = () => {
  const { token } = useAuth();
  const [surgeries, setSurgeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getSurgeries = async () => {
      setLoading(true);
      try {
        console.log("Token:", token); 
        const data = await fetchRecentSurgeries(token);
        setSurgeries(data);
      } catch (error) {
        console.error("Error en fetchRecentSurgeries:", error); 
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      getSurgeries();
    } else {
      setLoading(false);
      setError("No se ha encontrado un token de autenticación.");
    }
  }, [token]);

  return { surgeries, loading, error };
};

export default useRecentSurgeries;
