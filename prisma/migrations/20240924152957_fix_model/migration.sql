/*
  Warnings:

  - You are about to drop the column `intrauterinaId` on the `IntrauterinaEndoscopica` table. All the data in the column will be lost.
  - You are about to drop the column `ubicacionPlacentariaId` on the `IntrauterinaEndoscopica` table. All the data in the column will be lost.
  - You are about to drop the column `percutaneaId` on the `IntrauterinaPercutanea` table. All the data in the column will be lost.
  - You are about to drop the column `ubicacionPlacentariaId` on the `IntrauterinaPercutanea` table. All the data in the column will be lost.
  - Added the required column `ubicacionPlacentaria` to the `IntrauterinaEndoscopica` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ubicacionPlacentaria` to the `IntrauterinaPercutanea` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_IntrauterinaEndoscopica" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "diagnosticoPrenatalId" INTEGER NOT NULL,
    "ubicacionPlacentaria" TEXT NOT NULL,
    "laserDeAnastomosisPlacentaria" BOOLEAN,
    "coagulacionBipolarDeCordoneUmbilical" BOOLEAN,
    "liberacionDeBandasAmnioticas" BOOLEAN,
    "colocacionDeBalonEndotraqueal" BOOLEAN,
    "retiroDeBalonEndotraqueal" BOOLEAN,
    "reparacionDeMielomeningocele" BOOLEAN,
    "cistoscopia" BOOLEAN,
    "cistoscopiaMasLaserDeValvasUretralesPosteriores" BOOLEAN,
    "intubacionEndotraquealIntrauterina" BOOLEAN,
    "fechaCirugia" DATETIME,
    "horaInicioAnestesia" DATETIME,
    "tipoAnestesiaId" TEXT,
    "complicacionesAnestesicas" TEXT,
    "horaInicioCirugiaFetal" DATETIME,
    "frecuenciaCardiacaFetalInicio" REAL,
    "bolsilloUnicoInicialDeLiquidoAmniotico" BOOLEAN,
    "sangradoEstimado" TEXT,
    "frecuenciaCardiacaFetalFinalizacion" REAL,
    "complicacionesQuirurgicas" TEXT,
    "horaFinalizacionCirugia" DATETIME,
    CONSTRAINT "IntrauterinaEndoscopica_diagnosticoPrenatalId_fkey" FOREIGN KEY ("diagnosticoPrenatalId") REFERENCES "DiagnosticoPrenatal" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_IntrauterinaEndoscopica" ("bolsilloUnicoInicialDeLiquidoAmniotico", "cistoscopia", "cistoscopiaMasLaserDeValvasUretralesPosteriores", "coagulacionBipolarDeCordoneUmbilical", "colocacionDeBalonEndotraqueal", "complicacionesAnestesicas", "complicacionesQuirurgicas", "diagnosticoPrenatalId", "fechaCirugia", "frecuenciaCardiacaFetalFinalizacion", "frecuenciaCardiacaFetalInicio", "horaFinalizacionCirugia", "horaInicioAnestesia", "horaInicioCirugiaFetal", "id", "intubacionEndotraquealIntrauterina", "laserDeAnastomosisPlacentaria", "liberacionDeBandasAmnioticas", "reparacionDeMielomeningocele", "retiroDeBalonEndotraqueal", "sangradoEstimado", "tipoAnestesiaId") SELECT "bolsilloUnicoInicialDeLiquidoAmniotico", "cistoscopia", "cistoscopiaMasLaserDeValvasUretralesPosteriores", "coagulacionBipolarDeCordoneUmbilical", "colocacionDeBalonEndotraqueal", "complicacionesAnestesicas", "complicacionesQuirurgicas", "diagnosticoPrenatalId", "fechaCirugia", "frecuenciaCardiacaFetalFinalizacion", "frecuenciaCardiacaFetalInicio", "horaFinalizacionCirugia", "horaInicioAnestesia", "horaInicioCirugiaFetal", "id", "intubacionEndotraquealIntrauterina", "laserDeAnastomosisPlacentaria", "liberacionDeBandasAmnioticas", "reparacionDeMielomeningocele", "retiroDeBalonEndotraqueal", "sangradoEstimado", "tipoAnestesiaId" FROM "IntrauterinaEndoscopica";
DROP TABLE "IntrauterinaEndoscopica";
ALTER TABLE "new_IntrauterinaEndoscopica" RENAME TO "IntrauterinaEndoscopica";
CREATE UNIQUE INDEX "IntrauterinaEndoscopica_diagnosticoPrenatalId_key" ON "IntrauterinaEndoscopica"("diagnosticoPrenatalId");
CREATE TABLE "new_IntrauterinaPercutanea" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "diagnosticoPrenatalId" INTEGER NOT NULL,
    "ubicacionPlacentaria" TEXT NOT NULL,
    "ablacionDeVasoTumoral" BOOLEAN,
    "ablacionDeVasoNutricioSistemico" BOOLEAN,
    "ablacionDeVasoNutricioFetal" BOOLEAN,
    "fechaCirugia" DATETIME,
    "horaInicioAnestesia" DATETIME,
    "tipoAnestesiaId" TEXT,
    "complicacionesAnestesicas" TEXT,
    "horaInicioCirugiaFetal" DATETIME,
    "frecuenciaCardiacaFetalInicio" REAL,
    "bolsilloUnicoInicialDeLiquidoAmniotico" BOOLEAN,
    "sangradoEstimado" TEXT,
    "frecuenciaCardiacaFetalFinalizacion" REAL,
    "complicacionesQuirurgicas" TEXT,
    "horaFinalizacionCirugia" DATETIME,
    CONSTRAINT "IntrauterinaPercutanea_diagnosticoPrenatalId_fkey" FOREIGN KEY ("diagnosticoPrenatalId") REFERENCES "DiagnosticoPrenatal" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_IntrauterinaPercutanea" ("ablacionDeVasoNutricioFetal", "ablacionDeVasoNutricioSistemico", "ablacionDeVasoTumoral", "bolsilloUnicoInicialDeLiquidoAmniotico", "complicacionesAnestesicas", "complicacionesQuirurgicas", "diagnosticoPrenatalId", "fechaCirugia", "frecuenciaCardiacaFetalFinalizacion", "frecuenciaCardiacaFetalInicio", "horaFinalizacionCirugia", "horaInicioAnestesia", "horaInicioCirugiaFetal", "id", "sangradoEstimado", "tipoAnestesiaId") SELECT "ablacionDeVasoNutricioFetal", "ablacionDeVasoNutricioSistemico", "ablacionDeVasoTumoral", "bolsilloUnicoInicialDeLiquidoAmniotico", "complicacionesAnestesicas", "complicacionesQuirurgicas", "diagnosticoPrenatalId", "fechaCirugia", "frecuenciaCardiacaFetalFinalizacion", "frecuenciaCardiacaFetalInicio", "horaFinalizacionCirugia", "horaInicioAnestesia", "horaInicioCirugiaFetal", "id", "sangradoEstimado", "tipoAnestesiaId" FROM "IntrauterinaPercutanea";
DROP TABLE "IntrauterinaPercutanea";
ALTER TABLE "new_IntrauterinaPercutanea" RENAME TO "IntrauterinaPercutanea";
CREATE UNIQUE INDEX "IntrauterinaPercutanea_diagnosticoPrenatalId_key" ON "IntrauterinaPercutanea"("diagnosticoPrenatalId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
