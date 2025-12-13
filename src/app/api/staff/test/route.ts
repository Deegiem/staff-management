// src/app/api/staff/test/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    // Simple test to see if we can connect to the database
    const staffCount = await prisma.staff.count();
    
    return NextResponse.json({
      success: true,
      message: "API is working",
      staffCount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Test API Error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}