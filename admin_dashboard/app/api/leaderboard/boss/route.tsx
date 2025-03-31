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
          createdAt: true,
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
    if (attempts === 0) {
      return {
        fullName: `${user.firstName} ${user.lastName}`,
        lowestTime: 0,
        lowestTimeSubmissionDate: null,
      };
    }

    const times = user.bossLevels.map(ul => ul.time);
    const lowestTime = Math.min(...times);
    const lowestTimeSubmission = user.bossLevels.find(ul => ul.time === lowestTime);
    const lowestTimeSubmissionDate = lowestTimeSubmission?.createdAt;

    return {
      fullName: `${user.firstName} ${user.lastName}`,
      lowestTime,
      lowestTimeSubmissionDate,
    };
  });

  // Sort by lowest time first, then by submission date
  result.sort((a, b) => {
    if (a.lowestTime === b.lowestTime) {
      if (a.lowestTimeSubmissionDate && b.lowestTimeSubmissionDate) {
        return a.lowestTimeSubmissionDate < b.lowestTimeSubmissionDate ? -1 : 1;
      }
    }
    return a.lowestTime < b.lowestTime ? -1 : 1;
  });

  return Response.json(result);
}
