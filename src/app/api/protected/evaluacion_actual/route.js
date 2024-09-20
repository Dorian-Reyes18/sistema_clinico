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

// Obtener todas las evaluaciones actuales
export async function GET(req) {
  return handleRequest(req, async () => {
    try {
      const evaluaciones = await prisma.evaluacionActual.findMany({
        include: {
          paciente: true,
          tipoDiabetes: true,
        },
      });

      // Eliminamos pacienteId y tipoDiabetesId de cada evaluación
      const evaluacionesSinIds = evaluaciones.map(
        ({ pacienteId, tipoDiabetesId, ...rest }) => rest
      );

      return NextResponse.json({ evaluaciones: evaluacionesSinIds });
    } catch (error) {
      return handleError(
        error,
        "Error al obtener las evaluaciones actuales",
        500
      );
    }
  });
}

// Crear una nueva evaluación actual
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

  if (!body.pacienteId || !body.tipoDiabetesId) {
    return NextResponse.json(
      { error: "Faltan datos: pacienteId y tipoDiabetesId son obligatorios." },
      { status: 400 }
    );
  }

  // Validar que el paciente y el tipo de diabetes existen
  const pacienteExists = await prisma.paciente.findUnique({
    where: { id: body.pacienteId },
  });

  const tipoDiabetesExists = await prisma.tipoDiabetes.findUnique({
    where: { id: body.tipoDiabetesId },
  });

  if (!pacienteExists || !tipoDiabetesExists) {
    return NextResponse.json(
      { error: "El paciente o el registro de diabetes no existen." },
      { status: 400 }
    );
  }

  // Verificar si ya existe una evaluación actual para el mismo tipo de diabetes
  const evaluacionExistente = await prisma.evaluacionActual.findFirst({
    where: {
      pacienteId: body.pacienteId,
      tipoDiabetesId: body.tipoDiabetesId,
    },
  });

  if (evaluacionExistente) {
    return NextResponse.json(
      {
        error:
          "Ya existe una evaluación para este registro de diabetes. Por favor, crea un nuevo registro.",
      },
      { status: 400 }
    );
  }

  try {
    const nuevaEvaluacion = await prisma.evaluacionActual.create({
      data: body,
    });

    // Eliminamos pacienteId y tipoDiabetesId de la respuesta
    const { pacienteId, tipoDiabetesId, ...resto } = nuevaEvaluacion;

    return NextResponse.json({
      message: "Evaluación creada exitosamente",
      evaluacion: resto,
    });
  } catch (error) {
    if (error.code === "P2002") {
      return NextResponse.json(
        {
          error:
            "Error: Ya existe una evaluación con el tipo de diabetes especificado.",
        },
        { status: 400 }
      );
    }
    return handleError(error, "Error al crear la evaluación", 500);
  }
}
