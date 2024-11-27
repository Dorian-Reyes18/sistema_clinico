/*
  Warnings:

  - You are about to drop the column `fechaEmbarazo` on the `EmbarazoActual` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_EmbarazoActual" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pacienteId" INTEGER NOT NULL,
    "pesoKg" REAL,
    "talla" REAL,
    "ultimaRegla" DATETIME,
    "edadGestacional" TEXT,
    "imc" REAL,
    "consumoAF" BOOLEAN,
    "fechaInicioConsumo" DATETIME,
    CONSTRAINT "EmbarazoActual_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_EmbarazoActual" ("consumoAF", "edadGestacional", "fechaInicioConsumo", "id", "imc", "pacienteId", "pesoKg", "talla", "ultimaRegla") SELECT "consumoAF", "edadGestacional", "fechaInicioConsumo", "id", "imc", "pacienteId", "pesoKg", "talla", "ultimaRegla" FROM "EmbarazoActual";
DROP TABLE "EmbarazoActual";
ALTER TABLE "new_EmbarazoActual" RENAME TO "EmbarazoActual";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
