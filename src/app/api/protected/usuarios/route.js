import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { authenticateRequest } from "@/middlewares/authMiddleware";
import bcrypt from "bcryptjs";

const handleError = (error, message, status = 500) => {
  console.error(message, error);
  return NextResponse.json({ error: message }, { status });
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

// Obtener todos los usuarios sin rolId
export async function GET(req) {
  return handleRequest(req, async () => {
    try {
      const usuarios = await prisma.usuarios.findMany({
        include: {
          rol: true,
        },
      });

      // Eliminamos rolId de la respuesta
      const usuariosSinRolId = usuarios.map(({ rolId, ...usuario }) => usuario);

      return NextResponse.json({ usuarios: usuariosSinRolId });
    } catch (error) {
      return handleError(error, "Error al obtener los usuarios", 500);
    }
  });
}
// Crear un nuevo usuario
export async function POST(req) {
  const authResult = await authenticateRequest(req);
  if (authResult) return authResult;

  let body;
  try {
    body = await req.json();
  } catch (error) {
    return NextResponse.json(
      {
        error:
          "Cuerpo de la solicitud inválido. Asegúrese de que el formato sea JSON. Detalles del error: " +
          error.message,
      },
      { status: 400 }
    );
  }

  if (!Object.keys(body).length) {
    return NextResponse.json(
      {
        error:
          "No se proporcionaron datos para crear el usuario. Asegúrese de enviar todos los campos necesarios.",
      },
      { status: 400 }
    );
  }

  try {
    // Verificar si el número de teléfono ya existe
    const existingUser = await prisma.usuarios.findUnique({
      where: { telefono: body.telefono },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          error:
            "El número de teléfono ya está registrado. Por favor, ingrese un número diferente.",
        },
        { status: 400 }
      );
    }

    // Hash de la contraseña
    if (body.contrasena) {
      body.contrasena = await bcrypt.hash(body.contrasena, 10);
    }

    // Crear el nuevo usuario
    const nuevoUsuario = await prisma.usuarios.create({
      data: body,
    });

    return NextResponse.json({
      message: "Usuario creado exitosamente.",
      usuario: nuevoUsuario,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: `Error al crear el usuario. Detalles del error: ${error.message}`,
      },
      { status: 500 }
    );
  }
}
