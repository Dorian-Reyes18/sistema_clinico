import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { authenticateRequest } from "@/middlewares/authMiddleware";

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

export async function GET(req) {
  return handleRequest(req, async () => {
    try {
      const categorias = await prisma.categoria.findMany();
      const departamentos = await prisma.departamento.findMany();
      const tipoDefectos = await prisma.tipoDefecto.findMany();
      const silais = await prisma.silais.findMany();
      const municipios = await prisma.municipio.findMany();
      const sangreRH = await prisma.sangreRH.findMany();

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
