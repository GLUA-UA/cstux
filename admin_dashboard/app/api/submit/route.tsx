import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// POST body
// {
//     "userAccessCode": "ABCDEF",
//     "levelInfo": {
//         "levelId": "level_id.stl",
//         "time": "3.14159",
//         "coins": "420.0"
//     }
// }

export async function POST(request: Request) {
  try {
    const { userAccessCode, levelInfo } = await request.json();

    // Fetching the user from the database
    const user = await prisma.users.findFirst({
      where: { accessCode: userAccessCode },
    });
    
    // If the user does not exist, return a 404
    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    const time = parseFloat(levelInfo.time);
    const coins = parseInt(levelInfo.coins);

    // Inserting the level info into the database
    const userLevel = await prisma.userLevels.create({
        data: {
            userId: user.id,
            levelId: levelInfo.levelId,
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