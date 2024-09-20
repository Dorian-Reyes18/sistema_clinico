import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { authenticateRequest } from "@/middlewares/authMiddleware";

const handleError = (error, defaultMessage, status = 500) => {
  console.error(defaultMessage, error);

  if (error.code === "P2025") {
    return NextResponse.json(
      { error: "Tipo de diabetes no encontrado." },
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

// GET - Obtener un registro de tipoDiabetes por ID
export async function GET(req, { params }) {
  return handleRequest(req, async () => {
    const { id } = params;

    try {
      const tipoDiabetes = await prisma.tipoDiabetes.findUnique({
        where: { id: parseInt(id) },
        include: {
          pacientes: true, // Anidación de los datos del paciente
        },
      });
      if (!tipoDiabetes) {
        return NextResponse.json(
          { error: "Tipo de diabetes no encontrado" },
          { status: 404 }
        );
      }
      return NextResponse.json(tipoDiabetes);
    } catch (error) {
      return handleError(error, "Error al obtener el tipo de diabetes");
    }
  });
}

// PUT - Actualizar un registro de tipoDiabetes
export async function PUT(req, { params }) {
  return handleRequest(req, async () => {
    const { id } = params;
    const data = await req.json();

    try {
      const tipoDiabetesActualizado = await prisma.tipoDiabetes.update({
        where: { id: parseInt(id) },
        data,
      });
      return NextResponse.json({
        message: "Tipo de diabetes actualizado exitosamente",
        tipoDiabetes: tipoDiabetesActualizado,
      });
    } catch (error) {
      return handleError(error, "Error al actualizar el tipoDiabetes");
    }
  });
}
// DELETE - Eliminar un registro de tipoDiabetes
export async function DELETE(req, { params }) {
  return handleRequest(req, async () => {
    const { id } = params;

    // Verifica si el tipo de diabetes existe
    const tipoDiabetesExistente = await prisma.tipoDiabetes.findUnique({
      where: { id: parseInt(id) },
    });

    if (!tipoDiabetesExistente) {
      return NextResponse.json(
        { error: "El registro no fue encontrado." },
        { status: 404 }
      );
    }

    // Verifica si hay pacientes asociados
    const count = await prisma.paciente.count({
      where: {
        tipoDiabetes: {
          some: { id: parseInt(id) }, // Ajusta esto para verificar la relación correctamente
        },
      },
    });

    if (count > 0) {
      return NextResponse.json(
        {
          error:
            "No se puede eliminar este tipo de diabetes porque está asociado con otros pacientes.",
        },
        { status: 400 }
      );
    }

    try {
      await prisma.tipoDiabetes.delete({
        where: { id: parseInt(id) },
      });
      return NextResponse.json(
        {
          message: "Tipo de diabetes eliminado exitosamente",
        },
        { status: 204 }
      );
    } catch (error) {
      return handleError(error, "Error al eliminar el tipo de diabetes");
    }
  });
}
