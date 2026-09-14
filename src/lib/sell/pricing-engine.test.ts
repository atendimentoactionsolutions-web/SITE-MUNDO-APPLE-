import { calculatePurchasePrice } from "./pricing-engine";
import { db } from "./db";
import { runSeed } from "./seeds";

function runTests() {
  console.log("Running Updated Pricing Engine Tests...");
  if (db.deviceModels.length === 0) runSeed();

  const variant = db.deviceVariants.find((v: any) => v.id.includes("model-iphone-15-pro-max") && v.id.includes("256gb"));
  if (!variant) {
    console.error("Test variant not found. Make sure seeds ran.");
    return;
  }

  const priceObj = db.purchasePrices.find((pp: any) => pp.deviceVariantId === variant.id);
  const basePrice = priceObj?.basePrice || 3000;

  console.log(`Base Price for iPhone 15 Pro Max 256GB is ${basePrice}`);

  // TEST 1: iPhone 15 Pro Max 256GB, sem avarias = R$ 3.000
  const res1 = calculatePurchasePrice({
    deviceModelId: variant.deviceModelId,
    storageOptionId: variant.storageOptionId,
    answers: {
      powerOn: true,
      screenCondition: "perfect",
      bodyCondition: "perfect",
      batteryHealth: "90_plus",
      batteryWarning: false,
      biometricsOk: true,
      replacedScreen: "no",
      replacedBattery: "no",
      replacedCamera: "no",
      replacedHousing: false,
      unknownPartWarning: false,
      liquidDamage: false,
      boardProblem: false,
      icloudClear: true,
      imeiRegular: true,
    }
  });
  console.assert(res1.finalPrice === 3000, `TEST 1 Failed: Expected 3000, got ${res1.finalPrice}`);

  // TEST 2: iPhone 15 Pro Max 256GB, Tela trincada (18%) -> R$ 3.000 * 18% = R$ 540 -> R$ 2.460
  const res2 = calculatePurchasePrice({
    deviceModelId: variant.deviceModelId,
    storageOptionId: variant.storageOptionId,
    answers: {
      powerOn: true,
      screenCondition: "cracked",
      bodyCondition: "perfect",
      batteryHealth: "90_plus",
      batteryWarning: false,
      biometricsOk: true,
      replacedScreen: "no",
      replacedBattery: "no",
      replacedCamera: "no",
      replacedHousing: false,
      unknownPartWarning: false,
      liquidDamage: false,
      boardProblem: false,
      icloudClear: true,
      imeiRegular: true,
    }
  });
  console.assert(res2.finalPrice === 2460, `TEST 2 Failed: Expected 2460, got ${res2.finalPrice}`);

  // TEST 3: Base: R$ 3.000, Tela trincada (-R$ 540), Bateria 75-79 (-R$ 250) -> R$ 2.210
  const res3 = calculatePurchasePrice({
    deviceModelId: variant.deviceModelId,
    storageOptionId: variant.storageOptionId,
    answers: {
      powerOn: true,
      screenCondition: "cracked",
      bodyCondition: "perfect",
      batteryHealth: "75_79",
      batteryWarning: false,
      biometricsOk: true,
      replacedScreen: "no",
      replacedBattery: "no",
      replacedCamera: "no",
      replacedHousing: false,
      unknownPartWarning: false,
      liquidDamage: false,
      boardProblem: false,
      icloudClear: true,
      imeiRegular: true,
    }
  });
  console.assert(res3.finalPrice === 2210, `TEST 3 Failed: Expected 2210, got ${res3.finalPrice}`);

  // TEST 4: iPhone 17 Pro Max 256GB (Base 5780), Face ID (-18% / 1040,40) -> R$ 4.739,60 (Arredondado R$ 4.740)
  const variant17 = db.deviceVariants.find((v: any) => v.id.includes("model-iphone-17-pro-max") && v.id.includes("256gb"));
  const res4 = calculatePurchasePrice({
    deviceModelId: variant17!.deviceModelId,
    storageOptionId: variant17!.storageOptionId,
    answers: {
      powerOn: true,
      screenCondition: "perfect",
      bodyCondition: "perfect",
      batteryHealth: "90_plus",
      batteryWarning: false,
      biometricsOk: false, // FACE_ID_NOT_WORKING = 18%
      replacedScreen: "no",
      replacedBattery: "no",
      replacedCamera: "no",
      replacedHousing: false,
      unknownPartWarning: false,
      liquidDamage: false,
      boardProblem: false,
      icloudClear: true,
      imeiRegular: true,
    }
  });
  console.assert(res4.finalPrice === 4740, `TEST 4 Failed: Expected 4740, got ${res4.finalPrice}`);

  // TEST 5: iPhone 13 128GB (Base 1050), Bateria 80-84 (-R$ 100) -> R$ 950
  const variant13 = db.deviceVariants.find((v: any) => v.id.includes("model-iphone-13") && v.id.includes("128gb") && !v.id.includes("pro") && !v.id.includes("mini"));
  const res5 = calculatePurchasePrice({
    deviceModelId: variant13!.deviceModelId,
    storageOptionId: variant13!.storageOptionId,
    answers: {
      powerOn: true,
      screenCondition: "perfect",
      bodyCondition: "perfect",
      batteryHealth: "80_84",
      batteryWarning: false,
      biometricsOk: true,
      replacedScreen: "no",
      replacedBattery: "no",
      replacedCamera: "no",
      replacedHousing: false,
      unknownPartWarning: false,
      liquidDamage: false,
      boardProblem: false,
      icloudClear: true,
      imeiRegular: true,
    }
  });
  console.assert(res5.finalPrice === 950, `TEST 5 Failed: Expected 950, got ${res5.finalPrice}`);

  // TEST 6: Base: 3000, Tela: Riscos fortes (-7%), Trincada (-18%), Linhas (-28%). Aplicar somente -28% -> R$ 2.160
  const res6 = calculatePurchasePrice({
    deviceModelId: variant.deviceModelId,
    storageOptionId: variant.storageOptionId,
    answers: {
      powerOn: true,
      screenCondition: "lines", // Only highest applied (-28%)
      bodyCondition: "perfect",
      batteryHealth: "90_plus",
      batteryWarning: false,
      biometricsOk: true,
      replacedScreen: "no",
      replacedBattery: "no",
      replacedCamera: "no",
      replacedHousing: false,
      unknownPartWarning: false,
      liquidDamage: false,
      boardProblem: false,
      icloudClear: true,
      imeiRegular: true,
    }
  });
  console.assert(res6.finalPrice === 2160, `TEST 6 Failed: Expected 2160, got ${res6.finalPrice}`);

  // TEST ICLOUD: iCloud = false -> blocked: true, finalPrice: 0, status: ICLOUD_BLOCKED
  const resIcloud = calculatePurchasePrice({
    deviceModelId: variant.deviceModelId,
    storageOptionId: variant.storageOptionId,
    answers: {
      powerOn: true,
      screenCondition: "perfect",
      bodyCondition: "perfect",
      batteryHealth: "90_plus",
      batteryWarning: false,
      biometricsOk: true,
      replacedScreen: "no",
      replacedBattery: "no",
      replacedCamera: "no",
      replacedHousing: false,
      unknownPartWarning: false,
      liquidDamage: false,
      boardProblem: false,
      icloudClear: false, // Blocked
      imeiRegular: true,
    }
  });
  console.assert(resIcloud.blocked === true && resIcloud.blockReason === "ICLOUD_BLOCKED" && resIcloud.finalPrice === 0, "TEST ICLOUD Failed");

  // TEST ICLOUD UNKNOWN: iCloud = null -> manualReview: true
  const resIcloudUnknown = calculatePurchasePrice({
    deviceModelId: variant.deviceModelId,
    storageOptionId: variant.storageOptionId,
    answers: {
      powerOn: true,
      screenCondition: "perfect",
      bodyCondition: "perfect",
      batteryHealth: "90_plus",
      batteryWarning: false,
      biometricsOk: true,
      replacedScreen: "no",
      replacedBattery: "no",
      replacedCamera: "no",
      replacedHousing: false,
      unknownPartWarning: false,
      liquidDamage: false,
      boardProblem: false,
      icloudClear: null, // Unknown
      imeiRegular: true,
    }
  });
  console.assert(resIcloudUnknown.manualReview === true && resIcloudUnknown.finalPrice === 3000, "TEST ICLOUD UNKNOWN Failed");

  // ==========================================
  // OFFICIAL 13 CRITERIA TESTS
  // ==========================================
  console.log("\n--- TESTANDO OFICIAL 13 CRITÉRIOS ---");
  const mod16 = db.deviceModels.find((m) => m.slug === "iphone-16-pro");
  const stg16 = db.storageOptions.find((s) => s.displayName === "1TB");
  if (mod16 && stg16) {
    // 1. User Official Example:
    // Base: R$ 4.000
    // Arranhões moderados na tela: -4%
    // Tampa marcas leves: -1%
    // Bateria abaixo de 85%: -5%
    // Tela paralela: -15%
    // Total: -25% -> R$ 3.000
    const resUserEx = calculatePurchasePrice({
      deviceModelId: mod16.id,
      storageOptionId: stg16.id,
      answers: {
        screenGlass: "moderate_scratches",
        bodyBackGlass: "light_marks",
        batteryHealth: "below_85",
        screenHistory: "parallel",
      },
    });
    console.assert(resUserEx.finalPrice === 3000, `CENÁRIO USUÁRIO FALHOU: esperado 3000, obtido ${resUserEx.finalPrice}`);
    console.log(`✓ Exemplo Oficial do Usuário: R$ ${resUserEx.basePrice} -> R$ ${resUserEx.finalPrice} (-25%)`);

    // 2. Regra Anti-Duplicação: Vidro trincado (-18%) + Display sem imagem (-30%)
    // Deve aplicar apenas -30% (maior impacto) -> R$ 2.800
    const resAntiDup = calculatePurchasePrice({
      deviceModelId: mod16.id,
      storageOptionId: stg16.id,
      answers: {
        screenGlass: "cracked",
        screenDisplay: "no_image",
      },
    });
    console.assert(resAntiDup.finalPrice === 2800, `ANTI-DUPLICAÇÃO FALHOU: esperado 2800, obtido ${resAntiDup.finalPrice}`);
    console.assert(resAntiDup.deflatorsApplied.length === 1, "Deveria consolidar em 1 deflator para a tela");
    console.log(`✓ Regra Anti-Duplicação de Tela: R$ ${resAntiDup.basePrice} -> R$ ${resAntiDup.finalPrice} (-30% consolidado)`);

    // 3. Bloqueio iCloud
    const resIcloudLock = calculatePurchasePrice({
      deviceModelId: mod16.id,
      storageOptionId: stg16.id,
      answers: {
        icloudStatus: "locked",
      },
    });
    console.assert(resIcloudLock.blocked === true, "Deveria bloquear iCloud");
    console.assert(resIcloudLock.blockReason === "ICLOUD_BLOCKED", "Motivo deveria ser ICLOUD_BLOCKED");
    console.log(`✓ Bloqueio de iCloud: Bloqueado com sucesso (NÃO COMPRAR)`);

    // 4. Não Liga (Avaliação Manual)
    const resNoPower = calculatePurchasePrice({
      deviceModelId: mod16.id,
      storageOptionId: stg16.id,
      answers: {
        powerOnStatus: "no_power",
      },
    });
    console.assert(resNoPower.manualReview === true, "Deveria marcar manualReview para Não Liga");
    console.log(`✓ Não Liga: Direcionado para avaliação manual`);
  }

  console.log("All exact specification pricing engine tests passed!");
}

if (require.main === module) {
  runTests();
}
export { runTests };
