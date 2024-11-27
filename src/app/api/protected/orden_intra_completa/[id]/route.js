import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { authenticateRequest } from "@/middlewares/authMiddleware";

// Manejo de errores
const handleError = (error, defaultMessage, status = 500) => {
  console.error(defaultMessage, error);
  return NextResponse.json({ error: defaultMessage }, { status });
};

// Manejo de solicitudes comunes
const handleRequest = async (req, operation) => {
  const authResult = await authenticateRequest(req);
  if (authResult) return authResult;

  try {
    return await operation();
  } catch (error) {
    return handleError(error, "Error al procesar la solicitud");
  }
};

// DELETE: Eliminar la orden quirúrgica y sus registros asociados
export async function DELETE(req, { params }) {
  const { id } = params; // Obtenemos el id desde params

  if (!id || isNaN(parseInt(id, 10))) {
    return NextResponse.json(
      { error: "El ID proporcionado es inválido o está ausente" },
      { status: 400 }
    );
  }

  const idNumber = parseInt(id, 10); // Convertir el id a número entero

  return handleRequest(req, async () => {
    console.log("Eliminando orden quirúrgica con ID:", idNumber);

    try {
      // 1. Eliminar los registros asociados a la orden quirúrgica en cadena
      await prisma.diagnosticoPrenatal.deleteMany({
        where: {
          cirugiaIntraId: idNumber, // Usamos idNumber como entero
        },
      });

      await prisma.intrauterinaEndoscopica.deleteMany({
        where: {
          ordenQuirurgicaId: idNumber, // Usamos idNumber como entero
        },
      });

      await prisma.intrauterinaAbierta.deleteMany({
        where: {
          ordenQuirurgicaId: idNumber, // Usamos idNumber como entero
        },
      });

      await prisma.intrauterinaPercutanea.deleteMany({
        where: {
          ordenQuirurgicaId: idNumber, // Usamos idNumber como entero
        },
      });

      await prisma.resultadosPerinatales.deleteMany({
        where: {
          ordenQuirurgicaId: idNumber, // Usamos idNumber como entero
        },
      });

      // 2. Eliminar la orden quirúrgica
      const ordenQuirurgica = await prisma.ordenQuirurgicaIntrauterina.delete({
        where: {
          id: idNumber, // Usamos idNumber como entero
        },
      });

      return NextResponse.json({
        message:
          "Orden quirúrgica y registros asociados eliminados exitosamente",
        ordenQuirurgica,
      });
    } catch (error) {
      return handleError(error, "Error al eliminar la orden quirúrgica");
    }
  });
}

// GET: Obtener una orden quirúrgica por ID con los datos relacionados concatenados
export async function GET(req, { params }) {
  const authResult = await authenticateRequest(req);
  if (authResult) return authResult;

  const { id } = params;

  console.log("ID recibido:", id);

  if (!id || isNaN(parseInt(id, 10))) {
    return NextResponse.json(
      { error: "El ID proporcionado es inválido o está ausente" },
      { status: 400 }
    );
  }

  try {
    // Buscar la orden quirúrgica por ID
    const ordenQuirurgica = await prisma.ordenQuirurgicaIntrauterina.findUnique(
      {
        where: { id: parseInt(id, 10) },
        include: {
          diagnosticoPrenatal: true,
          intrauterinaAbierta: true,
          intrauterinaPercutanea: true,
          intrauterinaEndoscopica: true,
          resultadosPerinatales: true,
        },
      }
    );

    console.log("Orden quirúrgica encontrada:", ordenQuirurgica);

    if (!ordenQuirurgica) {
      return NextResponse.json(
        { error: "Orden quirúrgica no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Orden quirúrgica obtenida exitosamente",
      ordenQuirurgica,
    });
  } catch (error) {
    console.error("Error al obtener la orden quirúrgica:", error);
    return handleError(error, "Error al obtener la orden quirúrgica", 500);
  }
}
