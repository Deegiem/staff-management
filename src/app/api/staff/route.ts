import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET all staff
export async function GET() {
  const staff = await prisma.staff.findMany();
  return NextResponse.json(staff);
}

// CREATE new staff
export async function POST(req: Request) {
  const body = await req.json();
  const { name, email, position } = body;

  const newStaff = await prisma.staff.create({
    data: { name, email, position },
  });

  return NextResponse.json(newStaff, { status: 201 });
}
