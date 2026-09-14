import { NextRequest, NextResponse } from "next/server";
import { db, PurchasePrice, AuditLog } from "@/lib/sell/db";

// Process CSV lines on the server
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { csvData } = body;

    if (!csvData || typeof csvData !== "string") {
      return NextResponse.json({ success: false, error: "Empty or invalid CSV file data" }, { status: 400 });
    }

    const lines = csvData.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length <= 1) {
      return NextResponse.json({ success: false, error: "CSV has no data lines" }, { status: 400 });
    }

    // Header validation (model,storage,base_price,minimum_price)
    const header = lines[0].toLowerCase().split(",");
    const modelIdx = header.indexOf("model");
    const storageIdx = header.indexOf("storage");
    const baseIdx = header.indexOf("base_price");
    const minIdx = header.indexOf("minimum_price");

    if (modelIdx === -1 || storageIdx === -1 || baseIdx === -1 || minIdx === -1) {
      return NextResponse.json({ success: false, error: "Invalid CSV headers. Must include: model,storage,base_price,minimum_price" }, { status: 400 });
    }

    const errors: string[] = [];
    const validUpdates: { priceId: string; basePrice: number; minimumPrice: number; name: string }[] = [];
    const now = new Date().toISOString();

    for (let i = 1; i < lines.length; i++) {
      const columns = lines[i].split(",");
      const rawModel = columns[modelIdx]?.trim();
      const rawStorage = columns[storageIdx]?.trim();
      const rawBase = columns[baseIdx]?.trim();
      const rawMin = columns[minIdx]?.trim();

      if (!rawModel || !rawStorage) {
        errors.push(`Linha ${i + 1}: Modelo ou armazenamento vazio.`);
        continue;
      }

      // Find Model matching name
      const model = db.deviceModels.find(
        (dm) => dm.name.toLowerCase() === rawModel.toLowerCase()
      );
      if (!model) {
        errors.push(`Linha ${i + 1}: Modelo "${rawModel}" não encontrado no catálogo.`);
        continue;
      }

      // Find Storage matching displayName
      // Normalize rawStorage (e.g. 256GB -> 256 GB)
      const normalizedStg = rawStorage.replace(/\s+/g, "").replace(/gb/i, " GB").replace(/tb/i, " TB");
      const storage = db.storageOptions.find(
        (so) => so.displayName.toLowerCase().replace(/\s+/g, "") === normalizedStg.toLowerCase().replace(/\s+/g, "")
      );
      if (!storage) {
        errors.push(`Linha ${i + 1}: Capacidade de armazenamento "${rawStorage}" incompatível ou não cadastrada.`);
        continue;
      }

      // Find variant
      const variant = db.deviceVariants.find(
        (dv) => dv.deviceModelId === model.id && dv.storageOptionId === storage.id
      );
      if (!variant) {
        errors.push(`Linha ${i + 1}: Combinação de ${rawModel} com ${rawStorage} não é permitida no catálogo.`);
        continue;
      }

      // Find purchase price object
      const pp = db.purchasePrices.find(
        (p) => p.deviceVariantId === variant.id && p.priceBookId === "pb-main"
      );
      if (!pp) {
        errors.push(`Linha ${i + 1}: Sem registro de tabela de preço existente para ${rawModel} (${rawStorage}).`);
        continue;
      }

      const basePrice = Number(rawBase);
      const minimumPrice = Number(rawMin);

      if (isNaN(basePrice) || basePrice <= 0) {
        errors.push(`Linha ${i + 1}: Preço Base inválido.`);
        continue;
      }
      if (isNaN(minimumPrice) || minimumPrice < 0) {
        errors.push(`Linha ${i + 1}: Preço Mínimo inválido.`);
        continue;
      }

      validUpdates.push({
        priceId: pp.id,
        basePrice,
        minimumPrice,
        name: `${model.name} (${storage.displayName})`,
      });
    }

    // Only proceed to save if there are zero validation errors
    if (errors.length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    // Apply valid updates
    validUpdates.forEach((item) => {
      const idx = db.purchasePrices.findIndex((pp) => pp.id === item.priceId);
      if (idx !== -1) {
        const oldpp = db.purchasePrices[idx];
        db.purchasePrices[idx] = {
          ...oldpp,
          basePrice: item.basePrice,
          minimumPrice: item.minimumPrice,
          updatedAt: now,
        };

        // Audit Log
        db.auditLogs.push({
          id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          action: "IMPORT_CSV_PRICE",
          entityName: "PurchasePrice",
          entityId: oldpp.id,
          newValue: JSON.stringify({ basePrice: item.basePrice, minimumPrice: item.minimumPrice }),
          userName: "Administrador (CSV)",
          createdAt: now,
        });
      }
    });

    return NextResponse.json({ success: true, updatedCount: validUpdates.length });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
