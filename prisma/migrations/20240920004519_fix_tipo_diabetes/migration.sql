/*
  Warnings:

  - You are about to drop the `_PacienteToTipoDiabetes` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `pacienteid` to the `TipoDiabetes` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "_PacienteToTipoDiabetes_B_index";

-- DropIndex
DROP INDEX "_PacienteToTipoDiabetes_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_PacienteToTipoDiabetes";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TipoDiabetes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pacienteid" INTEGER NOT NULL,
    "mellitusTipo1" BOOLEAN NOT NULL,
    "mellitusTipo2" BOOLEAN NOT NULL,
    "mellitusGestacional" BOOLEAN NOT NULL,
    "ninguna" BOOLEAN NOT NULL,
    "fechaDiagnostico" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TipoDiabetes_pacienteid_fkey" FOREIGN KEY ("pacienteid") REFERENCES "Paciente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TipoDiabetes" ("fechaDiagnostico", "id", "mellitusGestacional", "mellitusTipo1", "mellitusTipo2", "ninguna") SELECT "fechaDiagnostico", "id", "mellitusGestacional", "mellitusTipo1", "mellitusTipo2", "ninguna" FROM "TipoDiabetes";
DROP TABLE "TipoDiabetes";
ALTER TABLE "new_TipoDiabetes" RENAME TO "TipoDiabetes";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
