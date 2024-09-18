import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { verifyToken } from "@/libs/jwt"; // Importa la función de verificación de token

// Obtener rol por ID
export async function GET(req, { params }) {
  try {
    // Obtener el token del encabezado de autorización
    const token = req.headers.get("authorization")?.replace("Bearer ", "");

    // Verificar el token
    const decodedToken = verifyToken(token);

    if (!decodedToken) {
      return NextResponse.json(
        { error: "Token inválido o no proporcionado" },
        { status: 401 }
      );
    }

    const { id } = params;
    const rol = await prisma.roles.findUnique({
      where: { id: Number(id) },
    });

    if (!rol) {
      return NextResponse.json({ error: "El rol no existe" }, { status: 404 });
    }

    return NextResponse.json(rol);
  } catch (error) {
    console.error("Error al solicitar el rol:", error);
    return NextResponse.json(
      { error: "Error al solicitar el Rol" },
      { status: 500 }
    );
  }
}

// Actualizar rol por ID
export async function PUT(req, { params }) {
  try {
    // Obtener el token del encabezado de autorización
    const token = req.headers.get("authorization")?.replace("Bearer ", "");

    // Verificar el token
    const decodedToken = verifyToken(token);

    if (!decodedToken) {
      return NextResponse.json(
        { error: "Token inválido o no proporcionado" },
        { status: 401 }
      );
    }

    const { id } = params;
    const body = await req.json();

    // Verificar si el rol existe antes de actualizar
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
  } catch (error) {
    console.error("Error al actualizar rol:", error);
    return NextResponse.json(
      { error: "Error al actualizar el rol" },
      { status: 500 }
    );
  }
}

// Eliminar rol por ID
export async function DELETE(req, { params }) {
  try {
    // Obtener el token del encabezado de autorización
    const token = req.headers.get("authorization")?.replace("Bearer ", "");

    // Verificar el token
    const decodedToken = verifyToken(token);

    if (!decodedToken) {
      return NextResponse.json(
        { error: "Token inválido o no proporcionado" },
        { status: 401 }
      );
    }

    const { id } = params;

    // Verificar si el rol existe antes de eliminar
    const rolExistente = await prisma.roles.findUnique({
      where: { id: Number(id) },
    });

    if (!rolExistente) {
      return NextResponse.json({ error: "El rol no existe" }, { status: 404 });
    }

    await prisma.roles.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: "Rol eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar rol:", error);
    return NextResponse.json(
      { error: "Error, no se pudo eliminar el rol" },
      { status: 500 }
    );
  }
}
