import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { authenticateRequest } from "@/middlewares/authMiddleware";

const handleError = (error, defaultMessage, status = 500) => {
  console.error(defaultMessage, error);

  if (error.code === "P2002") {
    return NextResponse.json(
      { error: "El número de expediente ya existe. Por favor, usa otro." },
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

// GET - Obtener todas las órdenes quirúrgicas intrauterinas
export async function GET(req) {
  return handleRequest(req, async () => {
    try {
      const ordenes = await prisma.ordenQuirurgicaIntrauterina.findMany({
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

      const ordenesTransformadas = ordenes.map((orden) => {
        const {
          diagnosticoPrenatal,
          resultadosPerinatales,
          intrauterinaPercutanea,
          intrauterinaEndoscopica,
          intrauterinaAbierta,
          ...resto
        } = orden;
        return {
          ...resto,
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
        };
      });

      return NextResponse.json(ordenesTransformadas);
    } catch (error) {
      return handleError(error, "Error al obtener las órdenes quirúrgicas");
    }
  });
}

// POST - Crear una nueva orden quirúrgica intrauterina
export async function POST(req) {
  return handleRequest(req, async () => {
    const {
      pacienteId,
      tipoCirugia,
      teniaDiagnostico,
      etapa,
      complicacionesQuirurgicas,
      estado,
    } = await req.json();

    if (!pacienteId) {
      return NextResponse.json(
        { error: "El ID del paciente es obligatorio." },
        { status: 400 }
      );
    }

    try {
      const paciente = await prisma.paciente.findUnique({
        where: { id: pacienteId },
      });
      if (!paciente) {
        return NextResponse.json(
          { error: "Paciente no encontrado." },
          { status: 404 }
        );
      }

      const nuevaOrden = await prisma.ordenQuirurgicaIntrauterina.create({
        data: {
          pacienteId,
          tipoCirugia,
          teniaDiagnostico,
          etapa,
          complicacionesQuirurgicas,
          estado,
        },
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
      } = nuevaOrden;

      return NextResponse.json(
        {
          message: "Orden quirúrgica creada exitosamente",
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
        },
        { status: 201 }
      );
    } catch (error) {
      return handleError(error, "No se pudo crear la orden quirúrgica");
    }
  });
}
