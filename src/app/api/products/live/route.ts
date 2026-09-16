import { NextResponse } from "next/server";
import { products } from "@/data/products";
import { getLiveEnrichedProducts } from "@/lib/pricing/live-pricing";

export const dynamic = "force-dynamic";
export const revalidate = 300; // 5 minutes

export async function GET() {
  try {
    const liveProducts = await getLiveEnrichedProducts(products);
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      count: liveProducts.length,
      products: liveProducts,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to load live products",
        products,
      },
      { status: 500 }
    );
  }
}
