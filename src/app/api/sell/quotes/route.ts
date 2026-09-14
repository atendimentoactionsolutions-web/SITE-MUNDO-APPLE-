import { NextRequest, NextResponse } from "next/server";
import { db, SellQuote, QuoteAnswer, QuoteDeflator, Customer } from "@/lib/sell/db";
import { calculatePurchasePrice } from "@/lib/sell/pricing-engine";

function generatePublicCode(): string {
  const chars = "0123456789ABCDEFGHJKLMNPQRSTUVWXYZ";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `COT-${code}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { deviceModelId, storageOptionId, answers, customer } = body;

    if (!deviceModelId || !storageOptionId || !answers) {
      return NextResponse.json(
        { success: false, error: "Missing quote calculation details" },
        { status: 400 }
      );
    }

    // 1. Calculate price on server
    const calculation = calculatePurchasePrice({
      deviceModelId,
      storageOptionId,
      answers,
    });

    const variant = db.deviceVariants.find(
      (dv) => dv.deviceModelId === deviceModelId && dv.storageOptionId === storageOptionId
    );

    if (!variant) {
      return NextResponse.json(
        { success: false, error: "Device variant not found" },
        { status: 400 }
      );
    }

    const now = new Date();
    const expirationHours = 48;
    const expiresAt = new Date(now.getTime() + expirationHours * 60 * 60 * 1000).toISOString();

    const quoteId = `quote-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const publicCode = generatePublicCode();

    // 2. Handle customer creation if provided
    let customerId: string | undefined = undefined;
    const custData = customer || {
      name: answers.customerName,
      whatsapp: answers.customerWhatsapp,
      cep: answers.customerCep,
    };

    if (custData && custData.name && custData.whatsapp) {
      const newCustomer: Customer = {
        id: `customer-${Date.now()}`,
        name: custData.name,
        whatsapp: custData.whatsapp,
        email: custData.email || "",
        cep: custData.cep || "",
        city: custData.city || "",
        state: custData.state || "",
        consentLgpd: true,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      };
      db.customers.push(newCustomer);
      customerId = newCustomer.id;
    }

    // 3. Create Sell Quote record with full financial snapshots
    const discountSnapshot = calculation.basePrice - calculation.finalPrice;
    
    let finalStatus: any = "QUOTED";
    if (calculation.blocked) {
      finalStatus = calculation.blockReason || "BLOCKED";
    } else if (calculation.manualReview) {
      finalStatus = "MANUAL_REVIEW";
    }

    const newQuote: SellQuote = {
      id: quoteId,
      publicCode,
      customerId,
      deviceVariantId: variant.id,
      priceBookId: "pb-main",
      basePriceSnapshot: calculation.basePrice,
      discountSnapshot,
      percentageDiscountTotal: calculation.percentageDiscountTotal,
      fixedDiscountTotal: calculation.fixedDiscountTotal,
      calculatedPrice: calculation.calculatedPrice,
      finalPrice: calculation.finalPrice,
      status: finalStatus,
      manualReview: calculation.manualReview || calculation.blocked,
      expiresAt,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    db.sellQuotes.push(newQuote);

    // 4. Save Quote Answers
    Object.entries(answers).forEach(([key, val]) => {
      let answerText = "";
      if (Array.isArray(val)) {
        answerText = val.join(" | ");
      } else if (typeof val === "object" && val !== null) {
        answerText = JSON.stringify(val);
      } else {
        answerText = String(val || "");
      }

      const newAns: QuoteAnswer = {
        id: `answer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        quoteId,
        questionCode: key,
        answer: answerText,
        createdAt: now.toISOString(),
      };
      db.quoteAnswers.push(newAns);
    });

    // 5. Save Applied Deflators Snapshots
    calculation.deflatorsApplied.forEach((def) => {
      const newDefSnapshot: QuoteDeflator = {
        id: `qdef-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        quoteId,
        deflatorId: def.code,
        labelSnapshot: def.name,
        typeSnapshot: def.type,
        valueSnapshot: def.value,
        calculatedDiscount: def.discountAmount,
        createdAt: now.toISOString(),
      };
      db.quoteDeflators.push(newDefSnapshot);
    });

    return NextResponse.json({
      success: true,
      quote: newQuote,
      calculation,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
