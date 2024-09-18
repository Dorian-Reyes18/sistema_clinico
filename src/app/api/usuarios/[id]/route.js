import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import bcrypt from "bcryptjs";

export async function GET(req, { params }) {
  const { id } = params;
  try {
    const usuario = await prisma.usuarios.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!usuario) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }
    return NextResponse.json(usuario);
  } catch (error) {
    console.error("error al obtener el usuario: ", error);
    return NextResponse.json(
      { error: "Error al obtener el usuario" },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  const { id } = params;
  const body = await req.json();

  try {
    if (body.contrasena) {
      body.contrasena = await bcrypt.hash(body.contrasena, 10);
    }

    const usuarioActualizado = await prisma.usuarios.update({
      where: { id: parseInt(id, 10) },
      data: body,
    });

    return NextResponse.json({
      message: "Usuario actualizado exitosamente",
      usuario: usuarioActualizado,
    });
  } catch (error) {
    console.error("error al actualizar el usuario: ", error);
    return NextResponse.json(
      { error: "Error al actualizar el usuario" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const { id } = params;

  try {
    const usuarioEliminado = await prisma.usuarios.delete({
      where: { id: parseInt(id, 10) },
    });

    return NextResponse.json({
      message: "Usuario eliminado exitosamente",
      usuario: usuarioEliminado,
    });
  } catch (error) {
    console.error("error al eliminar el usuario: ", error);
    return NextResponse.json(
      { error: "Error al eliminar el usuario" },
      { status: 500 }
    );
  }
}
