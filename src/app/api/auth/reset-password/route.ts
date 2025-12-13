// src/app/api/auth/reset-password/route.ts
import { NextRequest, NextResponse } from "next/server";
import { consumeVerificationToken } from "@/lib/auth/tokens";
import { hashPassword } from "@/lib/auth/hash";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) return NextResponse.json({ error: "Token and password required" }, { status: 400 });

    const verification = await consumeVerificationToken(token);
    if (!verification || verification.type !== "PASSWORD_RESET") {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);

    // Update staff password
    await prisma.staff.update({
      where: { id: verification.staffId },
      data: { passwordHash: hashedPassword },
    });

    // Optionally revoke sessions for the user (implement revoke by staffId)
    await prisma.session.updateMany({ where: { staffId: verification.staffId }, data: { revoked: true } });

    return NextResponse.json({ message: "Password reset successfully. Please login." });
  } catch (error) {
    console.error("Reset Password Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
