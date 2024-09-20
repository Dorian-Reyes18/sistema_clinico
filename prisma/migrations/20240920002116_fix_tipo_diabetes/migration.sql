-- DropIndex
DROP INDEX "AntecedentesPersonales_diabetesId_key";

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TipoDiabetes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "mellitusTipo1" BOOLEAN NOT NULL,
    "mellitusTipo2" BOOLEAN NOT NULL,
    "mellitusGestacional" BOOLEAN NOT NULL,
    "ninguna" BOOLEAN NOT NULL,
    "fechaDiagnostico" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_TipoDiabetes" ("id", "mellitusGestacional", "mellitusTipo1", "mellitusTipo2", "ninguna") SELECT "id", "mellitusGestacional", "mellitusTipo1", "mellitusTipo2", "ninguna" FROM "TipoDiabetes";
DROP TABLE "TipoDiabetes";
ALTER TABLE "new_TipoDiabetes" RENAME TO "TipoDiabetes";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
