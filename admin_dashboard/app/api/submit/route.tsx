import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// POST body
// {
//     "accessCode": "ABCDEF",
//     "levelInfo": {
//         "levelId": "level_id.stl",
//         "time": "3.14159",
//         "coins": "420.0"
//     }
// }

export async function POST(request: Request) {
  try {
    const { accessCode, levelInfo } = await request.json();

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

    const time = parseFloat(levelInfo.time);
    const coins = parseInt(levelInfo.coins);

    // Check if the user has already completed the level
    const duplicatedLevel = await prisma.userLevels.findFirst({
      where: {
        userId: user.id,
        levelId: level.id,
      },
    });

    if (duplicatedLevel) {
      return new Response("Level already completed", { status: 400 });
    }

    // Inserting the level info into the database
    const userLevel = await prisma.userLevels.create({
        data: {
            userId: user.id,
            levelId: level.id,
            time: time,
            coins: coins,
        },
    });

    return new Response(JSON.stringify(userLevel), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Failed to submit data", { status: 500 });
  }
}
