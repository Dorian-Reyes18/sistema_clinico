import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { authenticateRequest } from "@/middlewares/authMiddleware";

const handleError = (error, message, status = 500) => {
  console.error(message, error);
  return NextResponse.json({ error: message }, { status });
};

const handleRequest = async (req, operation) => {
  const authResult = await authenticateRequest(req);

  if (authResult) return authResult;

  try {
    return await operation();
  } catch (error) {
    return handleError(error, "Error al procesar la solicitud");
  }
};

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
