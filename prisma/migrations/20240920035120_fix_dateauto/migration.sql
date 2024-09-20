-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AntecedentesFamiliaresDefectos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pacienteId" INTEGER NOT NULL,
    "fechaCreacion" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "opcion" BOOLEAN NOT NULL,
    "descripcion" TEXT,
    CONSTRAINT "AntecedentesFamiliaresDefectos_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_AntecedentesFamiliaresDefectos" ("descripcion", "fechaCreacion", "id", "opcion", "pacienteId") SELECT "descripcion", "fechaCreacion", "id", "opcion", "pacienteId" FROM "AntecedentesFamiliaresDefectos";
DROP TABLE "AntecedentesFamiliaresDefectos";
ALTER TABLE "new_AntecedentesFamiliaresDefectos" RENAME TO "AntecedentesFamiliaresDefectos";
CREATE TABLE "new_AntecedentesObstetricos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pacienteId" INTEGER NOT NULL,
    "fechaCreacion" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "gesta" TEXT,
    "parto" TEXT,
    "aborto" TEXT,
    "cesarea" TEXT,
    "legrado" TEXT,
    CONSTRAINT "AntecedentesObstetricos_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_AntecedentesObstetricos" ("aborto", "cesarea", "fechaCreacion", "gesta", "id", "legrado", "pacienteId", "parto") SELECT "aborto", "cesarea", "fechaCreacion", "gesta", "id", "legrado", "pacienteId", "parto" FROM "AntecedentesObstetricos";
DROP TABLE "AntecedentesObstetricos";
ALTER TABLE "new_AntecedentesObstetricos" RENAME TO "AntecedentesObstetricos";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
