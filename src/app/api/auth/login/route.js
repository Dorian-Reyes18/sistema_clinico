// app/api/auth/login/route.js
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { singToken } from "@/libs/jwt";
import { prisma } from "@/libs/prisma";

export async function POST(request) {
  try {
    const { telefono, contrasena } = await request.json();

    if (!telefono || !contrasena) {
      return NextResponse.json(
        { error: "Se requieren teléfono y contraseña para la autenticación" },
        { status: 400 }
      );
    }

    const user = await prisma.usuarios.findUnique({ where: { telefono } });

    if (!user || !user.contrasena) {
      return NextResponse.json(
        { error: "Usuario no encontrado o sin contraseña" },
        { status: 404 }
      );
    }

    const isMatch = await bcrypt.compare(contrasena, user.contrasena);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Contraseña incorrecta" },
        { status: 401 }
      );
    }

    const token = singToken(user); // Crear token JWT
    return NextResponse.json({ token });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    return NextResponse.json(
      { error: "Error al iniciar sesión" },
      { status: 500 }
    );
  }
}
