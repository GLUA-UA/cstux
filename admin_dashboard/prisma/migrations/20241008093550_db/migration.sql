/*
  Warnings:

  - A unique constraint covering the columns `[statName]` on the table `states` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "states_statName_key" ON "states"("statName");
