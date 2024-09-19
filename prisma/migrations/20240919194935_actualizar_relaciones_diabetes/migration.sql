/*
  Warnings:

  - A unique constraint covering the columns `[diabetesId]` on the table `AntecedentesPersonales` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tipoDiabetesId]` on the table `EvaluacionActual` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "AntecedentesPersonales_diabetesId_key" ON "AntecedentesPersonales"("diabetesId");

-- CreateIndex
CREATE UNIQUE INDEX "EvaluacionActual_tipoDiabetesId_key" ON "EvaluacionActual"("tipoDiabetesId");
