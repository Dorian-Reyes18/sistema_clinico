-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CirugiaNeonatal" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cirugiaId" INTEGER NOT NULL,
    "malformacionesBroncoPulmonares" TEXT,
    "estomago" TEXT,
    "minimaInvasion" BOOLEAN,
    "cirugiaConvencional" BOOLEAN,
    "enfisemaLobarCongenito" BOOLEAN,
    "lesionesQuisticasDupliacionEsesofagicas" BOOLEAN,
    "atresiaEsofagica" BOOLEAN,
    "herniaDiafragmatica" BOOLEAN,
    "estenosisAtresiaDuodenal" BOOLEAN,
    "estenosisAtresiaIntestinales" BOOLEAN,
    "malRotacionIntestinal" BOOLEAN,
    "enfermedadMeconial" BOOLEAN,
    "enterocolitisNecrotizante" BOOLEAN,
    "enfermedadDeHirschsprung" BOOLEAN,
    "defectosParedAbdominalGastrosquisis" BOOLEAN,
    "defectosParedabdominalOnfalocele" BOOLEAN,
    "tumorDeOvario" BOOLEAN,
    "Otros" TEXT,
    CONSTRAINT "CirugiaNeonatal_cirugiaId_fkey" FOREIGN KEY ("cirugiaId") REFERENCES "OrdenQuirurgicaPostoperacion" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CirugiaNeonatal" ("Otros", "atresiaEsofagica", "cirugiaConvencional", "cirugiaId", "defectosParedAbdominalGastrosquisis", "defectosParedabdominalOnfalocele", "enfermedadDeHirschsprung", "enfermedadMeconial", "enfisemaLobarCongenito", "enterocolitisNecrotizante", "estenosisAtresiaDuodenal", "estenosisAtresiaIntestinales", "estomago", "herniaDiafragmatica", "id", "lesionesQuisticasDupliacionEsesofagicas", "malRotacionIntestinal", "malformacionesBroncoPulmonares", "minimaInvasion", "tumorDeOvario") SELECT "Otros", "atresiaEsofagica", "cirugiaConvencional", "cirugiaId", "defectosParedAbdominalGastrosquisis", "defectosParedabdominalOnfalocele", "enfermedadDeHirschsprung", "enfermedadMeconial", "enfisemaLobarCongenito", "enterocolitisNecrotizante", "estenosisAtresiaDuodenal", "estenosisAtresiaIntestinales", "estomago", "herniaDiafragmatica", "id", "lesionesQuisticasDupliacionEsesofagicas", "malRotacionIntestinal", "malformacionesBroncoPulmonares", "minimaInvasion", "tumorDeOvario" FROM "CirugiaNeonatal";
DROP TABLE "CirugiaNeonatal";
ALTER TABLE "new_CirugiaNeonatal" RENAME TO "CirugiaNeonatal";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
