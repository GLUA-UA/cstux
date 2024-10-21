-- CreateTable
CREATE TABLE "statistics" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "statName" TEXT NOT NULL,
    "statValue" TEXT NOT NULL,
    "statType" TEXT NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "accessCode" TEXT NOT NULL,
    "signInCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_users" ("accessCode", "createdAt", "firstName", "id", "lastName", "updatedAt") SELECT "accessCode", "createdAt", "firstName", "id", "lastName", "updatedAt" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
