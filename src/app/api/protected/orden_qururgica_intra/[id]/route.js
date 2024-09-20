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

// Obtener una orden quirúrgica por ID
export async function GET(req, { params }) {
  const { id } = params;

  if (!id || isNaN(parseInt(id, 10))) {
    return NextResponse.json(
      { error: "El ID proporcionado es inválido o está ausente" },
      { status: 400 }
    );
  }

  return handleRequest(req, async () => {
    try {
      const orden = await prisma.ordenQuirurgicaIntrauterina.findUnique({
        where: { id: parseInt(id, 10) },
        include: {
          paciente: true,
          evaluacionActual: true,
          diagnosticoPrenatal: true,
          resultadosPerinatales: true,
        },
      });

      if (!orden) {
        return NextResponse.json(
          { error: "Orden quirúrgica no encontrada" },
          { status: 404 }
        );
      }

      // Eliminar pacienteId de la respuesta
      const { pacienteId, ...ordenSinPacienteId } = orden;

      return NextResponse.json(ordenSinPacienteId);
    } catch (error) {
      return handleError(error, "Error al obtener la orden quirúrgica", 500);
    }
  });
}

// Actualizar una orden quirúrgica por ID
export async function PUT(req, { params }) {
  const { id } = params;

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

  if (!Object.keys(body).length) {
    return NextResponse.json(
      {
        error:
          "No se proporcionaron datos para actualizar la orden quirúrgica.",
      },
      { status: 400 }
    );
  }

  return handleRequest(req, async () => {
    try {
      const ordenActualizada = await prisma.ordenQuirurgicaIntrauterina.update({
        where: { id: parseInt(id, 10) },
        data: body,
      });

      return NextResponse.json({
        message: "Orden quirúrgica actualizada exitosamente",
        orden: ordenActualizada,
      });
    } catch (error) {
      console.error("Error al actualizar la orden quirúrgica: ", error);

      if (error.code === "P2025") {
        return NextResponse.json(
          {
            error:
              "No se encontró ninguna orden quirúrgica con el ID proporcionado para actualizar.",
          },
          { status: 404 }
        );
      }

      return handleError(error, "Error al actualizar la orden quirúrgica", 500);
    }
  });
}

// Eliminar una orden quirúrgica por ID
export async function DELETE(req, { params }) {
  const { id } = params;

  if (!id || isNaN(parseInt(id, 10))) {
    return NextResponse.json(
      { error: "El ID proporcionado es inválido o está ausente" },
      { status: 400 }
    );
  }

  return handleRequest(req, async () => {
    try {
      // Verificar si existen relaciones
      const relaciones = await prisma.resultadosPerinatales.findMany({
        where: { ordenQuirurgicaIntrauterinaId: parseInt(id, 10) },
      });

      if (relaciones.length > 0) {
        return NextResponse.json(
          {
            error:
              "No se puede eliminar la orden quirúrgica, posee registros asociados.",
          },
          { status: 400 }
        );
      }

      const ordenEliminada = await prisma.ordenQuirurgicaIntrauterina.delete({
        where: { id: parseInt(id, 10) },
      });

      return NextResponse.json({
        message: "Orden quirúrgica eliminada exitosamente",
        orden: ordenEliminada,
      });
    } catch (error) {
      console.error("Error al eliminar la orden quirúrgica: ", error);

      if (error.code === "P2025") {
        return NextResponse.json(
          {
            error:
              "No se encontró ninguna orden quirúrgica con el ID proporcionado para eliminar.",
          },
          { status: 404 }
        );
      }

      return handleError(error, "Error al eliminar la orden quirúrgica", 500);
    }
  });
}
