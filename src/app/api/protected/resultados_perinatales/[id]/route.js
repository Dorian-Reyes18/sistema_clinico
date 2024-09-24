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

// GET - Obtener un registro de Resultados Perinatales por ID
export async function GET(req, { params }) {
  return handleRequest(req, async () => {
    const { id } = params;

    // Validar ID
    if (isNaN(id) || parseInt(id) <= 0) {
      return NextResponse.json({ error: "ID no válido." }, { status: 400 });
    }

    try {
      const registro = await prisma.resultadosPerinatales.findUnique({
        where: { id: parseInt(id) },
        include: {
          ordenQuirurgica: true,
        },
      });

      if (!registro) {
        return NextResponse.json(
          { error: "Registro no encontrado" },
          { status: 404 }
        );
      }

      const { ordenQuirurgicaId, ...rest } = registro; // Eliminar el campo ordenQuirurgicaId
      return NextResponse.json(rest);
    } catch (error) {
      return handleError(
        error,
        "Error al obtener el registro de Resultados Perinatales"
      );
    }
  });
}

// PUT - Actualizar un registro de Resultados Perinatales por ID
export async function PUT(req, { params }) {
  return handleRequest(req, async () => {
    const { id } = params;
    const data = await req.json();

    // Validar ID
    if (isNaN(id) || parseInt(id) <= 0) {
      return NextResponse.json({ error: "ID no válido." }, { status: 400 });
    }

    try {
      // Validar que el ID de orden quirúrgica exista si se está actualizando
      if (data.ordenQuirurgicaId) {
        const ordenExists = await prisma.ordenQuirurgicaIntrauterina.findUnique(
          {
            where: { id: data.ordenQuirurgicaId },
          }
        );

        if (!ordenExists) {
          return NextResponse.json(
            { error: "La Orden Quirúrgica especificada no existe." },
            { status: 404 }
          );
        }
      }

      const registro = await prisma.resultadosPerinatales.update({
        where: { id: parseInt(id) },
        data,
        include: {
          ordenQuirurgica: true,
        },
      });

      const { ordenQuirurgicaId, ...rest } = registro; // Eliminar el campo ordenQuirurgicaId

      return NextResponse.json({
        message: "Registro de Resultados Perinatales actualizado exitosamente",
        registro: rest,
      });
    } catch (error) {
      return handleError(
        error,
        "Error al actualizar el registro de Resultados Perinatales"
      );
    }
  });
}

// DELETE - Eliminar un registro de Resultados Perinatales por ID
export async function DELETE(req, { params }) {
  return handleRequest(req, async () => {
    const id = validateId(params.id);
    if (!id) {
      return NextResponse.json({ error: "ID no válido." }, { status: 400 });
    }

    try {
      // Comprobar si el registro existe antes de verificar asociaciones
      const registroExistente = await prisma.resultadosPerinatales.findUnique({
        where: { id },
      });

      if (!registroExistente) {
        return NextResponse.json(
          { error: "El registro no existe." },
          { status: 404 }
        );
      }

      await prisma.resultadosPerinatales.delete({ where: { id } });

      // Respuesta exitosa
      return NextResponse.json(
        {
          message: "Registro de Resultados Perinatales eliminado exitosamente",
        },
        { status: 200 }
      );
    } catch (error) {
      return handleError(
        error,
        "Error al eliminar el registro de Resultados Perinatales"
      );
    }
  });
}
