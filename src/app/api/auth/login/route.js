import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { singToken } from "@/libs/jwt";
import { prisma } from "@/libs/prisma";

export async function POST(request) {
  try {
    // Intenta parsear el cuerpo de la solicitud
    const body = await request.json();
    const { telefono, contrasena } = body;

    // Verifica que se proporcionen el teléfono y la contraseña
    if (!telefono || !contrasena) {
      return NextResponse.json(
        { error: "Se requieren teléfono y contraseña para la autenticación" },
        { status: 400 }
      );
    }

    // Busca al usuario usando el teléfono
    const user = await prisma.usuarios.findUnique({
      where: { telefono },
    });

    // Verifica si el usuario existe
    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    // Verifica si el campo contraseña existe
    if (!user.contrasena) {
      return NextResponse.json(
        { error: "El usuario no tiene una contraseña asignada" },
        { status: 500 }
      );
    }

    // Verifica la contraseña
    const isMatch = await bcrypt.compare(contrasena, user.contrasena);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Contraseña incorrecta" },
        { status: 401 }
      );
    }

    // Genera el token y responde con él
    const token = singToken(user);
    return NextResponse.json({ token });
  } catch (error) {
    // Manejo de errores más detallado
    console.error("Error al iniciar sesión:", error);

    // Verificar si el error es un problema de parseo JSON
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "El cuerpo de la solicitud no está en formato JSON válido" },
        { status: 400 }
      );
    }

    // Verificar si el error es un problema relacionado con bcrypt
    if (error.message.includes("bcrypt")) {
      return NextResponse.json(
        { error: "Error al comparar la contraseña" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Error al iniciar sesión" },
      { status: 500 }
    );
  }
}
