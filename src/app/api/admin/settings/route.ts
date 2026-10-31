import { NextRequest, NextResponse } from "next/server";
import { getSiteSettings, updateSiteSettings } from "@/lib/site-settings";
import { syncSupplierPrices } from "@/lib/supplier-sync";

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
    const { hideAllPrices, resyncNow } = body;

    const payload: any = {};
    if (typeof hideAllPrices === "boolean") {
      payload.hideAllPrices = hideAllPrices;
    }
    const updated = updateSiteSettings(payload);

    // Synchronize exact supplier prices when requested.
    let syncResult = null;
    if (resyncNow) {
      syncResult = await syncSupplierPrices();
    }

    return NextResponse.json({
      success: true,
      message: "Configurações salvas e aplicadas com sucesso!",
      settings: updated,
      syncResult,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
