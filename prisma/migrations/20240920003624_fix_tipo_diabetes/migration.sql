-- CreateTable
CREATE TABLE "_PacienteToTipoDiabetes" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_PacienteToTipoDiabetes_A_fkey" FOREIGN KEY ("A") REFERENCES "Paciente" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_PacienteToTipoDiabetes_B_fkey" FOREIGN KEY ("B") REFERENCES "TipoDiabetes" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_PacienteToTipoDiabetes_AB_unique" ON "_PacienteToTipoDiabetes"("A", "B");

-- CreateIndex
CREATE INDEX "_PacienteToTipoDiabetes_B_index" ON "_PacienteToTipoDiabetes"("B");
