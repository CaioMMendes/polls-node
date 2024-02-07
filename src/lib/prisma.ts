import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
  //serve para mostrar as querys que o prisma fez no console
  log: ["query"],
});
