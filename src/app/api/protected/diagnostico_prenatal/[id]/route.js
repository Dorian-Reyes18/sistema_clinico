import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { authenticateRequest } from "@/middlewares/authMiddleware";

const handleError = (error, defaultMessage, status = 500) => {
  console.error(defaultMessage, error);

  if (error.code === "P2025") {
    return NextResponse.json(
      { error: "Diagnóstico no encontrado." },
      { status: 404 }
    );
  }

  if (error.code === "P2002") {
    return NextResponse.json(
      {
        error:
          "Conflicto de datos. Es posible que ya exista un diagnóstico con estos datos.",
      },
      { status: 409 }
    );
  }

  if (error instanceof SyntaxError) {
    return NextResponse.json(
      { error: "Error de formato en los datos de entrada." },
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

// GET - Obtener un diagnóstico prenatal por ID
export async function GET(req, { params }) {
  return handleRequest(req, async () => {
    const { id } = params;
    try {
      const diagnostico = await prisma.diagnosticoPrenatal.findUnique({
        where: { id: parseInt(id) },
        include: {
          categoria: true,
          tipoDefecto: true,
          cirugiaIntra: true, 
        },
      });

      if (!diagnostico) {
        return NextResponse.json(
          { error: "Diagnóstico no encontrado" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        id: diagnostico.id,
        tipoCirugiaRealizada: diagnostico.tipoCirugiaRealizada,
        estudioGen: diagnostico.estudioGen,
        resultadoEstGen: diagnostico.resultadoEstGen,
        tipoEmbarazo: diagnostico.tipoEmbarazo,
        categoria: diagnostico.categoria,
        tipoDefecto: diagnostico.tipoDefecto,
        cirugiaIntra: diagnostico.cirugiaIntra,
      });
    } catch (error) {
      return handleError(error, "Error al obtener el diagnóstico prenatal");
    }
  });
}

// PUT - Actualizar un diagnóstico prenatal por ID
export async function PUT(req, { params }) {
  return handleRequest(req, async () => {
    const { id } = params;
    const {
      cirugiaIntraId,
      categoriaId,
      tipoDefectoId,
      tipoCirugiaRealizada,
      estudioGen,
      resultadoEstGen,
      tipoEmbarazo,
    } = await req.json();

    try {
      const diagnostico = await prisma.diagnosticoPrenatal.update({
        where: { id: parseInt(id) },
        data: {
          cirugiaIntraId,
          categoriaId,
          tipoDefectoId,
          tipoCirugiaRealizada,
          estudioGen,
          resultadoEstGen,
          tipoEmbarazo,
        },
        include: {
          categoria: true,
          tipoDefecto: true,
          cirugiaIntra: true,
        },
      });

      return NextResponse.json({
        message: "Diagnóstico prenatal actualizado exitosamente",
        diagnostico: {
          id: diagnostico.id,
          tipoCirugiaRealizada: diagnostico.tipoCirugiaRealizada,
          estudioGen: diagnostico.estudioGen,
          resultadoEstGen: diagnostico.resultadoEstGen,
          tipoEmbarazo: diagnostico.tipoEmbarazo,
          categoria: diagnostico.categoria,
          tipoDefecto: diagnostico.tipoDefecto,
          cirugiaIntra: diagnostico.cirugiaIntra, 
        },
      });
    } catch (error) {
      return handleError(error, "Error al actualizar el diagnóstico prenatal");
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
        { message: "Diagnóstico prenatal eliminado exitosamente" },
        { status: 200 }
      );
    } catch (error) {
      return handleError(error, "Error al eliminar el diagnóstico prenatal");
    }
  });
}
