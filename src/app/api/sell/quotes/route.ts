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

    let variant = db.deviceVariants.find(
      (dv) => dv.deviceModelId === deviceModelId && dv.storageOptionId === storageOptionId
    );

    if (!variant) {
      variant = {
        id: `variant-${deviceModelId}-${storageOptionId}`,
        deviceModelId,
        storageOptionId,
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      db.deviceVariants.push(variant);
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

    // 6. Automated WhatsApp message dispatch (Sem emojis e com espaçamento padronizado)
    let waResult: any = null;
    if (custData && custData.whatsapp) {
      const model = db.deviceModels.find((dm) => dm.id === deviceModelId);
      const storage = db.storageOptions.find((so) => so.id === storageOptionId);
      const modelName = model ? model.name : "iPhone";
      const storageName = storage ? storage.displayName : "";
      const valorFormatado = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(calculation.finalPrice);

      // Formatação completa dos detalhes do aparelho declarado pelo cliente
      const batteryMap: Record<string, string> = {
        "90_plus": "90% a 100% (Excelente)",
        "85_89": "85% a 89% (Boa)",
        "80_84": "80% a 84% (Moderada)",
        "below_80": "Abaixo de 80% ou Manutenção",
      };
      const screenMap: Record<string, string> = {
        "perfect": "Impecável / Sem riscos",
        "light_scratches": "Riscos leves superficiais",
        "deep_scratches": "Riscos profundos",
        "cracked": "Vidro trincado ou quebrado",
        "display_damaged": "Display danificado / Manchas ou listras",
      };
      const backMap: Record<string, string> = {
        "perfect": "Impecável / Sem marcas",
        "light_marks": "Riscos leves / Marcas de capinha",
        "cracked": "Vidro traseiro trincado ou quebrado",
        "camera_broken": "Lente da câmera trincada ou arranhada",
      };
      const sidesMap: Record<string, string> = {
        "perfect": "Impecáveis / Sem detalhes",
        "light_scratches": "Marcas leves de uso",
        "dents": "Amassados, batidas ou marcas de queda",
      };
      const partsMap: Record<string, string> = {
        "screen": "Tela / Display",
        "battery": "Bateria",
        "back_glass": "Tampa / Vidro Traseiro",
        "housing": "Carcaça completa / Chassi",
        "camera_rear": "Câmera Traseira",
        "camera_front": "Câmera Frontal (Selfie)",
        "camera_glass": "Vidro da Câmera",
        "charging_port": "Conector de Carga",
        "speaker": "Alto-falante",
        "microphone": "Microfone",
        "buttons": "Botões físicos",
        "wifi_antenna": "Antena / Módulo Wi-Fi",
        "sim_tray": "Gaveta de Chip",
        "other": "Outro componente",
      };

      const batteryText = batteryMap[answers.batteryHealth || ""] || answers.batteryHealth || "Não informada";
      const screenText = screenMap[answers.screenCondition || answers.screenGlass || ""] || "Impecável / Sem riscos";
      const backText = backMap[answers.backCondition || answers.bodyBackGlass || ""] || "Impecável / Sem marcas";
      const sidesText = sidesMap[answers.sidesCondition || answers.bodySides || ""] || "Impecáveis / Sem detalhes";

      let replacedPartsText = "100% Original de fábrica (Nunca aberto)";
      const rawParts = Array.isArray(answers.replacedParts)
        ? answers.replacedParts
        : Array.isArray(answers.replacedPartsList)
        ? answers.replacedPartsList
        : [];
      if (answers.replacedPartsStatus === "yes" && rawParts.length > 0) {
        replacedPartsText = rawParts.map((k: string) => partsMap[k] || k).join(", ");
      }

      const deviceDetailsBlock = `- Modelo: ${modelName}\n- Armazenamento: ${storageName}\n- Saúde da Bateria: ${batteryText}\n- Condição da Tela: ${screenText}\n- Condição da Traseira: ${backText}\n- Condição das Laterais: ${sidesText}\n- Peças Trocadas: ${replacedPartsText}\n- Placa-Mãe: 100% Original e Intacta\n- iCloud e IMEI: Liberados para formatação`;

      let autoMessage = "";
      if (answers.upgradeGoal && answers.upgradeGoal.productName) {
        const tradeInValue = calculation.finalPrice || 0;
        const targetPrice = Number(answers.upgradeGoal.newPrice) || 0;
        const differenceToPay = Math.max(0, targetPrice - tradeInValue);

        const tradeInFormatted = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(tradeInValue);
        const targetFormatted = targetPrice > 0
          ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(targetPrice)
          : "Sob Consulta";
        const diffFormatted = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(differenceToPay);

        const { getMaxInstallment } = await import("@/utils/installments");
        const maxInstallment = differenceToPay > 0 ? getMaxInstallment(differenceToPay) : null;
        const installmentText = maxInstallment
          ? `\n- Ou em até 18x de ${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(maxInstallment.installmentValue)} no cartão`
          : "";
        const newConfigText = `${answers.upgradeGoal.storage || ""}${answers.upgradeGoal.color ? ` (${answers.upgradeGoal.color})` : ""}`.trim();

        autoMessage = `Olá ${custData.name}!\n\nRecebemos sua simulação de Upgrade (Troca) na Mundo Apple!\n\nCódigo da Cotação: ${publicCode}\n\nAPARELHO USADO (ENTRADA):\n${deviceDetailsBlock}\n- Valor Pré-Avaliado: ${tradeInFormatted}\n\nPRODUTO NOVO DESEJADO (LACRADO):\n- Modelo: ${answers.upgradeGoal.productName}\n- Configuração: ${newConfigText || "Padrão"}\n- Valor do Novo: ${targetFormatted}\n\nVALOR DA DIFERENÇA (VOLTA A PAGAR):\n- À vista no PIX: ${diffFormatted}${installmentText}\n\nDADOS DO CLIENTE:\n- Nome: ${custData.name}\n- WhatsApp: ${custData.whatsapp}\n\nNossa equipe já recebeu sua simulação para agendar a entrega e retirada simultânea em SP!`;
      } else {
        autoMessage = `Olá ${custData.name}!\n\nRecebemos sua avaliação para venda do seu iPhone na Mundo Apple!\n\nCódigo da Cotação: ${publicCode}\n\nDADOS DO APARELHO:\n${deviceDetailsBlock}\n\nValor Pré-Avaliado: ${valorFormatado} no PIX\n\nDADOS DO CLIENTE:\n- Nome: ${custData.name}\n- WhatsApp: ${custData.whatsapp}\n\nNossa equipe já recebeu sua avaliação para agendar a conferência e retirada em SP!`;
      }

      try {
        const { sendWhatsAppMessage } = await import("@/lib/whatsapp/whatsapp-service");
        waResult = await sendWhatsAppMessage(custData.whatsapp, autoMessage);
        console.log("[DISPATCH RESULT]:", waResult);
      } catch (err: any) {
        console.error("Erro no disparo automático WhatsApp:", err);
        waResult = { success: false, error: err?.message };
      }
    }

    return NextResponse.json({
      success: true,
      quote: newQuote,
      calculation,
      whatsappDispatched: waResult,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
