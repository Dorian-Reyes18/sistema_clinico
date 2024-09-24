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

// GET - Obtener todos los registros de Orden Quirúrgica Postoperatoria
export async function GET(req) {
  return handleRequest(req, async () => {
    try {
      const registros = await prisma.ordenQuirurgicaPostoperacion.findMany({
        include: {
          paciente: true,
          diagnosticoPrenatal: true,
          doctor: true, // Se refiere a Usuarios
        },
      });

      return NextResponse.json({ registros });
    } catch (error) {
      return handleError(
        error,
        "Error al obtener los registros de Orden Quirúrgica Postoperatoria"
      );
    }
  });
}

// POST - Crear un nuevo registro de Orden Quirúrgica Postoperatoria
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
    const requiredFields = ["pacienteId", "diagnosticoId", "doctorId"];
    const missingFields = requiredFields.filter((field) => !data[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Faltan los siguientes datos: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    // Verificar existencia de IDs antes de crear
    const [paciente, diagnostico, doctor] = await Promise.all([
      prisma.paciente.findUnique({ where: { id: data.pacienteId } }),
      prisma.diagnosticoPrenatal.findUnique({
        where: { id: data.diagnosticoId },
      }),
      prisma.usuarios.findUnique({ where: { id: data.doctorId } }), // Cambiado a usuarios
    ]);

    // Manejar errores de ID no encontrados
    const idErrors = [];
    if (!paciente) idErrors.push("El paciente no existe.");
    if (!diagnostico) idErrors.push("El diagnóstico no existe.");
    if (!doctor) idErrors.push("El doctor no existe."); // Cambiado para reflejar que es un usuario

    if (idErrors.length) {
      return NextResponse.json({ error: idErrors.join(" ") }, { status: 400 });
    }

    try {
      const nuevoRegistro = await prisma.ordenQuirurgicaPostoperacion.create({
        data,
        include: {
          paciente: true,
          diagnosticoPrenatal: true,
          doctor: true, // Se refiere a Usuarios
        },
      });

      return NextResponse.json({
        message:
          "Registro de Orden Quirúrgica Postoperatoria creado exitosamente",
        registro: nuevoRegistro,
      });
    } catch (error) {
      return handleError(
        error,
        "Error al crear el registro de Orden Quirúrgica Postoperatoria"
      );
    }
  });
}
