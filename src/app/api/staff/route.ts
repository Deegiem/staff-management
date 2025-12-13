// // Old/existing
// // src/app/api/staff/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
// import { createVerificationToken } from "@/lib/auth/tokens";
// import { sendMail } from "@/utils/mail";

// const requireAdmin = (role: string) => role === "ADMIN";

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();
//     const { email, firstName, lastName, role, adminRole } = body;

//     if (!requireAdmin(adminRole)) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
//     }

//     if (!email || !firstName || !lastName || !role) {
//       return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
//     }

//     // Create staff inactive
//     const staff = await prisma.staff.create({
//       data: { email, firstName, lastName, role, isActive: false },
//     });

//     // Create FIRST_LOGIN token
//     const tokenRecord = await createVerificationToken(staff.id, "FIRST_LOGIN", Number(process.env.FIRST_TOKEN_EXPIRES_HOURS ?? 48));

//     const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
//     const link = `${appUrl}/auth/create-password?token=${tokenRecord.token}`;

//     // Send email (or dev preview)
//     const mailRes = await sendMail({
//       to: email,
//       subject: "Complete Your Account Setup",
//       html: `<p>Hello ${firstName},</p><p>Click the link to set your password: <a href="${link}">Set Password</a></p>`,
//     });

//     const payload: any = { message: "Staff onboarded successfully", staffId: staff.id };

//     if (process.env.DEV_EMAIL_MODE === "true") {
//       payload.devVerificationLink = link;
//       payload.mailPreview = mailRes;
//     }

//     return NextResponse.json(payload);
//   } catch (error) {
//     console.error("Staff Onboard Error:", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }

// export async function GET() {
//   try {
//     const items = await prisma.staff.findMany({ take: 100 });
//     return NextResponse.json(items);
//   } catch (err) {
//     console.error("Get staff error", err);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }



// import { NextRequest, NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
// import { hashPassword } from "@/lib/auth/hash";
// import { createVerificationToken } from "@/lib/auth/tokens";
// import { sendWelcomeEmail } from "@/utils/mail";






// // New


// // src/app/api/staff/route.ts
// export async function GET(req: NextRequest) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const page = parseInt(searchParams.get('page') || '1');
//     const limit = parseInt(searchParams.get('limit') || '10');
//     const search = searchParams.get('search') || '';
//     const department = searchParams.get('department') || '';
//     const role = searchParams.get('role') || '';
//     const status = searchParams.get('status') || '';

//     const skip = (page - 1) * limit;

//     // Build where clause
//     const where: any = {};

//     if (search) {
//       where.OR = [
//         { firstName: { contains: search, mode: 'insensitive' } },
//         { lastName: { contains: search, mode: 'insensitive' } },
//         { email: { contains: search, mode: 'insensitive' } },
//       ];
//     }

//     if (department) {
//       where.department = { name: department };
//     }

//     if (role) {
//       where.role = { name: role };
//     }

//     if (status) {
//       where.status = status;
//     }

//     // Get staff with relations
//     const [staff, total] = await Promise.all([
//       prisma.staff.findMany({
//         where,
//         skip,
//         take: limit,
//         include: {
//           role: {
//             select: { name: true, description: true }
//           },
//           department: {
//             select: { name: true, description: true }
//           }
//         },
//         orderBy: { createdAt: 'desc' }
//       }),
//       prisma.staff.count({ where })
//     ]);

//     return NextResponse.json({
//       success: true,
//       data: staff,
//       pagination: {
//         page,
//         limit,
//         total,
//         pages: Math.ceil(total / limit)
//       }
//     });

//   } catch (error) {
//     console.error("Get Staff Error:", error);
//     return NextResponse.json(
//       { success: false, error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }







// // Continue in src/app/api/staff/route.ts
// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();
//     const {
//       firstName,
//       lastName,
//       email,
//       phone,
//       roleId,
//       departmentId,
//       employmentType,
//       dateOfHire
//     } = body;

//     // Validation
//     if (!firstName || !lastName || !email || !roleId || !departmentId || !employmentType || !dateOfHire) {
//       return NextResponse.json(
//         { success: false, error: "Missing required fields" },
//         { status: 400 }
//       );
//     }

//     // Check if email already exists
//     const existingStaff = await prisma.staff.findUnique({
//       where: { email }
//     });

//     if (existingStaff) {
//       return NextResponse.json(
//         { success: false, error: "Email already exists" },
//         { status: 409 }
//       );
//     }

//     // Generate temporary password
//     const tempPassword = Math.random().toString(36).slice(-8);
//     const hashedPassword = await hashPassword(tempPassword);

//     // Create staff
//     const staff = await prisma.staff.create({
//       data: {
//         firstName,
//         lastName,
//         email,
//         phone: phone || null,
//         passwordHash: hashedPassword,
//         roleId,
//         departmentId,
//         employmentType,
//         dateOfHire: new Date(dateOfHire),
//         status: "ACTIVE"
//       },
//       include: {
//         role: { select: { name: true } },
//         department: { select: { name: true } }
//       }
//     });

//     // Create verification token for first login
//     const token = await createVerificationToken(staff.id, "FIRST_LOGIN", 24); // 24 hours expiry

//     // Send welcome email
//     const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
//     const setupLink = `${appUrl}/auth/create-password?token=${token.token}`;

//     try {
//       await sendWelcomeEmail(staff.email, staff.firstName, setupLink);
//     } catch (mailError) {
//       console.error("Welcome email failed:", mailError);
//       // Continue even if email fails
//     }

//     // Don't include password hash in response
//     const { passwordHash, ...staffResponse } = staff;

//     return NextResponse.json({
//       success: true,
//       data: staffResponse,
//       message: "Staff created successfully. Welcome email sent."
//     }, { status: 201 });

//   } catch (error) {
//     console.error("Create Staff Error:", error);
//     return NextResponse.json(
//       { success: false, error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }



// src/app/api/staff/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/auth/hash";
import { createVerificationToken } from "@/lib/auth/tokens";
import { sendWelcomeEmail } from "@/utils/mail";
import { getCurrentStaff } from "@/lib/auth/current-staff";

// // GET - List staff with pagination & filtering (Enhanced from new)
// export async function GET(req: NextRequest) {
//   try {
//     const currentStaff = await getCurrentStaff(req);

//     if (!currentStaff) {
//       return NextResponse.json(
//         { success: false, error: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     // Only ADMIN and HR can list all staff
//     const isAdminOrHR = currentStaff.role.name === "ADMIN" || currentStaff.role.name === "HR";
//     if (!isAdminOrHR) {
//       return NextResponse.json(
//         { success: false, error: "Access denied" },
//         { status: 403 }
//       );
//     }

//     const { searchParams } = new URL(req.url);
//     const page = parseInt(searchParams.get('page') || '1');
//     const limit = parseInt(searchParams.get('limit') || '10');
//     const search = searchParams.get('search') || '';
//     const department = searchParams.get('department') || '';
//     const role = searchParams.get('role') || '';
//     const status = searchParams.get('status') || '';

//     const skip = (page - 1) * limit;

//     // Build where clause
//     const where: any = {};

//     if (search && search.trim().length >= 2) {
//       const keyword = search.trim();
//       where.OR = [
//         { firstName: { contains: keyword, mode: 'insensitive' } },
//         { lastName: { contains: keyword, mode: 'insensitive' } },
//         { email: { contains: keyword, mode: 'insensitive' } },
//       ];
//     }

//     if (department) {
//       where.department = { name: department };
//     }

//     if (role) {
//       where.role = { name: role };
//     }

//     if (status) {
//       where.status = status;
//     }

//     // Get staff with relations
//     const [staff, total] = await Promise.all([
//       prisma.staff.findMany({
//         where,
//         skip,
//         take: limit,
//         include: {
//           role: {
//             select: { name: true, description: true }
//           },
//           department: {
//             select: { name: true, description: true }
//           }
//         },
//         orderBy: { createdAt: 'desc' }
//       }),
//       prisma.staff.count({ where })
//     ]);

//     return NextResponse.json({
//       success: true,
//       data: staff,
//       pagination: {
//         page,
//         limit,
//         total,
//         pages: Math.ceil(total / limit)
//       }
//     });

//   } catch (error) {
//     console.error("Get Staff Error:", error);
//     return NextResponse.json(
//       { success: false, error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }

// GET - List staff with pagination & filtering
export async function GET(req: NextRequest) {
  try {
    const currentStaff = await getCurrentStaff(req);

    if (!currentStaff) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Only ADMIN and HR can list all staff
    const isAdminOrHR =
      currentStaff.role.name === "ADMIN" ||
      currentStaff.role.name === "HR";

    if (!isAdminOrHR) {
      return NextResponse.json(
        { success: false, error: "Access denied" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search")?.trim() || "";
    const department = searchParams.get("department") || "";
    const role = searchParams.get("role") || "";
    const status = searchParams.get("status") || "";

    const skip = (page - 1) * limit;

    // WHERE CLAUSE
    const where: any = {};

    if (search !== "") {
      where.OR = [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    if (department) {
      where.department = { name: department };
    }

    if (role) {
      where.role = { name: role };
    }

    if (status) {
      where.status = status;
    }

    const [staff, total] = await Promise.all([
      prisma.staff.findMany({
        where,
        skip,
        take: limit,
        include: {
          role: {
            select: { name: true, description: true },
          },
          department: {
            select: { name: true, description: true },
          },
        },
        orderBy: { createdAt: "desc" },
      }),

      prisma.staff.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: staff,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get Staff Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}



// POST - Create new staff (Merged logic from old and new)
export async function POST(req: NextRequest) {
  try {
    const currentStaff = await getCurrentStaff(req);

    if (!currentStaff) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Only ADMIN and HR can create staff
    const isAdminOrHR = currentStaff.role.name === "ADMIN" || currentStaff.role.name === "HR";
    if (!isAdminOrHR) {
      return NextResponse.json(
        { success: false, error: "Access denied" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      roleId,
      departmentId,
      employmentType,
      dateOfHire
    } = body;

    // Validation (from new)
    if (!firstName || !lastName || !email || !roleId || !departmentId || !employmentType || !dateOfHire) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingStaff = await prisma.staff.findUnique({
      where: { email }
    });

    if (existingStaff) {
      return NextResponse.json(
        { success: false, error: "Email already exists" },
        { status: 409 }
      );
    }

    // Generate temporary password (from new)
    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await hashPassword(tempPassword);

    // Create staff - Use INACTIVE status initially (from old logic)
    const staff = await prisma.staff.create({
      data: {
        firstName,
        lastName,
        email,
        phone: phone || null,
        passwordHash: hashedPassword,
        roleId,
        departmentId,
        employmentType,
        dateOfHire: new Date(dateOfHire),
        status: "INACTIVE" // Staff becomes active after setting password
      },
      include: {
        role: { select: { name: true } },
        department: { select: { name: true } }
      }
    });

    // Create verification token for first login (from both)
    const tokenExpiryHours = Number(process.env.FIRST_TOKEN_EXPIRES_HOURS) || 48;
    const token = await createVerificationToken(staff.id, "FIRST_LOGIN", tokenExpiryHours);

    // Generate setup link
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const setupLink = `${appUrl}/auth/create-password?token=${token.token}`;

    // ✅ ADD THIS LOG - This will show the setup link in your console
    console.log('📧 STAFF SETUP LINK:');
    console.log('For:', `${staff.firstName} ${staff.lastName} (${staff.email})`);
    console.log('Setup Link:', setupLink);
    console.log('Token Expires:', tokenExpiryHours, 'hours');
    console.log('---');

    // Prepare response payload (merged from both)
    const payload: any = {
      success: true,
      data: {
        id: staff.id,
        firstName: staff.firstName,
        lastName: staff.lastName,
        email: staff.email,
        role: staff.role.name,
        department: staff.department.name,
        status: staff.status
      },
      message: "Staff onboarded successfully. Welcome email sent."
    };

    // Send welcome email (from new) or include dev link (from old)
    if (process.env.DEV_EMAIL_MODE === "true") {
      payload.devVerificationLink = setupLink;
      payload.devPreview = {
        to: staff.email,
        subject: "Complete Your Account Setup",
        html: `<p>Hello ${staff.firstName},</p><p>Click the link to set your password: <a href="${setupLink}">Set Password</a></p>`,
      };
    } else {
      try {
        await sendWelcomeEmail(staff.email, staff.firstName, setupLink);
      } catch (mailError) {
        console.error("Welcome email failed:", mailError);
        payload.message = "Staff created but welcome email failed to send.";
      }
    }

    return NextResponse.json(payload, { status: 201 });

  } catch (error) {
    console.error("Create Staff Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}