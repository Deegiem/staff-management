// src/app/api/roles/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentStaff } from "@/lib/auth/current-staff";

export async function GET(
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

    const role = await prisma.role.findUnique({
      where: { id },
      include: {
        staff: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
          take: 10,
        },
      },
    });

    if (!role) {
      return NextResponse.json(
        { success: false, error: "Role not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: role
    });

  } catch (error) {
    console.error("Get Role Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
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

    // Only ADMIN can update roles
    if (currentStaff.role.name !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Access denied" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, description, baseSalary } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: "Role name is required" },
        { status: 400 }
      );
    }

    const role = await prisma.role.update({
      where: { id },
      data: {
        name,
        description,
        baseSalary: baseSalary ? parseFloat(baseSalary) : null
      }
    });

    return NextResponse.json({
      success: true,
      data: role,
      message: "Role updated successfully"
    });

  } catch (error) {
    console.error("Update Role Error:", error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: "Role not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    // Only ADMIN can delete roles
    if (currentStaff.role.name !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Access denied" },
        { status: 403 }
      );
    }

    // Check if role has staff
    const roleWithStaff = await prisma.role.findUnique({
      where: { id },
      include: {
        staff: {
          select: { id: true },
          take: 1,
        },
      },
    });

    if (roleWithStaff && roleWithStaff.staff.length > 0) {
      return NextResponse.json(
        { success: false, error: "Cannot delete role with assigned staff" },
        { status: 400 }
      );
    }

    await prisma.role.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: "Role deleted successfully"
    });

  } catch (error) {
    console.error("Delete Role Error:", error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: "Role not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}