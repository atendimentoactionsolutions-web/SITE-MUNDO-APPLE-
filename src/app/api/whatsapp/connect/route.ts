import { NextResponse } from "next/server";
import { initWhatsApp, getWhatsAppStatus } from "@/lib/whatsapp/whatsapp-service";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const forceReset = Boolean(body.forceReset);

    // Initialize or reset WhatsApp socket
    initWhatsApp(forceReset).catch((err) => {
      console.error("Erro ao inicializar WhatsApp no connect route:", err);
    });

    // Wait a brief moment for QR generation
    await new Promise((r) => setTimeout(r, 1200));

    const status = getWhatsAppStatus();
    return NextResponse.json({ success: true, ...status });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 });
  }
}
