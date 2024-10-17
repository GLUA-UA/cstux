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

  ///////
  const result = userSummaries.map((user) => {
    const totalTime = parseFloat(user.userLevels.reduce((sum, ul) => sum + ul.time, 0).toFixed(3));
    const totalCoins = user.userLevels.reduce((sum, ul) => sum + ul.coins, 0);
    const timeBonus = parseFloat((totalCoins * 0.05).toFixed(3));
    const timeWithBonus = totalTime - timeBonus;

    // Group levels by unique 'order'
    const uniqueOrders = new Set(user.userLevels.map(ul => Math.floor(ul.level.order)));
    const levelsCompleted = uniqueOrders.size;

    const lastCompletedLevel =
      user.userLevels.length > 0
        ? user.userLevels[0].level.displayName
        : "None";

    return {
      fullName: `${user.firstName} ${user.lastName}`,
      lastCompletedLevel,
      levelsCompleted, // Now counting grouped levels
      totalTime,
      totalCoins,
      timeBonus,
      timeWithBonus,
    };
  });

  // Sort by levelsCompleted (descending) and then by timeWithBonus (ascending)
  result.sort((a, b) => {
    if (b.levelsCompleted !== a.levelsCompleted) {
      return b.levelsCompleted - a.levelsCompleted; // Sort by levels completed first
    }
    return a.timeWithBonus - b.timeWithBonus; // Sort by time with bonus if same levels completed
  });

  return Response.json(result);
}
