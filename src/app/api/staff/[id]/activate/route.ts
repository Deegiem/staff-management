// src/app/api/staff/[id]/activate/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentStaff } from "@/lib/auth/current-staff";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params first
    const { id } = await params;

    const currentStaff = await getCurrentStaff(req);
    
    if (!currentStaff) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Only ADMIN and HR can activate staff
    const isAdminOrHR = currentStaff.role.name === "ADMIN" || currentStaff.role.name === "HR";
    if (!isAdminOrHR) {
      return NextResponse.json(
        { success: false, error: "Access denied" },
        { status: 403 }
      );
    }

    // Check if staff exists
    const existingStaff = await prisma.staff.findUnique({
      where: { id }
    });

    if (!existingStaff) {
      return NextResponse.json(
        { success: false, error: "Staff not found" },
        { status: 404 }
      );
    }

    // Reactivate staff
    const activatedStaff = await prisma.staff.update({
      where: { id },
      data: { 
        status: "ACTIVE",
        dateOfExit: null
      },
      include: {
        role: { select: { name: true } },
        department: { select: { name: true } }
      }
    });

    // Remove sensitive data
    const { passwordHash, ...safeStaff } = activatedStaff;

    return NextResponse.json({
      success: true,
      data: safeStaff,
      message: "Staff activated successfully"
    });

  } catch (error) {
    console.error("Activate Staff Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}