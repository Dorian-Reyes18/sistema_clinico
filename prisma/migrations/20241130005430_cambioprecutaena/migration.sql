/*
  Warnings:

  - You are about to drop the column `ablacionDeVasoNutricioFetal` on the `IntrauterinaPercutanea` table. All the data in the column will be lost.

*/
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
    "derivacionToracoAmnioticaUnilateral" BOOLEAN,
    "derivacionToracoAmnioticaBilateral" BOOLEAN,
    "cordocentesis" BOOLEAN,
    "drenajeDeMasaQuisticaRenal" BOOLEAN,
    "drenajeDeMasaQuisticaPulmonar" BOOLEAN,
    "toracocentesis" BOOLEAN,
    "cateterismoCardiaco" BOOLEAN,
    "ablacionDeVasoNutricioSistemico" BOOLEAN,
    "ablacionDeVasoNutricioPulmonar" BOOLEAN,
    "diferenciaPorcentualDePeso" TEXT,
    "bolsilloUnicoInicialDeLiquidoAmniotico" TEXT,
    "frecuenciaCardiacaFetalInicio" TEXT,
    "ubicacionPlacentaria" TEXT NOT NULL,
    "frecuenciaCardiacaFetalFinalizacion" TEXT,
    CONSTRAINT "IntrauterinaPercutanea_ordenQuirurgicaId_fkey" FOREIGN KEY ("ordenQuirurgicaId") REFERENCES "OrdenQuirurgicaIntrauterina" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_IntrauterinaPercutanea" ("ablacionDeVasoNutricioSistemico", "ablacionDeVasoTumoral", "anastomosisCoaguladas", "bolsilloUnicoInicialDeLiquidoAmniotico", "cateterismoCardiaco", "complicacionesAnestesicas", "complicacionesQuirurgicas", "cordocentesis", "derivacionToracoAmnioticaBilateral", "derivacionToracoAmnioticaUnilateral", "diferenciaPorcentualDePeso", "drenajeDeMasaQuisticaPulmonar", "drenajeDeMasaQuisticaRenal", "fechaCirugia", "frecuenciaCardiacaFetalFinalizacion", "frecuenciaCardiacaFetalInicio", "horaFinalizacionCirugia", "horaInicioAnestesia", "horaInicioCirugiaFetal", "id", "ordenQuirurgicaId", "proceso", "sangradoEstimado", "tipoAnestesiaId", "toracocentesis", "ubicacionPlacentaria") SELECT "ablacionDeVasoNutricioSistemico", "ablacionDeVasoTumoral", "anastomosisCoaguladas", "bolsilloUnicoInicialDeLiquidoAmniotico", "cateterismoCardiaco", "complicacionesAnestesicas", "complicacionesQuirurgicas", "cordocentesis", "derivacionToracoAmnioticaBilateral", "derivacionToracoAmnioticaUnilateral", "diferenciaPorcentualDePeso", "drenajeDeMasaQuisticaPulmonar", "drenajeDeMasaQuisticaRenal", "fechaCirugia", "frecuenciaCardiacaFetalFinalizacion", "frecuenciaCardiacaFetalInicio", "horaFinalizacionCirugia", "horaInicioAnestesia", "horaInicioCirugiaFetal", "id", "ordenQuirurgicaId", "proceso", "sangradoEstimado", "tipoAnestesiaId", "toracocentesis", "ubicacionPlacentaria" FROM "IntrauterinaPercutanea";
DROP TABLE "IntrauterinaPercutanea";
ALTER TABLE "new_IntrauterinaPercutanea" RENAME TO "IntrauterinaPercutanea";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
