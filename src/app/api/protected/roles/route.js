// src/app/api/protected/roles/route.js
import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { authenticateRequest } from "@/middlewares/authMiddleware";

// Función auxiliar para manejar errores
const handleError = (error, message, status = 500) => {
  console.error(message, error);
  return NextResponse.json({ error: message }, { status });
};

// Función auxiliar para manejar autenticación y operaciones CRUD
const handleRequest = async (req, operation) => {
  const authResult = await authenticateRequest(req);
  if (authResult.error) return authResult;

  try {
    return await operation();
  } catch (error) {
    return handleError(error, "Error al procesar la solicitud");
  }
};

// Obtener todos los roles
export async function GET(request) {
  return handleRequest(request, async () => {
    const roles = await prisma.roles.findMany();
    return NextResponse.json(roles);
  });
}

// Crear un nuevo rol
export async function POST(request) {
  return handleRequest(request, async () => {
    const body = await request.json();
    const nuevoRol = await prisma.roles.create({
      data: body,
    });
    return NextResponse.json({
      message: "Rol creado exitosamente",
      rol: nuevoRol,
    });
  });
}
