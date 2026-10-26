import { NextRequest, NextResponse } from "next/server";
import { getSiteSettings, updateSiteSettings } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const settings = getSiteSettings();
    return NextResponse.json({
      success: true,
      settings,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { hideAllPrices } = body;

    if (typeof hideAllPrices !== "boolean") {
      return NextResponse.json(
        { success: false, error: "Parâmetro 'hideAllPrices' deve ser booleano." },
        { status: 400 }
      );
    }

    const updated = updateSiteSettings({ hideAllPrices });

    return NextResponse.json({
      success: true,
      message: hideAllPrices
        ? "Modo 'Sob Consulta' ATIVADO: todos os valores do site foram ocultados com sucesso."
        : "Modo de preços normais RESTAURADO: todos os valores estão visíveis.",
      settings: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
