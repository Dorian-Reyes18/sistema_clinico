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

// GET - Obtener todos los registros de IntrauterinaPercutanea
export async function GET(req) {
  return handleRequest(req, async () => {
    try {
      const registros = await prisma.intrauterinaPercutanea.findMany({
        include: {
          ordenQuirurgica: true, 
        },
      });

      return NextResponse.json(registros);
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

    const requiredFields = ["ubicacionPlacentaria"];
    const missingFields = requiredFields.filter((field) => !data[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Faltan los siguientes datos: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    // Validar si la orden quirúrgica existe si se pasa un ordenQuirurgicaId
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
      const nuevoRegistro = await prisma.intrauterinaPercutanea.create({
        data,
        include: {
          ordenQuirurgica: true, 
        },
      });

      return NextResponse.json({
        message: "Registro de Intrauterina Percutanea creado exitosamente",
        registro: nuevoRegistro,
      });
    } catch (error) {
      return handleError(
        error,
        "Error al crear el registro de Intrauterina Percutanea"
      );
    }
  });
}
