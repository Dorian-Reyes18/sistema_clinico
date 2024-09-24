import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { authenticateRequest } from "@/middlewares/authMiddleware";

// Función para validar el ID
const validateId = (id) => {
  const parsedId = parseInt(id);
  return !isNaN(parsedId) && parsedId > 0 ? parsedId : false;
};

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

// GET - Obtener un registro de Cirugía Neonatal por ID
export async function GET(req, { params }) {
  return handleRequest(req, async () => {
    const { id } = params;

    const validId = validateId(id);
    if (!validId) {
      return NextResponse.json({ error: "ID no válido." }, { status: 400 });
    }

    try {
      const registro = await prisma.cirugiaNeonatal.findUnique({
        where: { id: validId },
        include: {
          ordenQuirurgicaPostoperacion: true,
        },
      });

      if (!registro) {
        return NextResponse.json(
          { error: "Registro no encontrado" },
          { status: 404 }
        );
      }

      return NextResponse.json(registro);
    } catch (error) {
      return handleError(
        error,
        "Error al obtener el registro de Cirugía Neonatal"
      );
    }
  });
}

// PUT - Actualizar un registro de Cirugía Neonatal por ID
export async function PUT(req, { params }) {
  return handleRequest(req, async () => {
    const { id } = params;
    const validId = validateId(id);
    if (!validId) {
      return NextResponse.json({ error: "ID no válido." }, { status: 400 });
    }

    const data = await req.json();

    try {
      const registro = await prisma.cirugiaNeonatal.update({
        where: { id: validId },
        data,
        include: {
          ordenQuirurgicaPostoperacion: true,
        },
      });

      return NextResponse.json({
        message: "Registro de Cirugía Neonatal actualizado exitosamente",
        registro,
      });
    } catch (error) {
      return handleError(
        error,
        "Error al actualizar el registro de Cirugía Neonatal"
      );
    }
  });
}

// DELETE - Eliminar un registro de Cirugía Neonatal por ID
export async function DELETE(req, { params }) {
  return handleRequest(req, async () => {
    const validId = validateId(params.id);
    if (!validId) {
      return NextResponse.json({ error: "ID no válido." }, { status: 400 });
    }

    try {
      const registroExistente = await prisma.cirugiaNeonatal.findUnique({
        where: { id: validId },
      });

      if (!registroExistente) {
        return NextResponse.json(
          { error: "El registro no existe." },
          { status: 404 }
        );
      }

      await prisma.cirugiaNeonatal.delete({
        where: { id: validId },
      });

      return NextResponse.json(
        {
          message: "Registro de Cirugía Neonatal eliminado exitosamente",
        },
        { status: 200 }
      );
    } catch (error) {
      return handleError(
        error,
        "Error al eliminar el registro de Cirugía Neonatal"
      );
    }
  });
}
