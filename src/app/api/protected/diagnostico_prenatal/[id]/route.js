import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { authenticateRequest } from "@/middlewares/authMiddleware";

const handleError = (error, defaultMessage, status = 500) => {
  console.error(defaultMessage, error);

  if (error.code === "P2025") {
    return NextResponse.json(
      { error: "Diagnóstico prenatal no encontrado." },
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

export async function GET(req, { params }) {
  return handleRequest(req, async () => {
    const { id } = params;
    try {
      const diagnostico = await prisma.diagnosticoPrenatal.findUnique({
        where: { id: parseInt(id) },
        include: {
          categoria: true,
          tipoDefecto: true,
        },
      });

      if (!diagnostico) {
        return NextResponse.json(
          { error: "Diagnóstico prenatal no encontrado" },
          { status: 404 }
        );
      }
      return NextResponse.json(diagnostico);
    } catch (error) {
      return handleError(error, "Error al obtener el diagnóstico");
    }
  });
}

export async function PUT(req, { params }) {
  return handleRequest(req, async () => {
    const { id } = params;
    const {
      categoriaId,
      tipoDefectoId,
      tipoCirugiaRealizada,
      estudioGen,
      resultadoEstGen,
      embarazoUnico,
    } = await req.json();

    try {
      const actualizado = await prisma.diagnosticoPrenatal.update({
        where: { id: parseInt(id) },
        data: {
          categoriaId,
          tipoDefectoId,
          tipoCirugiaRealizada,
          estudioGen,
          resultadoEstGen,
          embarazoUnico,
          categoria: { connect: { id: categoriaId } }, // Relación a la tabla Categoria
          tipoDefecto: { connect: { id: tipoDefectoId } }, // Relación a la tabla TipoDefecto
        },
      });
      return NextResponse.json({
        message: "Diagnóstico prenatal actualizado exitosamente",
        diagnostico: actualizado,
      });
    } catch (error) {
      return handleError(error, "Error al actualizar el diagnóstico");
    }
  });
}

export async function DELETE(req, { params }) {
  return handleRequest(req, async () => {
    const { id } = params;

    try {
      await prisma.diagnosticoPrenatal.delete({
        where: { id: parseInt(id) },
      });
      return NextResponse.json(
        {
          message: "Diagnóstico prenatal eliminado exitosamente",
        },
        { status: 204 }
      );
    } catch (error) {
      return handleError(error, "Error al eliminar el diagnóstico");
    }
  });
}
