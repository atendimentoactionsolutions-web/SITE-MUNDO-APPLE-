import { NextRequest, NextResponse } from "next/server";
import { db, SellQuote } from "@/lib/sell/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { publicCode: string } }
) {
  try {
    const code = params.publicCode;
    const quote = db.sellQuotes.find((q) => q.publicCode === code);

    if (!quote) {
      return NextResponse.json(
        { success: false, error: "Quote not found" },
        { status: 404 }
      );
    }

    const customer = db.customers.find((c) => c.id === quote.customerId);
    const variant = db.deviceVariants.find((v) => v.id === quote.deviceVariantId);
    const model = variant
      ? db.deviceModels.find((dm) => dm.id === variant.deviceModelId)
      : null;
    const storage = variant
      ? db.storageOptions.find((so) => so.id === variant.storageOptionId)
      : null;

    // Check expiration
    const expired = new Date(quote.expiresAt).getTime() < Date.now();

    return NextResponse.json({
      success: true,
      quote,
      expired,
      customer,
      deviceName: model?.name || "iPhone",
      storageName: storage?.displayName || "",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
