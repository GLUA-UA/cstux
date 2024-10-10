import { PrismaClient } from "@prisma/client";

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
    };
  });

  return Response.json(result);
}
