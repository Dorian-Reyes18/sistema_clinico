import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { singToken } from "@/libs/jwt";
import { prisma } from "@/libs/prisma";

export async function GET() {
  try {
    const usuarios = await prisma.usuarios.findMany();
    return NextResponse.json(usuarios);
  } catch (error) {
    console.error("error al obtener todos los usuarios: ", error);
    return NextResponse.json(
      { error: "Error al obtener todos los usuarios" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { rolId, usuario, nombreYApellido, telefono, contrasena } = body;

    const existingUser = await prisma.usuarios.findUnique({
      where: { telefono },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "El número de teléfono ya está en uso." },
        { status: 400 }
      );
    }

    const hashearContraseña = await bcrypt.hash(contrasena, 10);

    const nuevoUsuario = await prisma.usuarios.create({
      data: {
        rolId,
        usuario,
        nombreYApellido,
        telefono,
        contrasena: hashearContraseña,
      },
    });

    const token = singToken(nuevoUsuario);

    return NextResponse.json({
      message: "Usuario creado exitosamente",
      usuario: nuevoUsuario,
      token,
    });
  } catch (error) {
    console.error("error al crear el usuario: ", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Error de unicidad en la base de datos" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Error al crear el usuario" },
      { status: 500 }
    );
  }
}
