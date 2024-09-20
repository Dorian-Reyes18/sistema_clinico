import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { authenticateRequest } from "@/middlewares/authMiddleware";

const handleError = (error, message, status = 500) => {
  console.error(message, error);
  return NextResponse.json({ error: message }, { status });
};

// Obtener antecedente personal por ID
export async function GET(req, { params }) {
  const authResult = await authenticateRequest(req);
  if (authResult) return authResult;

  const { id } = params;

  if (!id || isNaN(parseInt(id, 10))) {
    return NextResponse.json(
      { error: "El ID proporcionado es inválido o está ausente" },
      { status: 400 }
    );
  }

  try {
    const antecedentePersonal = await prisma.antecedentesPersonales.findUnique({
      where: { id: parseInt(id, 10) },
      include: {
        paciente: true,
        tipoDiabetes: true,
        sangreRh: true,
      },
    });

    if (!antecedentePersonal) {
      return NextResponse.json(
        { error: "Antecedente personal no encontrado" },
        { status: 404 }
      );
    }

    // Eliminar pacienteId, diabetesId y sangreRhId de la respuesta
    const { pacienteId, diabetesId, sangreRhId, ...respuestaSinIds } =
      antecedentePersonal;

    return NextResponse.json(respuestaSinIds);
  } catch (error) {
    return handleError(error, "Error al obtener el antecedente personal", 500);
  }
}
export async function PUT(req, { params }) {
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

  const { id } = params;

  if (!id || isNaN(id)) {
    return NextResponse.json({ error: "ID inválido." }, { status: 400 });
  }

  try {
    const antecedenteActualizado = await prisma.antecedentesPersonales.update({
      where: { id: Number(id) },
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

    return NextResponse.json({
      message: "Antecedente personal actualizado exitosamente",
      antecedentePersonal: antecedenteActualizado,
    });
  } catch (error) {
    return handleError(
      error,
      "Error al actualizar el antecedente personal",
      500
    );
  }
}

// Eliminar antecedente personal por ID
export async function DELETE(req, { params }) {
  const authResult = await authenticateRequest(req);
  if (authResult) return authResult;

  const { id } = params;

  if (!id || isNaN(parseInt(id, 10))) {
    return NextResponse.json(
      { error: "El ID proporcionado es inválido o está ausente" },
      { status: 400 }
    );
  }

  // Verifica si el antecedente personal existe
  const antecedenteExistente = await prisma.antecedentesPersonales.findUnique({
    where: { id: parseInt(id, 10) },
  });

  if (!antecedenteExistente) {
    return NextResponse.json(
      { error: "Antecedente personal no encontrado." },
      { status: 404 }
    );
  }

  // Verifica si hay pacientes asociados
  const countPacientes = await prisma.paciente.count({
    where: {
      antecedentesPersonalesId: parseInt(id, 10), // Ajusta esto según cómo esté definida la relación en tu modelo Paciente
    },
  });

  if (countPacientes > 0) {
    return NextResponse.json(
      {
        error:
          "No se puede eliminar este antecedente personal porque está asociado con otros pacientes.",
      },
      { status: 400 }
    );
  }

  try {
    const antecedentePersonalEliminado =
      await prisma.antecedentesPersonales.delete({
        where: { id: parseInt(id, 10) },
      });

    return NextResponse.json({
      message: "Antecedente personal eliminado exitosamente",
      antecedentePersonal: antecedentePersonalEliminado,
    });
  } catch (error) {
    console.error("Error al eliminar el antecedente personal: ", error);

    if (error.code === "P2025") {
      return NextResponse.json(
        {
          error:
            "No se encontró ningún antecedente personal con el ID proporcionado para eliminar.",
        },
        { status: 404 }
      );
    }

    return handleError(error, "Error al eliminar el antecedente personal", 500);
  }
}
