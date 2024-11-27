import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { authenticateRequest } from "@/middlewares/authMiddleware";

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

const handleRequest = async (req, operation) => {
  const authResult = await authenticateRequest(req);
  if (authResult) return authResult;

  try {
    return await operation();
  } catch (error) {
    return handleError(error, "Error al procesar la solicitud");
  }
};

// GET - Obtener todos los registros de Intrauterina Abierta
export async function GET(req) {
  return handleRequest(req, async () => {
    try {
      const registros = await prisma.intrauterinaAbierta.findMany();

      return NextResponse.json(registros);
    } catch (error) {
      return handleError(
        error,
        "Error al obtener los registros de Intrauterina Abierta"
      );
    }
  });
}

// POST - Crear un nuevo registro de Intrauterina Abierta
export async function POST(req) {
  return handleRequest(req, async () => {
    const data = await req.json();

    // Validar campos necesarios
    const requiredFields = [
      "ubicacionPlacentaria", 
      "tamanoDelDefecto",
    ];

    const missingFields = requiredFields.filter((field) => !data[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Faltan los siguientes datos: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    try {
      const nuevoRegistro = await prisma.intrauterinaAbierta.create({
        data,
      });

      return NextResponse.json({
        message: "Registro de Intrauterina Abierta creado exitosamente",
        registro: nuevoRegistro,
      });
    } catch (error) {
      return handleError(
        error,
        "Error al crear el registro de Intrauterina Abierta"
      );
    }
  });
}
