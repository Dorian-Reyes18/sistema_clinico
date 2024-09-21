import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { authenticateRequest } from "@/middlewares/authMiddleware";

const handleError = (error, defaultMessage, status = 500) => {
  console.error(defaultMessage, error);

  if (error.code === "P2002") {
    return NextResponse.json(
      { error: "El diagnóstico ya existe. Por favor, usa otro." },
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

export async function GET(req) {
  return handleRequest(req, async () => {
    try {
      const diagnosticos = await prisma.diagnosticoPrenatal.findMany({
        include: {
          categoria: true,
          tipoDefecto: true,
        },
      });
      return NextResponse.json(diagnosticos);
    } catch (error) {
      return handleError(error, "Error al obtener los diagnósticos");
    }
  });
}

export async function POST(req) {
  return handleRequest(req, async () => {
    const {
      categoriaId,
      tipoDefectoId,
      tipoCirugiaRealizada,
      estudioGen,
      resultadoEstGen,
      embarazoUnico,
    } = await req.json();

    try {
      const nuevoDiagnostico = await prisma.diagnosticoPrenatal.create({
        data: {
          categoriaId,
          tipoDefectoId,
          tipoCirugiaRealizada,
          estudioGen,
          resultadoEstGen,
          embarazoUnico,
          categoria: { connect: { id: categoriaId } }, 
          tipoDefecto: { connect: { id: tipoDefectoId } }, 
        },
      });
      return NextResponse.json(
        {
          message: "Diagnóstico prenatal creado exitosamente",
          diagnostico: nuevoDiagnostico,
        },
        { status: 201 }
      );
    } catch (error) {
      return handleError(error, "Error al crear el diagnóstico");
    }
  });
}
