import { NextResponse } from "next/server";
import { sendWhatsAppMessage } from "@/lib/whatsapp/whatsapp-service";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { phone, text } = body;

    if (!phone || !text) {
      return NextResponse.json({ success: false, error: "Telefone e texto são obrigatórios." }, { status: 400 });
    }

    const res = await sendWhatsAppMessage(phone, text);
    if (!res.success) {
      return NextResponse.json({ success: false, error: res.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: "Mensagem enviada com sucesso!" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 });
  }
}
