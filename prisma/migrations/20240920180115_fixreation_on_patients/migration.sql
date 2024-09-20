/*
  Warnings:

  - Added the required column `pacienteId` to the `EvaluacionActual` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_EvaluacionActual" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pacienteId" INTEGER NOT NULL,
    "tipoDiabetesId" INTEGER NOT NULL,
    "lupusEritematosoSist" BOOLEAN,
    "obesidad" BOOLEAN,
    "hipertension" BOOLEAN,
    "sindromeAntifosfo" BOOLEAN,
    "cardiopatias" BOOLEAN,
    "artritis" BOOLEAN,
    "hipotiroidismo" BOOLEAN,
    "hipertiroidismo" BOOLEAN,
    "trombofilia" BOOLEAN,
    "epilepsia" BOOLEAN,
    "observaciones" TEXT,
    CONSTRAINT "EvaluacionActual_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "EvaluacionActual_tipoDiabetesId_fkey" FOREIGN KEY ("tipoDiabetesId") REFERENCES "TipoDiabetes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_EvaluacionActual" ("artritis", "cardiopatias", "epilepsia", "hipertension", "hipertiroidismo", "hipotiroidismo", "id", "lupusEritematosoSist", "obesidad", "observaciones", "sindromeAntifosfo", "tipoDiabetesId", "trombofilia") SELECT "artritis", "cardiopatias", "epilepsia", "hipertension", "hipertiroidismo", "hipotiroidismo", "id", "lupusEritematosoSist", "obesidad", "observaciones", "sindromeAntifosfo", "tipoDiabetesId", "trombofilia" FROM "EvaluacionActual";
DROP TABLE "EvaluacionActual";
ALTER TABLE "new_EvaluacionActual" RENAME TO "EvaluacionActual";
CREATE UNIQUE INDEX "EvaluacionActual_tipoDiabetesId_key" ON "EvaluacionActual"("tipoDiabetesId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
