import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { authenticateRequest } from "@/middlewares/authMiddleware";

const handleError = (error, message, status = 500) => {
  console.error(message, error);
  return NextResponse.json({ error: message }, { status });
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
  const authResult = await authenticateRequest(req);
  if (authResult) return authResult;

  try {
    const antecedentes = await prisma.antecedentesObstetricos.findMany({
      include: {
        paciente: true, // Incluimos el paciente
      },
    });

    // Eliminamos el campo pacienteId de los resultados
    const antecedentesSinPacienteId = antecedentes.map(
      ({ pacienteId, ...resto }) => resto
    );

    return NextResponse.json({ antecedentes: antecedentesSinPacienteId });
  } catch (error) {
    return handleError(error, "Error al obtener los antecedentes obstétricos");
  }
}

// Crear un nuevo antecedente obstétrico
export async function POST(req) {
  const authResult = await authenticateRequest(req);
  if (authResult) return authResult;

  let body;
  try {
    body = await req.json();
  } catch (error) {
    return NextResponse.json(
      {
        error:
          "Cuerpo de la solicitud inválido. Asegúrese de que el formato sea JSON.",
      },
      { status: 400 }
    );
  }

  if (!Object.keys(body).length) {
    return NextResponse.json(
      { error: "No se proporcionaron datos para crear el antecedente." },
      { status: 400 }
    );
  }

  try {
    const nuevoAntecedente = await prisma.antecedentesObstetricos.create({
      data: body,
      include: {
        paciente: true, // Incluir los datos del paciente al crear el registro
      },
    });

    // Eliminamos el campo pacienteId de la respuesta
    const { pacienteId, ...resto } = nuevoAntecedente;

    return NextResponse.json({
      message: "Antecedente creado exitosamente",
      antecedente: resto,
    });
  } catch (error) {
    return handleError(error, "Error al crear el antecedente obstétrico");
  }
}
