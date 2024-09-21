/*
  Warnings:

  - You are about to drop the column `diagnosticoPrenatalId` on the `OrdenQuirurgicaIntrauterina` table. All the data in the column will be lost.
  - You are about to drop the column `ordenQuirurgicaIntrauterinaId` on the `OrdenQuirurgicaIntrauterina` table. All the data in the column will be lost.
  - Added the required column `cirugiaIntraId` to the `DiagnosticoPrenatal` table without a default value. This is not possible if the table is not empty.

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
    "embarazoUnico" BOOLEAN,
    CONSTRAINT "DiagnosticoPrenatal_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DiagnosticoPrenatal_tipoDefectoId_fkey" FOREIGN KEY ("tipoDefectoId") REFERENCES "TipoDefecto" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DiagnosticoPrenatal_cirugiaIntraId_fkey" FOREIGN KEY ("cirugiaIntraId") REFERENCES "OrdenQuirurgicaIntrauterina" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_DiagnosticoPrenatal" ("categoriaId", "embarazoUnico", "estudioGen", "id", "resultadoEstGen", "tipoCirugiaRealizada", "tipoDefectoId") SELECT "categoriaId", "embarazoUnico", "estudioGen", "id", "resultadoEstGen", "tipoCirugiaRealizada", "tipoDefectoId" FROM "DiagnosticoPrenatal";
DROP TABLE "DiagnosticoPrenatal";
ALTER TABLE "new_DiagnosticoPrenatal" RENAME TO "DiagnosticoPrenatal";
CREATE TABLE "new_IntrauterinaAbierta" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "diagnosticoPrenatalId" INTEGER NOT NULL,
    "ubicacionPlacentariaId" TEXT NOT NULL,
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
    "frecuenciaCardiacaFetalInicio" REAL,
    "incisionEnPiel" BOOLEAN,
    "incisionEnUtero" BOOLEAN,
    "tamanoDelDefecto" TEXT NOT NULL,
    "nivelAnatomico" TEXT,
    "nivelFuncional" TEXT,
    "ilaInicialDeLiquidoAmniotico" TEXT,
    "ilaFinalBolsilloUnicoInicialDeLiquidoAmniotico" BOOLEAN,
    "intrauterinaId" INTEGER NOT NULL,
    "frecuenciaCardiacaFetalFinalizacion" REAL,
    "complicacionesQuirurgicas" TEXT,
    "horaFinalizacionCirugia" DATETIME,
    CONSTRAINT "IntrauterinaAbierta_diagnosticoPrenatalId_fkey" FOREIGN KEY ("diagnosticoPrenatalId") REFERENCES "DiagnosticoPrenatal" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_IntrauterinaAbierta" ("cierreDeEncefalocele", "cierreDeMielomeningocele", "complicacionesAnestesicas", "complicacionesQuirurgicas", "derivacionVentriculoamniotica", "diagnosticoPrenatalId", "drenajeDeQuistesCoroideosUniOBilaterales", "fechaCirugia", "frecuenciaCardiacaFetalFinalizacion", "frecuenciaCardiacaFetalInicio", "horaFinalizacionCirugia", "horaInicioAnestesia", "horaInicioCirugiaFetal", "horaInicioCirugiaMaterna", "id", "ilaFinalBolsilloUnicoInicialDeLiquidoAmniotico", "ilaInicialDeLiquidoAmniotico", "incisionEnPiel", "incisionEnUtero", "intrauterinaId", "nivelAnatomico", "nivelFuncional", "sangreEstimado", "tamanoDelDefecto", "tipoAnestesiaId", "ubicacionPlacentariaId") SELECT "cierreDeEncefalocele", "cierreDeMielomeningocele", "complicacionesAnestesicas", "complicacionesQuirurgicas", "derivacionVentriculoamniotica", "diagnosticoPrenatalId", "drenajeDeQuistesCoroideosUniOBilaterales", "fechaCirugia", "frecuenciaCardiacaFetalFinalizacion", "frecuenciaCardiacaFetalInicio", "horaFinalizacionCirugia", "horaInicioAnestesia", "horaInicioCirugiaFetal", "horaInicioCirugiaMaterna", "id", "ilaFinalBolsilloUnicoInicialDeLiquidoAmniotico", "ilaInicialDeLiquidoAmniotico", "incisionEnPiel", "incisionEnUtero", "intrauterinaId", "nivelAnatomico", "nivelFuncional", "sangreEstimado", "tamanoDelDefecto", "tipoAnestesiaId", "ubicacionPlacentariaId" FROM "IntrauterinaAbierta";
DROP TABLE "IntrauterinaAbierta";
ALTER TABLE "new_IntrauterinaAbierta" RENAME TO "IntrauterinaAbierta";
CREATE UNIQUE INDEX "IntrauterinaAbierta_diagnosticoPrenatalId_key" ON "IntrauterinaAbierta"("diagnosticoPrenatalId");
CREATE UNIQUE INDEX "IntrauterinaAbierta_intrauterinaId_key" ON "IntrauterinaAbierta"("intrauterinaId");
CREATE TABLE "new_IntrauterinaEndoscopica" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "diagnosticoPrenatalId" INTEGER NOT NULL,
    "ubicacionPlacentariaId" TEXT NOT NULL,
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
    "frecuenciaCardiacaFetalInicio" REAL,
    "bolsilloUnicoInicialDeLiquidoAmniotico" BOOLEAN,
    "sangradoEstimado" TEXT,
    "frecuenciaCardiacaFetalFinalizacion" REAL,
    "complicacionesQuirurgicas" TEXT,
    "horaFinalizacionCirugia" DATETIME,
    "intrauterinaId" INTEGER NOT NULL,
    CONSTRAINT "IntrauterinaEndoscopica_diagnosticoPrenatalId_fkey" FOREIGN KEY ("diagnosticoPrenatalId") REFERENCES "DiagnosticoPrenatal" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_IntrauterinaEndoscopica" ("bolsilloUnicoInicialDeLiquidoAmniotico", "cistoscopia", "cistoscopiaMasLaserDeValvasUretralesPosteriores", "coagulacionBipolarDeCordoneUmbilical", "colocacionDeBalonEndotraqueal", "complicacionesAnestesicas", "complicacionesQuirurgicas", "diagnosticoPrenatalId", "fechaCirugia", "frecuenciaCardiacaFetalFinalizacion", "frecuenciaCardiacaFetalInicio", "horaFinalizacionCirugia", "horaInicioAnestesia", "horaInicioCirugiaFetal", "id", "intrauterinaId", "intubacionEndotraquealIntrauterina", "laserDeAnastomosisPlacentaria", "liberacionDeBandasAmnioticas", "reparacionDeMielomeningocele", "retiroDeBalonEndotraqueal", "sangradoEstimado", "tipoAnestesiaId", "ubicacionPlacentariaId") SELECT "bolsilloUnicoInicialDeLiquidoAmniotico", "cistoscopia", "cistoscopiaMasLaserDeValvasUretralesPosteriores", "coagulacionBipolarDeCordoneUmbilical", "colocacionDeBalonEndotraqueal", "complicacionesAnestesicas", "complicacionesQuirurgicas", "diagnosticoPrenatalId", "fechaCirugia", "frecuenciaCardiacaFetalFinalizacion", "frecuenciaCardiacaFetalInicio", "horaFinalizacionCirugia", "horaInicioAnestesia", "horaInicioCirugiaFetal", "id", "intrauterinaId", "intubacionEndotraquealIntrauterina", "laserDeAnastomosisPlacentaria", "liberacionDeBandasAmnioticas", "reparacionDeMielomeningocele", "retiroDeBalonEndotraqueal", "sangradoEstimado", "tipoAnestesiaId", "ubicacionPlacentariaId" FROM "IntrauterinaEndoscopica";
DROP TABLE "IntrauterinaEndoscopica";
ALTER TABLE "new_IntrauterinaEndoscopica" RENAME TO "IntrauterinaEndoscopica";
CREATE UNIQUE INDEX "IntrauterinaEndoscopica_diagnosticoPrenatalId_key" ON "IntrauterinaEndoscopica"("diagnosticoPrenatalId");
CREATE UNIQUE INDEX "IntrauterinaEndoscopica_intrauterinaId_key" ON "IntrauterinaEndoscopica"("intrauterinaId");
CREATE TABLE "new_IntrauterinaPercutanea" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "diagnosticoPrenatalId" INTEGER NOT NULL,
    "ubicacionPlacentariaId" TEXT NOT NULL,
    "ablacionDeVasoTumoral" BOOLEAN,
    "ablacionDeVasoNutricioSistemico" BOOLEAN,
    "ablacionDeVasoNutricioFetal" BOOLEAN,
    "fechaCirugia" DATETIME,
    "horaInicioAnestesia" DATETIME,
    "tipoAnestesiaId" TEXT,
    "complicacionesAnestesicas" TEXT,
    "horaInicioCirugiaFetal" DATETIME,
    "frecuenciaCardiacaFetalInicio" REAL,
    "bolsilloUnicoInicialDeLiquidoAmniotico" BOOLEAN,
    "sangradoEstimado" TEXT,
    "frecuenciaCardiacaFetalFinalizacion" REAL,
    "complicacionesQuirurgicas" TEXT,
    "horaFinalizacionCirugia" DATETIME,
    "percutaneaId" INTEGER NOT NULL,
    CONSTRAINT "IntrauterinaPercutanea_diagnosticoPrenatalId_fkey" FOREIGN KEY ("diagnosticoPrenatalId") REFERENCES "DiagnosticoPrenatal" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_IntrauterinaPercutanea" ("ablacionDeVasoNutricioFetal", "ablacionDeVasoNutricioSistemico", "ablacionDeVasoTumoral", "bolsilloUnicoInicialDeLiquidoAmniotico", "complicacionesAnestesicas", "complicacionesQuirurgicas", "diagnosticoPrenatalId", "fechaCirugia", "frecuenciaCardiacaFetalFinalizacion", "frecuenciaCardiacaFetalInicio", "horaFinalizacionCirugia", "horaInicioAnestesia", "horaInicioCirugiaFetal", "id", "percutaneaId", "sangradoEstimado", "tipoAnestesiaId", "ubicacionPlacentariaId") SELECT "ablacionDeVasoNutricioFetal", "ablacionDeVasoNutricioSistemico", "ablacionDeVasoTumoral", "bolsilloUnicoInicialDeLiquidoAmniotico", "complicacionesAnestesicas", "complicacionesQuirurgicas", "diagnosticoPrenatalId", "fechaCirugia", "frecuenciaCardiacaFetalFinalizacion", "frecuenciaCardiacaFetalInicio", "horaFinalizacionCirugia", "horaInicioAnestesia", "horaInicioCirugiaFetal", "id", "percutaneaId", "sangradoEstimado", "tipoAnestesiaId", "ubicacionPlacentariaId" FROM "IntrauterinaPercutanea";
DROP TABLE "IntrauterinaPercutanea";
ALTER TABLE "new_IntrauterinaPercutanea" RENAME TO "IntrauterinaPercutanea";
CREATE UNIQUE INDEX "IntrauterinaPercutanea_diagnosticoPrenatalId_key" ON "IntrauterinaPercutanea"("diagnosticoPrenatalId");
CREATE UNIQUE INDEX "IntrauterinaPercutanea_percutaneaId_key" ON "IntrauterinaPercutanea"("percutaneaId");
CREATE TABLE "new_OrdenQuirurgicaIntrauterina" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pacienteId" INTEGER NOT NULL,
    "fechaDeCreacion" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "teniaDiagnostico" BOOLEAN,
    "evaluacionActualId" INTEGER,
    "etapa" TEXT,
    "complicacionesQuirurgicas" TEXT,
    "estado" BOOLEAN,
    CONSTRAINT "OrdenQuirurgicaIntrauterina_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "OrdenQuirurgicaIntrauterina_evaluacionActualId_fkey" FOREIGN KEY ("evaluacionActualId") REFERENCES "EvaluacionActual" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_OrdenQuirurgicaIntrauterina" ("complicacionesQuirurgicas", "estado", "etapa", "evaluacionActualId", "fechaDeCreacion", "id", "pacienteId", "teniaDiagnostico") SELECT "complicacionesQuirurgicas", "estado", "etapa", "evaluacionActualId", "fechaDeCreacion", "id", "pacienteId", "teniaDiagnostico" FROM "OrdenQuirurgicaIntrauterina";
DROP TABLE "OrdenQuirurgicaIntrauterina";
ALTER TABLE "new_OrdenQuirurgicaIntrauterina" RENAME TO "OrdenQuirurgicaIntrauterina";
CREATE UNIQUE INDEX "OrdenQuirurgicaIntrauterina_evaluacionActualId_key" ON "OrdenQuirurgicaIntrauterina"("evaluacionActualId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
