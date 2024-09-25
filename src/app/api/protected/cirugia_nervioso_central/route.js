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
    return NextResponse.json(
      { error: "Error de restricción de clave foránea." },
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

// GET - Obtener todos los registros de Cirugía Nervioso Central
export async function GET(req) {
  return handleRequest(req, async () => {
    try {
      const registros = await prisma.cirugiaNerviosoCentral.findMany({
        include: {
          ordenQuirurgicaPostoperacion: true,
        },
      });
      return NextResponse.json({ registros });
    } catch (error) {
      return handleError(
        error,
        "Error al obtener los registros de Cirugía Nervioso Central"
      );
    }
  });
}

// POST - Crear un nuevo registro de Cirugía Nervioso Central
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

    // Validar que cirugiaId existe
    const cirugiaExistente =
      await prisma.ordenQuirurgicaPostoperacion.findUnique({
        where: { id: data.cirugiaId },
      });

    if (!cirugiaExistente) {
      return NextResponse.json(
        { error: `El cirugiaId ${data.cirugiaId} no existe.` },
        { status: 400 }
      );
    }

    // Validar que los campos booleanos son verdaderos o falsos
    const booleanFields = [
      "mielomeningocele",
      "meningocele",
      "raquisquisis",
      "mieloquisis",
      "mielocistocele",
      "cierreReconstruccionTuboNeural",
      "senoDermico",
      "lipomaIntramedularSacro",
      "diasteamtomelia",
      "dilomielia",
      "colaDeFauno",
      "medulaAnclada",
      "cierreReconstruccionEncefalocele",
      "quisteNeuroenterico",
      "colocacionSistemasDerivativosProtesicos", // Corrección aquí
      "endoscopiaTranscraneal",
      "lavadoVentricularEndoscopico",
      "puncionTranscraneal",
      "colocacionDeVentriculostomia",
      "lavadoVentricularTranscraneal",
      "derivacionSubduralExterna",
      "derivacionSubDuroperiotoneal",
      "reseccionQuistesAracnoideos",
      "fenestracionDeQuistes",
      "derivacionQuiste",
      "reseccionTumoresCongenitos",
      "derivacionSubDuroperiotonealBilateral",
    ];

    for (const field of booleanFields) {
      if (data[field] !== undefined && typeof data[field] !== "boolean") {
        return NextResponse.json(
          { error: `El campo ${field} debe ser un valor booleano.` },
          { status: 400 }
        );
      }
    }

    // Validar el campo 'otros'
    if (data.otros !== undefined && typeof data.otros !== "string") {
      return NextResponse.json(
        { error: `El campo 'otros' debe ser un string.` },
        { status: 400 }
      );
    }

    try {
      const nuevoRegistro = await prisma.cirugiaNerviosoCentral.create({
        data,
        include: {
          ordenQuirurgicaPostoperacion: true,
        },
      });

      return NextResponse.json({
        message: "Registro de Cirugía Nervioso Central creado exitosamente",
        registro: nuevoRegistro,
      });
    } catch (error) {
      return handleError(
        error,
        "Error al crear el registro de Cirugía Nervioso Central"
      );
    }
  });
}
