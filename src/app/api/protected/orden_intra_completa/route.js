import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { authenticateRequest } from "@/middlewares/authMiddleware";

// Manejo de errores centralizado
const handleError = (error, defaultMessage, status = 500) => {
  console.error(defaultMessage, error);

  if (error.code === "P2025") {
    return NextResponse.json(
      { error: "Recurso no encontrado." },
      { status: 404 }
    );
  }

  return NextResponse.json({ error: defaultMessage }, { status });
};

// Manejo de solicitudes comunes
const handleRequest = async (req, operation) => {
  const authResult = await authenticateRequest(req);
  if (authResult) return authResult;

  try {
    return await operation();
  } catch (error) {
    return handleError(error, "Error al procesar la solicitud");
  }
};

// POST: Crear nuevos registros con las relaciones entre tablas
export async function POST(req) {
  return handleRequest(req, async () => {
    const data = await req.json();
    console.log("Datos recibidos en la solicitud:", data);

    if (!data.OrdenQuirurgicaIntrauterina) {
      console.log("Falta el campo 'OrdenQuirurgicaIntrauterina'");
      return NextResponse.json(
        { error: "El campo 'OrdenQuirurgicaIntrauterina' es requerido." },
        { status: 400 }
      );
    }

    const {
      OrdenQuirurgicaIntrauterina,
      IntrauterinaAbierta,
      IntrauterinaPercutanea,
      Endoscopicas,
      ResultadosPerinatales,
      DiagnosticoPrenatal,
    } = data;

    
    console.log(
      "OrdenQuirurgicaIntrauterina recibido:",
      OrdenQuirurgicaIntrauterina
    );

    console.log(
      "Datos para crear la orden quirúrgica:",
      OrdenQuirurgicaIntrauterina
    );

    try {
      const ordenQuirurgica = await prisma.ordenQuirurgicaIntrauterina.create({
        data: OrdenQuirurgicaIntrauterina,
      });

      if (DiagnosticoPrenatal) {
        await prisma.diagnosticoPrenatal.create({
          data: {
            cirugiaIntraId: ordenQuirurgica.id,
            ...DiagnosticoPrenatal,
          },
        });
      }

      if (Endoscopicas && Endoscopicas.length > 0) {
        for (let endoscopica of Endoscopicas) {
          await prisma.intrauterinaEndoscopica.create({
            data: {
              ordenQuirurgica: {
                connect: { id: ordenQuirurgica.id },
              },
              ...endoscopica,
            },
          });
        }
      }

      if (IntrauterinaAbierta) {
        await prisma.intrauterinaAbierta.create({
          data: {
            ordenQuirurgica: {
              connect: { id: ordenQuirurgica.id },
            },
            ...IntrauterinaAbierta,
          },
        });
      }

      if (IntrauterinaPercutanea) {
        await prisma.intrauterinaPercutanea.create({
          data: {
            ordenQuirurgica: {
              connect: { id: ordenQuirurgica.id },
            },
            ...IntrauterinaPercutanea,
          },
        });
      }

      if (ResultadosPerinatales) {
        await prisma.resultadosPerinatales.create({
          data: {
            ordenQuirurgica: {
              connect: { id: ordenQuirurgica.id },
            },
            ...ResultadosPerinatales,
          },
        });
      }

      return NextResponse.json({
        message: "Registros creados exitosamente",
        ordenQuirurgica,
      });
    } catch (error) {
      console.error("Error al procesar la solicitud:", error);
      return handleError(error, "Error al procesar la solicitud");
    }
  });
}

export async function GET(req) {
  return handleRequest(req, async () => {
    try {
      const ordenesQuirurgicas =
        await prisma.ordenQuirurgicaIntrauterina.findMany({
          include: {
            diagnosticoPrenatal: true,
            intrauterinaAbierta: true,
            intrauterinaPercutanea: true,
            intrauterinaEndoscopica: true,
            resultadosPerinatales: true,
          },
        });

      return NextResponse.json({
        message: "Órdenes quirúrgicas obtenidas exitosamente",
        ordenesQuirurgicas,
      });
    } catch (error) {
      console.error("Error al procesar la solicitud:", error);
      return handleError(error, "Error al obtener las órdenes quirúrgicas");
    }
  });
}
