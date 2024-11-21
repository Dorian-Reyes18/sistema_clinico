/*
  Warnings:

  - You are about to alter the column `edadGestacional` on the `EmbarazoActual` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - You are about to alter the column `talla` on the `EmbarazoActual` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_EmbarazoActual" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pacienteId" INTEGER NOT NULL,
    "fechaEmbarazo" DATETIME,
    "pesoKg" REAL,
    "talla" REAL,
    "ultimaRegla" DATETIME,
    "edadGestacional" REAL,
    "imc" REAL,
    "consumoAF" BOOLEAN,
    "fechaInicioConsumo" DATETIME,
    CONSTRAINT "EmbarazoActual_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_EmbarazoActual" ("consumoAF", "edadGestacional", "fechaEmbarazo", "fechaInicioConsumo", "id", "imc", "pacienteId", "pesoKg", "talla", "ultimaRegla") SELECT "consumoAF", "edadGestacional", "fechaEmbarazo", "fechaInicioConsumo", "id", "imc", "pacienteId", "pesoKg", "talla", "ultimaRegla" FROM "EmbarazoActual";
DROP TABLE "EmbarazoActual";
ALTER TABLE "new_EmbarazoActual" RENAME TO "EmbarazoActual";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
