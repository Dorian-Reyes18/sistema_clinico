// src/middlewares/authMiddleware.js

import { verifyToken } from "@/libs/jwt";
import { NextResponse } from "next/server";

export async function authenticateRequest(request) {
  try {
    // Obtener el token del encabezado Authorization
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Se requiere autenticación" },
        { status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "");

    // Verificar el token
    const user = await verifyToken(token);
    if (!user) {
      return NextResponse.json(
        { error: "Autenticación fallida" },
        { status: 401 }
      );
    }

    // Si la autenticación es exitosa, devolver el usuario
    return { user };
  } catch (error) {
    console.error("Error al verificar el token:", error);
    return NextResponse.json(
      { error: "Error al verificar el token" },
      { status: 500 }
    );
  }
}
