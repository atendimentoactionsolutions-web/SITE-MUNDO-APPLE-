import { NextResponse } from "next/server";
import { getWhatsAppStatus } from "@/lib/whatsapp/whatsapp-service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const status = getWhatsAppStatus();
    return NextResponse.json({ success: true, ...status });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 });
  }
}
