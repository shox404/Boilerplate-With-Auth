import { NextRequest, NextResponse } from "next/server";
import { databases } from "@/lib/appwrite";
import { Query, ID } from "node-appwrite";
import jwt from "jsonwebtoken";
import { CLIENT_TOKEN, DATABASE_ID, JWT_SECRET_CLIENT, OTP_COLLECTION, USERS_COLLECTION } from "@/lib/constants";

export async function POST(req: NextRequest) {
    const { email, code } = await req.json();

    if (!email || !code) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const otpResult = await databases.listDocuments(DATABASE_ID, OTP_COLLECTION, [
        Query.equal("email", email),
        Query.equal("code", code),
    ]);

    const otp = otpResult.documents[0];

    if (!otp) {
        return NextResponse.json({ error: "Invalid code" }, { status: 401 });
    }

    const createdAt = new Date(otp.$createdAt).getTime();
    const now = Date.now();

    if (now - createdAt > 15 * 60 * 1000) {
        return NextResponse.json({ error: "Code expired" }, { status: 401 });
    }

    await databases.deleteDocument(DATABASE_ID, OTP_COLLECTION, otp.$id);

    const usersResult = await databases.listDocuments(DATABASE_ID, USERS_COLLECTION, [
        Query.equal("email", email),
    ]);

    let user = usersResult.documents[0];

    if (!user) {
        user = await databases.createDocument(
            DATABASE_ID,
            USERS_COLLECTION,
            ID.unique(),
            {
                email,
            }
        );
    }

    const userData = { $id: user.$id };
    const token = jwt.sign(userData, JWT_SECRET_CLIENT, { expiresIn: "7d" });

    const res = NextResponse.json(
        { success: true, member: userData },
        { status: 200 }
    );

    res.cookies.set({
        name: CLIENT_TOKEN,
        value: token,
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
    });

    return res;
}
