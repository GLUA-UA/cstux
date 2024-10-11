import { PrismaClient } from "@prisma/client";
import { time } from "console";

const prisma = new PrismaClient();

export async function GET() {
  const userSummaries = await prisma.users.findMany({
    select: {
      firstName: true,
      lastName: true,
      userLevels: {
        select: {
          level: {
            select: {
              displayName: true,
              order: true,
            },
          },
          time: true,
          coins: true,
        },
        orderBy: {
          level: {
            order: "desc", // To get the last completed level by order
          },
        },
      },
    },
  });

  const result = userSummaries.map((user) => {
    const totalTime = user.userLevels.reduce((sum, ul) => sum + ul.time, 0);
    const totalCoins = user.userLevels.reduce((sum, ul) => sum + ul.coins, 0);
    const timeBonus = totalCoins * 0.05;
    const timeWithBonus = totalTime - timeBonus;
    const lastCompletedLevel =
      user.userLevels.length > 0
        ? user.userLevels[0].level.displayName
        : "None";
    const levelsCompleted = user.userLevels.length;

    return {
      fullName: `${user.firstName} ${user.lastName}`,
      lastCompletedLevel,
      levelsCompleted,
      totalTime,
      totalCoins,
      timeBonus,
      timeWithBonus,
    };
  });

  result.sort((a, b) => a.timeWithBonus - b.timeWithBonus);

  return Response.json(result);
}
