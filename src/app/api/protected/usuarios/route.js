import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import bcrypt from "bcryptjs";
import { authenticateRequest } from "@/middlewares/authMiddleware";

// Función auxiliar para manejar errores
const handleError = (error, message, status = 500) => {
  console.error(message, error);
  return NextResponse.json({ error: message }, { status });
};

// Función auxiliar para manejar autenticación y operaciones CRUD
const handleRequest = async (req, operation) => {
  const authResult = await authenticateRequest(req);
  if (authResult) return authResult; // Retorna el error si la autenticación falla

  try {
    return await operation();
  } catch (error) {
    return handleError(error, "Error al procesar la solicitud");
  }
};

// Crear usuario
export async function POST(req) {
  return handleRequest(req, async () => {
    const { rolId, usuario, nombreYApellido, telefono, contrasena } =
      await req.json();

    const existingUser = await prisma.usuarios.findUnique({
      where: { telefono },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "El número de teléfono ya está en uso." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(contrasena, 10);

    const nuevoUsuario = await prisma.usuarios.create({
      data: {
        rolId,
        usuario,
        nombreYApellido,
        telefono,
        contrasena: hashedPassword,
      },
    });

    if (!nuevoUsuario) {
      return NextResponse.json(
        { error: "Error al crear el usuario" },
        { status: 500 }
      );
    }

    const token = singToken(nuevoUsuario); // Crear token JWT después de crear el usuario
    return NextResponse.json({
      message: "Usuario creado exitosamente",
      usuario: nuevoUsuario,
      token,
    });
  });
}

// Obtener todos los usuarios
export async function GET(req) {
  return handleRequest(req, async () => {
    const usuarios = await prisma.usuarios.findMany();
    return NextResponse.json(usuarios);
  });
}
