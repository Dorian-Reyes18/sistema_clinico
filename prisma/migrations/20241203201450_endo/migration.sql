-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ResultadosPerinatales" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ordenQuirurgicaId" INTEGER,
    "tipoDeParto" TEXT,
    "fechaNac" DATETIME,
    "edadFinalizacion" TEXT,
    "natalidad" TEXT,
    "descripcionFetal" TEXT,
    "pesoGramos" TEXT,
    CONSTRAINT "ResultadosPerinatales_ordenQuirurgicaId_fkey" FOREIGN KEY ("ordenQuirurgicaId") REFERENCES "OrdenQuirurgicaIntrauterina" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_ResultadosPerinatales" ("descripcionFetal", "edadFinalizacion", "fechaNac", "id", "natalidad", "ordenQuirurgicaId", "pesoGramos", "tipoDeParto") SELECT "descripcionFetal", "edadFinalizacion", "fechaNac", "id", "natalidad", "ordenQuirurgicaId", "pesoGramos", "tipoDeParto" FROM "ResultadosPerinatales";
DROP TABLE "ResultadosPerinatales";
ALTER TABLE "new_ResultadosPerinatales" RENAME TO "ResultadosPerinatales";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
