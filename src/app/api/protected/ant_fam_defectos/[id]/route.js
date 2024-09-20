import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { authenticateRequest } from "@/middlewares/authMiddleware";

const handleError = (error, defaultMessage, status = 500) => {
  console.error(defaultMessage, error);

  if (error.code === "P2025") {
    return NextResponse.json(
      { error: "Antecedente familiar no encontrado." },
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

// GET - Obtener un antecedente familiar por ID
export async function GET(req, { params }) {
  return handleRequest(req, async () => {
    const { id } = params;

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: "El ID proporcionado es inválido o está ausente." },
        { status: 400 }
      );
    }

    try {
      const antecedente =
        await prisma.antecedentesFamiliaresDefectos.findUnique({
          where: { id: parseInt(id) },
          include: {
            paciente: true, // Anidación de datos del paciente
          },
        });

      if (!antecedente) {
        return NextResponse.json(
          { error: "Antecedente familiar no encontrado." },
          { status: 404 }
        );
      }

      return NextResponse.json(antecedente);
    } catch (error) {
      return handleError(error, "Error al obtener el antecedente familiar");
    }
  });
}

// PUT - Actualizar un antecedente familiar
export async function PUT(req, { params }) {
  return handleRequest(req, async () => {
    const { id } = params;

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: "El ID proporcionado es inválido o está ausente." },
        { status: 400 }
      );
    }

    try {
      const data = await req.json(); // Puede lanzar un error si el JSON es inválido

      // Verifica si el antecedente existe
      const antecedenteExistente =
        await prisma.antecedentesFamiliaresDefectos.findUnique({
          where: { id: parseInt(id) },
        });

      if (!antecedenteExistente) {
        return NextResponse.json(
          { error: "Antecedente familiar no encontrado." },
          { status: 404 }
        );
      }

      const antecedenteActualizado =
        await prisma.antecedentesFamiliaresDefectos.update({
          where: { id: parseInt(id) },
          data,
        });

      return NextResponse.json({
        message: "Antecedente familiar actualizado exitosamente",
        antecedente: antecedenteActualizado,
      });
    } catch (error) {
      if (error instanceof SyntaxError) {
        return NextResponse.json(
          { error: "El cuerpo de la solicitud debe ser un JSON válido." },
          { status: 400 }
        );
      }
      return handleError(error, "Error al actualizar el antecedente familiar");
    }
  });
}

// DELETE - Eliminar un antecedente familiar
export async function DELETE(req, { params }) {
  return handleRequest(req, async () => {
    const { id } = params;

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: "El ID proporcionado es inválido o está ausente." },
        { status: 400 }
      );
    }

    // Verifica si el antecedente familiar existe
    const antecedenteExistente =
      await prisma.antecedentesFamiliaresDefectos.findUnique({
        where: { id: parseInt(id) },
      });

    if (!antecedenteExistente) {
      return NextResponse.json(
        { error: "Antecedente familiar no encontrado." },
        { status: 404 }
      );
    }

    // Verifica si hay relaciones asociadas
    const count = await prisma.paciente.count({
      where: {
        antecedentesFamiliaresDefectos: {
          some: { id: parseInt(id) },
        },
      },
    });

    if (count > 0) {
      return NextResponse.json(
        {
          error:
            "No se puede eliminar este antecedente familiar porque está asociado con otros registros.",
        },
        { status: 400 }
      );
    }

    try {
      await prisma.antecedentesFamiliaresDefectos.delete({
        where: { id: parseInt(id) },
      });
      // Respuesta sin contenido
      return NextResponse.next({ status: 204 });
    } catch (error) {
      return handleError(error, "Error al eliminar el antecedente familiar");
    }
  });
}
