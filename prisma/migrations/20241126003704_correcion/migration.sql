/*
  Warnings:

  - You are about to drop the column `diagnosticoPrenatalId` on the `IntrauterinaAbierta` table. All the data in the column will be lost.
  - You are about to drop the column `diagnosticoPrenatalId` on the `IntrauterinaEndoscopica` table. All the data in the column will be lost.
  - You are about to drop the column `diagnosticoPrenatalId` on the `IntrauterinaPercutanea` table. All the data in the column will be lost.
  - You are about to drop the column `evaluacionActualId` on the `OrdenQuirurgicaIntrauterina` table. All the data in the column will be lost.
  - Made the column `frecuenciaCardiacaFetalFinalizacion` on table `IntrauterinaAbierta` required. This step will fail if there are existing NULL values in that column.
  - Made the column `frecuenciaCardiacaFetalInicio` on table `IntrauterinaAbierta` required. This step will fail if there are existing NULL values in that column.
  - Made the column `frecuenciaCardiacaFetalFinalizacion` on table `IntrauterinaEndoscopica` required. This step will fail if there are existing NULL values in that column.
  - Made the column `frecuenciaCardiacaFetalInicio` on table `IntrauterinaEndoscopica` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_IntrauterinaAbierta" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ordenQuirurgicaId" INTEGER,
    "ubicacionPlacentaria" TEXT,
    "sangreEstimado" INTEGER,
    "cierreDeMielomeningocele" BOOLEAN,
    "derivacionVentriculoamniotica" BOOLEAN,
    "cierreDeEncefalocele" BOOLEAN,
    "drenajeDeQuistesCoroideosUniOBilaterales" BOOLEAN,
    "fechaCirugia" DATETIME,
    "horaInicioAnestesia" DATETIME,
    "tipoAnestesiaId" TEXT,
    "complicacionesAnestesicas" TEXT,
    "horaInicioCirugiaMaterna" DATETIME,
    "horaInicioCirugiaFetal" DATETIME,
    "frecuenciaCardiacaFetalInicio" TEXT NOT NULL,
    "incisionEnPiel" BOOLEAN,
    "incisionEnUtero" BOOLEAN,
    "tamanoDelDefecto" TEXT NOT NULL,
    "nivelAnatomico" TEXT,
    "nivelFuncional" TEXT,
    "ilaInicialDeLiquidoAmniotico" TEXT,
    "ilaFinalBolsilloUnicoInicialDeLiquidoAmniotico" BOOLEAN,
    "frecuenciaCardiacaFetalFinalizacion" TEXT NOT NULL,
    "complicacionesQuirurgicas" TEXT,
    "horaFinalizacionCirugia" DATETIME,
    CONSTRAINT "IntrauterinaAbierta_ordenQuirurgicaId_fkey" FOREIGN KEY ("ordenQuirurgicaId") REFERENCES "OrdenQuirurgicaIntrauterina" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_IntrauterinaAbierta" ("cierreDeEncefalocele", "cierreDeMielomeningocele", "complicacionesAnestesicas", "complicacionesQuirurgicas", "derivacionVentriculoamniotica", "drenajeDeQuistesCoroideosUniOBilaterales", "fechaCirugia", "frecuenciaCardiacaFetalFinalizacion", "frecuenciaCardiacaFetalInicio", "horaFinalizacionCirugia", "horaInicioAnestesia", "horaInicioCirugiaFetal", "horaInicioCirugiaMaterna", "id", "ilaFinalBolsilloUnicoInicialDeLiquidoAmniotico", "ilaInicialDeLiquidoAmniotico", "incisionEnPiel", "incisionEnUtero", "nivelAnatomico", "nivelFuncional", "sangreEstimado", "tamanoDelDefecto", "tipoAnestesiaId", "ubicacionPlacentaria") SELECT "cierreDeEncefalocele", "cierreDeMielomeningocele", "complicacionesAnestesicas", "complicacionesQuirurgicas", "derivacionVentriculoamniotica", "drenajeDeQuistesCoroideosUniOBilaterales", "fechaCirugia", "frecuenciaCardiacaFetalFinalizacion", "frecuenciaCardiacaFetalInicio", "horaFinalizacionCirugia", "horaInicioAnestesia", "horaInicioCirugiaFetal", "horaInicioCirugiaMaterna", "id", "ilaFinalBolsilloUnicoInicialDeLiquidoAmniotico", "ilaInicialDeLiquidoAmniotico", "incisionEnPiel", "incisionEnUtero", "nivelAnatomico", "nivelFuncional", "sangreEstimado", "tamanoDelDefecto", "tipoAnestesiaId", "ubicacionPlacentaria" FROM "IntrauterinaAbierta";
DROP TABLE "IntrauterinaAbierta";
ALTER TABLE "new_IntrauterinaAbierta" RENAME TO "IntrauterinaAbierta";
CREATE TABLE "new_IntrauterinaEndoscopica" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ordenQuirurgicaId" INTEGER,
    "ubicacionPlacentaria" TEXT NOT NULL,
    "laserDeAnastomosisPlacentaria" BOOLEAN,
    "coagulacionBipolarDeCordoneUmbilical" BOOLEAN,
    "liberacionDeBandasAmnioticas" BOOLEAN,
    "colocacionDeBalonEndotraqueal" BOOLEAN,
    "retiroDeBalonEndotraqueal" BOOLEAN,
    "reparacionDeMielomeningocele" BOOLEAN,
    "cistoscopia" BOOLEAN,
    "cistoscopiaMasLaserDeValvasUretralesPosteriores" BOOLEAN,
    "intubacionEndotraquealIntrauterina" BOOLEAN,
    "fechaCirugia" DATETIME,
    "horaInicioAnestesia" DATETIME,
    "tipoAnestesiaId" TEXT,
    "complicacionesAnestesicas" TEXT,
    "horaInicioCirugiaFetal" DATETIME,
    "frecuenciaCardiacaFetalInicio" TEXT NOT NULL,
    "bolsilloUnicoInicialDeLiquidoAmniotico" BOOLEAN,
    "sangradoEstimado" TEXT,
    "frecuenciaCardiacaFetalFinalizacion" TEXT NOT NULL,
    "complicacionesQuirurgicas" TEXT,
    "horaFinalizacionCirugia" DATETIME,
    CONSTRAINT "IntrauterinaEndoscopica_ordenQuirurgicaId_fkey" FOREIGN KEY ("ordenQuirurgicaId") REFERENCES "OrdenQuirurgicaIntrauterina" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_IntrauterinaEndoscopica" ("bolsilloUnicoInicialDeLiquidoAmniotico", "cistoscopia", "cistoscopiaMasLaserDeValvasUretralesPosteriores", "coagulacionBipolarDeCordoneUmbilical", "colocacionDeBalonEndotraqueal", "complicacionesAnestesicas", "complicacionesQuirurgicas", "fechaCirugia", "frecuenciaCardiacaFetalFinalizacion", "frecuenciaCardiacaFetalInicio", "horaFinalizacionCirugia", "horaInicioAnestesia", "horaInicioCirugiaFetal", "id", "intubacionEndotraquealIntrauterina", "laserDeAnastomosisPlacentaria", "liberacionDeBandasAmnioticas", "reparacionDeMielomeningocele", "retiroDeBalonEndotraqueal", "sangradoEstimado", "tipoAnestesiaId", "ubicacionPlacentaria") SELECT "bolsilloUnicoInicialDeLiquidoAmniotico", "cistoscopia", "cistoscopiaMasLaserDeValvasUretralesPosteriores", "coagulacionBipolarDeCordoneUmbilical", "colocacionDeBalonEndotraqueal", "complicacionesAnestesicas", "complicacionesQuirurgicas", "fechaCirugia", "frecuenciaCardiacaFetalFinalizacion", "frecuenciaCardiacaFetalInicio", "horaFinalizacionCirugia", "horaInicioAnestesia", "horaInicioCirugiaFetal", "id", "intubacionEndotraquealIntrauterina", "laserDeAnastomosisPlacentaria", "liberacionDeBandasAmnioticas", "reparacionDeMielomeningocele", "retiroDeBalonEndotraqueal", "sangradoEstimado", "tipoAnestesiaId", "ubicacionPlacentaria" FROM "IntrauterinaEndoscopica";
DROP TABLE "IntrauterinaEndoscopica";
ALTER TABLE "new_IntrauterinaEndoscopica" RENAME TO "IntrauterinaEndoscopica";
CREATE TABLE "new_IntrauterinaPercutanea" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ordenQuirurgicaId" INTEGER,
    "ubicacionPlacentaria" TEXT NOT NULL,
    "ablacionDeVasoTumoral" BOOLEAN,
    "ablacionDeVasoNutricioSistemico" BOOLEAN,
    "ablacionDeVasoNutricioFetal" BOOLEAN,
    "fechaCirugia" DATETIME,
    "horaInicioAnestesia" DATETIME,
    "tipoAnestesiaId" TEXT,
    "complicacionesAnestesicas" TEXT,
    "horaInicioCirugiaFetal" DATETIME,
    "frecuenciaCardiacaFetalInicio" TEXT,
    "bolsilloUnicoInicialDeLiquidoAmniotico" BOOLEAN,
    "sangradoEstimado" TEXT,
    "frecuenciaCardiacaFetalFinalizacion" TEXT,
    "complicacionesQuirurgicas" TEXT,
    "horaFinalizacionCirugia" DATETIME,
    CONSTRAINT "IntrauterinaPercutanea_ordenQuirurgicaId_fkey" FOREIGN KEY ("ordenQuirurgicaId") REFERENCES "OrdenQuirurgicaIntrauterina" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_IntrauterinaPercutanea" ("ablacionDeVasoNutricioFetal", "ablacionDeVasoNutricioSistemico", "ablacionDeVasoTumoral", "bolsilloUnicoInicialDeLiquidoAmniotico", "complicacionesAnestesicas", "complicacionesQuirurgicas", "fechaCirugia", "frecuenciaCardiacaFetalFinalizacion", "frecuenciaCardiacaFetalInicio", "horaFinalizacionCirugia", "horaInicioAnestesia", "horaInicioCirugiaFetal", "id", "sangradoEstimado", "tipoAnestesiaId", "ubicacionPlacentaria") SELECT "ablacionDeVasoNutricioFetal", "ablacionDeVasoNutricioSistemico", "ablacionDeVasoTumoral", "bolsilloUnicoInicialDeLiquidoAmniotico", "complicacionesAnestesicas", "complicacionesQuirurgicas", "fechaCirugia", "frecuenciaCardiacaFetalFinalizacion", "frecuenciaCardiacaFetalInicio", "horaFinalizacionCirugia", "horaInicioAnestesia", "horaInicioCirugiaFetal", "id", "sangradoEstimado", "tipoAnestesiaId", "ubicacionPlacentaria" FROM "IntrauterinaPercutanea";
DROP TABLE "IntrauterinaPercutanea";
ALTER TABLE "new_IntrauterinaPercutanea" RENAME TO "IntrauterinaPercutanea";
CREATE TABLE "new_OrdenQuirurgicaIntrauterina" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pacienteId" INTEGER NOT NULL,
    "tipoCirugia" TEXT NOT NULL DEFAULT 'Sin Especificar',
    "fechaDeCreacion" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "teniaDiagnostico" BOOLEAN,
    "etapa" TEXT,
    "complicacionesQuirurgicas" TEXT,
    "estado" BOOLEAN,
    CONSTRAINT "OrdenQuirurgicaIntrauterina_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_OrdenQuirurgicaIntrauterina" ("complicacionesQuirurgicas", "estado", "etapa", "fechaDeCreacion", "id", "pacienteId", "teniaDiagnostico", "tipoCirugia") SELECT "complicacionesQuirurgicas", "estado", "etapa", "fechaDeCreacion", "id", "pacienteId", "teniaDiagnostico", "tipoCirugia" FROM "OrdenQuirurgicaIntrauterina";
DROP TABLE "OrdenQuirurgicaIntrauterina";
ALTER TABLE "new_OrdenQuirurgicaIntrauterina" RENAME TO "OrdenQuirurgicaIntrauterina";
CREATE TABLE "new_ResultadosPerinatales" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ordenQuirurgicaId" INTEGER,
    "tipoDeParto" TEXT,
    "fechaNac" DATETIME,
    "edadFinalizacion" TEXT,
    "natalidad" TEXT,
    "descripcionFetal" TEXT,
    "pesoGramos" INTEGER,
    CONSTRAINT "ResultadosPerinatales_ordenQuirurgicaId_fkey" FOREIGN KEY ("ordenQuirurgicaId") REFERENCES "OrdenQuirurgicaIntrauterina" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_ResultadosPerinatales" ("descripcionFetal", "edadFinalizacion", "fechaNac", "id", "natalidad", "ordenQuirurgicaId", "pesoGramos", "tipoDeParto") SELECT "descripcionFetal", "edadFinalizacion", "fechaNac", "id", "natalidad", "ordenQuirurgicaId", "pesoGramos", "tipoDeParto" FROM "ResultadosPerinatales";
DROP TABLE "ResultadosPerinatales";
ALTER TABLE "new_ResultadosPerinatales" RENAME TO "ResultadosPerinatales";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
