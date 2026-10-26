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
    const { hideAllPrices, categoryMargins, resyncNow } = body;

    const payload: any = {};
    if (typeof hideAllPrices === "boolean") {
      payload.hideAllPrices = hideAllPrices;
    }
    if (categoryMargins && typeof categoryMargins === "object") {
      payload.categoryMargins = {
        iphone: Number(categoryMargins.iphone) || 0,
        mac: Number(categoryMargins.mac) || 0,
        ipad: Number(categoryMargins.ipad) || 0,
        watch: Number(categoryMargins.watch) || 0,
        airpods: Number(categoryMargins.airpods) || 0,
        accessories: Number(categoryMargins.accessories) || 0,
      };
    }

    const updated = updateSiteSettings(payload);

    // If resyncNow requested or margins updated, trigger recalculation
    let syncResult = null;
    if (resyncNow || categoryMargins) {
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
