import nodemailer from "nodemailer";
import { ID, Query } from "node-appwrite";
import { NextRequest, NextResponse } from "next/server";
import { databases } from "@/lib/appwrite";
import { DATABASE_ID, OTP_COLLECTION, USER_APP_PASSWORD, USER_EMAIL } from "@/lib/constants";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: USER_EMAIL,
        pass: USER_APP_PASSWORD,
    },
});

export async function POST(req: NextRequest) {
    const { email } = await req.json();

    if (!email) {
        return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const code = Math.floor(10000 + Math.random() * 90000).toString();

    const oldOtps = await databases.listDocuments(DATABASE_ID, OTP_COLLECTION, [
        Query.equal("email", email),
    ]);

    await Promise.all(
        oldOtps.documents.map(doc =>
            databases.deleteDocument(DATABASE_ID, OTP_COLLECTION, doc.$id)
        )
    );

    await databases.createDocument(DATABASE_ID, OTP_COLLECTION, ID.unique(), {
        email,
        code,
    });

    await transporter.sendMail({
        from: process.env.NEXT_PUBLIC_EMAIL_FROM,
        to: email,
        subject: "✨ Your Login Code is Here!",
        html: `
        <div style="
            font-family: Arial, sans-serif; 
            text-align: center; 
            padding: 30px; 
            background-color: #f9f9f9;
            border-radius: 10px;
        ">
            <h2 style="color: #4CAF50;">Welcome Back!</h2>
            <p style="font-size: 16px; color: #333;">
                Use the code below to log in. It's quick, easy, and safe!
            </p>
            <p style="
                font-size: 28px; 
                font-weight: bold; 
                color: white; 
                background-color: black; 
                display: inline-block; 
                padding: 15px 25px; 
                border-radius: 8px;
                letter-spacing: 2px;
            ">
                ${code}
            </p>
            <p style="font-size: 14px; color: #777; margin-top: 20px;">
                This code will expire in 15 minutes.
            </p>
        </div>
        `,
    });

    return NextResponse.json({ success: true }, { status: 200 });
}
