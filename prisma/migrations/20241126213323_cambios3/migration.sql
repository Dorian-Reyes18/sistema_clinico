/*
  Warnings:

  - You are about to drop the column `etapa` on the `OrdenQuirurgicaIntrauterina` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_OrdenQuirurgicaIntrauterina" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pacienteId" INTEGER NOT NULL,
    "tipoCirugia" TEXT NOT NULL DEFAULT 'Sin Especificar',
    "fechaDeCreacion" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "teniaDiagnostico" BOOLEAN,
    "complicacionesQuirurgicas" TEXT,
    "estado" BOOLEAN,
    CONSTRAINT "OrdenQuirurgicaIntrauterina_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_OrdenQuirurgicaIntrauterina" ("complicacionesQuirurgicas", "estado", "fechaDeCreacion", "id", "pacienteId", "teniaDiagnostico", "tipoCirugia") SELECT "complicacionesQuirurgicas", "estado", "fechaDeCreacion", "id", "pacienteId", "teniaDiagnostico", "tipoCirugia" FROM "OrdenQuirurgicaIntrauterina";
DROP TABLE "OrdenQuirurgicaIntrauterina";
ALTER TABLE "new_OrdenQuirurgicaIntrauterina" RENAME TO "OrdenQuirurgicaIntrauterina";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
