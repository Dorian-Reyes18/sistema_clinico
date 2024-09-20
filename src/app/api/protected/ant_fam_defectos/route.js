import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { authenticateRequest } from "@/middlewares/authMiddleware";

const handleError = (error, defaultMessage, status = 500) => {
  console.error(defaultMessage, error);

  if (error.code === "P2025") {
    return NextResponse.json(
      { error: "Antecedente familiar no encontrado." },
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

// POST - Crear un antecedente familiar
export async function POST(req) {
  return handleRequest(req, async () => {
    try {
      const data = await req.json();

      // Verifica si el paciente existe
      const pacienteExistente = await prisma.paciente.findUnique({
        where: { id: data.pacienteId },
      });
      if (!pacienteExistente) {
        return NextResponse.json(
          { error: "El ID del paciente no existe." },
          { status: 404 }
        );
      }

      const antecedente = await prisma.antecedentesFamiliaresDefectos.create({
        data,
      });
      return NextResponse.json(antecedente, { status: 201 });
    } catch (error) {
      if (error instanceof SyntaxError) {
        return NextResponse.json(
          { error: "El cuerpo de la solicitud debe ser un JSON válido." },
          { status: 400 }
        );
      }
      return handleError(error, "Error al crear el antecedente familiar");
    }
  });
}

// GET - Obtener todos los antecedentes familiares
export async function GET(req) {
  return handleRequest(req, async () => {
    try {
      const antecedentes = await prisma.antecedentesFamiliaresDefectos.findMany(
        {
          include: {
            paciente: true,
          },
        }
      );
      return NextResponse.json(antecedentes);
    } catch (error) {
      return handleError(error, "Error al obtener antecedentes familiares");
    }
  });
}
