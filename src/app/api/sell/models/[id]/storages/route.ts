import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/sell/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const modelId = params.id;
    // Find all variants for this model
    const variants = db.deviceVariants.filter(
      (v) => v.deviceModelId === modelId && v.active
    );

    let storageOptions = variants.map((v) => {
      const option = db.storageOptions.find((so) => so.id === v.storageOptionId);
      return {
        id: option?.id || v.storageOptionId || "",
        displayName: option?.displayName || "128GB",
        capacityGb: option?.capacityGb || 128,
      };
    }).sort((a, b) => a.capacityGb - b.capacityGb);

    // Fallback if no variants are found in DB
    if (storageOptions.length === 0) {
      storageOptions = [
        { id: "storage-64gb", displayName: "64GB", capacityGb: 64 },
        { id: "storage-128gb", displayName: "128GB", capacityGb: 128 },
        { id: "storage-256gb", displayName: "256GB", capacityGb: 256 },
        { id: "storage-512gb", displayName: "512GB", capacityGb: 512 },
      ];
    }

    return NextResponse.json({
      success: true,
      storageOptions,
      storages: storageOptions,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
