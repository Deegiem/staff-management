
// // Old/existing
// import { NextRequest, NextResponse } from "next/server";
// import { verifyAccessToken } from "@/lib/auth/jwt";
// import prisma from "@/lib/prisma";
// import { parse } from "cookie";

// export async function GET(req: NextRequest) {
//   try {
//     // Parse cookies
//     const cookies = parse(req.headers.get("cookie") || "");
//     const token = cookies.access_token;

//     if (!token) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     // Verify access token
//     let payload;
//     try {
//       payload = verifyAccessToken(token) as { staffId: string; role: string };
//     } catch (err) {
//       return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
//     }

//     // Fetch staff info from DB - FIXED: Use string ID and include role
//     const staff = await prisma.staff.findUnique({
//       where: { id: payload.staffId }, // ID is already a string
//       include: {
//         role: {
//           select: {
//             name: true
//           }
//         }
//       },
//     });

//     if (!staff) {
//       return NextResponse.json({ error: "Staff not found" }, { status: 404 });
//     }

//     // Format the response to include role name
//     const staffResponse = {
//       id: staff.id,
//       firstName: staff.firstName,
//       lastName: staff.lastName,
//       email: staff.email,
//       role: staff.role.name, // Extract the role name
//     };

//     return NextResponse.json(staffResponse, { status: 200 });
//   } catch (error) {
//     console.error("Staff/me Error:", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }





// // New
// // src/app/api/staff/me/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
// import { getCurrentStaff } from "@/lib/auth/current-staff"; // We'll create this helper

// export async function GET(req: NextRequest) {
//   try {
//     const staff = await getCurrentStaff(req);
    
//     if (!staff) {
//       return NextResponse.json(
//         { success: false, error: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     // Get full staff details with relations
//     const staffWithDetails = await prisma.staff.findUnique({
//       where: { id: staff.id },
//       include: {
//         role: {
//           select: { name: true, description: true, baseSalary: true }
//         },
//         department: {
//           select: { name: true, description: true }
//         }
//       }
//     });

//     if (!staffWithDetails) {
//       return NextResponse.json(
//         { success: false, error: "Staff not found" },
//         { status: 404 }
//       );
//     }

//     // Remove sensitive data
//     const { passwordHash, ...safeStaff } = staffWithDetails;

//     return NextResponse.json({
//       success: true,
//       data: safeStaff
//     });

//   } catch (error) {
//     console.error("Get Current Staff Error:", error);
//     return NextResponse.json(
//       { success: false, error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }


// // src/app/api/staff/me/route.ts
// export async function PUT(req: NextRequest) {
//   try {
//     const staff = await getCurrentStaff(req);
    
//     if (!staff) {
//       return NextResponse.json(
//         { success: false, error: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     const body = await req.json();
//     const { firstName, lastName, phone, profilePhoto } = body;

//     // Only allow certain fields to be updated
//     const updateData: any = {};
//     if (firstName) updateData.firstName = firstName;
//     if (lastName) updateData.lastName = lastName;
//     if (phone !== undefined) updateData.phone = phone;
//     if (profilePhoto !== undefined) updateData.profilePhoto = profilePhoto;

//     const updatedStaff = await prisma.staff.update({
//       where: { id: staff.id },
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
//       message: "Profile updated successfully"
//     });

//   } catch (error) {
//     console.error("Update Profile Error:", error);
//     return NextResponse.json(
//       { success: false, error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }




// src/app/api/staff/me/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentStaff } from "@/lib/auth/current-staff";
import { verifyAccessToken } from "@/lib/auth/jwt";
import { parse } from "cookie";

// Helper function to get staff with fallback methods
async function getAuthenticatedStaff(req: NextRequest) {
  try {
    // First try the new helper method
    const staffFromHelper = await getCurrentStaff(req);
    if (staffFromHelper) return staffFromHelper;
    
    // Fallback to old cookie parsing method if helper fails
    const cookies = parse(req.headers.get("cookie") || "");
    const token = cookies.access_token;

    if (!token) return null;

    const payload = verifyAccessToken(token) as { staffId: string; role: string };
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

// GET - Get current staff profile (merged)
export async function GET(req: NextRequest) {
  try {
    const staff = await getAuthenticatedStaff(req);
    
    if (!staff) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Unauthorized" 
        },
        { status: 401 }
      );
    }

    // Get full staff details with relations (from new version)
    const staffWithDetails = await prisma.staff.findUnique({
      where: { id: staff.id },
      include: {
        role: {
          select: { 
            id: true,
            name: true, 
            description: true, 
            baseSalary: true 
          }
        },
        department: {
          select: { 
            id: true,
            name: true, 
            description: true 
          }
        }
      }
    });

    if (!staffWithDetails) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Staff not found" 
        },
        { status: 404 }
      );
    }

    // Remove sensitive data
    const { passwordHash, ...safeStaff } = staffWithDetails;

    // Return merged response format (success field + full data)
    return NextResponse.json({
      success: true,
      data: safeStaff
    });

  } catch (error) {
    console.error("Get Current Staff Error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Internal Server Error" 
      },
      { status: 500 }
    );
  }
}

// PUT - Update own profile (from new version, enhanced)
export async function PUT(req: NextRequest) {
  try {
    const staff = await getAuthenticatedStaff(req);
    
    if (!staff) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Unauthorized" 
        },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { firstName, lastName, phone, profilePhoto } = body;

    // Validation - ensure at least one field is provided
    if (!firstName && !lastName && phone === undefined && profilePhoto === undefined) {
      return NextResponse.json(
        { 
          success: false, 
          error: "No fields to update" 
        },
        { status: 400 }
      );
    }

    // Only allow certain fields to be updated (security)
    const updateData: any = {};
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (phone !== undefined) updateData.phone = phone;
    if (profilePhoto !== undefined) updateData.profilePhoto = profilePhoto;

    const updatedStaff = await prisma.staff.update({
      where: { id: staff.id },
      data: updateData,
      include: {
        role: { 
          select: { 
            id: true,
            name: true,
            description: true 
          } 
        },
        department: { 
          select: { 
            id: true,
            name: true,
            description: true 
          } 
        }
      }
    });

    // Remove sensitive data
    const { passwordHash, ...safeStaff } = updatedStaff;

    return NextResponse.json({
      success: true,
      data: safeStaff,
      message: "Profile updated successfully"
    });

  } catch (error) {
    console.error("Update Profile Error:", error);
    
    // Handle specific Prisma errors
    if (error.code === 'P2025') {
      return NextResponse.json(
        { 
          success: false, 
          error: "Staff not found" 
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: "Internal Server Error" 
      },
      { status: 500 }
    );
  }
}