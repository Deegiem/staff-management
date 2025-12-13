// import { NextRequest, NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
// import { verifyRefreshToken, signAccessToken, signRefreshToken } from "@/lib/auth/jwt";
// import { createSession, revokeSession } from "@/lib/auth/session";

// // Helper to set cookies
// const setCookie = (res: NextResponse, name: string, value: string, maxAge: number) => {
//   res.cookies.set({
//     name,
//     value,
//     httpOnly: true,
//     path: "/",
//     maxAge,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "lax",
//   });
// };

// export async function POST(req: NextRequest) {
//   try {
//     const refreshToken = req.cookies.get("refresh_token")?.value;

//     if (!refreshToken) {
//       return NextResponse.json({ error: "Refresh token missing." }, { status: 401 });
//     }

//     let payload: any;
//     try {
//       payload = verifyRefreshToken(refreshToken);
//     } catch (err) {
//       return NextResponse.json({ error: "Invalid refresh token." }, { status: 401 });
//     }

//     // Check session in DB
//     const session = await prisma.session.findUnique({
//       where: { refreshToken },
//     });

//     if (!session || session.revoked || session.expiresAt < new Date()) {
//       return NextResponse.json({ error: "Session invalid or expired." }, { status: 401 });
//     }

//     // Fetch staff with role relation - FIXED: Include role and use status instead of isActive
//     const staff = await prisma.staff.findUnique({ 
//       where: { id: payload.staffId },
//       include: {
//         role: {
//           select: {
//             name: true
//           }
//         }
//       }
//     });

//     // FIXED: Use status field instead of isActive
//     if (!staff || staff.status !== "ACTIVE") {
//       return NextResponse.json({ error: "Staff not found or inactive." }, { status: 401 });
//     }

//     // Revoke old session
//     await revokeSession(refreshToken);

//     // Generate new tokens - FIXED: Access role name from relation
//     const newAccessToken = signAccessToken({ 
//       staffId: staff.id, 
//       role: staff.role.name // Access role name
//     });
//     const newRefreshToken = signRefreshToken({ staffId: staff.id });
//     const refreshExpires = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000); // 7 days

//     // Create new session
//     await createSession(staff.id, newRefreshToken, refreshExpires);

//     // Return new tokens via HttpOnly cookies
//     const res = NextResponse.json({
//       message: "Tokens refreshed successfully",
//       staff: {
//         id: staff.id,
//         email: staff.email,
//         firstName: staff.firstName,
//         lastName: staff.lastName,
//         role: staff.role.name, // Access role name
//       },
//     });

//     setCookie(res, "access_token", newAccessToken, 60 * 60); // 15 min
//     setCookie(res, "refresh_token", newRefreshToken, 1 * 24 * 60 * 60); // 7 days

//     return res;
//   } catch (error) {
//     console.error("Refresh Token Error:", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }


// app/api/auth/refresh/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyRefreshToken, signAccessToken, signRefreshToken, ACCESS_COOKIE_MAX_AGE, REFRESH_COOKIE_MAX_AGE } from "@/lib/auth/jwt";
import { getSessionById, rotateSession } from "@/lib/auth/session";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  try {
    const currentRefreshToken = req.cookies.get("refresh_token")?.value;
    if (!currentRefreshToken) {
      return NextResponse.json({ error: "Refresh token missing." }, { status: 401 });
    }

    // Verify token (returns payload or null)
    const payload = verifyRefreshToken(currentRefreshToken);
    if (!payload || !payload.sessionId || !payload.staffId) {
      return NextResponse.json({ error: "Invalid refresh token." }, { status: 401 });
    }

    // Fetch session by refresh token for validation
    const session = await prisma.session.findUnique({
      where: { refreshToken: currentRefreshToken },
    });

    if (!session || session.revoked || new Date(session.expiresAt) < new Date()) {
      return NextResponse.json({ error: "Session invalid or expired." }, { status: 401 });
    }

    // Verify session ID matches
    if (session.id !== payload.sessionId) {
      return NextResponse.json({ error: "Session mismatch." }, { status: 401 });
    }

    // Fetch staff (include role)
    const staff = await prisma.staff.findUnique({
      where: { id: payload.staffId },
      include: {
        role: { select: { name: true } },
      },
    });

    if (!staff || staff.status !== "ACTIVE") {
      return NextResponse.json({ error: "Staff not found or inactive." }, { status: 401 });
    }

    // Rotate session atomically: revoke old session and create a new one
    const newExpiresAt = new Date(Date.now() + REFRESH_COOKIE_MAX_AGE * 1000);
    const newRefreshToken = signRefreshToken({
      staffId: staff.id,
      sessionId: uuidv4()
    });

    const newSessionId = await rotateSession(payload.sessionId, staff.id, newExpiresAt, newRefreshToken);

    // Sign new access token with the new sessionId
    const newAccessToken = signAccessToken({ staffId: staff.id, role: staff.role?.name ?? "" });

    // Prepare response and set cookies
    const res = NextResponse.json({
      message: "Tokens refreshed successfully",
      staff: {
        id: staff.id,
        email: staff.email,
        firstName: staff.firstName,
        lastName: staff.lastName,
        role: staff.role?.name ?? null,
      },
    });

    // Set HttpOnly cookies
    res.cookies.set({
      name: "access_token",
      value: newAccessToken,
      httpOnly: true,
      path: "/",
      maxAge: ACCESS_COOKIE_MAX_AGE,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    res.cookies.set({
      name: "refresh_token",
      value: newRefreshToken,
      httpOnly: true,
      path: "/",
      maxAge: REFRESH_COOKIE_MAX_AGE,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return res;
  } catch (error) {
    console.error("Refresh Token Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}