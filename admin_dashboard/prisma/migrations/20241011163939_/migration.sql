/*
  Warnings:

  - You are about to alter the column `order` on the `levels` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_levels" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "codeName" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "order" REAL NOT NULL
);
INSERT INTO "new_levels" ("codeName", "displayName", "id", "order") SELECT "codeName", "displayName", "id", "order" FROM "levels";
DROP TABLE "levels";
ALTER TABLE "new_levels" RENAME TO "levels";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
