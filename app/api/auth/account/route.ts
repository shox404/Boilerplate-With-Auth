import { NextRequest, NextResponse } from "next/server";
import { CLIENT_TOKEN, JWT_SECRET_CLIENT } from "@/lib/constants";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get(CLIENT_TOKEN)?.value;

        if (!token) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        const user = jwt.verify(token, JWT_SECRET_CLIENT) as { $id: string };

        return NextResponse.json(user, { status: 200 });
    } catch {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
}