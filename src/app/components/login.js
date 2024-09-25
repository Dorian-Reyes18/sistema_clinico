"use client"; // Asegúrate de que este componente se ejecute en el lado del cliente

import { useState } from "react";
import { useRouter } from "next/navigation"; // Cambiado a next/navigation

const Login = () => {
  const [telefono, setTelefono] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter(); // Hook de Next.js para la navegación

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        // Endpoint actualizado
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ telefono, contrasena }), // Cuerpo con teléfono y contraseña
      });

      if (!response.ok) {
        throw new Error("Error en el login"); // Manejo de errores
      }

      const { token } = await response.json(); // Suponiendo que recibes el token
      console.log("Token", token);
      localStorage.setItem("token", token); // Guarda el token en localStorage

      // Redirige a la página de inicio
      router.push("/home"); // Asegúrate de que esta ruta sea correcta
    } catch (error) {
      setError(error.message); // Muestra el error en el componente
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <div>
        <label>Teléfono:</label>
        <input
          type="text"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Contraseña:</label>
        <input
          type="password"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          required
        />
      </div>
      <button type="submit">Iniciar Sesión</button>
      {error && <p>{error}</p>} {/* Muestra mensaje de error */}
    </form>
  );
};

export default Login;
