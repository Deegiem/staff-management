// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAccessToken } from "@/lib/auth/jwt";

export async function middleware(req: NextRequest) {
  // Define public routes that do not need auth
  const PUBLIC_PATHS = ["/api/auth/login", "/api/auth/bootstrap", "/api/auth/forgot-password", "/api/auth/reset-password", "/api/auth/create-password"];
  
  if (PUBLIC_PATHS.some((path) => req.nextUrl.pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const accessToken = req.cookies.get("access_token")?.value;
  if (!accessToken) {
    return NextResponse.json({ error: "Access token is missing" }, { status: 401 });
  }

  let payload: any;
  try {
    payload = verifyAccessToken(accessToken);
  } catch (err) {
    return NextResponse.json({ error: "Invalid or expired access token" }, { status: 401 });
  }

  // Check staff existence and active status
  const staff = await prisma.staff.findUnique({ 
    where: { id: payload.staffId },
    include: { role: true }
  });
  
  if (!staff || staff.status !== "ACTIVE") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  // Create audit log for sensitive operations (excluding GET requests)
  if (req.method !== "GET") {
    try {
      await prisma.auditLog.create({
        data: {
          action: `${req.method} ${req.nextUrl.pathname}`,
          actorId: staff.id,
          entity: "API Request",
          entityId: req.nextUrl.pathname,
          ipAddress: req.ip || req.headers.get('x-forwarded-for') || 'unknown',
          userAgent: req.headers.get('user-agent') || 'unknown',
          newData: {
            method: req.method,
            path: req.nextUrl.pathname,
            query: Object.fromEntries(req.nextUrl.searchParams),
            timestamp: new Date().toISOString()
          }
        }
      });
    } catch (error) {
      console.error("Audit log creation failed:", error);
      // Don't block request if audit logging fails
    }
  }

  // Attach staff info to request for later use
  const response = NextResponse.next();
  (response as any).staff = staff;

  return response;
}