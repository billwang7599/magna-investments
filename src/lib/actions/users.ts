"use server";
import { User } from "@/generated/prisma";
import prisma from "@/lib/prisma";

export async function getUsers() {
    const users = await prisma.user.findMany();
    return users as User[];
}

export async function getUserById(id: string) {
    const user = await prisma.user.findUnique({ where: { id } });
    return user as User | null;
}

export async function createUser(id: string, name: string, email: string) {
    const user = await prisma.user.create({ data: { id, name, email } });
    return user as User;
}

export async function getUserByEmail(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    return user as User | null;
}
