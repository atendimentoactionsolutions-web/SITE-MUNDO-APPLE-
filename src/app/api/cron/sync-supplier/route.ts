import { NextResponse } from "next/server";
import { syncSupplierPrices } from "@/lib/supplier-sync";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = await syncSupplierPrices();
    return NextResponse.json(result, { status: result.success ? 200 : 503 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
