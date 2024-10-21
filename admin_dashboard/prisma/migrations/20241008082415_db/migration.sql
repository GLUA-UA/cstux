/*
  Warnings:

  - You are about to drop the `statistics` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "statistics";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "states" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "statName" TEXT NOT NULL,
    "statValue" TEXT NOT NULL,
    "statType" TEXT NOT NULL
);
