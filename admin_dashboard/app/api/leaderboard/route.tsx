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
          badguys: true,
          secrets: true,
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
    const totalBadguysKilled = user.userLevels.reduce((sum, ul) => sum + ul.badguys, 0);
    const totalSecrets = user.userLevels.reduce((sum, ul) => sum + ul.secrets, 0);

    const timeBonus = parseFloat((
      totalCoins * 0.07 + totalBadguysKilled * 0.07 + totalSecrets * 5
    ).toFixed(3));

    const timeWithBonus = parseFloat((totalTime - timeBonus).toFixed(3));

    // Group levels by unique 'order'
    const uniqueOrders = new Set(user.userLevels.map(ul => Math.floor(ul.level.order)));
    const levelsCompleted = uniqueOrders.size;

    const lastCompletedLevel =
      user.userLevels.length > 0
        ? user.userLevels[0].level.displayName + " (" + user.userLevels[0].level.order + ")"
        : "None";

    return {
      fullName: `${user.firstName} ${user.lastName}`,
      lastCompletedLevel,
      levelsCompleted, // Now counting grouped levels
      totalTime,
      totalCoins,
      totalBadguysKilled,
      totalSecrets,
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
