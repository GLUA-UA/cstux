/*
  Warnings:

  - You are about to alter the column `time` on the `userLevels` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_userLevels" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "levelId" TEXT NOT NULL,
    "time" REAL NOT NULL,
    "coins" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "userLevels_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "userLevels_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "levels" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_userLevels" ("coins", "createdAt", "id", "levelId", "time", "userId") SELECT "coins", "createdAt", "id", "levelId", "time", "userId" FROM "userLevels";
DROP TABLE "userLevels";
ALTER TABLE "new_userLevels" RENAME TO "userLevels";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
