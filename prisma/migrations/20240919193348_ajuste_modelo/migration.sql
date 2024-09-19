/*
  Warnings:

  - You are about to drop the `EtapaCirugia` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `etapaId` on the `OrdenQuirurgicaIntrauterina` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "OrdenQuirurgicaPostoperacion" ADD COLUMN "etapa" TEXT;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "EtapaCirugia";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_OrdenQuirurgicaIntrauterina" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pacienteId" INTEGER NOT NULL,
    "fechaDeCreacion" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "teniaDiagnostico" BOOLEAN,
    "evaluacionActualId" INTEGER,
    "diagnosticoPrenatalId" INTEGER NOT NULL,
    "etapa" TEXT,
    "complicacionesQuirurgicas" TEXT,
    "estado" BOOLEAN,
    "ordenQuirurgicaIntrauterinaId" INTEGER,
    CONSTRAINT "OrdenQuirurgicaIntrauterina_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "OrdenQuirurgicaIntrauterina_evaluacionActualId_fkey" FOREIGN KEY ("evaluacionActualId") REFERENCES "EvaluacionActual" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "OrdenQuirurgicaIntrauterina_diagnosticoPrenatalId_fkey" FOREIGN KEY ("diagnosticoPrenatalId") REFERENCES "DiagnosticoPrenatal" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_OrdenQuirurgicaIntrauterina" ("complicacionesQuirurgicas", "diagnosticoPrenatalId", "estado", "evaluacionActualId", "fechaDeCreacion", "id", "ordenQuirurgicaIntrauterinaId", "pacienteId", "teniaDiagnostico") SELECT "complicacionesQuirurgicas", "diagnosticoPrenatalId", "estado", "evaluacionActualId", "fechaDeCreacion", "id", "ordenQuirurgicaIntrauterinaId", "pacienteId", "teniaDiagnostico" FROM "OrdenQuirurgicaIntrauterina";
DROP TABLE "OrdenQuirurgicaIntrauterina";
ALTER TABLE "new_OrdenQuirurgicaIntrauterina" RENAME TO "OrdenQuirurgicaIntrauterina";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
