-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_IntrauterinaPercutanea" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ordenQuirurgicaId" INTEGER,
    "fechaCirugia" DATETIME,
    "horaInicioAnestesia" TEXT,
    "horaInicioCirugiaFetal" TEXT,
    "horaFinalizacionCirugia" TEXT,
    "tipoAnestesiaId" TEXT,
    "complicacionesAnestesicas" TEXT,
    "anastomosisCoaguladas" TEXT,
    "sangradoEstimado" TEXT,
    "complicacionesQuirurgicas" TEXT,
    "proceso" TEXT,
    "ablacionDeVasoTumoral" BOOLEAN,
    "ablacionDeVasoNutricioFetal" BOOLEAN,
    "derivacionToracoAmnioticaUnilateral" BOOLEAN,
    "derivacionToracoAmnioticaBilateral" BOOLEAN,
    "cordocentesis" BOOLEAN,
    "drenajeDeMasaQuisticaRenal" BOOLEAN,
    "drenajeDeMasaQuisticaPulmonar" BOOLEAN,
    "toracocentesis" BOOLEAN,
    "cateterismoCardiaco" BOOLEAN,
    "ablacionDeVasoNutricioSistemico" BOOLEAN,
    "diferenciaPorcentualDePeso" TEXT,
    "bolsilloUnicoInicialDeLiquidoAmniotico" TEXT,
    "frecuenciaCardiacaFetalInicio" TEXT,
    "ubicacionPlacentaria" TEXT NOT NULL,
    "frecuenciaCardiacaFetalFinalizacion" TEXT,
    CONSTRAINT "IntrauterinaPercutanea_ordenQuirurgicaId_fkey" FOREIGN KEY ("ordenQuirurgicaId") REFERENCES "OrdenQuirurgicaIntrauterina" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_IntrauterinaPercutanea" ("ablacionDeVasoNutricioFetal", "ablacionDeVasoNutricioSistemico", "ablacionDeVasoTumoral", "bolsilloUnicoInicialDeLiquidoAmniotico", "complicacionesAnestesicas", "complicacionesQuirurgicas", "fechaCirugia", "frecuenciaCardiacaFetalFinalizacion", "frecuenciaCardiacaFetalInicio", "horaFinalizacionCirugia", "horaInicioAnestesia", "horaInicioCirugiaFetal", "id", "ordenQuirurgicaId", "sangradoEstimado", "tipoAnestesiaId", "ubicacionPlacentaria") SELECT "ablacionDeVasoNutricioFetal", "ablacionDeVasoNutricioSistemico", "ablacionDeVasoTumoral", "bolsilloUnicoInicialDeLiquidoAmniotico", "complicacionesAnestesicas", "complicacionesQuirurgicas", "fechaCirugia", "frecuenciaCardiacaFetalFinalizacion", "frecuenciaCardiacaFetalInicio", "horaFinalizacionCirugia", "horaInicioAnestesia", "horaInicioCirugiaFetal", "id", "ordenQuirurgicaId", "sangradoEstimado", "tipoAnestesiaId", "ubicacionPlacentaria" FROM "IntrauterinaPercutanea";
DROP TABLE "IntrauterinaPercutanea";
ALTER TABLE "new_IntrauterinaPercutanea" RENAME TO "IntrauterinaPercutanea";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
