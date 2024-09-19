import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { authenticateRequest } from "@/middlewares/authMiddleware";
import bcrypt from "bcryptjs";

// Obtener usuario por ID
export async function GET(req, { params }) {
  const authResult = await authenticateRequest(req);
  if (authResult) return authResult;

  const { id } = params;

  // Validar si el ID es válido
  if (!id || isNaN(parseInt(id, 10))) {
    return NextResponse.json(
      { error: "El ID proporcionado es inválido o está ausente" },
      { status: 400 }
    );
  }

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
    console.error("Error al obtener el usuario: ", error);
    return NextResponse.json(
      {
        error:
          "Error al obtener el usuario. Por favor, intente de nuevo más tarde.",
      },
      { status: 500 }
    );
  }
}

// Actualizar usuario por ID
export async function PUT(req, { params }) {
  const authResult = await authenticateRequest(req);
  if (authResult) return authResult;

  const { id } = params;

  // Validar si el ID es válido
  if (!id || isNaN(parseInt(id, 10))) {
    return NextResponse.json(
      { error: "El ID proporcionado es inválido o está ausente" },
      { status: 400 }
    );
  }

  let body;
  try {
    body = await req.json();
  } catch (error) {
    return NextResponse.json(
      {
        error:
          "Cuerpo de la solicitud inválido. Asegúrese de que el formato sea JSON.",
      },
      { status: 400 }
    );
  }

  // Validar si el cuerpo contiene datos
  if (!Object.keys(body).length) {
    return NextResponse.json(
      { error: "No se proporcionaron datos para actualizar." },
      { status: 400 }
    );
  }

  try {
    // Hash de la contraseña si está presente
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
    console.error("Error al actualizar el usuario: ", error);

    // Detectar error específico si el ID no existe
    if (error.code === "P2025") {
      return NextResponse.json(
        {
          error:
            "No se encontró ningún usuario con el ID proporcionado para actualizar.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        error:
          "Error al actualizar el usuario. Por favor, intente de nuevo más tarde.",
      },
      { status: 500 }
    );
  }
}

// Eliminar usuario por ID
export async function DELETE(req, { params }) {
  const authResult = await authenticateRequest(req);
  if (authResult) return authResult;

  const { id } = params;

  // Validar si el ID es válido
  if (!id || isNaN(parseInt(id, 10))) {
    return NextResponse.json(
      { error: "El ID proporcionado es inválido o está ausente" },
      { status: 400 }
    );
  }

  try {
    const usuarioEliminado = await prisma.usuarios.delete({
      where: { id: parseInt(id, 10) },
    });

    return NextResponse.json({
      message: "Usuario eliminado exitosamente",
      usuario: usuarioEliminado,
    });
  } catch (error) {
    console.error("Error al eliminar el usuario: ", error);

    // Detectar error específico si el ID no existe
    if (error.code === "P2025") {
      return NextResponse.json(
        {
          error:
            "No se encontró ningún usuario con el ID proporcionado para eliminar.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        error:
          "Error al eliminar el usuario. Por favor, intente de nuevo más tarde.",
      },
      { status: 500 }
    );
  }
}
