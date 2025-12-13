// src/app/api/auth/forgot-password/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createVerificationToken } from "@/lib/auth/tokens";
import { sendPasswordResetEmail } from "@/utils/mail";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const staff = await prisma.staff.findUnique({ 
      where: { email },
      select: { id: true, email: true, firstName: true, status: true } // Only select needed fields
    });

    // Security: Always show generic message regardless of email existence
    const genericMessage = "If the email exists, a reset link has been sent.";

    // Only proceed if staff exists AND is active
    if (!staff || staff.status !== "ACTIVE") {
      if (process.env.DEV_EMAIL_MODE === "true") {
        return NextResponse.json({ 
          error: staff ? "Account is inactive" : "Email does not exist" 
        }, { status: 404 });
      } else {
        return NextResponse.json({ message: genericMessage });
      }
    }

    // Create verification token
    const tokenExpiryHours = Number(process.env.PASSWORD_RESET_TOKEN_HOURS) || 2;
    const token = await createVerificationToken(
      staff.id, 
      "PASSWORD_RESET", 
      tokenExpiryHours
    );

    // Generate reset link
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const resetLink = `${appUrl}/auth/reset-password?token=${token.token}`;

    // Send email (dev-mode handled inside)
    const mailRes = await sendPasswordResetEmail(staff.email, staff.firstName, resetLink);

    // Prepare response
    const payload: any = { message: genericMessage };
    
    if (process.env.DEV_EMAIL_MODE === "true") {
      payload.devResetLink = resetLink;
      payload.mailPreview = mailRes;
      payload.tokenExpiry = `${tokenExpiryHours} hours`;
    }

    return NextResponse.json(payload);
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return NextResponse.json({ 
      error: "Internal Server Error" 
    }, { status: 500 });
  }
}