import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { authenticateRequest } from "@/middlewares/authMiddleware";

// Manejo de errores
const handleError = (error, defaultMessage, status = 500) => {
  console.error(defaultMessage, error);
  if (error.code === "P2025") {
    return NextResponse.json(
      { error: "Registro no encontrado." },
      { status: 404 }
    );
  }
  return NextResponse.json({ error: defaultMessage }, { status });
};

// Manejo de la solicitud
const handleRequest = async (req, operation) => {
  const authResult = await authenticateRequest(req);
  if (authResult) return authResult;

  try {
    return await operation();
  } catch (error) {
    return handleError(error, "Error al procesar la solicitud");
  }
};

// GET - Obtener todos los registros de IntrauterinaPercutanea
export async function GET(req) {
  return handleRequest(req, async () => {
    try {
      const registros = await prisma.intrauterinaPercutanea.findMany({
        include: {
          diagnosticoPrenatal: true, // Anidar el objeto de DiagnosticoPrenatal
        },
      });

      // Eliminar el campo diagnosticoPrenatalId de cada registro
      const registrosSinId = registros.map(
        ({ diagnosticoPrenatalId, ...rest }) => rest
      );

      return NextResponse.json(registrosSinId);
    } catch (error) {
      return handleError(
        error,
        "Error al obtener los registros de Intrauterina Percutanea"
      );
    }
  });
}

// POST - Crear un nuevo registro de IntrauterinaPercutanea
export async function POST(req) {
  return handleRequest(req, async () => {
    const data = await req.json();

    // Validar campos necesarios
    const requiredFields = ["diagnosticoPrenatalId", "ubicacionPlacentaria"];
    const missingFields = requiredFields.filter((field) => !data[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Faltan los siguientes datos: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    // Validar que el ID de diagnóstico prenatal exista
    const diagnosticoExists = await prisma.diagnosticoPrenatal.findUnique({
      where: { id: data.diagnosticoPrenatalId },
    });

    if (!diagnosticoExists) {
      return NextResponse.json(
        { error: "El Diagnóstico Prenatal especificado no existe." },
        { status: 404 }
      );
    }

    try {
      const nuevoRegistro = await prisma.intrauterinaPercutanea.create({
        data,
        include: {
          diagnosticoPrenatal: true, // Incluir objeto de DiagnosticoPrenatal
        },
      });

      const { diagnosticoPrenatalId, ...rest } = nuevoRegistro; // Eliminar el campo diagnosticoPrenatalId

      return NextResponse.json({
        message: "Registro de Intrauterina Percutanea creado exitosamente",
        registro: rest,
      });
    } catch (error) {
      return handleError(
        error,
        "Error al crear el registro de Intrauterina Percutanea"
      );
    }
  });
}
