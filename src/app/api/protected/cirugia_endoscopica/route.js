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

const handleRequest = async (req, operation) => {
  const authResult = await authenticateRequest(req);
  if (authResult) return authResult;

  try {
    return await operation();
  } catch (error) {
    return handleError(error, "Error al procesar la solicitud");
  }
};

export async function GET(req) {
  return handleRequest(req, async () => {
    try {
      const registros = await prisma.intrauterinaEndoscopica.findMany({
        include: {
          ordenQuirurgica: true, 
        },
      });

      const registrosSinId = registros.map(
        ({ ordenQuirurgicaId, ...rest }) => rest
      );

      return NextResponse.json(registrosSinId);
    } catch (error) {
      return handleError(
        error,
        "Error al obtener los registros de Intrauterina Endoscopica"
      );
    }
  });
}

// POST - Crear un nuevo registro de Intrauterina Endoscopica
export async function POST(req) {
  return handleRequest(req, async () => {
    const data = await req.json();


    const requiredFields = [
      "ubicacionPlacentaria", 
    ];

    const missingFields = requiredFields.filter((field) => !data[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Faltan los siguientes datos: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    if (data.ordenQuirurgicaId) {
      const ordenQuirurgicaExists =
        await prisma.ordenQuirurgicaIntrauterina.findUnique({
          where: { id: data.ordenQuirurgicaId },
        });

      if (!ordenQuirurgicaExists) {
        return NextResponse.json(
          { error: "La Orden Quirúrgica especificada no existe." },
          { status: 404 }
        );
      }
    }

    try {
      const nuevoRegistro = await prisma.intrauterinaEndoscopica.create({
        data,
        include: {
          ordenQuirurgica: true, 
        },
      });

      const { ordenQuirurgicaId, ...rest } = nuevoRegistro; 

      return NextResponse.json({
        message: "Registro de Intrauterina Endoscopica creado exitosamente",
        registro: rest,
      });
    } catch (error) {
      return handleError(
        error,
        "Error al crear el registro de Intrauterina Endoscopica"
      );
    }
  });
}
