import { NextRequest, NextResponse } from "next/server";
import { syncSupplierPrices, getLastSupplierSync } from "@/lib/supplier-sync";

export const dynamic = "force-dynamic";

export async function GET() {
  const last = getLastSupplierSync();
  return NextResponse.json({
    success: true,
    lastSync: last,
  });
}

export async function POST(request: NextRequest) {
  try {
    const result = await syncSupplierPrices();
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
