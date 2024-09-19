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
      const pacientes = await prisma.paciente.findMany();
      return NextResponse.json(pacientes);
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
    } = await req.json();

    try {
      const nuevoPaciente = await prisma.paciente.create({
        data: {
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
        },
      });
      return NextResponse.json(
        {
          message: "Paciente creado exitosamente",
          paciente: nuevoPaciente,
        },
        { status: 201 }
      );
    } catch (error) {
      return handleError(error, "Error al crear el paciente");
    }
  });
}
