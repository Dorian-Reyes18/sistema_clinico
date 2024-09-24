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
          ordenQuirurgicaIntrauterina: true,
          intrauterinaPercutanea: true,
          intrauterinaEndoscopica: true,
          intrauterinaAbierta: true,
          ordenQuirurgicaPostoperacion: true,
        },
      });

      // Transformar el resultado para no incluir los IDs
      const resultado = diagnosticos.map((diagnostico) => ({
        id: diagnostico.id,
        tipoCirugiaRealizada: diagnostico.tipoCirugiaRealizada,
        estudioGen: diagnostico.estudioGen,
        resultadoEstGen: diagnostico.resultadoEstGen,
        embarazoUnico: diagnostico.embarazoUnico,
        categoria: diagnostico.categoria,
        tipoDefecto: diagnostico.tipoDefecto,
        cirugiaIntra: diagnostico.ordenQuirurgicaIntrauterina, // renombrar a cirugiaIntra
        intrauterinaPercutanea: diagnostico.intrauterinaPercutanea,
        intrauterinaEndoscopica: diagnostico.intrauterinaEndoscopica,
        intrauterinaAbierta: diagnostico.intrauterinaAbierta,
        ordenQuirurgicaPostoperacion: diagnostico.ordenQuirurgicaPostoperacion,
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
      embarazoUnico,
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
          embarazoUnico,
        },
        include: {
          categoria: true,
          tipoDefecto: true,
          ordenQuirurgicaIntrauterina: true,
          intrauterinaPercutanea: true,
          intrauterinaEndoscopica: true,
          intrauterinaAbierta: true,
          ordenQuirurgicaPostoperacion: true,
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
            embarazoUnico: nuevoDiagnostico.embarazoUnico,
            categoria: nuevoDiagnostico.categoria,
            tipoDefecto: nuevoDiagnostico.tipoDefecto,
            cirugiaIntra: nuevoDiagnostico.ordenQuirurgicaIntrauterina, // renombrar a cirugiaIntra
            intrauterinaPercutanea: nuevoDiagnostico.intrauterinaPercutanea,
            intrauterinaEndoscopica: nuevoDiagnostico.intrauterinaEndoscopica,
            intrauterinaAbierta: nuevoDiagnostico.intrauterinaAbierta,
            ordenQuirurgicaPostoperacion:
              nuevoDiagnostico.ordenQuirurgicaPostoperacion,
          },
        },
        { status: 201 }
      );
    } catch (error) {
      return handleError(error, "Error al crear el diagnóstico prenatal");
    }
  });
}
