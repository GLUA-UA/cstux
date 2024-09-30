const { PrismaClient } = require("@prisma/client");
const { users, levels } = require("./data.js");

const prisma = new PrismaClient();

try {
    console.log("Deleting all data...");
    await prisma.users.deleteMany();
    console.log("Deleted all users");

    console.log("Deleting all data...");
    await prisma.levels.deleteMany();
    console.log("Deleted all levels");

    console.log("Seeding users...");
    await prisma.users.createMany({
        data: users,
    });
    console.log("Seeded users");

    console.log("Seeding levels...");
    await prisma.levels.createMany({
        data: levels,
    });
    console.log("Seeded levels");
} catch (error) {
    console.error(error);
    process.exit(1);
} finally {
    await prisma.$disconnect();
}