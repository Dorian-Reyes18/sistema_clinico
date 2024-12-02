-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_IntrauterinaEndoscopica" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ordenQuirurgicaId" INTEGER,
    "fechaCirugia" DATETIME,
    "horaInicioAnestesia" TEXT,
    "horaInicioCirugiaFetal" TEXT,
    "horaFinalizacionCirugia" TEXT,
    "tipoAnestesiaId" TEXT,
    "complicacionesAnestesicas" TEXT,
    "ubicacionPlacentaria" TEXT NOT NULL,
    "frecuenciaCardiacaFetalInicio" TEXT NOT NULL,
    "sangradoEstimado" TEXT,
    "complicacionesQuirurgicas" TEXT,
    "frecuenciaCardiacaFetalFinalizacion" TEXT NOT NULL,
    "bolsilloUnicoInicialDeLiquidoAmniotico" TEXT,
    "laserDeAnastomosisPlacentaria" BOOLEAN,
    "coagulacionBipolarDeCordoneUmbilical" BOOLEAN,
    "liberacionDeBandasAmnioticas" BOOLEAN,
    "colocacionDeBalonEndotraqueal" BOOLEAN,
    "retiroDeBalonEndotraqueal" BOOLEAN,
    "reparacionDeMielomeningocele" BOOLEAN,
    "cistoscopia" BOOLEAN,
    "cistoscopiaMasLaserDeValvasUretralesPosteriores" BOOLEAN,
    "intubacionEndotraquealIntrauterina" BOOLEAN,
    CONSTRAINT "IntrauterinaEndoscopica_ordenQuirurgicaId_fkey" FOREIGN KEY ("ordenQuirurgicaId") REFERENCES "OrdenQuirurgicaIntrauterina" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_IntrauterinaEndoscopica" ("bolsilloUnicoInicialDeLiquidoAmniotico", "cistoscopia", "cistoscopiaMasLaserDeValvasUretralesPosteriores", "coagulacionBipolarDeCordoneUmbilical", "colocacionDeBalonEndotraqueal", "complicacionesAnestesicas", "complicacionesQuirurgicas", "fechaCirugia", "frecuenciaCardiacaFetalFinalizacion", "frecuenciaCardiacaFetalInicio", "horaFinalizacionCirugia", "horaInicioAnestesia", "horaInicioCirugiaFetal", "id", "intubacionEndotraquealIntrauterina", "laserDeAnastomosisPlacentaria", "liberacionDeBandasAmnioticas", "ordenQuirurgicaId", "reparacionDeMielomeningocele", "retiroDeBalonEndotraqueal", "sangradoEstimado", "tipoAnestesiaId", "ubicacionPlacentaria") SELECT "bolsilloUnicoInicialDeLiquidoAmniotico", "cistoscopia", "cistoscopiaMasLaserDeValvasUretralesPosteriores", "coagulacionBipolarDeCordoneUmbilical", "colocacionDeBalonEndotraqueal", "complicacionesAnestesicas", "complicacionesQuirurgicas", "fechaCirugia", "frecuenciaCardiacaFetalFinalizacion", "frecuenciaCardiacaFetalInicio", "horaFinalizacionCirugia", "horaInicioAnestesia", "horaInicioCirugiaFetal", "id", "intubacionEndotraquealIntrauterina", "laserDeAnastomosisPlacentaria", "liberacionDeBandasAmnioticas", "ordenQuirurgicaId", "reparacionDeMielomeningocele", "retiroDeBalonEndotraqueal", "sangradoEstimado", "tipoAnestesiaId", "ubicacionPlacentaria" FROM "IntrauterinaEndoscopica";
DROP TABLE "IntrauterinaEndoscopica";
ALTER TABLE "new_IntrauterinaEndoscopica" RENAME TO "IntrauterinaEndoscopica";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
