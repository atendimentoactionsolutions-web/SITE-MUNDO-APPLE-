import { NextResponse } from "next/server";
import { db } from "@/lib/sell/db";

export async function GET() {
  try {
    const models = db.deviceModels.filter((m) => m.active).map((m) => ({
      id: m.id,
      name: m.name,
      slug: m.slug,
      family: m.family,
      generation: m.generation,
      imageUrl: m.imageUrl || "",
    }));

    return NextResponse.json({ success: true, models });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
