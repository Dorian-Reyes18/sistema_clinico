import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { authenticateRequest } from "@/middlewares/authMiddleware";

const handleError = (error, defaultMessage, status = 500) => {
  console.error(defaultMessage, error);
  if (error.code === "P2025") {
    return NextResponse.json(
      { error: "Registro no encontrado." },
      { status: 404 }
    );
  }
  return NextResponse.json({ error: defaultMessage }, { status });
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

// GET - Obtener un registro de Intrauterina Abierta por ID
export async function GET(req, { params }) {
  return handleRequest(req, async () => {
    const { id } = params;

    if (isNaN(id) || parseInt(id) <= 0) {
      return NextResponse.json({ error: "ID no válido." }, { status: 400 });
    }

    try {
      const registro = await prisma.intrauterinaAbierta.findUnique({
        where: { id: parseInt(id) },
      });

      if (!registro) {
        return NextResponse.json(
          { error: "Registro no encontrado" },
          { status: 404 }
        );
      }

      return NextResponse.json(registro);
    } catch (error) {
      return handleError(
        error,
        "Error al obtener el registro de Intrauterina Abierta"
      );
    }
  });
}

// PUT - Actualizar un registro de Intrauterina Abierta por ID
export async function PUT(req, { params }) {
  return handleRequest(req, async () => {
    const { id } = params;
    const data = await req.json();

    if (isNaN(id) || parseInt(id) <= 0) {
      return NextResponse.json({ error: "ID no válido." }, { status: 400 });
    }

    try {
      const registro = await prisma.intrauterinaAbierta.update({
        where: { id: parseInt(id) },
        data,
      });

      return NextResponse.json({
        message: "Registro de Intrauterina Abierta actualizado exitosamente",
        registro,
      });
    } catch (error) {
      return handleError(
        error,
        "Error al actualizar el registro de Intrauterina Abierta"
      );
    }
  });
}

// DELETE - Eliminar un registro de Intrauterina Abierta por ID
export async function DELETE(req, { params }) {
  return handleRequest(req, async () => {
    const { id } = params;

    if (isNaN(id) || parseInt(id) <= 0) {
      return NextResponse.json({ error: "ID no válido." }, { status: 400 });
    }

    try {
      const registroExistente = await prisma.intrauterinaAbierta.findUnique({
        where: { id: parseInt(id) },
      });

      if (!registroExistente) {
        return NextResponse.json(
          { error: "El registro no existe." },
          { status: 404 }
        );
      }

      await prisma.intrauterinaAbierta.delete({
        where: { id: parseInt(id) },
      });

      return NextResponse.json(
        { message: "Registro de Intrauterina Abierta eliminado exitosamente" },
        { status: 200 }
      );
    } catch (error) {
      return handleError(
        error,
        "Error al eliminar el registro de Intrauterina Abierta"
      );
    }
  });
}
