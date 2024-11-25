import { NextResponse } from "next/server";
import { verifyToken } from "@/libs/jwt";

export async function authenticateRequest(req) {
  console.log("Middleware ejecutado");

  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    console.log("No se proporcionó un token de autorización");
    return NextResponse.json(
      { error: "No se proporcionó un token de autorización" },
      { status: 401 }
    );
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    console.log("Token no válido o no proporcionado");
    return NextResponse.json(
      { error: "Token no válido o no proporcionado" },
      { status: 401 }
    );
  }

  const decoded = verifyToken(token); 
  if (!decoded) {
    console.log("Token inválido o expirado");
    return NextResponse.json(
      { error: "Token inválido o expirado" },
      { status: 401 }
    );
  }

  // Almacenamos la información del usuario decodificado para futuras consultas
  req.user = decoded;

  console.log("Token válido, usuario decodificado:", decoded);
  return null;
}
