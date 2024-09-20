import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { authenticateRequest } from "@/middlewares/authMiddleware";

const handleError = (error, defaultMessage, status = 500) => {
  console.error(defaultMessage, error);

  if (error.code === "P2002") {
    return NextResponse.json(
      { error: "El registro ya existe. Por favor, usa otro." },
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

// GET - Obtener todos los registros de tipoDiabetes
export async function GET(req) {
  return handleRequest(req, async () => {
    try {
      const tiposDiabetes = await prisma.tipoDiabetes.findMany({
        include: {
          pacientes: true, // Anidación de los datos del paciente
        },
      });
      return NextResponse.json(tiposDiabetes);
    } catch (error) {
      return handleError(
        error,
        "Error al obtener los registros de tipoDiabetes"
      );
    }
  });
}

// POST - Crear un nuevo registro de tipoDiabetes
export async function POST(req) {
  return handleRequest(req, async () => {
    const {
      pacienteid,
      mellitusTipo1,
      mellitusTipo2,
      mellitusGestacional,
      ninguna,
    } = await req.json();

    try {
      const nuevoTipoDiabetes = await prisma.tipoDiabetes.create({
        data: {
          pacienteid,
          mellitusTipo1,
          mellitusTipo2,
          mellitusGestacional,
          ninguna,
        },
      });
      return NextResponse.json(
        {
          message: "Registro de tipoDiabetes creado exitosamente",
          tipoDiabetes: nuevoTipoDiabetes,
        },
        { status: 201 }
      );
    } catch (error) {
      return handleError(error, "Error al crear el registro de tipoDiabetes");
    }
  });
}
