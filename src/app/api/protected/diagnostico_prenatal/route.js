import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { authenticateRequest } from "@/middlewares/authMiddleware";

const handleError = (error, defaultMessage, status = 500) => {
  console.error(defaultMessage, error);
  if (error.code === "P2002") {
    return NextResponse.json(
      { error: "Ya existe un diagnóstico con esos datos." },
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

// GET - Obtener todos los diagnósticos prenatales
export async function GET(req) {
  return handleRequest(req, async () => {
    try {
      const diagnosticos = await prisma.diagnosticoPrenatal.findMany({
        include: {
          categoria: true,
          tipoDefecto: true,
          cirugiaIntra: true, // Relación ajustada al modelo actual
        },
      });

      // Transformar el resultado para no incluir los IDs referenciados directamente
      const resultado = diagnosticos.map((diagnostico) => ({
        id: diagnostico.id,
        tipoCirugiaRealizada: diagnostico.tipoCirugiaRealizada,
        estudioGen: diagnostico.estudioGen,
        resultadoEstGen: diagnostico.resultadoEstGen,
        tipoEmbarazo: diagnostico.tipoEmbarazo,
        categoria: diagnostico.categoria,
        tipoDefecto: diagnostico.tipoDefecto,
        cirugiaIntra: diagnostico.cirugiaIntra,
      }));

      return NextResponse.json(resultado);
    } catch (error) {
      return handleError(error, "Error al obtener los diagnósticos prenatales");
    }
  });
}

// POST - Crear un nuevo diagnóstico prenatal
export async function POST(req) {
  return handleRequest(req, async () => {
    const {
      cirugiaIntraId,
      categoriaId,
      tipoDefectoId,
      tipoCirugiaRealizada,
      estudioGen,
      resultadoEstGen,
      tipoEmbarazo,
    } = await req.json();

    // Validar que los IDs referenciados existan
    const cirugiaIntra = await prisma.ordenQuirurgicaIntrauterina.findUnique({
      where: { id: cirugiaIntraId },
    });

    const categoria = await prisma.categoria.findUnique({
      where: { id: categoriaId },
    });

    const tipoDefecto = await prisma.tipoDefecto.findUnique({
      where: { id: tipoDefectoId },
    });

    if (!cirugiaIntra || !categoria || !tipoDefecto) {
      return NextResponse.json(
        { error: "Cirugía, Categoría o Tipo de defecto no existe." },
        { status: 400 }
      );
    }

    try {
      const nuevoDiagnostico = await prisma.diagnosticoPrenatal.create({
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
          cirugiaIntra: true, // Relación ajustada al modelo actual
        },
      });

      return NextResponse.json(
        {
          message: "Diagnóstico prenatal creado exitosamente",
          diagnostico: {
            id: nuevoDiagnostico.id,
            tipoCirugiaRealizada: nuevoDiagnostico.tipoCirugiaRealizada,
            estudioGen: nuevoDiagnostico.estudioGen,
            resultadoEstGen: nuevoDiagnostico.resultadoEstGen,
            tipoEmbarazo: nuevoDiagnostico.tipoEmbarazo,
            categoria: nuevoDiagnostico.categoria,
            tipoDefecto: nuevoDiagnostico.tipoDefecto,
            cirugiaIntra: nuevoDiagnostico.cirugiaIntra,
          },
        },
        { status: 201 }
      );
    } catch (error) {
      return handleError(error, "Error al crear el diagnóstico prenatal");
    }
  });
}
