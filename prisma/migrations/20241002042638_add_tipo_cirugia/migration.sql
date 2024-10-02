-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_OrdenQuirurgicaIntrauterina" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pacienteId" INTEGER NOT NULL,
    "tipoCirugia" TEXT NOT NULL DEFAULT 'Sin Especificar',
    "fechaDeCreacion" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "teniaDiagnostico" BOOLEAN,
    "evaluacionActualId" INTEGER,
    "etapa" TEXT,
    "complicacionesQuirurgicas" TEXT,
    "estado" BOOLEAN,
    CONSTRAINT "OrdenQuirurgicaIntrauterina_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "OrdenQuirurgicaIntrauterina_evaluacionActualId_fkey" FOREIGN KEY ("evaluacionActualId") REFERENCES "EvaluacionActual" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_OrdenQuirurgicaIntrauterina" ("complicacionesQuirurgicas", "estado", "etapa", "evaluacionActualId", "fechaDeCreacion", "id", "pacienteId", "teniaDiagnostico") SELECT "complicacionesQuirurgicas", "estado", "etapa", "evaluacionActualId", "fechaDeCreacion", "id", "pacienteId", "teniaDiagnostico" FROM "OrdenQuirurgicaIntrauterina";
DROP TABLE "OrdenQuirurgicaIntrauterina";
ALTER TABLE "new_OrdenQuirurgicaIntrauterina" RENAME TO "OrdenQuirurgicaIntrauterina";
CREATE UNIQUE INDEX "OrdenQuirurgicaIntrauterina_evaluacionActualId_key" ON "OrdenQuirurgicaIntrauterina"("evaluacionActualId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
