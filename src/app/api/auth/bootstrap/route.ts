// src/app/api/auth/bootstrap/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/auth/hash";
import { sendMail } from "@/utils/mail";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, firstName, lastName } = body;

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: "All fields (email, password, firstName, lastName) are required." },
        { status: 400 }
      );
    }

    // First, ensure the ADMIN role exists
    let adminRole = await prisma.role.findFirst({
      where: { name: "ADMIN" }
    });

    if (!adminRole) {
      // Create ADMIN role if it doesn't exist
      adminRole = await prisma.role.create({
        data: {
          name: "ADMIN",
          description: "System Administrator"
        }
      });
    }

    // Also create a default department if needed
    let defaultDept = await prisma.department.findFirst({
      where: { name: "Administration" }
    });

    if (!defaultDept) {
      defaultDept = await prisma.department.create({
        data: {
          name: "Administration",
          description: "System Administration Department"
        }
      });
    }

    // Check if admin staff exists
    const existingAdmin = await prisma.staff.findFirst({
      where: { 
        role: {
          name: "ADMIN"
        }
      },
    });

    if (existingAdmin) {
      return NextResponse.json(
        { error: "Admin already exists. Bootstrap can only run once." },
        { status: 403 }
      );
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create admin staff - FIXED: Use relation fields correctly
    const admin = await prisma.staff.create({
      data: {
        email,
        firstName,
        lastName,
        passwordHash: hashedPassword,
        roleId: adminRole.id, // Use roleId instead of role
        departmentId: defaultDept.id, // Add required departmentId
        employmentType: "FULL_TIME", // Add required field
        status: "ACTIVE", // Add required field
        dateOfHire: new Date(), // Add required field
      },
      include: {
        role: true, // Include role details in response
        department: true
      }
    });

    // Optional: send welcome email (dev mode will preview)
    const mailRes = await sendMail({
      to: email,
      subject: "Welcome Admin",
      html: `<p>Hello ${firstName},</p><p>Your admin account has been created.</p>`,
    });

    const responsePayload: any = {
      message: "Admin account successfully created.",
      admin: {
        id: admin.id,
        email: admin.email,
        firstName: admin.firstName,
        lastName: admin.lastName,
        role: admin.role.name, // Get role name from relation
      },
    };

    if (process.env.DEV_EMAIL_MODE === "true") {
      responsePayload.devMail = mailRes;
    }

    return NextResponse.json(responsePayload);
  } catch (error) {
    console.error("Bootstrap Admin Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}