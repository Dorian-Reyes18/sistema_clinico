import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { authenticateRequest } from "@/middlewares/authMiddleware";

// Función para validar el ID
const validateId = (id) => {
  const parsedId = parseInt(id);
  return !isNaN(parsedId) && parsedId > 0 ? parsedId : false;
};

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

// GET - Obtener un registro de Orden Quirúrgica Postoperatoria por ID
export async function GET(req, { params }) {
  return handleRequest(req, async () => {
    const { id } = params;

    const validId = validateId(id);
    if (!validId) {
      return NextResponse.json({ error: "ID no válido." }, { status: 400 });
    }

    try {
      const registro = await prisma.ordenQuirurgicaPostoperacion.findUnique({
        where: { id: validId },
        include: {
          paciente: true,
          doctor: true,
          cirugiaNeonatal: true, // Incluir el array de cirugías neonatales
          cirugiaNerviosoCentral: true, // Incluir el array de cirugías del sistema nervioso central
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
        "Error al obtener el registro de Orden Quirúrgica Postoperatoria"
      );
    }
  });
}

// PUT - Actualizar un registro de Orden Quirúrgica Postoperatoria por ID
export async function PUT(req, { params }) {
  return handleRequest(req, async () => {
    const { id } = params;
    const validId = validateId(id);
    if (!validId) {
      return NextResponse.json({ error: "ID no válido." }, { status: 400 });
    }

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

    try {
      const registro = await prisma.ordenQuirurgicaPostoperacion.update({
        where: { id: validId },
        data,
        include: {
          paciente: true,
          doctor: true,
          cirugiaNeonatal: true,
          cirugiaNerviosoCentral: true,
        },
      });

      return NextResponse.json({
        message:
          "Registro de Orden Quirúrgica Postoperatoria actualizado exitosamente",
        registro,
      });
    } catch (error) {
      return handleError(
        error,
        "Error al actualizar el registro de Orden Quirúrgica Postoperatoria"
      );
    }
  });
}

// DELETE - Eliminar un registro de Orden Quirúrgica Postoperatoria por ID
// DELETE - Eliminar un registro de Orden Quirúrgica Postoperatoria por ID
export async function DELETE(req, { params }) {
  return handleRequest(req, async () => {
    const validId = validateId(params.id);
    if (!validId) {
      return NextResponse.json({ error: "ID no válido." }, { status: 400 });
    }

    try {
      const registroExistente =
        await prisma.ordenQuirurgicaPostoperacion.findUnique({
          where: { id: validId },
          include: {
            cirugiaNeonatal: true, // Incluir las cirugías neonatales asociadas
            cirugiaNerviosoCentral: true, // Incluir las cirugías de nervioso central asociadas
          },
        });

      if (!registroExistente) {
        return NextResponse.json(
          { error: "El registro no existe." },
          { status: 404 }
        );
      }

      // Eliminar los registros asociados de CirugiaNeonatal y CirugiaNerviosoCentral
      await prisma.cirugiaNeonatal.deleteMany({
        where: {
          cirugiaId: validId,
        },
      });

      await prisma.cirugiaNerviosoCentral.deleteMany({
        where: {
          cirugiaId: validId,
        },
      });

      // Ahora eliminar la orden quirúrgica
      await prisma.ordenQuirurgicaPostoperacion.delete({
        where: { id: validId },
      });

      return NextResponse.json(
        {
          message:
            "Registro de Orden Quirúrgica Postoperatoria y sus registros asociados eliminados exitosamente",
        },
        { status: 200 }
      );
    } catch (error) {
      return handleError(
        error,
        "Error al eliminar el registro de Orden Quirúrgica Postoperatoria"
      );
    }
  });
}
