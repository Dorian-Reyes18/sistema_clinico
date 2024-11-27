import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { authenticateRequest } from "@/middlewares/authMiddleware";

const handleError = (error, defaultMessage, status = 500) => {
  console.error(defaultMessage, error);

  if (error.code === "P2025") {
    return NextResponse.json(
      { error: "Orden quirúrgica no encontrada." },
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

// GET - Obtener una orden quirúrgica específica
export async function GET(req, { params }) {
  return handleRequest(req, async () => {
    const { id } = params;

    try {
      const orden = await prisma.ordenQuirurgicaIntrauterina.findUnique({
        where: { id: parseInt(id) },
        include: {
          paciente: true,
          diagnosticoPrenatal: true,
          resultadosPerinatales: true,
          evaluacionActual: true,
          intrauterinaPercutanea: true,
          intrauterinaEndoscopica: true,
          intrauterinaAbierta: true,
        },
      });

      if (!orden) {
        return NextResponse.json(
          { error: "Orden quirúrgica no encontrada." },
          { status: 404 }
        );
      }

      const {
        diagnosticoPrenatal,
        resultadosPerinatales,
        intrauterinaPercutanea,
        intrauterinaEndoscopica,
        intrauterinaAbierta,
        ...ordenSinDatosVacios
      } = orden;

      return NextResponse.json({
        ...ordenSinDatosVacios,
        diagnosticoPrenatal: diagnosticoPrenatal.length
          ? diagnosticoPrenatal
          : undefined,
        resultadosPerinatales: resultadosPerinatales.length
          ? resultadosPerinatales
          : undefined,
        cirugiasIntrauterinas: {
          percutanea: intrauterinaPercutanea.length
            ? intrauterinaPercutanea
            : undefined,
          endoscopica: intrauterinaEndoscopica.length
            ? intrauterinaEndoscopica
            : undefined,
          abierta: intrauterinaAbierta.length ? intrauterinaAbierta : undefined,
        },
      });
    } catch (error) {
      return handleError(error, "Error al obtener la orden quirúrgica");
    }
  });
}

// PUT - Actualizar una orden quirúrgica específica
export async function PUT(req, { params }) {
  return handleRequest(req, async () => {
    const { id } = params;
    const data = await req.json();

    try {
      if (data.pacienteId) {
        const paciente = await prisma.paciente.findUnique({
          where: { id: data.pacienteId },
        });
        if (!paciente) {
          return NextResponse.json(
            { error: "Paciente no encontrado." },
            { status: 404 }
          );
        }
      }

      const ordenActualizada = await prisma.ordenQuirurgicaIntrauterina.update({
        where: { id: parseInt(id) },
        data,
        include: {
          paciente: true,
          diagnosticoPrenatal: true,
          resultadosPerinatales: true,
          evaluacionActual: true,
          intrauterinaPercutanea: true,
          intrauterinaEndoscopica: true,
          intrauterinaAbierta: true,
        },
      });

      const {
        diagnosticoPrenatal,
        resultadosPerinatales,
        intrauterinaPercutanea,
        intrauterinaEndoscopica,
        intrauterinaAbierta,
        ...ordenSinDatosVacios
      } = ordenActualizada;

      return NextResponse.json({
        message: "Orden quirúrgica actualizada exitosamente",
        orden: {
          ...ordenSinDatosVacios,
          diagnosticoPrenatal: diagnosticoPrenatal.length
            ? diagnosticoPrenatal
            : undefined,
          resultadosPerinatales: resultadosPerinatales.length
            ? resultadosPerinatales
            : undefined,
          cirugiasIntrauterinas: {
            percutanea: intrauterinaPercutanea.length
              ? intrauterinaPercutanea
              : undefined,
            endoscopica: intrauterinaEndoscopica.length
              ? intrauterinaEndoscopica
              : undefined,
            abierta: intrauterinaAbierta.length
              ? intrauterinaAbierta
              : undefined,
          },
        },
      });
    } catch (error) {
      return handleError(error, "Error al actualizar la orden quirúrgica");
    }
  });
}

// DELETE - Eliminar una orden quirúrgica específica
export async function DELETE(req, { params }) {
  return handleRequest(req, async () => {
    const { id } = params;

    try {
      await prisma.ordenQuirurgicaIntrauterina.delete({
        where: { id: parseInt(id) },
      });

      return NextResponse.json(
        {
          message: "Orden quirúrgica eliminada exitosamente",
        },
        { status: 204 }
      );
    } catch (error) {
      return handleError(
        error,
        "Error al eliminar la orden quirúrgica, puede tener registros asociados"
      );
    }
  });
}
