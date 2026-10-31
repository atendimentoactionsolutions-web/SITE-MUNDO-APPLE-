import { NextResponse } from "next/server";
import { initWhatsApp } from "@/lib/whatsapp/whatsapp-service";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const forceReset = Boolean(body.forceReset);

    const status = await initWhatsApp(forceReset);
    return NextResponse.json({ success: true, ...status });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 });
  }
}
