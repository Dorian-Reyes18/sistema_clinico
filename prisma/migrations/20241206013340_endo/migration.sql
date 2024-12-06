-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Usuarios" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "rolId" INTEGER NOT NULL,
    "usuario" TEXT,
    "nombreYApellido" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "contrasena" TEXT NOT NULL,
    CONSTRAINT "Usuarios_rolId_fkey" FOREIGN KEY ("rolId") REFERENCES "Roles" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Usuarios" ("contrasena", "id", "nombreYApellido", "rolId", "telefono", "usuario") SELECT "contrasena", "id", "nombreYApellido", "rolId", "telefono", "usuario" FROM "Usuarios";
DROP TABLE "Usuarios";
ALTER TABLE "new_Usuarios" RENAME TO "Usuarios";
CREATE UNIQUE INDEX "Usuarios_telefono_key" ON "Usuarios"("telefono");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
