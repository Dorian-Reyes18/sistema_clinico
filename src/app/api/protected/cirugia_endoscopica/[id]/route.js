import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { authenticateRequest } from "@/middlewares/authMiddleware";

// Función para validar el ID
const validateId = (id) => {
  const parsedId = parseInt(id);
  return !isNaN(parsedId) && parsedId > 0 ? parsedId : false; // Devuelve el ID válido o false
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

// GET - Obtener un registro de Intrauterina Endoscopica por ID
export async function GET(req, { params }) {
  return handleRequest(req, async () => {
    const { id } = params;

    // Validar ID
    if (isNaN(id) || parseInt(id) <= 0) {
      return NextResponse.json({ error: "ID no válido." }, { status: 400 });
    }

    try {
      const registro = await prisma.intrauterinaEndoscopica.findUnique({
        where: { id: parseInt(id) },
        include: {
          diagnosticoPrenatal: true,
        },
      });

      if (!registro) {
        return NextResponse.json(
          { error: "Registro no encontrado" },
          { status: 404 }
        );
      }

      const { diagnosticoPrenatalId, ...rest } = registro; // Eliminar el campo diagnosticoPrenatalId
      return NextResponse.json(rest);
    } catch (error) {
      return handleError(
        error,
        "Error al obtener el registro de Intrauterina Endoscopica"
      );
    }
  });
}

// PUT - Actualizar un registro de Intrauterina Endoscopica por ID
export async function PUT(req, { params }) {
  return handleRequest(req, async () => {
    const { id } = params;
    const data = await req.json();

    // Validar ID
    if (isNaN(id) || parseInt(id) <= 0) {
      return NextResponse.json({ error: "ID no válido." }, { status: 400 });
    }

    try {
      // Validar que el ID de diagnóstico prenatal exista si se está actualizando
      if (data.diagnosticoPrenatalId) {
        const diagnosticoExists = await prisma.diagnosticoPrenatal.findUnique({
          where: { id: data.diagnosticoPrenatalId },
        });

        if (!diagnosticoExists) {
          return NextResponse.json(
            { error: "El Diagnóstico Prenatal especificado no existe." },
            { status: 404 }
          );
        }
      }

      const registro = await prisma.intrauterinaEndoscopica.update({
        where: { id: parseInt(id) },
        data,
        include: {
          diagnosticoPrenatal: true,
        },
      });

      const { diagnosticoPrenatalId, ...rest } = registro; // Eliminar el campo diagnosticoPrenatalId

      return NextResponse.json({
        message:
          "Registro de Intrauterina Endoscopica actualizado exitosamente",
        registro: rest,
      });
    } catch (error) {
      return handleError(
        error,
        "Error al actualizar el registro de Intrauterina Endoscopica"
      );
    }
  });
}

// DELETE - Eliminar un registro de Intrauterina Endoscopica por ID
export async function DELETE(req, { params }) {
  return handleRequest(req, async () => {
    const id = validateId(params.id);
    if (!id) {
      return NextResponse.json({ error: "ID no válido." }, { status: 400 });
    }

    try {
      // Comprobar si el registro existe antes de verificar asociaciones
      const registroExistente = await prisma.intrauterinaEndoscopica.findUnique(
        {
          where: { id },
        }
      );

      if (!registroExistente) {
        return NextResponse.json(
          { error: "El registro no existe." },
          { status: 404 }
        );
      }

      // Comprobar si el registro está asociado a otros registros en DiagnosticoPrenatal
      const asociado = await prisma.diagnosticoPrenatal.findFirst({
        where: { intrauterinaEndoscopica: { id: id } },
      });

      if (asociado) {
        return NextResponse.json(
          {
            error:
              "El registro no se puede eliminar porque tiene registros asociados.",
          },
          { status: 400 }
        );
      }

      await prisma.intrauterinaEndoscopica.delete({ where: { id } });

      // Respuesta exitosa
      return NextResponse.json(
        {
          message:
            "Registro de Intrauterina Endoscopica eliminado exitosamente",
        },
        { status: 200 }
      );
    } catch (error) {
      return handleError(
        error,
        "Error al eliminar el registro de Intrauterina Endoscopica"
      );
    }
  });
}
