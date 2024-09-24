import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { authenticateRequest } from "@/middlewares/authMiddleware";

// Manejo de errores
const handleError = (error, message, status = 500) => {
  console.error(message, error);
  if (error.code === "P2025") {
    return NextResponse.json(
      { error: "Registro no encontrado." },
      { status: 404 }
    );
  }
  if (error.code === "P2003") {
    // Manejo de errores de clave foránea
    return NextResponse.json(
      {
        error:
          "No se puede crear el registro. Asegúrese de que el cirugiaId existe en OrdenQuirurgicaPostoperacion.",
      },
      { status: 400 }
    );
  }
  return NextResponse.json({ error: message }, { status });
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

// GET - Obtener todos los registros de Cirugía Neonatal
export async function GET(req) {
  return handleRequest(req, async () => {
    try {
      const registros = await prisma.cirugiaNeonatal.findMany({
        include: {
          ordenQuirurgicaPostoperacion: true,
        },
      });
      return NextResponse.json({ registros });
    } catch (error) {
      return handleError(
        error,
        "Error al obtener los registros de Cirugía Neonatal"
      );
    }
  });
}

// POST - Crear un nuevo registro de Cirugía Neonatal
export async function POST(req) {
  return handleRequest(req, async () => {
    let data;
    try {
      data = await req.json();
    } catch (error) {
      return NextResponse.json(
        {
          error:
            "Cuerpo de la solicitud inválido. Asegúrese de que el formato sea JSON.",
        },
        { status: 400 }
      );
    }

    // Validar campos necesarios
    const requiredFields = ["cirugiaId"];
    const missingFields = requiredFields.filter((field) => !data[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Faltan los siguientes datos: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    try {
      const nuevoRegistro = await prisma.cirugiaNeonatal.create({
        data,
        include: {
          ordenQuirurgicaPostoperacion: true, // Asegúrate de incluir la relación si es necesario
        },
      });

      return NextResponse.json({
        message: "Registro de Cirugía Neonatal creado exitosamente",
        registro: nuevoRegistro,
      });
    } catch (error) {
      return handleError(
        error,
        "Error al crear el registro de Cirugía Neonatal"
      );
    }
  });
}
