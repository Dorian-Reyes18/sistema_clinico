import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { authenticateRequest } from "@/middlewares/authMiddleware";

const handleError = (error, defaultMessage, status = 500) => {
  console.error(defaultMessage, error);

  // Manejo específico para errores de Prisma
  if (error.code === "P2025") {
    return NextResponse.json(
      { error: "Paciente no encontrado." },
      { status: 404 }
    );
  }

  // Manejo de errores de validación específica
  if (error.message.includes("Invalid value")) {
    return NextResponse.json(
      { error: "Valor inválido proporcionado para uno o más campos." },
      { status: 400 }
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

export async function GET(req, { params }) {
  return handleRequest(req, async () => {
    const { id } = params;
    try {
      const paciente = await prisma.paciente.findUnique({
        where: { id: parseInt(id) },
        include: {
          silais: true,
          municipio: true,
          conyuge: {
            include: {
              sangreRh: true,
            },
          },
          tipoDiabetes: {
            include: {
              evaluacionActual: true,
            },
          },
          antecedentesPersonales: true,
          antecedentesFamiliaresDefectos: true,
          antecedentesObstetricos: true,
          embarazoActual: true,
        },
      });

      if (!paciente) {
        return NextResponse.json(
          { error: "Paciente no encontrado" },
          { status: 404 }
        );
      }

      // Transformar los datos para reemplazar silaisId y municipioId
      const { silaisId, municipioId, ...resto } = paciente;

      return NextResponse.json({
        ...resto,
        silais: paciente.silais,
        municipio: paciente.municipio,
      });
    } catch (error) {
      return handleError(error, "Error al obtener el paciente");
    }
  });
}

export async function PUT(req, { params }) {
  return handleRequest(req, async () => {
    const { id } = params;
    const data = await req.json();

    // Log para depurar los datos recibidos
    console.log("Datos recibidos para actualización:", data);

    // Validar campos
    if (data.conyugeId) {
      const conyuge = await prisma.conyuge.findUnique({
        where: { id: data.conyugeId },
      });
      if (!conyuge) {
        return NextResponse.json(
          { error: "El conyuge especificado no existe." },
          { status: 400 }
        );
      }
    }

    try {
      const paciente = await prisma.paciente.update({
        where: { id: parseInt(id) },
        data,
      });
      return NextResponse.json({
        message: "Paciente actualizado exitosamente",
        paciente,
      });
    } catch (error) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { error: "Paciente no encontrado." },
          { status: 404 }
        );
      }
      return handleError(error, "Error al actualizar el paciente");
    }
  });
}
export async function DELETE(req, { params }) {
  return handleRequest(req, async () => {
    const { id } = params;

    try {
      // Convertir el ID recibido a número
      const pacienteId = parseInt(id);

      // Validar si el paciente existe antes de proceder
      const pacienteExiste = await prisma.paciente.findUnique({
        where: { id: pacienteId },
      });

      if (!pacienteExiste) {
        return NextResponse.json(
          { error: "Paciente no encontrado." },
          { status: 404 }
        );
      }

      // Realizar la eliminación en cascada manual mediante una transacción
      await prisma.$transaction([
        prisma.antecedentesPersonales.deleteMany({
          where: {
            paciente: {
              id: pacienteId,
            },
          }, // Cambiar a 'paciente' como relación en lugar de 'pacienteId'
        }),
        prisma.antecedentesFamiliaresDefectos.deleteMany({
          where: {
            paciente: {
              id: pacienteId,
            },
          },
        }),
        prisma.antecedentesObstetricos.deleteMany({
          where: {
            paciente: {
              id: pacienteId,
            },
          },
        }),
        prisma.embarazoActual.deleteMany({
          where: {
            paciente: {
              id: pacienteId,
            },
          },
        }),
        prisma.tipoDiabetes.deleteMany({
          where: {
            pacienteid: pacienteId, // Asegúrate de usar el campo correcto
          },
        }),
        prisma.conyuge.deleteMany({
          where: {
            pacientes: {
              some: {
                id: pacienteId, // Asegúrate de usar la relación correcta
              },
            },
          },
        }),
        prisma.paciente.delete({
          where: { id: pacienteId },
        }),
      ]);

      return NextResponse.json(
        {
          message: "Paciente y sus dependencias eliminados exitosamente",
        },
        { status: 200 }
      );
    } catch (error) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { error: "Paciente no encontrado." },
          { status: 404 }
        );
      }
      return handleError(
        error,
        "Error al eliminar el paciente o sus dependencias relacionadas"
      );
    }
  });
}
