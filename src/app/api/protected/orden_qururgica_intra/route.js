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

// Obtener todas las órdenes quirúrgicas intrauterinas
export async function GET(req) {
  return handleRequest(req, async () => {
    try {
      const ordenes = await prisma.ordenQuirurgicaIntrauterina.findMany({
        include: {
          paciente: true,
          evaluacionActual: true,
          diagnosticoPrenatal: true,
          resultadosPerinatales: true,
        },
      });

      // Eliminar pacienteId de cada orden
      const ordenesSinPacienteId = ordenes.map(
        ({ pacienteId, ...orden }) => orden
      );

      return NextResponse.json({ ordenes: ordenesSinPacienteId });
    } catch (error) {
      return handleError(
        error,
        "Error al obtener las órdenes quirúrgicas",
        500
      );
    }
  });
}

// Crear una nueva orden quirúrgica intrauterina
export async function POST(req) {
  const authResult = await authenticateRequest(req);
  if (authResult) return authResult;

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
      { error: "No se proporcionaron datos para crear la orden quirúrgica." },
      { status: 400 }
    );
  }

  try {
    const nuevaOrden = await prisma.ordenQuirurgicaIntrauterina.create({
      data: body,
    });

    return NextResponse.json({
      message: "Orden quirúrgica creada exitosamente",
      orden: nuevaOrden,
    });
  } catch (error) {
    return handleError(error, "Error al crear la orden quirúrgica", 500);
  }
}
