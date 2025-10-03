import prisma from "@/lib/prisma";
import { User } from "@/generated/prisma";

export async function getUsers() {
    const users = await prisma.user.findMany();
    return users;
}

export async function createUser(data: User) {
    const user = await prisma.user.create({ data });
    return user;
}
