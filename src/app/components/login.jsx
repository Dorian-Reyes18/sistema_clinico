"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const Login = () => {
  const [telefono, setTelefono] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ telefono, contrasena }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Error inesperado");
        return;
      }

      const { token } = await response.json();
      localStorage.setItem("token", token);

      router.push("/home");
    } catch (error) {
      console.error("Error inesperado:", error);
      setError("Error inesperado al iniciar sesión");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <div className="form-group ">
        <label>
          <strong style={{ fontSize: 14 }}>Teléfono:</strong>
        </label>
        <input
          type="text"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          required
          className="form-control"
          placeholder="Escriba su teléfono"
        />
      </div>
      <div>
        <label>
          {" "}
          <strong style={{ fontSize: 14 }}>Contraseña:</strong>
        </label>
        <input
          type="password"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          required
          className="form-control"
          placeholder="Escriba su contraseña"
        />
      </div>
      <button className="btn btn-primary btn-rosa" type="submit">
        <strong>Iniciar Sesión</strong>
      </button>
      {error && <p style={{ color: "red", fontSize: 14 }}>{error}</p>}{" "}
      {/* Muestra mensaje de error */}
    </form>
  );
};

export default Login;
