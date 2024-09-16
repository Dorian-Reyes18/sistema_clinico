-- CreateTable
CREATE TABLE "Roles" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombreRol" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Usuarios" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "rolId" INTEGER NOT NULL,
    "nombreUsuario" TEXT NOT NULL,
    "nombreApellido" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "contrasena" TEXT NOT NULL,
    CONSTRAINT "Usuarios_rolId_fkey" FOREIGN KEY ("rolId") REFERENCES "Roles" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Categoria" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "opcion" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "TipoDefecto" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombreDefecto" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Silais" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Departamento" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Municipio" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "departamentoId" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,
    CONSTRAINT "Municipio_departamentoId_fkey" FOREIGN KEY ("departamentoId") REFERENCES "Departamento" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SangreRH" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tipo" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "TipoDiabetes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "mellitusTipo1" BOOLEAN NOT NULL,
    "mellitusTipo2" BOOLEAN NOT NULL,
    "mellitusGestacional" BOOLEAN NOT NULL,
    "ninguna" BOOLEAN NOT NULL
);

-- CreateTable
CREATE TABLE "Paciente" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "silaisId" INTEGER NOT NULL,
    "municipioId" INTEGER NOT NULL,
    "numeroExpediente" INTEGER NOT NULL,
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
    CONSTRAINT "Paciente_municipioId_fkey" FOREIGN KEY ("municipioId") REFERENCES "Municipio" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AntecedentesPersonales" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pacienteId" INTEGER NOT NULL,
    "diabetesId" INTEGER,
    "sangreRhId" INTEGER,
    "fechaCreacion" DATETIME,
    "licor" BOOLEAN,
    "drogas" BOOLEAN,
    "fuma" BOOLEAN,
    "teratogenicos" BOOLEAN,
    "hipertension" BOOLEAN,
    "epilepsia" BOOLEAN,
    "tiroidea" BOOLEAN,
    "neoplasicas" BOOLEAN,
    "cardiopatia" BOOLEAN,
    "inmunologia" BOOLEAN,
    CONSTRAINT "AntecedentesPersonales_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "AntecedentesPersonales_diabetesId_fkey" FOREIGN KEY ("diabetesId") REFERENCES "TipoDiabetes" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "AntecedentesPersonales_sangreRhId_fkey" FOREIGN KEY ("sangreRhId") REFERENCES "SangreRH" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EmbarazoActual" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pacienteId" INTEGER NOT NULL,
    "fechaEmbarazo" DATETIME,
    "pesoKg" REAL,
    "talla" INTEGER,
    "ultimaRegla" DATETIME,
    "edadGestacional" INTEGER,
    "imc" REAL,
    "consumoAF" BOOLEAN,
    "fechaInicioConsumo" DATETIME,
    CONSTRAINT "EmbarazoActual_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AntecedentesFamiliaresDefectos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pacienteId" INTEGER NOT NULL,
    "fechaCreacion" DATETIME,
    "opcion" BOOLEAN,
    "descripcion" TEXT,
    CONSTRAINT "AntecedentesFamiliaresDefectos_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AntecedentesObstetricos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pacienteId" INTEGER NOT NULL,
    "fechaCreacion" DATETIME,
    "gesta" TEXT,
    "parto" TEXT,
    "aborto" TEXT,
    "cesarea" TEXT,
    "legrado" TEXT,
    CONSTRAINT "AntecedentesObstetricos_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Conyuge" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sangreRhId" INTEGER NOT NULL,
    "pacienteId" INTEGER NOT NULL,
    "telefono" TEXT,
    "edad" INTEGER,
    CONSTRAINT "Conyuge_sangreRhId_fkey" FOREIGN KEY ("sangreRhId") REFERENCES "SangreRH" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Conyuge_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EtapaCirugia" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT
);

-- CreateTable
CREATE TABLE "DiagnosticoPrenatal" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "categoriaId" INTEGER NOT NULL,
    "tipoDefectoId" INTEGER NOT NULL,
    "tipoCirugiaRealizada" TEXT,
    "estudioGen" BOOLEAN,
    "resultadoEstGen" TEXT,
    "embarazoUnico" BOOLEAN,
    CONSTRAINT "DiagnosticoPrenatal_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DiagnosticoPrenatal_tipoDefectoId_fkey" FOREIGN KEY ("tipoDefectoId") REFERENCES "TipoDefecto" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EvaluacionActual" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tipoDiabetesId" INTEGER,
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
    CONSTRAINT "EvaluacionActual_tipoDiabetesId_fkey" FOREIGN KEY ("tipoDiabetesId") REFERENCES "TipoDiabetes" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "OrdenQuirurgicaIntrauterina" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pacienteId" INTEGER NOT NULL,
    "fechaDeCreacion" DATETIME,
    "teniaDiagnostico" BOOLEAN,
    "evaluacionActualId" INTEGER,
    "diagnosticoPrenatalId" INTEGER,
    "etapaId" INTEGER,
    "complicacionesQuirurgicas" TEXT,
    "estado" BOOLEAN,
    CONSTRAINT "OrdenQuirurgicaIntrauterina_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "OrdenQuirurgicaIntrauterina_evaluacionActualId_fkey" FOREIGN KEY ("evaluacionActualId") REFERENCES "EvaluacionActual" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "OrdenQuirurgicaIntrauterina_diagnosticoPrenatalId_fkey" FOREIGN KEY ("diagnosticoPrenatalId") REFERENCES "DiagnosticoPrenatal" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "OrdenQuirurgicaIntrauterina_etapaId_fkey" FOREIGN KEY ("etapaId") REFERENCES "EtapaCirugia" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "IntrauterinaPercutanea" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "diagnosticoPrenatalId" INTEGER NOT NULL,
    "cordocentesis" BOOLEAN,
    "drenajeMasaQuisticaRenal" BOOLEAN,
    "drenajeMasaQuisticaPulmonar" BOOLEAN,
    "toracocentesis" BOOLEAN,
    "cateterismoCardiaco" BOOLEAN,
    "noSeCompletoLaCirugiaFetal" BOOLEAN,
    "fechaCirugia" DATETIME,
    "horaInicioAnestesia" DATETIME,
    "tipoAnestesiaId" TEXT,
    "horaInicioCirugiaFetal" DATETIME,
    "frecuenciaCardiacaFetalInicio" REAL,
    "diferenciaPorcentualPeso" REAL,
    "anastomosisCoaguladas" TEXT,
    "sangradoEstimado" INTEGER,
    "frecuenciaCardiacaFetalFinal" REAL,
    "resultados" TEXT,
    CONSTRAINT "IntrauterinaPercutanea_diagnosticoPrenatalId_fkey" FOREIGN KEY ("diagnosticoPrenatalId") REFERENCES "DiagnosticoPrenatal" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "IntrauterinaEndoscopica" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "diagnosticoPrenatalId" INTEGER NOT NULL,
    "coagulacionUltrasonido" BOOLEAN,
    "usoLaparoscopico" BOOLEAN,
    "drenajeLateral" BOOLEAN,
    "extirpacionQuirurgica" BOOLEAN,
    "resultResultados" TEXT,
    CONSTRAINT "IntrauterinaEndoscopica_diagnosticoPrenatalId_fkey" FOREIGN KEY ("diagnosticoPrenatalId") REFERENCES "DiagnosticoPrenatal" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "IntrauterinaAbierta" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "diagnosticoPrenatalId" INTEGER NOT NULL,
    "tcnicaUsada" TEXT,
    "resultado" TEXT,
    CONSTRAINT "IntrauterinaAbierta_diagnosticoPrenatalId_fkey" FOREIGN KEY ("diagnosticoPrenatalId") REFERENCES "DiagnosticoPrenatal" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ResultadosPerinatales" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ordenQuirurgicaIntrauterinaId" INTEGER NOT NULL,
    "fechaNacimiento" DATETIME,
    "sexo" TEXT,
    "peso" REAL,
    "talla" INTEGER,
    "apgar" INTEGER,
    "resultados" TEXT,
    CONSTRAINT "ResultadosPerinatales_ordenQuirurgicaIntrauterinaId_fkey" FOREIGN KEY ("ordenQuirurgicaIntrauterinaId") REFERENCES "OrdenQuirurgicaIntrauterina" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuarios_telefono_key" ON "Usuarios"("telefono");

-- CreateIndex
CREATE UNIQUE INDEX "Paciente_numeroExpediente_key" ON "Paciente"("numeroExpediente");
