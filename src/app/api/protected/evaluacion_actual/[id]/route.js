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

// Obtener evaluación actual por ID
export async function GET(req, { params }) {
  const authResult = await authenticateRequest(req);
  if (authResult) return authResult;

  const { id } = params;

  console.log("ID recibido:", id); // Log del ID recibido

  if (!id || isNaN(parseInt(id, 10))) {
    return NextResponse.json(
      { error: "El ID proporcionado es inválido o está ausente" },
      { status: 400 }
    );
  }

  try {
    const evaluacion = await prisma.evaluacionActual.findUnique({
      where: { id: parseInt(id, 10) },
      include: {
        paciente: true,
        tipoDiabetes: true,
      },
    });

    console.log("Evaluación encontrada:", evaluacion); // Log de la evaluación encontrada

    if (!evaluacion) {
      return NextResponse.json(
        { error: "Evaluación no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(evaluacion);
  } catch (error) {
    console.error("Error al obtener la evaluación actual:", error);
    return handleError(error, "Error al obtener la evaluación actual", 500);
  }
}

// Eliminar evaluación actual por ID
export async function DELETE(req, { params }) {
  const { id } = params;

  if (!id || isNaN(parseInt(id, 10))) {
    return NextResponse.json(
      { error: "El ID proporcionado es inválido o está ausente" },
      { status: 400 }
    );
  }

  return handleRequest(req, async () => {
    console.log(
      "Verificando si la evaluación existe y tiene relaciones antes de eliminarla con ID:",
      id
    );

    try {
      // Verificar si la evaluación existe
      const evaluacion = await prisma.evaluacionActual.findUnique({
        where: { id: parseInt(id, 10) },
      });

      if (!evaluacion) {
        return NextResponse.json(
          {
            error:
              "No se encontró ninguna evaluación con el ID proporcionado para eliminar.",
          },
          { status: 404 }
        );
      }

      // Verificar si existen registros relacionados con la evaluación actual
      const [resultado, diagnostico] = await prisma.$transaction([
        prisma.resultadosPerinatales.findFirst({
          where: { evaluacionActualId: parseInt(id, 10) }, // Ajusta el campo aquí
        }),
        prisma.diagnosticoPrenatal.findFirst({
          where: { evaluacionActualId: parseInt(id, 10) },
        }),
      ]);

      if (resultado || diagnostico) {
        return NextResponse.json(
          {
            error:
              "No se puede eliminar la evaluación porque tiene registros dependientes.",
          },
          { status: 400 }
        );
      }

      // Si no hay relaciones, proceder con la eliminación
      const evaluacionEliminada = await prisma.evaluacionActual.delete({
        where: { id: parseInt(id, 10) },
      });

      // Eliminamos pacienteId y tipoDiabetesId de la respuesta
      const { pacienteId, tipoDiabetesId, ...resto } = evaluacionEliminada;

      return NextResponse.json({
        message: "Evaluación eliminada exitosamente",
        evaluacion: resto,
      });
    } catch (error) {
      console.error("Error al eliminar la evaluación:", error);

      if (error.code === "P2025") {
        return NextResponse.json(
          {
            error:
              "No se encontró ninguna evaluación con el ID proporcionado para eliminar.",
          },
          { status: 404 }
        );
      }

      return handleError(
        error,
        "Error al eliminar la evaluación. Verifica que el ID y las relaciones sean correctos.",
        500
      );
    }
  });
}
