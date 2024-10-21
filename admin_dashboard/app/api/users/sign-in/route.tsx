import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// POST body
// {
//     "accessCode": "ABCDEF"
// }

export async function POST(request: Request) {
  try {
    const { accessCode } = await request.json();

    // Fetching the user from the database
    const user = await prisma.users.findFirst({
      where: { accessCode },
    });

    // If the user does not exist, return a 404
    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    // Update the user's login counter
    await prisma.users.update({
      where: { id: user.id },
      data: { signInCount: user.signInCount + 1 },
    });

    // Return the user's data
    return Response.json(user, { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Failed to submit data", { status: 500 });
  }
}
