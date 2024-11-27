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
          ordenQuirurgica: true, 
        },
      });

      if (!registro) {
        return NextResponse.json(
          { error: "Registro no encontrado" },
          { status: 404 }
        );
      }

      const { ordenQuirurgicaId, ...rest } = registro;
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
      if (data.ordenQuirurgicaId) {
        const ordenQuirurgicaExists =
          await prisma.ordenQuirurgicaIntrauterina.findUnique({
            where: { id: data.ordenQuirurgicaId },
          });

        if (!ordenQuirurgicaExists) {
          return NextResponse.json(
            { error: "La Orden Quirúrgica especificada no existe." },
            { status: 404 }
          );
        }
      }

      const registro = await prisma.intrauterinaEndoscopica.update({
        where: { id: parseInt(id) },
        data,
        include: {
          ordenQuirurgica: true, 
        },
      });

      const { ordenQuirurgicaId, ...rest } = registro; 

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

export async function DELETE(req, { params }) {
  return handleRequest(req, async () => {
    const id = validateId(params.id);
    if (!id) {
      return NextResponse.json({ error: "ID no válido." }, { status: 400 });
    }

    try {
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

      await prisma.intrauterinaEndoscopica.delete({ where: { id } });

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
