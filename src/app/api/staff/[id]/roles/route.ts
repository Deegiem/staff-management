// src/app/api/staff/[id]/roles/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuthWithPermission } from "@/lib/auth/guard";

/**
 * PATCH /api/staff/[id]/roles
 * Body: { roleId: string }
 * - Assign/Change role (Admin only)
 */

const requireAdmin = (role: string) => role === "ADMIN";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const auth = await requireAuthWithPermission(req, "roles.manage");
    if (auth instanceof NextResponse) return auth;
    const actor = (auth as any).staff;

    const { roleId } = await req.json();
    if (!roleId) return NextResponse.json({ error: "roleId is required" }, { status: 400 });

    const role = await prisma.role.findUnique({ where: { id: roleId } });
    if (!role) return NextResponse.json({ error: "Role not found" }, { status: 404 });

    const previous = await prisma.staff.findUnique({ where: { id }, select: { roleId: true } });

    const updated = await prisma.staff.update({ where: { id }, data: { roleId } });

    await prisma.auditLog.create({
      data: {
        action: "STAFF_ROLE_CHANGE",
        actorId: actor.id,
        entity: "Staff",
        entityId: id,
        previousData: previous,
        newData: { roleId },
      },
    });

    return NextResponse.json({ message: "Role updated", data: updated });
  } catch (err) {
    console.error("PATCH /api/staff/[id]/roles error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

/**
 * DELETE /api/staff/[id]/roles
 * Body: { roleId?: string }  - optionally remove role or set to default
 * - Admin-only
 */
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const auth = await requireAuthWithPermission(req, "roles.manage");
    if (auth instanceof NextResponse) return auth;
    const actor = (auth as any).staff;

    // For safety, set role to a default (e.g., a 'STAFF' role) instead of null
    const defaultRole = await prisma.role.findFirst({ where: { name: "STAFF" } });
    if (!defaultRole) return NextResponse.json({ error: "Default STAFF role not found" }, { status: 500 });

    const previous = await prisma.staff.findUnique({ where: { id }, select: { roleId: true } });

    const updated = await prisma.staff.update({ where: { id }, data: { roleId: defaultRole.id } });

    await prisma.auditLog.create({
      data: {
        action: "STAFF_ROLE_REMOVE",
        actorId: actor.id,
        entity: "Staff",
        entityId: id,
        previousData: previous,
        newData: { roleId: defaultRole.id },
      },
    });

    return NextResponse.json({ message: "Role reset to STAFF", data: updated });
  } catch (err) {
    console.error("DELETE /api/staff/[id]/roles error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
