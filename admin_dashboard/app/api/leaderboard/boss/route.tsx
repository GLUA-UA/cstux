import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const userSummaries = await prisma.users.findMany({
    select: {
      firstName: true,
      lastName: true,
      bossLevels: {
        select: {
          time: true,
        },
        orderBy: {
          time: "desc", // To get the last completed level by order
        },
      },
    },
  });

  ///////
  const result = userSummaries.map((user) => {
    const attempts = user.bossLevels.length;
    
    const times = user.bossLevels.map(ul => ul.time);
    const lowestTime = Math.min(...times);
    
    const timesOfLowest = times.filter(t => t === lowestTime).length;
    const percentage = (timesOfLowest / attempts) * 100;

    return {
      fullName: `${user.firstName} ${user.lastName}`,
      attempts,
      lowestTime,
      percentage,
    };
  });

  // Sort by lowest time first, then by times of lowest
  result.sort((a, b) => {
    if (a.lowestTime !== b.lowestTime) {
      return a.lowestTime - b.lowestTime;
    }
    return b.percentage - a.percentage;
  });

  return Response.json(result);
}
