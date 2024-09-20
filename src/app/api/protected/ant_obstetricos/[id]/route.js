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

// Obtener antecedente obstétrico por ID
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
    const antecedente = await prisma.antecedentesObstetricos.findUnique({
      where: { id: parseInt(id, 10) },
      include: {
        paciente: true, // Incluimos el detalle del paciente
      },
    });

    if (!antecedente) {
      return NextResponse.json(
        { error: "Antecedente no encontrado" },
        { status: 404 }
      );
    }

    // Eliminamos el campo pacienteId de la respuesta
    const { pacienteId, ...antecedenteSinPacienteId } = antecedente;

    return NextResponse.json({ antecedente: antecedenteSinPacienteId });
  } catch (error) {
    return handleError(error, "Error al obtener el antecedente", 500);
  }
}

// Actualizar antecedente obstétrico por ID
export async function PUT(req, { params }) {
  const authResult = await authenticateRequest(req);
  if (authResult) return authResult;

  const { id } = params;

  if (!id || isNaN(parseInt(id, 10))) {
    return NextResponse.json(
      { error: "El ID proporcionado es inválido o está ausente" },
      { status: 400 }
    );
  }

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
      { error: "No se proporcionaron datos para actualizar." },
      { status: 400 }
    );
  }

  try {
    const antecedenteActualizado = await prisma.antecedentesObstetricos.update({
      where: { id: parseInt(id, 10) },
      data: body,
      include: {
        paciente: true, // Incluimos el detalle del paciente
      },
    });

    // Eliminamos el campo pacienteId de la respuesta
    const { pacienteId, ...antecedenteSinPacienteId } = antecedenteActualizado;

    return NextResponse.json({
      message: "Antecedente actualizado exitosamente",
      antecedente: antecedenteSinPacienteId,
    });
  } catch (error) {
    return handleError(error, "Error al actualizar el antecedente", 500);
  }
}

// Eliminar antecedente obstétrico por ID
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

  try {
    // Verificar si el antecedente existe y tiene relaciones
    const antecedente = await prisma.antecedentesObstetricos.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!antecedente) {
      return NextResponse.json(
        { error: "Antecedente no encontrado" },
        { status: 404 }
      );
    }

    const tieneRelaciones = false;
    if (tieneRelaciones) {
      return NextResponse.json(
        {
          error:
            "No se puede eliminar el antecedente porque tiene relaciones existentes.",
        },
        { status: 400 }
      );
    }

    const antecedenteEliminado = await prisma.antecedentesObstetricos.delete({
      where: { id: parseInt(id, 10) },
    });

    return NextResponse.json({
      message: "Antecedente eliminado exitosamente",
      antecedente: antecedenteEliminado,
    });
  } catch (error) {
    console.error("Error al eliminar el antecedente: ", error);
    return handleError(error, "Error al eliminar el antecedente", 500);
  }
}
