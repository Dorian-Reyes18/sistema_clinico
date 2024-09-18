import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(request) {
  const authHeader = request.headers.get("authorization");
  console.log("Authorization Header:", authHeader); // Verificar que el header Authorization esté presente

  const token = authHeader?.replace("Bearer ", "");
  console.log("Token recibido:", token); // Verificar que el token esté presente

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Token decodificado:", decoded); // Verificar el contenido del token decodificado

      // Crear la respuesta y agregar la cookie con la información del usuario
      const response = NextResponse.next();
      response.cookies.set("user", JSON.stringify(decoded), {
        // Eliminé httpOnly para permitir acceso desde cliente
        sameSite: "strict",
      });
      console.log("Cookie establecida:", response.cookies.get("user")); // Verificar que la cookie esté siendo configurada
      return response;
    } catch (error) {
      console.error("Error al verificar el token:", error);
      return NextResponse.json(
        { error: "Token inválido o expirado" },
        { status: 401 }
      );
    }
  }

  console.log("No se envió el token");
  return NextResponse.json(
    { error: "Se requiere autenticación" },
    { status: 401 }
  );
}

// Configuración del middleware
export const config = {
  matcher: ["/api/protected/**"],
};
