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
      const tipoDefectos = await prisma.tipoDefecto.findMany();
      const silais = await prisma.silais.findMany();
      const departamentos = await prisma.departamento.findMany();
      const municipios = await prisma.municipio.findMany();
      const sangreRH = await prisma.sangreRH.findMany();
      const tipoDiabetes = await prisma.tipoDiabetes.findMany();
      const etapaCirugia = await prisma.etapaCirugia.findMany();

      return NextResponse.json({
        categorias,
        tipoDefectos,
        silais,
        departamentos,
        municipios,
        sangreRH,
        tipoDiabetes,
        etapaCirugia,
      });
    } catch (error) {
      return handleError(error, "Error al obtener los datos", 500);
    }
  });
}
