import { getUsers, createUser } from "@/lib/data/users";
import { NextResponse, NextRequest } from "next/server";

export async function GET() {
    const users = await getUsers();
    return NextResponse.json(users);
}

export async function POST(request: NextRequest) {
    const { name, email, id } = await request.json();
    if (!name || !email || !id) {
        return NextResponse.json(
            { error: "Missing required fields" },
            { status: 400 },
        );
    }
    const user = await createUser({ name, email, id });
    return NextResponse.json(user);
}
