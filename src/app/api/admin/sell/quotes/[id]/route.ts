import { NextRequest, NextResponse } from "next/server";
import { db, QuoteStatus, AuditLog, Inspection } from "@/lib/sell/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const quote = db.sellQuotes.find((q) => q.id === id || q.publicCode === id);

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

    const answers = db.quoteAnswers.filter((a) => a.quoteId === quote.id);
    const deflatorsApplied = db.quoteDeflators.filter((qd) => qd.quoteId === quote.id);
    const inspections = db.inspections.filter((ins) => ins.quoteId === quote.id);

    return NextResponse.json({
      success: true,
      quote,
      customer,
      deviceName: model?.name || "iPhone",
      storageName: storage?.displayName || "",
      answers,
      deflatorsApplied,
      inspection: inspections[inspections.length - 1] || null,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();
    const { status, finalPrice, inspection, notes } = body;

    const quoteIndex = db.sellQuotes.findIndex((q) => q.id === id || q.publicCode === id);

    if (quoteIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Quote not found" },
        { status: 404 }
      );
    }

    const quote = db.sellQuotes[quoteIndex];
    const oldStatus = quote.status;
    const oldPrice = quote.finalPrice;

    if (status) {
      quote.status = status as QuoteStatus;
    }
    if (finalPrice !== undefined) {
      quote.finalPrice = finalPrice;
    }
    quote.updatedAt = new Date().toISOString();

    // Log Inspection details if technician provided checklist differences
    if (inspection) {
      const inspectionId = `inspection-${Date.now()}`;
      const newInspection: Inspection = {
        id: inspectionId,
        quoteId: quote.id,
        status: status || "INSPECTION",
        originalQuotedPrice: oldPrice,
        approvedPrice: finalPrice,
        notes: notes || inspection.notes || "Vistoria técnica realizada",
        inspectedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      db.inspections.push(newInspection);

      // Save list of checked items if available
      if (inspection.issues && Array.isArray(inspection.issues)) {
        inspection.issues.forEach((issue: any) => {
          db.inspectionIssues.push({
            id: `issue-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            inspectionId,
            description: issue.description,
            discount: issue.discount,
            createdAt: new Date().toISOString(),
          });
        });
      }
    }

    // Save Audit Log
    const newLog: AuditLog = {
      id: `audit-${Date.now()}`,
      action: "UPDATE_QUOTE",
      entityName: "SellQuote",
      entityId: quote.id,
      previousValue: JSON.stringify({ status: oldStatus, finalPrice: oldPrice }),
      newValue: JSON.stringify({ status: quote.status, finalPrice: quote.finalPrice }),
      userName: "Administrador",
      createdAt: new Date().toISOString(),
    };
    db.auditLogs.push(newLog);

    return NextResponse.json({ success: true, quote });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
