/*
  Warnings:

  - You are about to drop the column `resultado` on the `IntrauterinaAbierta` table. All the data in the column will be lost.
  - You are about to drop the column `tcnicaUsada` on the `IntrauterinaAbierta` table. All the data in the column will be lost.
  - You are about to drop the column `coagulacionUltrasonido` on the `IntrauterinaEndoscopica` table. All the data in the column will be lost.
  - You are about to drop the column `drenajeLateral` on the `IntrauterinaEndoscopica` table. All the data in the column will be lost.
  - You are about to drop the column `extirpacionQuirurgica` on the `IntrauterinaEndoscopica` table. All the data in the column will be lost.
  - You are about to drop the column `resultResultados` on the `IntrauterinaEndoscopica` table. All the data in the column will be lost.
  - You are about to drop the column `usoLaparoscopico` on the `IntrauterinaEndoscopica` table. All the data in the column will be lost.
  - You are about to drop the column `anastomosisCoaguladas` on the `IntrauterinaPercutanea` table. All the data in the column will be lost.
  - You are about to drop the column `cateterismoCardiaco` on the `IntrauterinaPercutanea` table. All the data in the column will be lost.
  - You are about to drop the column `cordocentesis` on the `IntrauterinaPercutanea` table. All the data in the column will be lost.
  - You are about to drop the column `diferenciaPorcentualPeso` on the `IntrauterinaPercutanea` table. All the data in the column will be lost.
  - You are about to drop the column `drenajeMasaQuisticaPulmonar` on the `IntrauterinaPercutanea` table. All the data in the column will be lost.
  - You are about to drop the column `drenajeMasaQuisticaRenal` on the `IntrauterinaPercutanea` table. All the data in the column will be lost.
  - You are about to drop the column `frecuenciaCardiacaFetalFinal` on the `IntrauterinaPercutanea` table. All the data in the column will be lost.
  - You are about to drop the column `noSeCompletoLaCirugiaFetal` on the `IntrauterinaPercutanea` table. All the data in the column will be lost.
  - You are about to drop the column `resultados` on the `IntrauterinaPercutanea` table. All the data in the column will be lost.
  - You are about to drop the column `toracocentesis` on the `IntrauterinaPercutanea` table. All the data in the column will be lost.
  - You are about to drop the column `apgar` on the `ResultadosPerinatales` table. All the data in the column will be lost.
  - You are about to drop the column `fechaNacimiento` on the `ResultadosPerinatales` table. All the data in the column will be lost.
  - You are about to drop the column `ordenQuirurgicaIntrauterinaId` on the `ResultadosPerinatales` table. All the data in the column will be lost.
  - You are about to drop the column `peso` on the `ResultadosPerinatales` table. All the data in the column will be lost.
  - You are about to drop the column `resultados` on the `ResultadosPerinatales` table. All the data in the column will be lost.
  - You are about to drop the column `sexo` on the `ResultadosPerinatales` table. All the data in the column will be lost.
  - You are about to drop the column `talla` on the `ResultadosPerinatales` table. All the data in the column will be lost.
  - You are about to drop the column `nombreApellido` on the `Usuarios` table. All the data in the column will be lost.
  - You are about to drop the column `nombreUsuario` on the `Usuarios` table. All the data in the column will be lost.
  - You are about to alter the column `telefono` on the `Usuarios` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - A unique constraint covering the columns `[nombreRol]` on the table `Roles` will be added. If there are existing duplicate values, this will fail.
  - Made the column `opcion` on table `AntecedentesFamiliaresDefectos` required. This step will fail if there are existing NULL values in that column.
  - Made the column `cardiopatia` on table `AntecedentesPersonales` required. This step will fail if there are existing NULL values in that column.
  - Made the column `diabetesId` on table `AntecedentesPersonales` required. This step will fail if there are existing NULL values in that column.
  - Made the column `drogas` on table `AntecedentesPersonales` required. This step will fail if there are existing NULL values in that column.
  - Made the column `epilepsia` on table `AntecedentesPersonales` required. This step will fail if there are existing NULL values in that column.
  - Made the column `fuma` on table `AntecedentesPersonales` required. This step will fail if there are existing NULL values in that column.
  - Made the column `hipertension` on table `AntecedentesPersonales` required. This step will fail if there are existing NULL values in that column.
  - Made the column `inmunologia` on table `AntecedentesPersonales` required. This step will fail if there are existing NULL values in that column.
  - Made the column `licor` on table `AntecedentesPersonales` required. This step will fail if there are existing NULL values in that column.
  - Made the column `neoplasicas` on table `AntecedentesPersonales` required. This step will fail if there are existing NULL values in that column.
  - Made the column `sangreRhId` on table `AntecedentesPersonales` required. This step will fail if there are existing NULL values in that column.
  - Made the column `teratogenicos` on table `AntecedentesPersonales` required. This step will fail if there are existing NULL values in that column.
  - Made the column `tiroidea` on table `AntecedentesPersonales` required. This step will fail if there are existing NULL values in that column.
  - Made the column `tipoCirugiaRealizada` on table `DiagnosticoPrenatal` required. This step will fail if there are existing NULL values in that column.
  - Made the column `tipoDiabetesId` on table `EvaluacionActual` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `intrauterinaId` to the `IntrauterinaAbierta` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tamanoDelDefecto` to the `IntrauterinaAbierta` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ubicacionPlacentariaId` to the `IntrauterinaAbierta` table without a default value. This is not possible if the table is not empty.
  - Added the required column `intrauterinaId` to the `IntrauterinaEndoscopica` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ubicacionPlacentariaId` to the `IntrauterinaEndoscopica` table without a default value. This is not possible if the table is not empty.
  - Added the required column `percutaneaId` to the `IntrauterinaPercutanea` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ubicacionPlacentariaId` to the `IntrauterinaPercutanea` table without a default value. This is not possible if the table is not empty.
  - Made the column `diagnosticoPrenatalId` on table `OrdenQuirurgicaIntrauterina` required. This step will fail if there are existing NULL values in that column.
  - Made the column `etapaId` on table `OrdenQuirurgicaIntrauterina` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `ordenQuirurgicaId` to the `ResultadosPerinatales` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nombreYApellido` to the `Usuarios` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usuario` to the `Usuarios` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "OrdenQuirurgicaPostoperacion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fechaDeCreacion" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "pacienteId" INTEGER NOT NULL,
    "diagnosticoId" INTEGER NOT NULL,
    "doctorId" INTEGER NOT NULL,
    "complicaciones" TEXT,
    "fechaPostoperatorio" DATETIME,
    CONSTRAINT "OrdenQuirurgicaPostoperacion_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "OrdenQuirurgicaPostoperacion_diagnosticoId_fkey" FOREIGN KEY ("diagnosticoId") REFERENCES "DiagnosticoPrenatal" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "OrdenQuirurgicaPostoperacion_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Usuarios" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CirugiaNeonatal" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cirugiaId" INTEGER NOT NULL,
    "minimaInvasion" BOOLEAN NOT NULL,
    "cirugiaConvencional" BOOLEAN NOT NULL,
    "malformacionesBroncoPulmonares" BOOLEAN NOT NULL,
    "enfisemaLobarCongenito" BOOLEAN NOT NULL,
    "lesionesQuisticasDupliacionEsesofagicas" BOOLEAN NOT NULL,
    "atresiaEsofagica" BOOLEAN NOT NULL,
    "herniaDiafragmatica" BOOLEAN NOT NULL,
    "estomago" BOOLEAN NOT NULL,
    "estenosisAtresiaDuodenal" BOOLEAN NOT NULL,
    "estenosisAtresiaIntestinales" BOOLEAN NOT NULL,
    "malRotacionIntestinal" BOOLEAN NOT NULL,
    "enfermedadMeconial" BOOLEAN NOT NULL,
    "enterocolitisNecrotizante" BOOLEAN NOT NULL,
    "enfermedadDeHirschsprung" BOOLEAN NOT NULL,
    "defectosParedAbdominalGastrosquisis" BOOLEAN NOT NULL,
    "defectosParedabdominalOnfalocele" BOOLEAN NOT NULL,
    "tumorDeOvario" BOOLEAN NOT NULL,
    CONSTRAINT "CirugiaNeonatal_cirugiaId_fkey" FOREIGN KEY ("cirugiaId") REFERENCES "OrdenQuirurgicaPostoperacion" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CirugiaNerviosoCentral" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cirugiaId" INTEGER NOT NULL,
    "mielomeningocele" BOOLEAN NOT NULL,
    "meningocele" BOOLEAN NOT NULL,
    "raquisquisis" BOOLEAN NOT NULL,
    "mieloquisis" BOOLEAN NOT NULL,
    "mielocistocele" BOOLEAN NOT NULL,
    "cierreReconstruccionTuboNeural" BOOLEAN NOT NULL,
    "senoDermico" BOOLEAN NOT NULL,
    "lipomaIntramedularSacro" BOOLEAN NOT NULL,
    "diasteamtomelia" BOOLEAN NOT NULL,
    "dilomielia" BOOLEAN NOT NULL,
    "colaDeFauno" BOOLEAN NOT NULL,
    "medulaAnclada" BOOLEAN NOT NULL,
    "cierreReconstruccionEncefalocele" BOOLEAN NOT NULL,
    "quisteNeuroenterico" BOOLEAN NOT NULL,
    "colocacionSistemasDerivativosProtesicos" BOOLEAN NOT NULL,
    "endoscopiaTranscraneal" BOOLEAN NOT NULL,
    "lavadoVentricularEndoscopico" BOOLEAN NOT NULL,
    "derivacionSubdural" BOOLEAN NOT NULL,
    "reseccionQuistesAracnoideos" BOOLEAN NOT NULL,
    "derivacionHidrocefalia" BOOLEAN NOT NULL,
    "otras" TEXT,
    CONSTRAINT "CirugiaNerviosoCentral_cirugiaId_fkey" FOREIGN KEY ("cirugiaId") REFERENCES "OrdenQuirurgicaPostoperacion" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AntecedentesFamiliaresDefectos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pacienteId" INTEGER NOT NULL,
    "fechaCreacion" DATETIME,
    "opcion" BOOLEAN NOT NULL,
    "descripcion" TEXT,
    CONSTRAINT "AntecedentesFamiliaresDefectos_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_AntecedentesFamiliaresDefectos" ("descripcion", "fechaCreacion", "id", "opcion", "pacienteId") SELECT "descripcion", "fechaCreacion", "id", "opcion", "pacienteId" FROM "AntecedentesFamiliaresDefectos";
DROP TABLE "AntecedentesFamiliaresDefectos";
ALTER TABLE "new_AntecedentesFamiliaresDefectos" RENAME TO "AntecedentesFamiliaresDefectos";
CREATE TABLE "new_AntecedentesPersonales" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pacienteId" INTEGER NOT NULL,
    "diabetesId" INTEGER NOT NULL,
    "sangreRhId" INTEGER NOT NULL,
    "fechaCreacion" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "licor" BOOLEAN NOT NULL,
    "drogas" BOOLEAN NOT NULL,
    "fuma" BOOLEAN NOT NULL,
    "teratogenicos" BOOLEAN NOT NULL,
    "hipertension" BOOLEAN NOT NULL,
    "epilepsia" BOOLEAN NOT NULL,
    "tiroidea" BOOLEAN NOT NULL,
    "neoplasicas" BOOLEAN NOT NULL,
    "cardiopatia" BOOLEAN NOT NULL,
    "inmunologia" BOOLEAN NOT NULL,
    CONSTRAINT "AntecedentesPersonales_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "AntecedentesPersonales_diabetesId_fkey" FOREIGN KEY ("diabetesId") REFERENCES "TipoDiabetes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "AntecedentesPersonales_sangreRhId_fkey" FOREIGN KEY ("sangreRhId") REFERENCES "SangreRH" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_AntecedentesPersonales" ("cardiopatia", "diabetesId", "drogas", "epilepsia", "fechaCreacion", "fuma", "hipertension", "id", "inmunologia", "licor", "neoplasicas", "pacienteId", "sangreRhId", "teratogenicos", "tiroidea") SELECT "cardiopatia", "diabetesId", "drogas", "epilepsia", coalesce("fechaCreacion", CURRENT_TIMESTAMP) AS "fechaCreacion", "fuma", "hipertension", "id", "inmunologia", "licor", "neoplasicas", "pacienteId", "sangreRhId", "teratogenicos", "tiroidea" FROM "AntecedentesPersonales";
DROP TABLE "AntecedentesPersonales";
ALTER TABLE "new_AntecedentesPersonales" RENAME TO "AntecedentesPersonales";
CREATE TABLE "new_DiagnosticoPrenatal" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "categoriaId" INTEGER NOT NULL,
    "tipoDefectoId" INTEGER NOT NULL,
    "tipoCirugiaRealizada" TEXT NOT NULL,
    "estudioGen" BOOLEAN,
    "resultadoEstGen" TEXT,
    "embarazoUnico" BOOLEAN,
    CONSTRAINT "DiagnosticoPrenatal_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DiagnosticoPrenatal_tipoDefectoId_fkey" FOREIGN KEY ("tipoDefectoId") REFERENCES "TipoDefecto" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_DiagnosticoPrenatal" ("categoriaId", "embarazoUnico", "estudioGen", "id", "resultadoEstGen", "tipoCirugiaRealizada", "tipoDefectoId") SELECT "categoriaId", "embarazoUnico", "estudioGen", "id", "resultadoEstGen", "tipoCirugiaRealizada", "tipoDefectoId" FROM "DiagnosticoPrenatal";
DROP TABLE "DiagnosticoPrenatal";
ALTER TABLE "new_DiagnosticoPrenatal" RENAME TO "DiagnosticoPrenatal";
CREATE TABLE "new_EvaluacionActual" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tipoDiabetesId" INTEGER NOT NULL,
    "lupusEritematosoSist" BOOLEAN,
    "obesidad" BOOLEAN,
    "hipertension" BOOLEAN,
    "sindromeAntifosfo" BOOLEAN,
    "cardiopatias" BOOLEAN,
    "artritis" BOOLEAN,
    "hipotiroidismo" BOOLEAN,
    "hipertiroidismo" BOOLEAN,
    "trombofilia" BOOLEAN,
    "epilepsia" BOOLEAN,
    "observaciones" TEXT,
    CONSTRAINT "EvaluacionActual_tipoDiabetesId_fkey" FOREIGN KEY ("tipoDiabetesId") REFERENCES "TipoDiabetes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_EvaluacionActual" ("artritis", "cardiopatias", "epilepsia", "hipertension", "hipertiroidismo", "hipotiroidismo", "id", "lupusEritematosoSist", "obesidad", "observaciones", "sindromeAntifosfo", "tipoDiabetesId", "trombofilia") SELECT "artritis", "cardiopatias", "epilepsia", "hipertension", "hipertiroidismo", "hipotiroidismo", "id", "lupusEritematosoSist", "obesidad", "observaciones", "sindromeAntifosfo", "tipoDiabetesId", "trombofilia" FROM "EvaluacionActual";
DROP TABLE "EvaluacionActual";
ALTER TABLE "new_EvaluacionActual" RENAME TO "EvaluacionActual";
CREATE TABLE "new_IntrauterinaAbierta" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "diagnosticoPrenatalId" INTEGER NOT NULL,
    "ubicacionPlacentariaId" TEXT NOT NULL,
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
    "sangreEstimado" INTEGER,
    "frecuenciaCardiacaFetalFinalizacion" REAL,
    "complicacionesQuirurgicas" TEXT,
    "horaFinalizacionCirugia" DATETIME,
    "intrauterinaId" INTEGER NOT NULL,
    CONSTRAINT "IntrauterinaAbierta_diagnosticoPrenatalId_fkey" FOREIGN KEY ("diagnosticoPrenatalId") REFERENCES "DiagnosticoPrenatal" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "IntrauterinaAbierta_intrauterinaId_fkey" FOREIGN KEY ("intrauterinaId") REFERENCES "OrdenQuirurgicaIntrauterina" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_IntrauterinaAbierta" ("diagnosticoPrenatalId", "id") SELECT "diagnosticoPrenatalId", "id" FROM "IntrauterinaAbierta";
DROP TABLE "IntrauterinaAbierta";
ALTER TABLE "new_IntrauterinaAbierta" RENAME TO "IntrauterinaAbierta";
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
    CONSTRAINT "IntrauterinaEndoscopica_diagnosticoPrenatalId_fkey" FOREIGN KEY ("diagnosticoPrenatalId") REFERENCES "DiagnosticoPrenatal" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "IntrauterinaEndoscopica_intrauterinaId_fkey" FOREIGN KEY ("intrauterinaId") REFERENCES "OrdenQuirurgicaIntrauterina" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_IntrauterinaEndoscopica" ("diagnosticoPrenatalId", "id") SELECT "diagnosticoPrenatalId", "id" FROM "IntrauterinaEndoscopica";
DROP TABLE "IntrauterinaEndoscopica";
ALTER TABLE "new_IntrauterinaEndoscopica" RENAME TO "IntrauterinaEndoscopica";
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
    CONSTRAINT "IntrauterinaPercutanea_diagnosticoPrenatalId_fkey" FOREIGN KEY ("diagnosticoPrenatalId") REFERENCES "DiagnosticoPrenatal" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "IntrauterinaPercutanea_percutaneaId_fkey" FOREIGN KEY ("percutaneaId") REFERENCES "OrdenQuirurgicaIntrauterina" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_IntrauterinaPercutanea" ("diagnosticoPrenatalId", "fechaCirugia", "frecuenciaCardiacaFetalInicio", "horaInicioAnestesia", "horaInicioCirugiaFetal", "id", "sangradoEstimado", "tipoAnestesiaId") SELECT "diagnosticoPrenatalId", "fechaCirugia", "frecuenciaCardiacaFetalInicio", "horaInicioAnestesia", "horaInicioCirugiaFetal", "id", "sangradoEstimado", "tipoAnestesiaId" FROM "IntrauterinaPercutanea";
DROP TABLE "IntrauterinaPercutanea";
ALTER TABLE "new_IntrauterinaPercutanea" RENAME TO "IntrauterinaPercutanea";
CREATE UNIQUE INDEX "IntrauterinaPercutanea_percutaneaId_key" ON "IntrauterinaPercutanea"("percutaneaId");
CREATE TABLE "new_OrdenQuirurgicaIntrauterina" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pacienteId" INTEGER NOT NULL,
    "fechaDeCreacion" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "teniaDiagnostico" BOOLEAN,
    "evaluacionActualId" INTEGER,
    "diagnosticoPrenatalId" INTEGER NOT NULL,
    "etapaId" INTEGER NOT NULL,
    "complicacionesQuirurgicas" TEXT,
    "estado" BOOLEAN,
    "ordenQuirurgicaIntrauterinaId" INTEGER,
    CONSTRAINT "OrdenQuirurgicaIntrauterina_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "OrdenQuirurgicaIntrauterina_evaluacionActualId_fkey" FOREIGN KEY ("evaluacionActualId") REFERENCES "EvaluacionActual" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "OrdenQuirurgicaIntrauterina_diagnosticoPrenatalId_fkey" FOREIGN KEY ("diagnosticoPrenatalId") REFERENCES "DiagnosticoPrenatal" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "OrdenQuirurgicaIntrauterina_etapaId_fkey" FOREIGN KEY ("etapaId") REFERENCES "EtapaCirugia" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_OrdenQuirurgicaIntrauterina" ("complicacionesQuirurgicas", "diagnosticoPrenatalId", "estado", "etapaId", "evaluacionActualId", "fechaDeCreacion", "id", "pacienteId", "teniaDiagnostico") SELECT "complicacionesQuirurgicas", "diagnosticoPrenatalId", "estado", "etapaId", "evaluacionActualId", "fechaDeCreacion", "id", "pacienteId", "teniaDiagnostico" FROM "OrdenQuirurgicaIntrauterina";
DROP TABLE "OrdenQuirurgicaIntrauterina";
ALTER TABLE "new_OrdenQuirurgicaIntrauterina" RENAME TO "OrdenQuirurgicaIntrauterina";
CREATE TABLE "new_ResultadosPerinatales" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ordenQuirurgicaId" INTEGER NOT NULL,
    "tipoDeParto" TEXT,
    "fechaNac" DATETIME,
    "edadFinalizacion" TEXT,
    "natalidad" TEXT,
    "descripcionFetal" TEXT,
    "pesoGramos" INTEGER,
    CONSTRAINT "ResultadosPerinatales_ordenQuirurgicaId_fkey" FOREIGN KEY ("ordenQuirurgicaId") REFERENCES "OrdenQuirurgicaIntrauterina" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ResultadosPerinatales" ("id") SELECT "id" FROM "ResultadosPerinatales";
DROP TABLE "ResultadosPerinatales";
ALTER TABLE "new_ResultadosPerinatales" RENAME TO "ResultadosPerinatales";
CREATE TABLE "new_Usuarios" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "rolId" INTEGER NOT NULL,
    "usuario" TEXT NOT NULL,
    "nombreYApellido" TEXT NOT NULL,
    "telefono" INTEGER NOT NULL,
    "contrasena" TEXT NOT NULL,
    CONSTRAINT "Usuarios_rolId_fkey" FOREIGN KEY ("rolId") REFERENCES "Roles" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Usuarios" ("contrasena", "id", "rolId", "telefono") SELECT "contrasena", "id", "rolId", "telefono" FROM "Usuarios";
DROP TABLE "Usuarios";
ALTER TABLE "new_Usuarios" RENAME TO "Usuarios";
CREATE UNIQUE INDEX "Usuarios_rolId_key" ON "Usuarios"("rolId");
CREATE UNIQUE INDEX "Usuarios_telefono_key" ON "Usuarios"("telefono");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "OrdenQuirurgicaPostoperacion_diagnosticoId_key" ON "OrdenQuirurgicaPostoperacion"("diagnosticoId");

-- CreateIndex
CREATE UNIQUE INDEX "CirugiaNeonatal_cirugiaId_key" ON "CirugiaNeonatal"("cirugiaId");

-- CreateIndex
CREATE UNIQUE INDEX "CirugiaNerviosoCentral_cirugiaId_key" ON "CirugiaNerviosoCentral"("cirugiaId");

-- CreateIndex
CREATE UNIQUE INDEX "Roles_nombreRol_key" ON "Roles"("nombreRol");
