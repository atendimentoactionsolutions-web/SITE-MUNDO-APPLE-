import { NextResponse } from "next/server";
import { products } from "@/data/products";
import { getLiveEnrichedProducts } from "@/lib/pricing/live-pricing";

export const dynamic = "force-dynamic";
export const revalidate = 0; // Real-time fetch without stale ISR cache

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      count: products.length,
      products: products,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to load products",
        products,
      },
      { status: 500 }
    );
  }
}
