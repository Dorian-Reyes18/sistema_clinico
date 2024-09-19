import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { authenticateRequest } from "@/middlewares/authMiddleware";

// Función auxiliar para manejar errores
const handleError = (error, message, status = 500) => {
  console.error(message, error);
  return NextResponse.json({ error: message }, { status });
};

// Función auxiliar para manejar autenticación y operaciones CRUD
const handleRequest = async (req, operation) => {
  const authResult = await authenticateRequest(req);
  if (authResult) return authResult; // Si la autenticación falla, devuelve la respuesta de error

  try {
    return await operation(); // Si la autenticación pasa, ejecuta la operación
  } catch (error) {
    return handleError(error, "Error al procesar la solicitud");
  }
};

// Manejar la solicitud GET para obtener los modelos
export async function GET(req) {
  return handleRequest(req, async () => {
    try {
      // Aquí obtenemos los datos de todos los modelos que mencionaste:
      const categorias = await prisma.categoria.findMany();
      const departamentos = await prisma.departamento.findMany();
      const tipoDefectos = await prisma.tipoDefecto.findMany();
      const silais = await prisma.silais.findMany();
      const municipios = await prisma.municipio.findMany();
      const sangreRH = await prisma.sangreRH.findMany();

      // Devolveremos todos los modelos en un solo objeto
      return NextResponse.json({
        categorias,
        tipoDefectos,
        silais,
        departamentos,
        municipios,
        sangreRH,
      });
    } catch (error) {
      return handleError(error, "Error al obtener los datos", 500);
    }
  });
}
