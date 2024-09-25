/*
  Warnings:

  - You are about to drop the column `colocacionSistemasDerivativosProtesicos` on the `CirugiaNerviosoCentral` table. All the data in the column will be lost.
  - You are about to drop the column `derivacionHidrocefalia` on the `CirugiaNerviosoCentral` table. All the data in the column will be lost.
  - You are about to drop the column `derivacionSubdural` on the `CirugiaNerviosoCentral` table. All the data in the column will be lost.
  - You are about to drop the column `otras` on the `CirugiaNerviosoCentral` table. All the data in the column will be lost.
  - You are about to drop the column `complicaciones` on the `OrdenQuirurgicaPostoperacion` table. All the data in the column will be lost.
  - You are about to drop the column `diagnosticoId` on the `OrdenQuirurgicaPostoperacion` table. All the data in the column will be lost.
  - You are about to drop the column `etapa` on the `OrdenQuirurgicaPostoperacion` table. All the data in the column will be lost.
  - You are about to drop the column `fechaPostoperatorio` on the `OrdenQuirurgicaPostoperacion` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CirugiaNeonatal" ADD COLUMN "Otros" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CirugiaNerviosoCentral" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cirugiaId" INTEGER NOT NULL,
    "mielomeningocele" BOOLEAN,
    "meningocele" BOOLEAN,
    "raquisquisis" BOOLEAN,
    "mieloquisis" BOOLEAN,
    "mielocistocele" BOOLEAN,
    "cierreReconstruccionTuboNeural" BOOLEAN,
    "senoDermico" BOOLEAN,
    "lipomaIntramedularSacro" BOOLEAN,
    "diasteamtomelia" BOOLEAN,
    "dilomielia" BOOLEAN,
    "colaDeFauno" BOOLEAN,
    "medulaAnclada" BOOLEAN,
    "cierreReconstruccionEncefalocele" BOOLEAN,
    "quisteNeuroenterico" BOOLEAN,
    "cierreReconsCranioraquisquisis" BOOLEAN,
    "colocacionSistemasDerivativosProte" BOOLEAN,
    "endoscopiaTranscraneal" BOOLEAN,
    "lavadoVentricularEndoscopico" BOOLEAN,
    "puncionTranscraneal" BOOLEAN,
    "colocacionDeVentriculostomia" BOOLEAN,
    "LavadoVentricularTranscraneal" BOOLEAN,
    "derivacionSubduralExterna" BOOLEAN,
    "derivacionSubDuroperiotoneal" BOOLEAN,
    "reseccionQuistesAracnoideos" BOOLEAN,
    "fenestracionDeQuistes" BOOLEAN,
    "derivacionQuiste" BOOLEAN,
    "reseccionTumoresCongenitos" BOOLEAN,
    "derivacionSubDuroperiotonealBilateral" BOOLEAN,
    "otros" TEXT,
    CONSTRAINT "CirugiaNerviosoCentral_cirugiaId_fkey" FOREIGN KEY ("cirugiaId") REFERENCES "OrdenQuirurgicaPostoperacion" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CirugiaNerviosoCentral" ("cierreReconstruccionEncefalocele", "cierreReconstruccionTuboNeural", "cirugiaId", "colaDeFauno", "diasteamtomelia", "dilomielia", "endoscopiaTranscraneal", "id", "lavadoVentricularEndoscopico", "lipomaIntramedularSacro", "medulaAnclada", "meningocele", "mielocistocele", "mielomeningocele", "mieloquisis", "quisteNeuroenterico", "raquisquisis", "reseccionQuistesAracnoideos", "senoDermico") SELECT "cierreReconstruccionEncefalocele", "cierreReconstruccionTuboNeural", "cirugiaId", "colaDeFauno", "diasteamtomelia", "dilomielia", "endoscopiaTranscraneal", "id", "lavadoVentricularEndoscopico", "lipomaIntramedularSacro", "medulaAnclada", "meningocele", "mielocistocele", "mielomeningocele", "mieloquisis", "quisteNeuroenterico", "raquisquisis", "reseccionQuistesAracnoideos", "senoDermico" FROM "CirugiaNerviosoCentral";
DROP TABLE "CirugiaNerviosoCentral";
ALTER TABLE "new_CirugiaNerviosoCentral" RENAME TO "CirugiaNerviosoCentral";
CREATE TABLE "new_OrdenQuirurgicaPostoperacion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fechaDeCreacion" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "tipoCirugia" TEXT,
    "pacienteId" INTEGER NOT NULL,
    "doctorId" INTEGER NOT NULL,
    "estado" BOOLEAN,
    "fechaDeIntervencion" DATETIME,
    CONSTRAINT "OrdenQuirurgicaPostoperacion_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "OrdenQuirurgicaPostoperacion_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Usuarios" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_OrdenQuirurgicaPostoperacion" ("doctorId", "fechaDeCreacion", "id", "pacienteId") SELECT "doctorId", "fechaDeCreacion", "id", "pacienteId" FROM "OrdenQuirurgicaPostoperacion";
DROP TABLE "OrdenQuirurgicaPostoperacion";
ALTER TABLE "new_OrdenQuirurgicaPostoperacion" RENAME TO "OrdenQuirurgicaPostoperacion";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
