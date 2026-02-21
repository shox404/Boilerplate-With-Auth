import { NextRequest, NextResponse } from "next/server";
import { databases } from "@/lib/appwrite";
import { CLIENT_TOKEN, DATABASE_ID, JWT_SECRET_CLIENT, USERS_COLLECTION } from "@/lib/constants";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get(CLIENT_TOKEN)?.value;

        if (!token) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        const user = jwt.verify(token, JWT_SECRET_CLIENT) as { $id: string };

        const data = await databases.getDocument(DATABASE_ID, USERS_COLLECTION, user.$id);

        return NextResponse.json(data, { status: 200 });
    } catch {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const token = req.cookies.get(CLIENT_TOKEN)?.value;
        if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

        const user = jwt.verify(token, JWT_SECRET_CLIENT) as { $id: string };
        const body = await req.json();

        const allowedKeys = ["name", "username", "email", "bio", "avatar"] as const;

        const updateData: Partial<Record<typeof allowedKeys[number], string>> = {};
        for (const key of allowedKeys) {
            if (body[key] !== undefined) updateData[key] = body[key];
        }

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ error: "No fields to update" }, { status: 400 });
        }

        const updated = await databases.updateDocument(
            DATABASE_ID,
            USERS_COLLECTION,
            user.$id,
            updateData
        );

        return NextResponse.json(updated, { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
    }
}