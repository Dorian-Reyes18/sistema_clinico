import { useState } from "react";
import { useRouter } from "next/navigation";
import jwt from "jsonwebtoken";
import { useAuth } from "../hooks/authContext";
import { Button, Spin, notification } from "antd";
import apiUrl from "../../global/apiURL";
import ReCAPTCHA from "react-google-recaptcha"; // Importa el componente

const Login = () => {
  const [telefono, setTelefono] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [captchaValue, setCaptchaValue] = useState(null); // Guarda el valor del CAPTCHA
  const router = useRouter();
  const { setToken, loadData } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    // Verificar si el CAPTCHA es válido
    if (!captchaValue) {
      setError("Por favor, verifique el CAPTCHA.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ telefono, contrasena, captchaValue }), // Incluye el valor del CAPTCHA
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Error inesperado");
        return;
      }

      const { token } = await response.json();
      document.cookie =
        "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
      const expirationDate = new Date(Date.now() + 86400e3).toUTCString();
      document.cookie = `token=${token}; path=/; expires=${expirationDate};`;

      const decodedToken = jwt.decode(token);
      if (decodedToken) {
        setToken(token);
        await loadData(decodedToken.id, token);
      }

      notification.success({
        message: "Éxito",
        description: "Sesión iniciada correctamente",
        placement: "topRight",
        duration: 2,
      });

      setIsRedirecting(true);
      router.push("/home");
    } catch (error) {
      console.error("Error inesperado:", error);
      setError("Error inesperado al iniciar sesión");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <div className="form-group">
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
          disabled={isSubmitting || isRedirecting}
        />
      </div>
      <div className="form-group">
        <label>
          <strong style={{ fontSize: 14 }}>Contraseña:</strong>
        </label>
        <input
          type="password"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          required
          className="form-control"
          placeholder="Escriba su contraseña"
          disabled={isSubmitting || isRedirecting}
        />
      </div>

      {/* Aquí se agrega el reCAPTCHA */}
      <div className="form-group">
        <ReCAPTCHA
          sitekey="6LeY4pIqAAAAAA3Mi5wyMUOgHDNV3cSAcAhvvIDz" // Reemplaza con tu clave de sitio
          onChange={(value) => setCaptchaValue(value)}
        />
      </div>

      <button
        className="btn btn-primary btn-rosa"
        type="submit"
        disabled={isSubmitting || isRedirecting}
      >
        {isSubmitting || isRedirecting ? (
          <Spin size="small" className="spin-login" />
        ) : (
          <strong>Iniciar Sesión</strong>
        )}
      </button>
      {error && <p style={{ color: "red", fontSize: 14 }}>*{error}</p>}
    </form>
  );
};

export default Login;
