// src/app/api/departments/route.ts
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

    const departments = await prisma.department.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return NextResponse.json({
      success: true,
      data: departments
    });

  } catch (error) {
    console.error("Get Departments Error:", error);
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

    // Only ADMIN and HR can create departments
    const isAdminOrHR = currentStaff.role.name === "ADMIN" || currentStaff.role.name === "HR";
    if (!isAdminOrHR) {
      return NextResponse.json(
        { success: false, error: "Access denied" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, description } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: "Department name is required" },
        { status: 400 }
      );
    }

    // Check if department already exists
    const existingDepartment = await prisma.department.findUnique({
      where: { name }
    });

    if (existingDepartment) {
      return NextResponse.json(
        { success: false, error: "Department already exists" },
        { status: 409 }
      );
    }

    const department = await prisma.department.create({
      data: {
        name,
        description
      }
    });

    return NextResponse.json({
      success: true,
      data: department,
      message: "Department created successfully"
    }, { status: 201 });

  } catch (error) {
    console.error("Create Department Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}