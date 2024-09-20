import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { authenticateRequest } from "@/middlewares/authMiddleware";

const handleError = (error, defaultMessage, status = 500) => {
  console.error(defaultMessage, error);

  // Manejo específico para errores de Prisma
  if (error.code === "P2025") {
    return NextResponse.json(
      { error: "Paciente no encontrado." },
      { status: 404 }
    );
  }

  // Manejo de errores de validación específica
  if (error.message.includes("Invalid value")) {
    return NextResponse.json(
      { error: "Valor inválido proporcionado para uno o más campos." },
      { status: 400 }
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

export async function GET(req, { params }) {
  return handleRequest(req, async () => {
    const { id } = params;
    try {
      const paciente = await prisma.paciente.findUnique({
        where: { id: parseInt(id) },
        include: {
          conyuge: {
            include: {
              sangreRh: true, // Incluye los datos de SangreRH
            },
          },
        },
      });
      if (!paciente) {
        return NextResponse.json(
          { error: "Paciente no encontrado" },
          { status: 404 }
        );
      }
      return NextResponse.json(paciente);
    } catch (error) {
      return handleError(error, "Error al obtener el paciente");
    }
  });
}

export async function PUT(req, { params }) {
  return handleRequest(req, async () => {
    const { id } = params;
    const data = await req.json();

    // Log para depurar los datos recibidos
    console.log("Datos recibidos para actualización:", data);

    // Validar campos
    if (data.conyugeId) {
      const conyuge = await prisma.conyuge.findUnique({
        where: { id: data.conyugeId },
      });
      if (!conyuge) {
        return NextResponse.json(
          { error: "El conyuge especificado no existe." },
          { status: 400 }
        );
      }
    }

    try {
      const paciente = await prisma.paciente.update({
        where: { id: parseInt(id) },
        data,
      });
      return NextResponse.json({
        message: "Paciente actualizado exitosamente",
        paciente,
      });
    } catch (error) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { error: "Paciente no encontrado." },
          { status: 404 }
        );
      }
      return handleError(error, "Error al actualizar el paciente");
    }
  });
}

export async function DELETE(req, { params }) {
  return handleRequest(req, async () => {
    const { id } = params;

    try {
      await prisma.paciente.delete({
        where: { id: parseInt(id) },
      });
      return NextResponse.json(
        {
          message: "Paciente eliminado exitosamente",
        },
        { status: 204 }
      );
    } catch (error) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { error: "Paciente no encontrado." },
          { status: 404 }
        );
      }
      return handleError(
        error,
        "Error al eliminar el paciente, tiene registros asociados"
      );
    }
  });
}
