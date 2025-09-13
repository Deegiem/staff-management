import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET single staff
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const staffId = Number(id);

  if (isNaN(staffId)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

  const staff = await prisma.staff.findUnique({ where: { id: staffId } });

  if (!staff) return NextResponse.json({ error: "Staff not found" }, { status: 404 });

  return NextResponse.json(staff);
}

// UPDATE staff
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const staffId = Number(id);
  const body = await req.json();

  const updatedStaff = await prisma.staff.update({
    where: { id: staffId },
    data: body,
  });

  return NextResponse.json(updatedStaff);
}

// DELETE staff
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const staffId = Number(id);

  await prisma.staff.delete({ where: { id: staffId } });

  return NextResponse.json({ message: "Staff deleted successfully" });
}
