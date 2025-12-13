// // Old/existing 
// import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma";

// // To get the detail of a single staff
// export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
//   const { id } = await params;
//   const staffId = Number(id);

//   if (isNaN(staffId))
//      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

//   const staff = await prisma.staff.findUnique({ where: { id: staffId } });

//   if (!staff) 
//     return NextResponse.json({ error: "Staff not found" }, { status: 404 });

//   return NextResponse.json(staff);
// }

// // To update detail of staff
// export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
//   const { id } = await params;
//   const staffId = Number(id);
//   const body = await req.json();

//   const updatedStaff = await prisma.staff.update({
//     where: { id: staffId },
//     data: body,
//   });

//   return NextResponse.json(updatedStaff);
// }

// // To delete a staff from records
// export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
//   const { id } = await params;
//   const staffId = Number(id);

//   await prisma.staff.delete({ where: { id: staffId } });

//   return NextResponse.json({ message: "Staff deleted successfully" });
// }


// //New 

// // src/app/api/staff/[id]/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
// import { getCurrentStaff } from "@/lib/auth/current-staff";

// export async function GET(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const currentStaff = await getCurrentStaff(req);
    
//     if (!currentStaff) {
//       return NextResponse.json(
//         { success: false, error: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     // Check permissions - only allow viewing own data unless ADMIN/HR
//     const isAdminOrHR = currentStaff.role.name === "ADMIN" || currentStaff.role.name === "HR";
//     if (!isAdminOrHR && currentStaff.id !== params.id) {
//       return NextResponse.json(
//         { success: false, error: "Access denied" },
//         { status: 403 }
//       );
//     }

//     const staff = await prisma.staff.findUnique({
//       where: { id: params.id },
//       include: {
//         role: {
//           select: { id: true, name: true, description: true, baseSalary: true }
//         },
//         department: {
//           select: { id: true, name: true, description: true }
//         },
//         attendanceRecords: {
//           take: 10,
//           orderBy: { date: 'desc' },
//           select: {
//             id: true,
//             date: true,
//             clockIn: true,
//             clockOut: true,
//             hoursWorked: true,
//             status: true
//           }
//         },
//         leaves: {
//           take: 5,
//           orderBy: { createdAt: 'desc' },
//           select: {
//             id: true,
//             type: true,
//             startDate: true,
//             endDate: true,
//             status: true,
//             createdAt: true
//           }
//         }
//       }
//     });

//     if (!staff) {
//       return NextResponse.json(
//         { success: false, error: "Staff not found" },
//         { status: 404 }
//       );
//     }

//     // Remove sensitive data
//     const { passwordHash, ...safeStaff } = staff;

//     return NextResponse.json({
//       success: true,
//       data: safeStaff
//     });

//   } catch (error) {
//     console.error("Get Staff by ID Error:", error);
//     return NextResponse.json(
//       { success: false, error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }


// // Continue in src/app/api/staff/[id]/route.ts
// export async function PUT(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const currentStaff = await getCurrentStaff(req);
    
//     if (!currentStaff) {
//       return NextResponse.json(
//         { success: false, error: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     // Only ADMIN and HR can update other staff members
//     const isAdminOrHR = currentStaff.role.name === "ADMIN" || currentStaff.role.name === "HR";
//     if (!isAdminOrHR && currentStaff.id !== params.id) {
//       return NextResponse.json(
//         { success: false, error: "Access denied" },
//         { status: 403 }
//       );
//     }

//     const body = await req.json();
//     const {
//       firstName,
//       lastName,
//       phone,
//       roleId,
//       departmentId,
//       employmentType,
//       status,
//       dateOfExit,
//       profilePhoto
//     } = body;

//     // Check if staff exists
//     const existingStaff = await prisma.staff.findUnique({
//       where: { id: params.id }
//     });

//     if (!existingStaff) {
//       return NextResponse.json(
//         { success: false, error: "Staff not found" },
//         { status: 404 }
//       );
//     }

//     // Permission checks
//     if (currentStaff.id === params.id) {
//       // Staff cannot update their own role, department, or status
//       if (roleId || departmentId || status) {
//         return NextResponse.json(
//           { success: false, error: "Cannot update your own role, department, or status" },
//           { status: 403 }
//         );
//       }
//     }

//     // Prevent deactivating own account
//     if (status === "INACTIVE" && currentStaff.id === params.id) {
//       return NextResponse.json(
//         { success: false, error: "Cannot deactivate your own account" },
//         { status: 403 }
//       );
//     }

//     // Build update data
//     const updateData: any = {};
//     if (firstName) updateData.firstName = firstName;
//     if (lastName) updateData.lastName = lastName;
//     if (phone !== undefined) updateData.phone = phone;
//     if (roleId && isAdminOrHR) updateData.roleId = roleId;
//     if (departmentId && isAdminOrHR) updateData.departmentId = departmentId;
//     if (employmentType && isAdminOrHR) updateData.employmentType = employmentType;
//     if (status && isAdminOrHR) updateData.status = status;
//     if (dateOfExit !== undefined && isAdminOrHR) updateData.dateOfExit = dateOfExit ? new Date(dateOfExit) : null;
//     if (profilePhoto !== undefined) updateData.profilePhoto = profilePhoto;

//     const updatedStaff = await prisma.staff.update({
//       where: { id: params.id },
//       data: updateData,
//       include: {
//         role: { select: { name: true } },
//         department: { select: { name: true } }
//       }
//     });

//     // Remove sensitive data
//     const { passwordHash, ...safeStaff } = updatedStaff;

//     return NextResponse.json({
//       success: true,
//       data: safeStaff,
//       message: "Staff updated successfully"
//     });

//   } catch (error) {
//     console.error("Update Staff Error:", error);
//     return NextResponse.json(
//       { success: false, error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }


// // Continue in src/app/api/staff/[id]/route.ts
// export async function DELETE(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const currentStaff = await getCurrentStaff(req);
    
//     if (!currentStaff) {
//       return NextResponse.json(
//         { success: false, error: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     // Only ADMIN and HR can deactivate staff
//     const isAdminOrHR = currentStaff.role.name === "ADMIN" || currentStaff.role.name === "HR";
//     if (!isAdminOrHR) {
//       return NextResponse.json(
//         { success: false, error: "Access denied" },
//         { status: 403 }
//       );
//     }

//     // Prevent deactivating own account
//     if (currentStaff.id === params.id) {
//       return NextResponse.json(
//         { success: false, error: "Cannot deactivate your own account" },
//         { status: 403 }
//       );
//     }

//     // Check if staff exists
//     const existingStaff = await prisma.staff.findUnique({
//       where: { id: params.id }
//     });

//     if (!existingStaff) {
//       return NextResponse.json(
//         { success: false, error: "Staff not found" },
//         { status: 404 }
//       );
//     }

//     // Soft delete - set status to INACTIVE
//     const deactivatedStaff = await prisma.staff.update({
//       where: { id: params.id },
//       data: { 
//         status: "INACTIVE",
//         dateOfExit: new Date()
//       },
//       include: {
//         role: { select: { name: true } },
//         department: { select: { name: true } }
//       }
//     });

//     // Remove sensitive data
//     const { passwordHash, ...safeStaff } = deactivatedStaff;

//     return NextResponse.json({
//       success: true,
//       data: safeStaff,
//       message: "Staff deactivated successfully"
//     });

//   } catch (error) {
//     console.error("Deactivate Staff Error:", error);
//     return NextResponse.json(
//       { success: false, error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }



// // src/app/api/staff/[id]/activate/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
// import { getCurrentStaff } from "@/lib/auth/current-staff";

// export async function POST(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const currentStaff = await getCurrentStaff(req);
    
//     if (!currentStaff) {
//       return NextResponse.json(
//         { success: false, error: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     // Only ADMIN and HR can activate staff
//     const isAdminOrHR = currentStaff.role.name === "ADMIN" || currentStaff.role.name === "HR";
//     if (!isAdminOrHR) {
//       return NextResponse.json(
//         { success: false, error: "Access denied" },
//         { status: 403 }
//       );
//     }

//     // Check if staff exists
//     const existingStaff = await prisma.staff.findUnique({
//       where: { id: params.id }
//     });

//     if (!existingStaff) {
//       return NextResponse.json(
//         { success: false, error: "Staff not found" },
//         { status: 404 }
//       );
//     }

//     // Reactivate staff
//     const activatedStaff = await prisma.staff.update({
//       where: { id: params.id },
//       data: { 
//         status: "ACTIVE",
//         dateOfExit: null // Clear exit date
//       },
//       include: {
//         role: { select: { name: true } },
//         department: { select: { name: true } }
//       }
//     });

//     // Remove sensitive data
//     const { passwordHash, ...safeStaff } = activatedStaff;

//     return NextResponse.json({
//       success: true,
//       data: safeStaff,
//       message: "Staff activated successfully"
//     });

//   } catch (error) {
//     console.error("Activate Staff Error:", error);
//     return NextResponse.json(
//       { success: false, error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }







// src/app/api/staff/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentStaff } from "@/lib/auth/current-staff";

// GET - Get specific staff member (merged)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // params is now a Promise
) {
  try {
    // Use the string ID directly (fix old version's Number conversion)
    const staffId = params.id;

    const currentStaff = await getCurrentStaff(req);
    
    if (!currentStaff) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check permissions - only allow viewing own data unless ADMIN/HR
    const isAdminOrHR = currentStaff.role.name === "ADMIN" || currentStaff.role.name === "HR";
    if (!isAdminOrHR && currentStaff.id !== staffId) {
      return NextResponse.json(
        { success: false, error: "Access denied" },
        { status: 403 }
      );
    }

    const staff = await prisma.staff.findUnique({
      where: { id: staffId },
      include: {
        role: {
          select: { id: true, name: true, description: true, baseSalary: true }
        },
        department: {
          select: { id: true, name: true, description: true }
        },
        attendanceRecords: {
          take: 10,
          orderBy: { date: 'desc' },
          select: {
            id: true,
            date: true,
            clockIn: true,
            clockOut: true,
            hoursWorked: true,
            status: true
          }
        },
        leaves: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            type: true,
            startDate: true,
            endDate: true,
            status: true,
            createdAt: true
          }
        }
      }
    });

    if (!staff) {
      return NextResponse.json(
        { success: false, error: "Staff not found" },
        { status: 404 }
      );
    }

    // Remove sensitive data
    const { passwordHash, ...safeStaff } = staff;

    return NextResponse.json({
      success: true,
      data: safeStaff
    });

  } catch (error) {
    console.error("Get Staff by ID Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PUT - Update staff member (merged with validation)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const staffId = id;
    const currentStaff = await getCurrentStaff(req);
    
    if (!currentStaff) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Only ADMIN and HR can update other staff members
    const isAdminOrHR = currentStaff.role.name === "ADMIN" || currentStaff.role.name === "HR";
    if (!isAdminOrHR && currentStaff.id !== staffId) {
      return NextResponse.json(
        { success: false, error: "Access denied" },
        { status: 403 }
      );
    }

    const body = await req.json();

    // Check if staff exists
    const existingStaff = await prisma.staff.findUnique({
      where: { id: staffId }
    });

    if (!existingStaff) {
      return NextResponse.json(
        { success: false, error: "Staff not found" },
        { status: 404 }
      );
    }

    // Extract allowed fields (from new version with validation)
    const {
      firstName,
      lastName,
      email,
      phone,
      roleId,
      departmentId,
      employmentType,
      status,
      dateOfExit,
      profilePhoto
    } = body;

    // Permission checks (from new version)
    if (currentStaff.id === staffId) {
      // Staff cannot update their own role, department, or status
      if (roleId || departmentId || status) {
        return NextResponse.json(
          { success: false, error: "Cannot update your own role, department, or status" },
          { status: 403 }
        );
      }
    }

    // Prevent deactivating own account
    if (status === "INACTIVE" && currentStaff.id === staffId) {
      return NextResponse.json(
        { success: false, error: "Cannot deactivate your own account" },
        { status: 403 }
      );
    }

    // Build update data with validation
    const updateData: any = {};
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (roleId && isAdminOrHR) updateData.roleId = roleId;
    if (departmentId && isAdminOrHR) updateData.departmentId = departmentId;
    if (employmentType && isAdminOrHR) updateData.employmentType = employmentType;
    if (status && isAdminOrHR) updateData.status = status;
    if (dateOfExit !== undefined && isAdminOrHR) {
      updateData.dateOfExit = dateOfExit ? new Date(dateOfExit) : null;
    }
    if (profilePhoto !== undefined) updateData.profilePhoto = profilePhoto;

    // If no valid fields to update
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { success: false, error: "No valid fields to update" },
        { status: 400 }
      );
    }

    const updatedStaff = await prisma.staff.update({
      where: { id: staffId },
      data: updateData,
      include: {
        role: { select: { name: true } },
        department: { select: { name: true } }
      }
    });

    // Remove sensitive data
    const { passwordHash, ...safeStaff } = updatedStaff;

    return NextResponse.json({
      success: true,
      data: safeStaff,
      message: "Staff updated successfully"
    });

  } catch (error) {
    console.error("Update Staff Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE - Deactivate staff (SOFT DELETE - from new version)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {

    const { id } = await params;
    const staffId = id;
    
    const currentStaff = await getCurrentStaff(req);
    
    if (!currentStaff) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Only ADMIN and HR can deactivate staff
    const isAdminOrHR = currentStaff.role.name === "ADMIN" || currentStaff.role.name === "HR";
    if (!isAdminOrHR) {
      return NextResponse.json(
        { success: false, error: "Access denied" },
        { status: 403 }
      );
    }

    // Prevent deactivating own account
    if (currentStaff.id === staffId) {
      return NextResponse.json(
        { success: false, error: "Cannot deactivate your own account" },
        { status: 403 }
      );
    }

    // Check if staff exists
    const existingStaff = await prisma.staff.findUnique({
      where: { id: staffId }
    });

    if (!existingStaff) {
      return NextResponse.json(
        { success: false, error: "Staff not found" },
        { status: 404 }
      );
    }

    // SOFT DELETE - set status to INACTIVE (not hard delete like old version)
    const deactivatedStaff = await prisma.staff.update({
      where: { id: staffId },
      data: { 
        status: "INACTIVE",
        dateOfExit: new Date()
      },
      include: {
        role: { select: { name: true } },
        department: { select: { name: true } }
      }
    });

    // Remove sensitive data
    const { passwordHash, ...safeStaff } = deactivatedStaff;

    return NextResponse.json({
      success: true,
      data: safeStaff,
      message: "Staff deactivated successfully"
    });

  } catch (error) {
    console.error("Deactivate Staff Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}