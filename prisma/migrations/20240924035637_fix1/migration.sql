/*
  Warnings:

  - You are about to drop the column `intrauterinaId` on the `IntrauterinaAbierta` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_IntrauterinaAbierta" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "diagnosticoPrenatalId" INTEGER NOT NULL,
    "ubicacionPlacentaria" TEXT,
    "sangreEstimado" INTEGER,
    "cierreDeMielomeningocele" BOOLEAN,
    "derivacionVentriculoamniotica" BOOLEAN,
    "cierreDeEncefalocele" BOOLEAN,
    "drenajeDeQuistesCoroideosUniOBilaterales" BOOLEAN,
    "fechaCirugia" DATETIME,
    "horaInicioAnestesia" DATETIME,
    "tipoAnestesiaId" TEXT,
    "complicacionesAnestesicas" TEXT,
    "horaInicioCirugiaMaterna" DATETIME,
    "horaInicioCirugiaFetal" DATETIME,
    "frecuenciaCardiacaFetalInicio" REAL,
    "incisionEnPiel" BOOLEAN,
    "incisionEnUtero" BOOLEAN,
    "tamanoDelDefecto" TEXT NOT NULL,
    "nivelAnatomico" TEXT,
    "nivelFuncional" TEXT,
    "ilaInicialDeLiquidoAmniotico" TEXT,
    "ilaFinalBolsilloUnicoInicialDeLiquidoAmniotico" BOOLEAN,
    "frecuenciaCardiacaFetalFinalizacion" REAL,
    "complicacionesQuirurgicas" TEXT,
    "horaFinalizacionCirugia" DATETIME,
    CONSTRAINT "IntrauterinaAbierta_diagnosticoPrenatalId_fkey" FOREIGN KEY ("diagnosticoPrenatalId") REFERENCES "DiagnosticoPrenatal" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_IntrauterinaAbierta" ("cierreDeEncefalocele", "cierreDeMielomeningocele", "complicacionesAnestesicas", "complicacionesQuirurgicas", "derivacionVentriculoamniotica", "diagnosticoPrenatalId", "drenajeDeQuistesCoroideosUniOBilaterales", "fechaCirugia", "frecuenciaCardiacaFetalFinalizacion", "frecuenciaCardiacaFetalInicio", "horaFinalizacionCirugia", "horaInicioAnestesia", "horaInicioCirugiaFetal", "horaInicioCirugiaMaterna", "id", "ilaFinalBolsilloUnicoInicialDeLiquidoAmniotico", "ilaInicialDeLiquidoAmniotico", "incisionEnPiel", "incisionEnUtero", "nivelAnatomico", "nivelFuncional", "sangreEstimado", "tamanoDelDefecto", "tipoAnestesiaId", "ubicacionPlacentaria") SELECT "cierreDeEncefalocele", "cierreDeMielomeningocele", "complicacionesAnestesicas", "complicacionesQuirurgicas", "derivacionVentriculoamniotica", "diagnosticoPrenatalId", "drenajeDeQuistesCoroideosUniOBilaterales", "fechaCirugia", "frecuenciaCardiacaFetalFinalizacion", "frecuenciaCardiacaFetalInicio", "horaFinalizacionCirugia", "horaInicioAnestesia", "horaInicioCirugiaFetal", "horaInicioCirugiaMaterna", "id", "ilaFinalBolsilloUnicoInicialDeLiquidoAmniotico", "ilaInicialDeLiquidoAmniotico", "incisionEnPiel", "incisionEnUtero", "nivelAnatomico", "nivelFuncional", "sangreEstimado", "tamanoDelDefecto", "tipoAnestesiaId", "ubicacionPlacentaria" FROM "IntrauterinaAbierta";
DROP TABLE "IntrauterinaAbierta";
ALTER TABLE "new_IntrauterinaAbierta" RENAME TO "IntrauterinaAbierta";
CREATE UNIQUE INDEX "IntrauterinaAbierta_diagnosticoPrenatalId_key" ON "IntrauterinaAbierta"("diagnosticoPrenatalId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
