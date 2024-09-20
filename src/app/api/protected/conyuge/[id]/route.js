import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { authenticateRequest } from "@/middlewares/authMiddleware";

const handleError = (error, defaultMessage, status = 500) => {
  console.error(defaultMessage, error);

  if (error.code === "P2025") {
    return NextResponse.json(
      { error: "Cónyuge no encontrado." },
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

// GET: Obtener un cónyuge por su id, incluyendo todas las relaciones
export async function GET(req, { params }) {
  return handleRequest(req, async () => {
    const { id } = params;
    const conyuge = await prisma.conyuge.findUnique({
      where: { id: parseInt(id) },
      include: {
        sangreRh: true, // Incluye los detalles del tipo de sangre
        pacientes: true, // Incluye los detalles del paciente relacionado
        // Aquí puedes incluir cualquier otra relación del modelo Conyuge
      },
    });
    if (!conyuge) {
      return NextResponse.json(
        { error: "Cónyuge no encontrado" },
        { status: 404 }
      );
    }
    return NextResponse.json(conyuge);
  });
}

// PUT: Actualizar un cónyuge
export async function PUT(req, { params }) {
  return handleRequest(req, async () => {
    const { id } = params;
    const data = await req.json();

    try {
      const conyuge = await prisma.conyuge.update({
        where: { id: parseInt(id) },
        data,
      });
      return NextResponse.json({
        message: "Cónyuge actualizado exitosamente",
        conyuge,
      });
    } catch (error) {
      return handleError(error, "Error al actualizar el cónyuge");
    }
  });
}

// DELETE: Eliminar un cónyuge
export async function DELETE(req, { params }) {
  return handleRequest(req, async () => {
    const { id } = params;

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: "El ID proporcionado es inválido o está ausente." },
        { status: 400 }
      );
    }

    // Verifica si el cónyuge existe
    const conyugeExistente = await prisma.conyuge.findUnique({
      where: { id: parseInt(id) },
    });

    if (!conyugeExistente) {
      return NextResponse.json(
        { error: "Cónyuge no encontrado." },
        { status: 404 }
      );
    }

    // Verifica si hay pacientes asociados
    const countPacientes = await prisma.paciente.count({
      where: {
        conyugeId: parseInt(id),
      },
    });

    if (countPacientes > 0) {
      return NextResponse.json(
        {
          error:
            "No se puede eliminar este cónyuge porque está asociado con otros pacientes.",
        },
        { status: 400 }
      );
    }

    try {
      await prisma.conyuge.delete({
        where: { id: parseInt(id) },
      });
      return NextResponse.json(
        {
          message: "Cónyuge eliminado exitosamente",
        },
        { status: 204 }
      );
    } catch (error) {
      return handleError(error, "Error al eliminar el cónyuge");
    }
  });
}
