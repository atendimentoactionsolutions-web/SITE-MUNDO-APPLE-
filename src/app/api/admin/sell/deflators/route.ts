import { NextRequest, NextResponse } from "next/server";
import { db, Deflator, AuditLog } from "@/lib/sell/db";

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({ success: true, deflators: db.deflators });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, code, name, category, description, type, value, active } = body;

    const now = new Date().toISOString();

    const defIndex = db.deflators.findIndex((d) => d.id === id);
    if (defIndex !== -1) {
      // Edit existing deflator
      const oldDef = db.deflators[defIndex];
      db.deflators[defIndex] = {
        ...oldDef,
        code: code || oldDef.code,
        name: name || oldDef.name,
        category: category || oldDef.category,
        description: description || oldDef.description,
        type: type || oldDef.type,
        value: Number(value) !== undefined ? Number(value) : oldDef.value,
        active: active !== undefined ? !!active : oldDef.active,
        updatedAt: now,
      };

      db.auditLogs.push({
        id: `audit-${Date.now()}`,
        action: "UPDATE_DEFLATOR",
        entityName: "Deflator",
        entityId: id,
        previousValue: JSON.stringify(oldDef),
        newValue: JSON.stringify(db.deflators[defIndex]),
        userName: "Administrador",
        createdAt: now,
      });

      return NextResponse.json({ success: true, deflator: db.deflators[defIndex] });
    } else {
      // Create new deflator
      const newDef: Deflator = {
        id: id || `def-${Date.now()}`,
        code,
        name,
        category,
        description,
        type: type || "FIXED",
        value: Number(value) || 0,
        active: active !== undefined ? !!active : true,
        createdAt: now,
        updatedAt: now,
      };
      db.deflators.push(newDef);

      db.auditLogs.push({
        id: `audit-${Date.now()}`,
        action: "CREATE_DEFLATOR",
        entityName: "Deflator",
        entityId: newDef.id,
        newValue: JSON.stringify(newDef),
        userName: "Administrador",
        createdAt: now,
      });

      return NextResponse.json({ success: true, deflator: newDef });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
