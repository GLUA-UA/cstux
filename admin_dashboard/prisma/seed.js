const { PrismaClient } = require("@prisma/client");
const { users, levels, states } = require("./data.js");
const { stat } = require("fs");

const prisma = new PrismaClient();

try {
    console.log("Deleting all data...");

    await prisma.users.deleteMany();
    console.log("Deleted all users");

    await prisma.levels.deleteMany();
    console.log("Deleted all levels");

    await prisma.states.deleteMany();
    console.log("Deleted all states");

    // console.log("Seeding users...");
    // await prisma.users.createMany({
    //     data: users,
    // });
    // console.log("Seeded users");

    console.log("Seeding levels...");
    await prisma.levels.createMany({
        data: levels,
    });
    console.log("Seeded levels");

    console.log("Seeding states...");
    await prisma.states.createMany({
        data: states,
    });
    console.log("Seeded states");
} catch (error) {
    console.error(error);
    process.exit(1);
} finally {
    await prisma.$disconnect();
}