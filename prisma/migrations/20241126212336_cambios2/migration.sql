/*
  Warnings:

  - You are about to drop the column `embarazoUnico` on the `DiagnosticoPrenatal` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DiagnosticoPrenatal" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cirugiaIntraId" INTEGER NOT NULL,
    "categoriaId" INTEGER NOT NULL,
    "tipoDefectoId" INTEGER NOT NULL,
    "tipoCirugiaRealizada" TEXT NOT NULL,
    "estudioGen" BOOLEAN,
    "resultadoEstGen" TEXT,
    "tipoEmbarazo" TEXT,
    CONSTRAINT "DiagnosticoPrenatal_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DiagnosticoPrenatal_tipoDefectoId_fkey" FOREIGN KEY ("tipoDefectoId") REFERENCES "TipoDefecto" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DiagnosticoPrenatal_cirugiaIntraId_fkey" FOREIGN KEY ("cirugiaIntraId") REFERENCES "OrdenQuirurgicaIntrauterina" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_DiagnosticoPrenatal" ("categoriaId", "cirugiaIntraId", "estudioGen", "id", "resultadoEstGen", "tipoCirugiaRealizada", "tipoDefectoId") SELECT "categoriaId", "cirugiaIntraId", "estudioGen", "id", "resultadoEstGen", "tipoCirugiaRealizada", "tipoDefectoId" FROM "DiagnosticoPrenatal";
DROP TABLE "DiagnosticoPrenatal";
ALTER TABLE "new_DiagnosticoPrenatal" RENAME TO "DiagnosticoPrenatal";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
