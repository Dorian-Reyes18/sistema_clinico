-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Conyuge" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sangreRhId" INTEGER NOT NULL,
    "pacienteId" INTEGER NOT NULL,
    "telefono" TEXT,
    "edad" INTEGER,
    CONSTRAINT "Conyuge_sangreRhId_fkey" FOREIGN KEY ("sangreRhId") REFERENCES "SangreRH" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Conyuge" ("edad", "id", "pacienteId", "sangreRhId", "telefono") SELECT "edad", "id", "pacienteId", "sangreRhId", "telefono" FROM "Conyuge";
DROP TABLE "Conyuge";
ALTER TABLE "new_Conyuge" RENAME TO "Conyuge";
CREATE TABLE "new_Paciente" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "silaisId" INTEGER NOT NULL,
    "municipioId" INTEGER NOT NULL,
    "numeroExpediente" INTEGER NOT NULL,
    "conyugeid" INTEGER,
    "primerNombre" TEXT NOT NULL,
    "segundoNombre" TEXT,
    "primerApellido" TEXT NOT NULL,
    "segundoApellido" TEXT,
    "edad" INTEGER,
    "fechaNac" DATETIME,
    "telefono1" TEXT NOT NULL,
    "telefono2" TEXT,
    "fechaIngreso" DATETIME NOT NULL,
    "domicilio" TEXT,
    CONSTRAINT "Paciente_silaisId_fkey" FOREIGN KEY ("silaisId") REFERENCES "Silais" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Paciente_municipioId_fkey" FOREIGN KEY ("municipioId") REFERENCES "Municipio" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Paciente_conyugeid_fkey" FOREIGN KEY ("conyugeid") REFERENCES "Conyuge" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Paciente" ("domicilio", "edad", "fechaIngreso", "fechaNac", "id", "municipioId", "numeroExpediente", "primerApellido", "primerNombre", "segundoApellido", "segundoNombre", "silaisId", "telefono1", "telefono2") SELECT "domicilio", "edad", "fechaIngreso", "fechaNac", "id", "municipioId", "numeroExpediente", "primerApellido", "primerNombre", "segundoApellido", "segundoNombre", "silaisId", "telefono1", "telefono2" FROM "Paciente";
DROP TABLE "Paciente";
ALTER TABLE "new_Paciente" RENAME TO "Paciente";
CREATE UNIQUE INDEX "Paciente_numeroExpediente_key" ON "Paciente"("numeroExpediente");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
