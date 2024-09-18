import { NextResponse } from "next/server";
import { verifyToken } from "@/libs/jwt"; // Asegúrate de tener una función para verificar el token
import { prisma } from "@/libs/prisma";

export async function GET(request) {
  try {
    // Obtener el token del encabezado Authorization
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Se requiere autenticación" },
        { status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "");

    // Verificar el token
    const user = await verifyToken(token);
    if (!user) {
      return NextResponse.json(
        { error: "Autenticación fallida" },
        { status: 401 }
      );
    }

    // Obtener todos los roles
    const roles = await prisma.roles.findMany();
    return NextResponse.json(roles);
  } catch (error) {
    console.error("Error al obtener roles:", error);
    return NextResponse.json(
      { error: "Error al solicitar los roles" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    // Obtener el token del encabezado Authorization
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Se requiere autenticación" },
        { status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "");

    // Verificar el token
    const user = await verifyToken(token);
    if (!user) {
      return NextResponse.json(
        { error: "Autenticación fallida" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const nuevoRol = await prisma.roles.create({
      data: body,
    });

    return NextResponse.json({
      message: "Rol creado exitosamente",
      rol: nuevoRol,
    });
  } catch (error) {
    console.error("Error al crear rol:", error);
    return NextResponse.json(
      { error: "Error al crear el rol" },
      { status: 500 }
    );
  }
}
