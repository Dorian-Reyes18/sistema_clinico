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

// GET - Obtener todos los registros de Embarazo Actual
export async function GET(req) {
  return handleRequest(req, async () => {
    try {
      const registros = await prisma.embarazoActual.findMany({
        include: {
          paciente: true, // Anidar el objeto de Paciente
        },
      });

      const registrosSinId = registros.map(({ pacienteId, ...rest }) => rest);

      return NextResponse.json(registrosSinId);
    } catch (error) {
      return handleError(
        error,
        "Error al obtener los registros de Embarazo Actual"
      );
    }
  });
}

// POST - Crear un nuevo registro de Embarazo Actual
export async function POST(req) {
  return handleRequest(req, async () => {
    const data = await req.json();

    // Validar campos necesarios
    const requiredFields = ["pacienteId", "fechaEmbarazo"];
    const missingFields = requiredFields.filter((field) => !data[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Faltan los siguientes datos: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    // Validar que el ID de paciente exista
    const pacienteExists = await prisma.paciente.findUnique({
      where: { id: data.pacienteId },
    });

    if (!pacienteExists) {
      return NextResponse.json(
        { error: "El Paciente especificado no existe." },
        { status: 404 }
      );
    }

    try {
      const nuevoRegistro = await prisma.embarazoActual.create({
        data,
        include: {
          paciente: true, 
        },
      });

      const { pacienteId, ...rest } = nuevoRegistro;

      return NextResponse.json({
        message: "Registro de Embarazo Actual creado exitosamente",
        registro: rest,
      });
    } catch (error) {
      return handleError(
        error,
        "Error al crear el registro de Embarazo Actual"
      );
    }
  });
}
