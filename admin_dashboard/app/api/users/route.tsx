import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  // Returning all users data from the database
  return Response.json(await prisma.users.findMany());
}

export async function POST(request: Request) {
  try {
    let { firstName, lastName } = await request.json();

    firstName = firstName.trim().charAt(0).toUpperCase() + firstName.trim().slice(1).toLowerCase();
    lastName = lastName.trim().charAt(0).toUpperCase() + lastName.trim().slice(1).toLowerCase();

    // Generating a unique access code
    let isUnique = false;
    let accessCode = "";
    while (!isUnique) {
      accessCode = generateAccessCode();
      isUnique = await isAccessCodeUnique(accessCode);
    }

    // Creating the user in the database
    const user = await prisma.users.create({
      data: {
        firstName,
        lastName,
        accessCode,
      },
    });

    // Returning the user to the client
    return new Response(JSON.stringify(user), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response("Failed to create user", { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    // Deleting the user from the database
    await prisma.users.delete({ where: { id } });

    return new Response("User deleted", { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Failed to delete user", { status: 500 });
  }
}

//
// Auxiliary functions
//

function generateAccessCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let accessCode = "";
  for (let i = 0; i < 8; i++) {
    accessCode += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return accessCode;
}

async function isAccessCodeUnique(accessCode: string) {
  return (await prisma.users.findFirst({ where: { accessCode } }))
    ? false
    : true;
}
