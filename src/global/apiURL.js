const apiUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === "development"
    ? "http://localhost:3000/api"
    : "https://tu-dominio.com/api");

export default apiUrl;
