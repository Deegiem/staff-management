// src/lib/auth/current-staff.ts
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAccessToken } from "@/lib/auth/jwt";
import { parse } from "cookie";

export async function getCurrentStaff(req: NextRequest) {
  try {
    const cookies = parse(req.headers.get("cookie") || "");
    const token = cookies.access_token;

    if (!token) return null;

    const payload = verifyAccessToken(token) as { staffId: string };
    const staff = await prisma.staff.findUnique({
      where: { id: payload.staffId },
      include: {
        role: { select: { name: true } }
      }
    });

    return staff && staff.status === "ACTIVE" ? staff : null;
  } catch (error) {
    return null;
  }
}