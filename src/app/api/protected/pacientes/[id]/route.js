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
    if (data.numeroExpediente && typeof data.numeroExpediente !== "string") {
      return NextResponse.json(
        { error: "El campo 'numeroExpediente' debe ser una cadena." },
        { status: 400 }
      );
    }

    if (data.fechaNac && isNaN(Date.parse(data.fechaNac))) {
      return NextResponse.json(
        {
          error:
            "El campo 'fechaNac' debe ser una fecha válida en formato ISO-8601.",
        },
        { status: 400 }
      );
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
      return handleError(error, "Error al eliminar el paciente");
    }
  });
}
