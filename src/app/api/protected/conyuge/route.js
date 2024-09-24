import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { authenticateRequest } from "@/middlewares/authMiddleware";

const handleError = (error, defaultMessage, status = 500) => {
  console.error(defaultMessage, error);

  if (error.code === "P2025") {
    return NextResponse.json(
      { error: "Recurso no encontrado." },
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

// GET: Listar todos los cónyuges con todas las relaciones
export async function GET(req) {
  return handleRequest(req, async () => {
    const conyuges = await prisma.conyuge.findMany({
      include: {
        sangreRh: true,
        pacientes: true,
      },
    });
    return NextResponse.json(conyuges);
  });
}

// POST: Crear un nuevo cónyuge
export async function POST(req) {
  return handleRequest(req, async () => {
    const data = await req.json();

    // Validar que los campos requeridos existan
    if (!data.sangreRhId) {
      return NextResponse.json(
        { error: "El campo 'sangreRhId' es requerido." },
        { status: 400 }
      );
    }

    try {
      // Crear el cónyuge sin depender de un paciente
      const conyuge = await prisma.conyuge.create({
        data,
      });
      return NextResponse.json({
        message: "Cónyuge creado exitosamente",
        conyuge,
      });
    } catch (error) {
      return handleError(error, "Error al crear el cónyuge");
    }
  });
}
