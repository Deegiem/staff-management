import { NextRequest, NextResponse } from "next/server";
import { revokeSession } from "@/lib/auth/session";

export async function POST(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get("refresh_token")?.value;

    if (refreshToken) {
      try {
        await revokeSession(refreshToken);
      } catch (error) {
        console.error("Error revoking session:", error);
        // Continue with logout even if session revocation fails
      }
    }

    const res = NextResponse.json({ 
      message: "Logged out successfully" 
    });

    // Clear cookies more reliably
    const cookieOptions = {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      maxAge: 0,
      expires: new Date(0) // Set expiration to past date
    };

    res.cookies.set({
      name: "access_token",
      value: "",
      ...cookieOptions
    });

    res.cookies.set({
      name: "refresh_token", 
      value: "",
      ...cookieOptions
    });

    return res;
  } catch (error) {
    console.error("Logout Error:", error);
    return NextResponse.json({ 
      error: "Internal Server Error" 
    }, { status: 500 });
  }
}