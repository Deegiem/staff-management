// import { NextRequest, NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
// import { comparePassword } from "@/lib/auth/hash";
// import { signAccessToken, signRefreshToken } from "@/lib/auth/jwt";
// import { createSession } from "@/lib/auth/session";

// // Cookie helper
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
//     const body = await req.json();
//     const { email, password } = body;

//     if (!email || !password) {
//       return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
//     }

//     // Find staff by email - INCLUDE THE ROLE RELATION
//     const staff = await prisma.staff.findUnique({ 
//       where: { email },
//       include: {
//         role: true // Include the role relation
//       }
//     });
    
//     if (!staff || !staff.passwordHash) {
//       return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
//     }

//     // Compare password
//     const isValid = await comparePassword(password, staff.passwordHash);
//     if (!isValid) {
//       return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
//     }

//     // Check if active - THIS IS CORRECT
//     if (staff.status !== "ACTIVE") {
//       return NextResponse.json({ error: "Account is inactive." }, { status: 403 });
//     }

//     // Generate JWT tokens - FIXED: Access role name from relation
//     const accessToken = signAccessToken({ 
//       staffId: staff.id, 
//       role: staff.role.name // Access the role name
//     });
//     const refreshToken = signRefreshToken({ staffId: staff.id });

//     // Calculate expiry
//     const refreshExpires = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000); // 30 days

//     // Create session
//     await createSession(staff.id, refreshToken, refreshExpires);

//     // Set cookies
//     const res = NextResponse.json({
//       message: "Login successful",
//       staff: {
//         id: staff.id,
//         email: staff.email,
//         firstName: staff.firstName,
//         lastName: staff.lastName,
//         role: staff.role.name, // Access the role name
//       },
//     });

//     setCookie(res, "access_token", accessToken, 60 * 60); // 1 hour
//     setCookie(res, "refresh_token", refreshToken, 1 * 24 * 60 * 60); // 30 days

//     return res;
//   } catch (error) {
//     console.error("Login Error:", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }



// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { comparePassword } from "@/lib/auth/hash";
import { signAccessToken, signRefreshToken, ACCESS_COOKIE_MAX_AGE, REFRESH_COOKIE_MAX_AGE } from "@/lib/auth/jwt";
import { createSession } from "@/lib/auth/session";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    // Fetch staff along with role
    const staff = await prisma.staff.findUnique({
      where: { email },
      include: { role: true },
    });

    if (!staff || !staff.passwordHash) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    // Verify password
    const isValid = await comparePassword(password, staff.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    // Check if staff account is active
    if (staff.status !== "ACTIVE") {
      return NextResponse.json({ error: "Account is inactive." }, { status: 403 });
    }

    // Generate unique session ID
    const sessionId = uuidv4();

    // Generate JWT tokens
    const accessToken = signAccessToken({ staffId: staff.id, role: staff.role?.name ?? "" });
    const refreshToken = signRefreshToken({ staffId: staff.id, sessionId });

    // Calculate session expiration date based on refresh token max age
    const expiresAt = new Date(Date.now() + REFRESH_COOKIE_MAX_AGE * 1000);

    // Persist session in DB (correct parameter order)
    await createSession(staff.id, sessionId, expiresAt, refreshToken);

    // Prepare response
    const res = NextResponse.json({
      message: "Login successful",
      staff: {
        id: staff.id,
        email: staff.email,
        firstName: staff.firstName,
        lastName: staff.lastName,
        role: staff.role?.name ?? null,
      },
    });

    // Set HttpOnly cookies using cookies.set()
    res.cookies.set({
      name: "access_token",
      value: accessToken,
      httpOnly: true,
      path: "/",
      maxAge: ACCESS_COOKIE_MAX_AGE,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    res.cookies.set({
      name: "refresh_token",
      value: refreshToken,
      httpOnly: true,
      path: "/",
      maxAge: REFRESH_COOKIE_MAX_AGE,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return res;
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}