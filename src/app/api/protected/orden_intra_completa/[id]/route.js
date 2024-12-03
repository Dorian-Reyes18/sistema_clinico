import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { authenticateRequest } from "@/middlewares/authMiddleware";

const handleError = (error, defaultMessage, status = 500) => {
  console.error(defaultMessage, error);
  return NextResponse.json({ error: defaultMessage }, { status });
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

export async function PUT(req, { params }) {
  const { id } = params;

  if (!id || isNaN(parseInt(id, 10))) {
    return NextResponse.json(
      { error: "El ID proporcionado es inválido o está ausente" },
      { status: 400 }
    );
  }

  const idNumber = parseInt(id, 10);

  return handleRequest(req, async () => {
    try {
      const body = await req.json();

      // Filtrar valores vacíos en los datos recibidos
      const filterEmpty = (data) => {
        if (Array.isArray(data)) return data.length > 0 ? data : undefined;
        if (typeof data === "object" && data !== null)
          return Object.keys(data).length > 0 ? data : undefined;
        return data;
      };

      const {
        OrdenQuirurgicaIntrauterina,
        DiagnosticoPrenatal,
        IntrauterinaPercutanea,
        ResultadosPerinatales,
        Endoscopicas,
      } = Object.fromEntries(
        Object.entries(body).map(([key, value]) => [key, filterEmpty(value)])
      );

      let ordenActualizada;
      // Actualizar la orden principal
      if (OrdenQuirurgicaIntrauterina) {
        ordenActualizada = await prisma.ordenQuirurgicaIntrauterina.update({
          where: { id: idNumber },
          data: {
            tipoCirugia: OrdenQuirurgicaIntrauterina.tipoCirugia,
            teniaDiagnostico: OrdenQuirurgicaIntrauterina.teniaDiagnostico,
            complicacionesQuirurgicas:
              OrdenQuirurgicaIntrauterina.complicacionesQuirurgicas,
            estado: OrdenQuirurgicaIntrauterina.estado,
            pacienteId: OrdenQuirurgicaIntrauterina.pacienteId,
          },
        });
      }

      // Actualizar o crear Diagnóstico Prenatal
      if (DiagnosticoPrenatal) {
        const existingDiagnostico = await prisma.diagnosticoPrenatal.findFirst({
          where: { cirugiaIntraId: idNumber },
        });

        if (existingDiagnostico) {
          await prisma.diagnosticoPrenatal.update({
            where: { id: existingDiagnostico.id },
            data: DiagnosticoPrenatal,
          });
        } else {
          await prisma.diagnosticoPrenatal.create({
            data: DiagnosticoPrenatal,
          });
        }
      }

      // Actualizar o crear Intrauterina Percutánea
      if (IntrauterinaPercutanea) {
        await prisma.intrauterinaPercutanea.upsert({
          where: { ordenQuirurgicaId: idNumber },
          create: IntrauterinaPercutanea,
          update: IntrauterinaPercutanea,
        });
      }

      // Actualizar o crear Resultados Perinatales
      if (ResultadosPerinatales) {
        await prisma.resultadosPerinatales.upsert({
          where: { ordenQuirurgicaId: idNumber },
          create: ResultadosPerinatales,
          update: ResultadosPerinatales,
        });
      }

      // Ignorar si Endoscopicas está vacío
      if (Endoscopicas && Endoscopicas.length > 0) {
        console.log("Endoscopicas:", Endoscopicas);
      }

      return NextResponse.json({
        message: "Orden quirúrgica y datos asociados actualizados exitosamente",
        ordenActualizada,
      });
    } catch (error) {
      console.error("Error al actualizar la orden quirúrgica", error);
      return handleError(error, "Error al actualizar la orden quirúrgica");
    }
  });
}

// DELETE: Eliminar la orden quirúrgica y sus registros asociados
export async function DELETE(req, { params }) {
  const { id } = params;

  if (!id || isNaN(parseInt(id, 10))) {
    return NextResponse.json(
      { error: "El ID proporcionado es inválido o está ausente" },
      { status: 400 }
    );
  }

  const idNumber = parseInt(id, 10);

  return handleRequest(req, async () => {
    console.log("Eliminando orden quirúrgica con ID:", idNumber);

    try {
      // 1. Eliminar los registros asociados a la orden quirúrgica en cadena
      await prisma.diagnosticoPrenatal.deleteMany({
        where: {
          cirugiaIntraId: idNumber,
        },
      });
      await prisma.evaluacionActual.deleteMany({
        where: {
          ordenQuirurgicaId: idNumber,
        },
      });

      await prisma.intrauterinaEndoscopica.deleteMany({
        where: {
          ordenQuirurgicaId: idNumber,
        },
      });

      await prisma.intrauterinaAbierta.deleteMany({
        where: {
          ordenQuirurgicaId: idNumber,
        },
      });

      await prisma.intrauterinaPercutanea.deleteMany({
        where: {
          ordenQuirurgicaId: idNumber,
        },
      });

      await prisma.resultadosPerinatales.deleteMany({
        where: {
          ordenQuirurgicaId: idNumber,
        },
      });

      // 2. Eliminar la orden quirúrgica
      const ordenQuirurgica = await prisma.ordenQuirurgicaIntrauterina.delete({
        where: {
          id: idNumber,
        },
      });

      return NextResponse.json({
        message:
          "Orden quirúrgica y registros asociados eliminados exitosamente",
        ordenQuirurgica,
      });
    } catch (error) {
      return handleError(error, "Error al eliminar la orden quirúrgica");
    }
  });
}

export async function GET(req, { params }) {
  const authResult = await authenticateRequest(req);
  if (authResult) return authResult;

  const { id } = params;

  console.log("ID recibido:", id);

  if (!id || isNaN(parseInt(id, 10))) {
    return NextResponse.json(
      { error: "El ID proporcionado es inválido o está ausente" },
      { status: 400 }
    );
  }

  try {
    // Buscar la orden quirúrgica por ID
    const ordenQuirurgica = await prisma.ordenQuirurgicaIntrauterina.findUnique(
      {
        where: { id: parseInt(id, 10) },
        include: {
          diagnosticoPrenatal: true,
          evaluacionActual: true,
          intrauterinaAbierta: true,
          intrauterinaPercutanea: true,
          intrauterinaEndoscopica: true,
          resultadosPerinatales: true,
        },
      }
    );

    console.log("Orden quirúrgica encontrada:", ordenQuirurgica);

    if (!ordenQuirurgica) {
      return NextResponse.json(
        { error: "Orden quirúrgica no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Orden quirúrgica obtenida exitosamente",
      ordenQuirurgica,
    });
  } catch (error) {
    console.error("Error al obtener la orden quirúrgica:", error);
    return handleError(error, "Error al obtener la orden quirúrgica", 500);
  }
}
