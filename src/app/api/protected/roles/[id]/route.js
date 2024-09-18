// src/app/api/protected/roles/[id]/route.js
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

// Obtener rol por ID
export async function GET(req, { params }) {
  return handleRequest(req, async () => {
    const { id } = params;
    const rol = await prisma.roles.findUnique({ where: { id: Number(id) } });
    if (!rol) {
      return NextResponse.json({ error: "El rol no existe" }, { status: 404 });
    }
    return NextResponse.json(rol);
  });
}

// Actualizar rol por ID
export async function PUT(req, { params }) {
  return handleRequest(req, async () => {
    const { id } = params;
    const body = await req.json();

    const rolExistente = await prisma.roles.findUnique({
      where: { id: Number(id) },
    });
    if (!rolExistente) {
      return NextResponse.json({ error: "El rol no existe" }, { status: 404 });
    }

    const actualizarRol = await prisma.roles.update({
      where: { id: Number(id) },
      data: body,
    });
    return NextResponse.json({
      message: "Rol actualizado exitosamente",
      rol: actualizarRol,
    });
  });
}

// Eliminar rol por ID
export async function DELETE(req, { params }) {
  return handleRequest(req, async () => {
    const { id } = params;

    const rolExistente = await prisma.roles.findUnique({
      where: { id: Number(id) },
    });
    if (!rolExistente) {
      return NextResponse.json({ error: "El rol no existe" }, { status: 404 });
    }

    await prisma.roles.delete({ where: { id: Number(id) } });
    return NextResponse.json({ message: "Rol eliminado correctamente" });
  });
}
