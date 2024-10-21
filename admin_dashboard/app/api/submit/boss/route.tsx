import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// POST body
// {
//     "accessCode": "ABCDEF",
//     "levelInfo": {
//         "levelId": "level_id.stl",
//         "time": "3.14159",
//     }
// }

export async function POST(request: Request) {
  try {
    const { accessCode, levelInfo } = await request.json();

    // Fetching the tournamentStarted state from the database
    const tournamentStarted = await prisma.states.findFirst({
      where: { statName: "tournamentStarted" },
    });

    // If the tournament is not started, return a 400
    if (!tournamentStarted || tournamentStarted.statValue !== "true") {
      return new Response("Tournament has not started", { status: 400 });
    }

    // Fetching the user from the database
    const user = await prisma.users.findFirst({
      where: { accessCode: accessCode },
    });
    
    // If the user does not exist, return a 404
    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    console.log(accessCode, user.firstName, user.lastName, levelInfo);

    // Fetch the level info from the database
    const level = await prisma.levels.findFirst({
      where: { codeName: levelInfo.levelId },
    });

    // If the level does not exist, return a 404
    if (!level) {
      return new Response("Invalid level id", { status: 404 });
    }

    // If the level is not the boss one, return a 400
    if (level.codeName !== "yeti_boss.stl") {
      return new Response("Invalid level", { status: 400 });
    }

    const time = parseFloat(levelInfo.time);

    // Inserting the level info into the database
    const bossLevel = await prisma.bossLevels.create({
        data: {
            userId: user.id,
            levelId: level.id,
            time: time,
        },
    });

    return new Response(JSON.stringify(bossLevel), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Failed to submit data", { status: 500 });
  }
}
