import { PrismaClient } from "@/generated/prisma";

// Removed isNode, use typeof global !== "undefined" inline
console.log("DB Link", process.env.DATABASE_URL);

declare global {
    var prisma: PrismaClient | undefined;
}

const prisma =
    typeof global !== "undefined"
        ? global.prisma || new PrismaClient()
        : undefined;

if (typeof global !== "undefined" && process.env.NODE_ENV === "development") {
    global.prisma = prisma;
}

if (!prisma) {
    throw new Error("Prisma client not initialized");
}

export default prisma!;
