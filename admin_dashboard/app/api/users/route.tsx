import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {

  const users = await prisma.users.findMany();

  return Response.json(users);
}
