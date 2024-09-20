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

// Obtener todos los antecedentes personales
export async function GET(req) {
  return handleRequest(req, async () => {
    try {
      const antecedentesPersonales =
        await prisma.antecedentesPersonales.findMany({
          include: {
            paciente: true,
            tipoDiabetes: true,
            sangreRh: true,
          },
        });

      // Eliminar pacienteId, diabetesId y sangreRhId de cada antecedente
      const antecedentesSinIds = antecedentesPersonales.map(
        ({ pacienteId, diabetesId, sangreRhId, ...resto }) => ({
          ...resto,
        })
      );

      return NextResponse.json({ antecedentesPersonales: antecedentesSinIds });
    } catch (error) {
      return handleError(
        error,
        "Error al obtener los antecedentes personales",
        500
      );
    }
  });
}

// Crear un nuevo antecedente personal
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
      {
        error: "No se proporcionaron datos para crear el antecedente personal.",
      },
      { status: 400 }
    );
  }

  try {
    const nuevoAntecedente = await prisma.antecedentesPersonales.create({
      data: {
        paciente: body.pacienteId
          ? { connect: { id: body.pacienteId } }
          : undefined,
        tipoDiabetes: body.diabetesId
          ? { connect: { id: body.diabetesId } }
          : undefined,
        sangreRh: body.sangreRhId
          ? { connect: { id: body.sangreRhId } }
          : undefined,
        licor: body.licor,
        drogas: body.drogas,
        fuma: body.fuma,
        teratogenicos: body.teratogenicos,
        hipertension: body.hipertension,
        epilepsia: body.epilepsia,
        tiroidea: body.tiroidea,
        neoplasicas: body.neoplasicas,
        cardiopatia: body.cardiopatia,
        inmunologia: body.inmunologia,
      },
      include: {
        paciente: true,
        tipoDiabetes: true,
        sangreRh: true,
      },
    });

    // Eliminar las líneas de pacienteId, diabetesId y sangreRhId de la respuesta
    const { pacienteId, diabetesId, sangreRhId, ...respuestaSinIds } =
      nuevoAntecedente;

    return NextResponse.json({
      message: "Antecedente personal creado exitosamente",
      antecedentePersonal: respuestaSinIds,
    });
  } catch (error) {
    return handleError(error, "Error al crear el antecedente personal", 500);
  }
}
