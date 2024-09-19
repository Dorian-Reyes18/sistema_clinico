// api/usuarios/route.js
export async function POST(request) {
  try {
    const { rolId, usuario, nombreYApellido, telefono, contrasena } =
      await request.json();

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
  } catch (error) {
    console.error("Error al crear el usuario:", error);
    return NextResponse.json(
      { error: "Error al crear el usuario" },
      { status: 500 }
    );
  }
}
