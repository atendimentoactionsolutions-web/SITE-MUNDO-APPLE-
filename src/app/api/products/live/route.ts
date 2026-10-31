import { getLastSupplierSync } from "@/lib/supplier-sync";
import { NextResponse } from "next/server";
import { getAllProductsWithOverrides } from "@/lib/products-store";

export const dynamic = "force-dynamic";
export const revalidate = 0; // Real-time fetch without stale ISR cache

export async function GET() {
  try {
    const list = getAllProductsWithOverrides();
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      supplierSync: getLastSupplierSync(),
      count: list.length,
      products: list,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to load products",
        products: [],
      },
      { status: 500 }
    );
  }
}
