import { NextResponse } from "next/server";
import { disconnectWhatsApp, getWhatsAppStatus } from "@/lib/whatsapp/whatsapp-service";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    await disconnectWhatsApp();
    const status = getWhatsAppStatus();
    return NextResponse.json({ success: true, ...status });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 });
  }
}
