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
  // Llamamos al middleware para autenticar la solicitud
  const authResult = await authenticateRequest(req);

  // Si la autenticación falla, devolvemos la respuesta con el error
  if (authResult) return authResult;

  // Si la autenticación es exitosa, continuamos con la operación CRUD
  try {
    return await operation();
  } catch (error) {
    return handleError(error, "Error al procesar la solicitud");
  }
};

// Obtener todos los roles (GET)
export async function GET(request) {
  return handleRequest(request, async () => {
    const roles = await prisma.roles.findMany();
    return NextResponse.json(roles);
  });
}

// Crear un nuevo rol (POST)
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
