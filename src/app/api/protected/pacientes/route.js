import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { authenticateRequest } from "@/middlewares/authMiddleware";

const handleError = (error, defaultMessage, status = 500) => {
  console.error(defaultMessage, error);

  // Manejo de errores específicos de Prisma
  if (error.code === "P2002") {
    return NextResponse.json(
      { error: "El número de expediente ya existe. Por favor, usa otro." },
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

export async function GET(req) {
  return handleRequest(req, async () => {
    try {
      const pacientes = await prisma.paciente.findMany({
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
              antecedentesPersonales: true,
              // evaluacionActual: true,
            },
          },
          antecedentesPersonales: true,
          antecedentesFamiliaresDefectos: true,
          antecedentesObstetricos: true,
          embarazoActual: true,
        },
      });

      // Transformar los datos para reemplazar silaisId y municipioId
      const pacientesTransformados = pacientes.map((paciente) => {
        const { silaisId, municipioId, ...resto } = paciente;
        return {
          ...resto,
          silais: paciente.silais,
          municipio: paciente.municipio,
        };
      });

      return NextResponse.json(pacientesTransformados);
    } catch (error) {
      return handleError(error, "Error al obtener los pacientes");
    }
  });
}

export async function POST(req) {
  return handleRequest(req, async () => {
    const {
      silaisId,
      municipioId,
      numeroExpediente,
      primerNombre,
      segundoNombre,
      primerApellido,
      segundoApellido,
      edad,
      fechaNac,
      telefono1,
      telefono2,
      fechaIngreso,
      domicilio,
      conyugeId,
    } = await req.json();

    const numeroExpedienteStr = numeroExpediente.toString();

    try {
      const nuevoPaciente = await prisma.paciente.create({
        data: {
          silaisId,
          municipioId,
          numeroExpediente: numeroExpedienteStr,
          primerNombre,
          segundoNombre,
          primerApellido,
          segundoApellido,
          edad,
          fechaNac,
          telefono1,
          telefono2,
          fechaIngreso,
          domicilio,
          conyugeId: conyugeId ? conyugeId : undefined,
        },
        include: {
          silais: true,
          municipio: true,
          conyuge: true,
        },
      });

      const { silaisId: _, municipioId: __, ...pacienteSinIds } = nuevoPaciente;

      return NextResponse.json(
        {
          message: "Paciente creado exitosamente",
          paciente: pacienteSinIds,
        },
        { status: 201 }
      );
    } catch (error) {
      console.error("Error al crear el paciente:", error);
      return NextResponse.json(
        {
          error:
            "No se pudo crear el paciente. Verifique los datos proporcionados.",
        },
        { status: 400 }
      );
    }
  });
}
