// src/app/api/auth/create-password/route.ts
import { NextRequest, NextResponse } from "next/server";
import { consumeVerificationToken } from "@/lib/auth/tokens";
import { hashPassword } from "@/lib/auth/hash";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json({ error: "Token and password required" }, { status: 400 });
    }

    const verification = await consumeVerificationToken(token);
    if (!verification || verification.type !== "FIRST_LOGIN") {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);

    // FIXED: Use status field instead of isActive
    await prisma.staff.update({
      where: { id: verification.staffId },
      data: { 
        passwordHash: hashedPassword, 
        status: "ACTIVE" // Use the enum value
      },
    });

    return NextResponse.json({ message: "Password set successfully, you can now login." });
  } catch (error) {
    console.error("Create Password Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}