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

// GET - Obtener todos los registros de Resultados Perinatales
export async function GET(req) {
  return handleRequest(req, async () => {
    try {
      const registros = await prisma.resultadosPerinatales.findMany({
        include: {
          ordenQuirurgica: true, // Anidar el objeto de OrdenQuirurgica
        },
      });

      // Eliminar el campo ordenQuirurgicaId de cada registro
      const registrosSinId = registros.map(
        ({ ordenQuirurgicaId, ...rest }) => rest
      );

      return NextResponse.json(registrosSinId);
    } catch (error) {
      return handleError(
        error,
        "Error al obtener los registros de Resultados Perinatales"
      );
    }
  });
}

// POST - Crear un nuevo registro de Resultados Perinatales
export async function POST(req) {
  return handleRequest(req, async () => {
    const data = await req.json();

    // Validar campos necesarios
    const requiredFields = ["ordenQuirurgicaId", "tipoDeParto", "fechaNac"];
    const missingFields = requiredFields.filter((field) => !data[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Faltan los siguientes datos: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    // Validar que el ID de orden quirúrgica exista
    const ordenExists = await prisma.ordenQuirurgicaIntrauterina.findUnique({
      where: { id: data.ordenQuirurgicaId },
    });

    if (!ordenExists) {
      return NextResponse.json(
        { error: "La Orden Quirúrgica especificada no existe." },
        { status: 404 }
      );
    }

    try {
      const nuevoRegistro = await prisma.resultadosPerinatales.create({
        data,
        include: {
          ordenQuirurgica: true, // Incluir objeto de OrdenQuirurgica
        },
      });

      const { ordenQuirurgicaId, ...rest } = nuevoRegistro; // Eliminar el campo ordenQuirurgicaId

      return NextResponse.json({
        message: "Registro de Resultados Perinatales creado exitosamente",
        registro: rest,
      });
    } catch (error) {
      return handleError(
        error,
        "Error al crear el registro de Resultados Perinatales"
      );
    }
  });
}
