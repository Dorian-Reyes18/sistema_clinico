const apiUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === "development"
    ? "http://localhost:3000/api"
    : "http://localhost:3000/api");

export default apiUrl;
