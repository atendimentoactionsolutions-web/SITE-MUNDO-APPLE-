import { NextRequest, NextResponse } from "next/server";
import { calculatePurchasePrice } from "@/lib/sell/pricing-engine";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { deviceModelId, storageOptionId, answers } = body;

    if (!deviceModelId || !storageOptionId || !answers) {
      return NextResponse.json(
        { success: false, error: "Missing parameters" },
        { status: 400 }
      );
    }

    const calculation = calculatePurchasePrice({
      deviceModelId,
      storageOptionId,
      answers,
    });

    return NextResponse.json({ success: true, calculation });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
