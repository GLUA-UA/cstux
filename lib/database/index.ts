import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const database = globalThis.prismaGlobal ?? prismaClientSingleton();

export default database;

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = database;