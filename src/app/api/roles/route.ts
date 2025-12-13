// src/app/api/roles/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentStaff } from "@/lib/auth/current-staff";

export async function GET(req: NextRequest) {
  try {
    const currentStaff = await getCurrentStaff(req);
    
    if (!currentStaff) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const roles = await prisma.role.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        description: true,
        baseSalary: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return NextResponse.json({
      success: true,
      data: roles
    });

  } catch (error) {
    console.error("Get Roles Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const currentStaff = await getCurrentStaff(req);
    
    if (!currentStaff) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Only ADMIN can create roles
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

    // Check if role already exists
    const existingRole = await prisma.role.findUnique({
      where: { name }
    });

    if (existingRole) {
      return NextResponse.json(
        { success: false, error: "Role already exists" },
        { status: 409 }
      );
    }

    const role = await prisma.role.create({
      data: {
        name,
        description,
        baseSalary: baseSalary ? parseFloat(baseSalary) : null
      }
    });

    return NextResponse.json({
      success: true,
      data: role,
      message: "Role created successfully"
    }, { status: 201 });

  } catch (error) {
    console.error("Create Role Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}