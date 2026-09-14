import { NextRequest, NextResponse } from "next/server";
import { db, PurchasePrice, AuditLog } from "@/lib/sell/db";

export async function GET(request: NextRequest) {
  try {
    const list = db.purchasePrices.map((pp) => {
      const variant = db.deviceVariants.find((dv) => dv.id === pp.deviceVariantId);
      const model = variant
        ? db.deviceModels.find((dm) => dm.id === variant.deviceModelId)
        : null;
      const storage = variant
        ? db.storageOptions.find((so) => so.id === variant.storageOptionId)
        : null;

      return {
        id: pp.id,
        modelId: model?.id || "",
        modelName: model?.name || "",
        imageUrl: model?.imageUrl || "",
        storageName: storage?.displayName || "",
        basePrice: pp.basePrice,
        minimumPrice: pp.minimumPrice,
        active: pp.active,
      };
    });

    return NextResponse.json({ success: true, prices: list });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prices } = body; // Array of { id, basePrice, minimumPrice, imageUrl, modelId }

    if (!prices || !Array.isArray(prices)) {
      return NextResponse.json(
        { success: false, error: "Invalid price updates array" },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();

    prices.forEach((up) => {
      const ppIndex = db.purchasePrices.findIndex((pp) => pp.id === up.id);
      if (ppIndex !== -1) {
        const oldpp = db.purchasePrices[ppIndex];
        const prevBase = oldpp.basePrice;
        const prevMin = oldpp.minimumPrice;

        db.purchasePrices[ppIndex] = {
          ...oldpp,
          basePrice: Number(up.basePrice),
          minimumPrice: Number(up.minimumPrice),
          updatedAt: now,
        };

        // Update imageUrl on the device model if provided
        if (up.modelId && up.imageUrl !== undefined) {
          const modelIndex = db.deviceModels.findIndex((dm) => dm.id === up.modelId);
          if (modelIndex !== -1) {
            db.deviceModels[modelIndex].imageUrl = up.imageUrl;
            db.deviceModels[modelIndex].updatedAt = now;
          }
        }

        // Force triggers JSON database save
        db.purchasePrices = [...db.purchasePrices];

        // Audit Log
        db.auditLogs.push({
          id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          action: "UPDATE_PURCHASE_PRICE",
          entityName: "PurchasePrice",
          entityId: oldpp.id,
          previousValue: JSON.stringify({ basePrice: prevBase, minimumPrice: prevMin }),
          newValue: JSON.stringify({ basePrice: up.basePrice, minimumPrice: up.minimumPrice }),
          userName: "Administrador",
          createdAt: now,
        });
      }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
