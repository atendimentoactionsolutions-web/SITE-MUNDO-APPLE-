import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    success: true,
    lastSync: null,
    manualMode: true,
  });
}

export async function POST() {
  return NextResponse.json({
    success: false,
    error: "A sincronização automática foi desativada. Todos os valores agora são gerenciados manualmente no painel.",
  });
}
