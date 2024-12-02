-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_IntrauterinaAbierta" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ordenQuirurgicaId" INTEGER,
    "fechaCirugia" TEXT,
    "horaInicioAnestesia" TEXT,
    "horaInicioCirugiaMaterna" TEXT,
    "horaInicioCirugiaFetal" TEXT,
    "horaFinalizacionCirugia" TEXT,
    "tipoAnestesiaId" TEXT,
    "complicacionesAnestesicas" TEXT,
    "complicacionesQuirurgicas" TEXT,
    "ubicacionPlacentaria" TEXT,
    "sangreEstimado" TEXT,
    "incisionEnPiel" TEXT,
    "incisionEnUtero" TEXT,
    "nivelAnatomico" TEXT,
    "tamanoDelDefecto" TEXT NOT NULL,
    "nivelFuncional" TEXT,
    "ilaInicialDeLiquidoAmniotico" TEXT,
    "ilaFinalBolsilloUnicoInicialDeLiquidoAmniotico" TEXT,
    "frecuenciaCardiacaFetalInicio" TEXT NOT NULL,
    "frecuenciaCardiacaFetalFinalizacion" TEXT NOT NULL,
    "cierreDeMielomeningocele" BOOLEAN,
    "derivacionVentriculoamniotica" BOOLEAN,
    "cierreDeEncefalocele" BOOLEAN,
    "drenajeDeQuistesCoroideosUniOBilaterales" BOOLEAN,
    CONSTRAINT "IntrauterinaAbierta_ordenQuirurgicaId_fkey" FOREIGN KEY ("ordenQuirurgicaId") REFERENCES "OrdenQuirurgicaIntrauterina" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_IntrauterinaAbierta" ("cierreDeEncefalocele", "cierreDeMielomeningocele", "complicacionesAnestesicas", "complicacionesQuirurgicas", "derivacionVentriculoamniotica", "drenajeDeQuistesCoroideosUniOBilaterales", "fechaCirugia", "frecuenciaCardiacaFetalFinalizacion", "frecuenciaCardiacaFetalInicio", "horaFinalizacionCirugia", "horaInicioAnestesia", "horaInicioCirugiaFetal", "horaInicioCirugiaMaterna", "id", "ilaFinalBolsilloUnicoInicialDeLiquidoAmniotico", "ilaInicialDeLiquidoAmniotico", "incisionEnPiel", "incisionEnUtero", "nivelAnatomico", "nivelFuncional", "ordenQuirurgicaId", "sangreEstimado", "tamanoDelDefecto", "tipoAnestesiaId", "ubicacionPlacentaria") SELECT "cierreDeEncefalocele", "cierreDeMielomeningocele", "complicacionesAnestesicas", "complicacionesQuirurgicas", "derivacionVentriculoamniotica", "drenajeDeQuistesCoroideosUniOBilaterales", "fechaCirugia", "frecuenciaCardiacaFetalFinalizacion", "frecuenciaCardiacaFetalInicio", "horaFinalizacionCirugia", "horaInicioAnestesia", "horaInicioCirugiaFetal", "horaInicioCirugiaMaterna", "id", "ilaFinalBolsilloUnicoInicialDeLiquidoAmniotico", "ilaInicialDeLiquidoAmniotico", "incisionEnPiel", "incisionEnUtero", "nivelAnatomico", "nivelFuncional", "ordenQuirurgicaId", "sangreEstimado", "tamanoDelDefecto", "tipoAnestesiaId", "ubicacionPlacentaria" FROM "IntrauterinaAbierta";
DROP TABLE "IntrauterinaAbierta";
ALTER TABLE "new_IntrauterinaAbierta" RENAME TO "IntrauterinaAbierta";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
