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
  if (error.code === "P2003") {
    return NextResponse.json(
      { error: "Error de restricción de clave foránea." },
      { status: 400 }
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

// GET - Obtener un registro de Cirugía Nervioso Central por ID
export async function GET(req, { params }) {
  const { id } = params; // Extraer el ID de los parámetros

  return handleRequest(req, async () => {
    if (!id) {
      return NextResponse.json(
        { error: "El campo 'id' es necesario para obtener el registro." },
        { status: 400 }
      );
    }

    try {
      const registro = await prisma.cirugiaNerviosoCentral.findUnique({
        where: { id: Number(id) },
        include: {
          ordenQuirurgicaPostoperacion: true,
        },
      });

      if (!registro) {
        return NextResponse.json(
          { error: "Registro no encontrado." },
          { status: 404 }
        );
      }

      return NextResponse.json({ registro });
    } catch (error) {
      return handleError(
        error,
        "Error al obtener el registro de Cirugía Nervioso Central"
      );
    }
  });
}

// PUT - Actualizar un registro de Cirugía Nervioso Central
export async function PUT(req, { params }) {
  const { id } = params; // Extraer el ID de los parámetros

  return handleRequest(req, async () => {
    if (!id) {
      return NextResponse.json(
        { error: "El campo 'id' es necesario para actualizar el registro." },
        { status: 400 }
      );
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

    // Validar que cirugiaId existe si se incluye en la actualización
    if (data.cirugiaId) {
      const cirugiaExistente =
        await prisma.ordenQuirurgicaPostoperacion.findUnique({
          where: { id: data.cirugiaId },
        });

      if (!cirugiaExistente) {
        return NextResponse.json(
          { error: `El cirugiaId ${data.cirugiaId} no existe.` },
          { status: 400 }
        );
      }
    }

    // Validar que los campos booleanos son verdaderos o falsos
    const booleanFields = [
      "mielomeningocele",
      "meningocele",
      "raquisquisis",
      "mieloquisis",
      "mielocistocele",
      "cierreReconstruccionTuboNeural",
      "senoDermico",
      "lipomaIntramedularSacro",
      "diasteamtomelia",
      "dilomielia",
      "colaDeFauno",
      "medulaAnclada",
      "cierreReconstruccionEncefalocele",
      "quisteNeuroenterico",
      "colocacionSistemasDerivativosProtesicos",
      "endoscopiaTranscraneal",
      "lavadoVentricularEndoscopico",
      "derivacionSubdural",
      "reseccionQuistesAracnoideos",
      "derivacionHidrocefalia",
    ];

    for (const field of booleanFields) {
      if (data[field] !== undefined && typeof data[field] !== "boolean") {
        return NextResponse.json(
          { error: `El campo ${field} debe ser un valor booleano.` },
          { status: 400 }
        );
      }
    }

    try {
      const updatedRegistro = await prisma.cirugiaNerviosoCentral.update({
        where: { id: Number(id) },
        data,
        include: {
          ordenQuirurgicaPostoperacion: true,
        },
      });

      return NextResponse.json({
        message:
          "Registro de Cirugía Nervioso Central actualizado exitosamente",
        registro: updatedRegistro,
      });
    } catch (error) {
      return handleError(
        error,
        "Error al actualizar el registro de Cirugía Nervioso Central"
      );
    }
  });
}

// DELETE - Eliminar un registro de Cirugía Nervioso Central
export async function DELETE(req, { params }) {
  const { id } = params; // Extraer el ID de los parámetros

  return handleRequest(req, async () => {
    if (!id) {
      return NextResponse.json(
        { error: "El campo 'id' es necesario para eliminar el registro." },
        { status: 400 }
      );
    }

    try {
      const registroExistente = await prisma.cirugiaNerviosoCentral.findUnique({
        where: { id: Number(id) },
      });

      if (!registroExistente) {
        return NextResponse.json(
          { error: "Registro no encontrado." },
          { status: 404 }
        );
      }

      await prisma.cirugiaNerviosoCentral.delete({
        where: { id: Number(id) },
      });

      return NextResponse.json({
        message: "Registro de Cirugía Nervioso Central eliminado exitosamente",
      });
    } catch (error) {
      return handleError(
        error,
        "Error al eliminar el registro de Cirugía Nervioso Central"
      );
    }
  });
}
