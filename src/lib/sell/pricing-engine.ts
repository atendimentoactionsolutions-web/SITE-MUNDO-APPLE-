import { db, Deflator } from "./db";
import { runSeed } from "./seeds";

// Automatically run seeds if DB is empty
if (db.deviceModels.length === 0 || db.deflators.length === 0 || db.purchasePrices.length === 0) {
  runSeed();
}

export interface CalculationAnswers {
  // Device specifics
  deviceColor?: string;

  // 1. Funcionamento Inicial
  // "normal" | "glitches" | "recovery" | "no_power"
  powerOnStatus?: string;

  // 2. Condição da Tela
  // Vidro: "perfect" | "light_scratches" | "moderate_scratches" | "deep_scratches" | "cracked"
  screenGlass?: string;
  // Display: "perfect" | "spots" | "lines" | "dead_pixels" | "burn_in" | "no_image"
  screenDisplay?: string;

  // 3. Estado da Carcaça e Acabamento
  // Tampa: "perfect" | "light_marks" | "heavy_marks" | "cracked" | "broken"
  bodyBackGlass?: string;
  // Laterais: "perfect" | "light_scratches" | "impact_marks" | "dents" | "bent"
  bodySides?: string;

  // 4. Câmeras
  // Frontal: "perfect" | "spots" | "focus" | "broken"
  cameraFront?: string;
  // Traseiras: "perfect" | "spots" | "focus" | "shaking" | "one_broken" | "all_broken"
  cameraRear?: string;
  // Vidro das câmeras: "perfect" | "scratches" | "cracked"
  cameraGlass?: string;

  // 5. Reconhecimento Facial (Face ID)
  // "perfect" | "glitches" | "broken"
  faceId?: string;

  // 6. Saúde da Bateria
  // "good" | "below_85" | "service_unknown"
  batteryHealth?: string;

  // 7. Sistema de Áudio
  // Alto-falantes: "perfect" | "low_distorted" | "broken"
  audioSpeakers?: string;
  // Microfones: "perfect" | "glitches" | "broken"
  audioMicrophone?: string;

  // 8. Rede e Conectividade
  // Wi-Fi: "perfect" | "glitches" | "broken"
  networkWifi?: string;
  // Rede móvel (Chip / eSIM): "perfect" | "glitches" | "no_sim" | "no_signal"
  networkCellular?: string;

  // 9. Carregamento e Conector
  // "perfect" | "specific_positions" | "bad_contact" | "broken"
  charging?: string;

  // 10. Histórico da Tela
  // "original" | "apple_genuine" | "original_pulled" | "parallel" | "unknown"
  screenHistory?: string;

  // 11. Histórico da Bateria
  // "never" | "apple_genuine" | "original_pulled" | "parallel" | "unknown"
  batteryHistory?: string;

  // 12. Outros Reparos Já Realizados (Array)
  // ["none"] | ["back_glass", "rear_camera", "front_camera", "charging_port", "speaker", "microphone", "motherboard", "other"]
  otherRepairs?: string[];

  // 13. Bloqueio de iCloud
  // "unlocked" | "locked"
  icloudStatus?: string;

  // Legacy fallbacks for compatibility
  powerOn?: string | boolean;
  screenConditions?: string[];
  screenCondition?: string;
  bodyConditions?: string[];
  bodyCondition?: string;
  replacedParts?: string[];
  defectiveComponents?: string[];
  liquidDamage?: boolean;
  boardProblem?: boolean;
  customerName?: string;
  customerWhatsapp?: string;
  customerCep?: string;
  batteryWarning?: boolean;
  biometricsOk?: boolean | null;
  replacedScreen?: string;
  replacedBattery?: string;
  replacedCamera?: string;
  replacedHousing?: boolean;
  unknownPartWarning?: boolean;
  icloudClear?: boolean | null;
  imeiRegular?: boolean | null;
  upgradeGoal?: any;
}

export interface CalculationInput {
  deviceModelId: string;
  storageOptionId: string;
  answers: CalculationAnswers;
}

export interface CalculationResult {
  basePrice: number;
  minimumPrice: number;
  finalPrice: number;
  percentageDiscountTotal: number;
  fixedDiscountTotal: number;
  calculatedPrice: number;
  deflatorsApplied: {
    code: string;
    name: string;
    type: "FIXED" | "PERCENTAGE";
    value: number;
    discountAmount: number;
  }[];
  manualReview: boolean;
  blocked: boolean;
  blockReason?: "ICLOUD_BLOCKED" | "IMEI_BLOCKED" | "";
}

export function calculatePurchasePrice(input: CalculationInput): CalculationResult {
  const variant = db.deviceVariants.find(
    (dv) => dv.deviceModelId === input.deviceModelId && dv.storageOptionId === input.storageOptionId
  );

  if (!variant) {
    return {
      basePrice: 0,
      minimumPrice: 0,
      finalPrice: 0,
      percentageDiscountTotal: 0,
      fixedDiscountTotal: 0,
      calculatedPrice: 0,
      deflatorsApplied: [],
      manualReview: true,
      blocked: false,
    };
  }

  const price = db.purchasePrices.find(
    (pp) => pp.deviceVariantId === variant.id && pp.priceBookId === "pb-main" && pp.active
  );

  if (!price) {
    return {
      basePrice: 0,
      minimumPrice: 0,
      finalPrice: 0,
      percentageDiscountTotal: 0,
      fixedDiscountTotal: 0,
      calculatedPrice: 0,
      deflatorsApplied: [],
      manualReview: true,
      blocked: false,
    };
  }

  const basePrice = price.basePrice;
  const minimumPrice = price.minimumPrice || 0;
  const answers = input.answers || {};

  // Check 13. Bloqueio de iCloud first
  const isIcloudLocked =
    answers.icloudStatus === "locked" ||
    answers.icloudStatus === "bloqueado" ||
    answers.icloudStatus === "sim" ||
    answers.icloudClear === false;

  if (isIcloudLocked) {
    return {
      basePrice,
      minimumPrice: 0,
      finalPrice: 0,
      percentageDiscountTotal: 100,
      fixedDiscountTotal: 0,
      calculatedPrice: 0,
      deflatorsApplied: [
        {
          code: "ICLOUD_LOCKED",
          name: "Bloqueio de iCloud ativo (NÃO COMPRAMOS)",
          type: "PERCENTAGE",
          value: 100,
          discountAmount: basePrice,
        },
      ],
      manualReview: false,
      blocked: true,
      blockReason: "ICLOUD_BLOCKED",
    };
  }

  const appliedDeflators: {
    code: string;
    name: string;
    type: "FIXED" | "PERCENTAGE";
    value: number;
    discountAmount: number;
  }[] = [];

  const addDeflator = (code: string, customName?: string, customValue?: number) => {
    const def = db.deflators.find((d) => d.code === code);
    const value = customValue !== undefined ? customValue : def?.value || 0;
    const name = customName || def?.name || code;
    const discountAmount = Math.round(basePrice * (value / 100));

    if (value > 0) {
      appliedDeflators.push({
        code,
        name,
        type: "PERCENTAGE",
        value,
        discountAmount,
      });
    }
  };

  let manualReview = answers.icloudClear === null;

  // 1. FUNCIONAMENTO INICIAL
  const power = answers.powerOnStatus || answers.powerOn;
  if (power === "glitches" || power === "Liga, mas apresenta falhas ou reinicializações") {
    addDeflator("POWER_GLITCHES", "Liga, mas com falhas / reinicializações", 25);
  } else if (power === "recovery" || power === "Está travado na tela da Apple / modo de recuperação") {
    addDeflator("POWER_RECOVERY", "Travado na tela Apple / Recovery", 35);
  } else if (power === "no_power" || power === "Não liga" || power === false || power === "nao") {
    manualReview = true;
    addDeflator("POWER_NO_POWER", "Não liga (Avaliação manual necessária)", 0);
  }

  // 2. CONDIÇÃO DA TELA — Anti-duplicação de reparo conjunto de tela
  let screenGlassPct = 0;
  let screenGlassCode = "";
  let screenGlassLabel = "";

  const sGlass = answers.screenGlass || answers.screenCondition;
  if (sGlass === "light_scratches") {
    screenGlassPct = 2;
    screenGlassCode = "SCREEN_GLASS_LIGHT_SCRATCHES";
    screenGlassLabel = "Vidro da tela com riscos leves";
  } else if (sGlass === "moderate_scratches") {
    screenGlassPct = 4;
    screenGlassCode = "SCREEN_GLASS_MODERATE_SCRATCHES";
    screenGlassLabel = "Vidro da tela com riscos moderados";
  } else if (sGlass === "deep_scratches") {
    screenGlassPct = 7;
    screenGlassCode = "SCREEN_GLASS_DEEP_SCRATCHES";
    screenGlassLabel = "Vidro com riscos profundos (perceptíveis na unha)";
  } else if (sGlass === "cracked") {
    screenGlassPct = 18;
    screenGlassCode = "SCREEN_GLASS_CRACKED";
    screenGlassLabel = "Vidro da tela trincado ou quebrado";
  }

  let screenDisplayPct = 0;
  let screenDisplayCode = "";
  let screenDisplayLabel = "";

  const sDisplay = answers.screenDisplay;
  if (sDisplay === "spots") {
    screenDisplayPct = 15;
    screenDisplayCode = "SCREEN_DISPLAY_SPOTS";
    screenDisplayLabel = "Display com manchas";
  } else if (sDisplay === "lines") {
    screenDisplayPct = 20;
    screenDisplayCode = "SCREEN_DISPLAY_LINES";
    screenDisplayLabel = "Display com linhas / listras";
  } else if (sDisplay === "dead_pixels") {
    screenDisplayPct = 10;
    screenDisplayCode = "SCREEN_DISPLAY_DEAD_PIXELS";
    screenDisplayLabel = "Display com pixels mortos";
  } else if (sDisplay === "burn_in") {
    screenDisplayPct = 12;
    screenDisplayCode = "SCREEN_DISPLAY_BURN_IN";
    screenDisplayLabel = "Display com burn-in / imagem marcada";
  } else if (sDisplay === "no_image") {
    screenDisplayPct = 30;
    screenDisplayCode = "SCREEN_DISPLAY_NO_IMAGE";
    screenDisplayLabel = "Display não apresenta imagem";
  }

  // Legacy fallback for screen
  if (!sGlass && !sDisplay && answers.screenConditions) {
    const screens = answers.screenConditions;
    screens.forEach((s) => {
      if (s.includes("trincado") || s.includes("quebrado")) {
        screenGlassPct = Math.max(screenGlassPct, 18);
        screenGlassCode = "SCREEN_GLASS_CRACKED";
        screenGlassLabel = "Vidro trincado";
      }
      if (s.includes("riscado") || s.includes("arranhado")) {
        screenGlassPct = Math.max(screenGlassPct, 4);
        screenGlassCode = "SCREEN_GLASS_MODERATE_SCRATCHES";
        screenGlassLabel = "Vidro com riscos";
      }
      if (s.includes("manchas")) {
        screenDisplayPct = Math.max(screenDisplayPct, 15);
        screenDisplayCode = "SCREEN_DISPLAY_SPOTS";
        screenDisplayLabel = "Display com manchas";
      }
      if (s.includes("linhas")) {
        screenDisplayPct = Math.max(screenDisplayPct, 20);
        screenDisplayCode = "SCREEN_DISPLAY_LINES";
        screenDisplayLabel = "Display com linhas";
      }
    });
  }

  // Anti-duplication rule for screen repair:
  // Se vidro quebrado (-18%) e display sem imagem (-30%), não somar os dois. Aplicar o maior abatimento relacionado ao mesmo reparo.
  // Se display danificado necessitar de troca completa da tela, substitui o vidro também -> aplicar maior abatimento.
  if (screenGlassPct > 0 && screenDisplayPct > 0) {
    if (screenDisplayPct >= screenGlassPct) {
      addDeflator(
        screenDisplayCode,
        `${screenDisplayLabel} (Troca do conjunto frontal)`,
        screenDisplayPct
      );
    } else {
      addDeflator(
        screenGlassCode,
        `${screenGlassLabel} (Troca do conjunto frontal)`,
        screenGlassPct
      );
    }
  } else {
    if (screenGlassPct > 0) addDeflator(screenGlassCode, screenGlassLabel, screenGlassPct);
    if (screenDisplayPct > 0) addDeflator(screenDisplayCode, screenDisplayLabel, screenDisplayPct);
  }

  // 3. ESTADO DA CARCAÇA E ACABAMENTO
  // Tampa traseira
  const bBack = answers.bodyBackGlass;
  if (bBack === "light_marks") {
    addDeflator("BODY_BACK_LIGHT_MARKS", "Tampa traseira com marcas leves", 1);
  } else if (bBack === "heavy_marks") {
    addDeflator("BODY_BACK_HEAVY_MARKS", "Tampa traseira com marcas fortes / descascados", 3);
  } else if (bBack === "cracked") {
    addDeflator("BODY_BACK_CRACKED", "Tampa traseira trincada", 8);
  } else if (bBack === "broken") {
    addDeflator("BODY_BACK_BROKEN", "Tampa traseira quebrada com perda de material", 12);
  }

  // Laterais
  const bSides = answers.bodySides;
  if (bSides === "light_scratches") {
    addDeflator("BODY_SIDES_LIGHT_SCRATCHES", "Laterais com pequenos arranhões", 1);
  } else if (bSides === "impact_marks") {
    addDeflator("BODY_SIDES_IMPACT_MARKS", "Laterais com marcas fortes de impacto", 3);
  } else if (bSides === "dents") {
    addDeflator("BODY_SIDES_DENTS", "Laterais com amassados visíveis", 7);
  } else if (bSides === "bent") {
    addDeflator("BODY_SIDES_BENT", "Estrutura empenada ou torta", 15);
  }

  // Legacy fallback for body
  if (!bBack && !bSides && answers.bodyConditions) {
    const bodies = answers.bodyConditions;
    bodies.forEach((b) => {
      if (b.includes("Trincado") || b.includes("quebrado")) {
        addDeflator("BODY_BACK_CRACKED", "Traseira trincada / quebrada", 8);
      } else if (b.includes("amassado")) {
        addDeflator("BODY_SIDES_DENTS", "Carcaça com amassados", 7);
      } else if (b.includes("Arranhado")) {
        addDeflator("BODY_BACK_HEAVY_MARKS", "Carcaça com arranhões", 3);
      }
    });
  }

  // 4. CÂMERAS
  // Câmera frontal
  const cFront = answers.cameraFront;
  if (cFront === "spots") {
    addDeflator("CAMERA_FRONT_SPOTS", "Câmera frontal com manchas", 5);
  } else if (cFront === "focus") {
    addDeflator("CAMERA_FRONT_FOCUS", "Câmera frontal com falha de foco", 7);
  } else if (cFront === "broken") {
    addDeflator("CAMERA_FRONT_BROKEN", "Câmera frontal não funciona / tela preta", 10);
  }

  // Câmeras traseiras + Vidro externo (Cluster Câmera Traseira: max se ambos forem afetados ou somar vidro)
  let cRearPct = 0;
  let cRearCode = "";
  let cRearLabel = "";
  const cRear = answers.cameraRear;
  if (cRear === "spots") {
    cRearPct = 6;
    cRearCode = "CAMERA_REAR_SPOTS";
    cRearLabel = "Câmeras traseiras com manchas";
  } else if (cRear === "focus") {
    cRearPct = 8;
    cRearCode = "CAMERA_REAR_FOCUS";
    cRearLabel = "Câmeras traseiras com falha de foco";
  } else if (cRear === "shaking") {
    cRearPct = 10;
    cRearCode = "CAMERA_REAR_SHAKING";
    cRearLabel = "Câmera traseira tremendo ao abrir";
  } else if (cRear === "one_broken") {
    cRearPct = 12;
    cRearCode = "CAMERA_REAR_ONE_BROKEN";
    cRearLabel = "Uma das câmeras traseiras não funciona";
  } else if (cRear === "all_broken") {
    cRearPct = 20;
    cRearCode = "CAMERA_REAR_ALL_BROKEN";
    cRearLabel = "Nenhuma câmera traseira funciona";
  }

  let cGlassPct = 0;
  let cGlassCode = "";
  let cGlassLabel = "";
  const cGlass = answers.cameraGlass;
  if (cGlass === "scratches") {
    cGlassPct = 2;
    cGlassCode = "CAMERA_GLASS_SCRATCHES";
    cGlassLabel = "Vidro externo das câmeras com riscos leves";
  } else if (cGlass === "cracked") {
    cGlassPct = 5;
    cGlassCode = "CAMERA_GLASS_CRACKED";
    cGlassLabel = "Vidro externo das câmeras trincado ou quebrado";
  }

  if (cRearPct >= 20 && cGlassPct > 0) {
    // Se o módulo inteiro de câmeras traseiras for substituído, absorve o vidro
    addDeflator(cRearCode, `${cRearLabel} (Módulo completo)`, cRearPct);
  } else {
    if (cRearPct > 0) addDeflator(cRearCode, cRearLabel, cRearPct);
    if (cGlassPct > 0) addDeflator(cGlassCode, cGlassLabel, cGlassPct);
  }

  // 5. RECONHECIMENTO FACIAL (FACE ID)
  const fId = answers.faceId;
  if (fId === "glitches") {
    addDeflator("FACE_ID_GLITCHES", "Face ID com falhas intermitentes", 10);
  } else if (fId === "broken") {
    addDeflator("FACE_ID_BROKEN", "Face ID não funciona", 20);
  }

  // 6. SAÚDE DA BATERIA
  const bHealth = answers.batteryHealth;
  if (bHealth === "below_85" || bHealth === "inferior a 80%" || bHealth === "80_84" || bHealth === "75_79" || bHealth === "below_75") {
    addDeflator("BATTERY_HEALTH_BELOW_85", "Saúde da bateria abaixo de 85%", 5);
  } else if (bHealth === "service_unknown" || bHealth === "service_warning" || bHealth === "unknown" || bHealth?.includes("Não sei")) {
    addDeflator("BATTERY_HEALTH_SERVICE", "Mensagem de manutenção / não consulta saúde", 8);
  }

  // 7. SISTEMA DE ÁUDIO
  const spk = answers.audioSpeakers;
  if (spk === "low_distorted") {
    addDeflator("AUDIO_SPEAKER_DISTORTED", "Alto-falante baixo, chiando ou distorcido", 4);
  } else if (spk === "broken") {
    addDeflator("AUDIO_SPEAKER_BROKEN", "Alto-falante não sai som", 7);
  }

  const mic = answers.audioMicrophone;
  if (mic === "glitches") {
    addDeflator("AUDIO_MIC_GLITCHES", "Microfone com falhas na gravação ou ligação", 4);
  } else if (mic === "broken") {
    addDeflator("AUDIO_MIC_BROKEN", "Microfone não funciona", 7);
  }

  // 8. REDE E CONECTIVIDADE
  const wifi = answers.networkWifi;
  if (wifi === "glitches") {
    addDeflator("NETWORK_WIFI_GLITCHES", "Wi-Fi com quedas frequentes / sinal fraco", 10);
  } else if (wifi === "broken") {
    addDeflator("NETWORK_WIFI_BROKEN", "Wi-Fi não ativa ou não conecta", 20);
  }

  const cell = answers.networkCellular;
  if (cell === "glitches") {
    addDeflator("NETWORK_CELL_GLITCHES", "Rede celular com falhas de sinal frequentes", 12);
  } else if (cell === "no_sim") {
    addDeflator("NETWORK_CELL_NO_SIM", "Não reconhece chip físico ou eSIM", 18);
  } else if (cell === "no_signal") {
    addDeflator("NETWORK_CELL_NO_SIGNAL", "Sem sinal de operadora constante", 25);
  }

  // 9. CARREGAMENTO E CONECTOR
  const chg = answers.charging;
  if (chg === "specific_positions") {
    addDeflator("CHARGING_POSITIONS", "Carrega apenas em determinadas posições", 5);
  } else if (chg === "bad_contact") {
    addDeflator("CHARGING_BAD_CONTACT", "Conector com mau contato frequente", 7);
  } else if (chg === "broken") {
    addDeflator("CHARGING_BROKEN", "Conector não carrega", 12);
  }

  // 10. HISTÓRICO DA TELA
  const sHist = answers.screenHistory;
  if (sHist === "apple_genuine") {
    addDeflator("SCREEN_HIST_APPLE_GENUINE", "Tela trocada genuína Apple (autorizada)", 2);
  } else if (sHist === "original_pulled") {
    addDeflator("SCREEN_HIST_ORIGINAL_PULLED", "Tela trocada original retirada", 5);
  } else if (sHist === "parallel") {
    addDeflator("SCREEN_HIST_PARALLEL", "Tela trocada paralela / primeira linha", 15);
  } else if (sHist === "unknown") {
    addDeflator("SCREEN_HIST_UNKNOWN", "Histórico da tela não informado", 5);
  }

  // 11. HISTÓRICO DA BATERIA
  const bHist = answers.batteryHistory;
  if (bHist === "original_pulled") {
    addDeflator("BATTERY_HIST_ORIGINAL_PULLED", "Bateria trocada original retirada", 3);
  } else if (bHist === "parallel") {
    addDeflator("BATTERY_HIST_PARALLEL", "Bateria trocada por paralela", 7);
  } else if (bHist === "unknown") {
    addDeflator("BATTERY_HIST_UNKNOWN", "Histórico da bateria não informado", 3);
  }

  // 12. OUTROS REPAROS JÁ REALIZADOS
  const repList = answers.otherRepairs || [];
  if (repList.includes("back_glass")) {
    addDeflator("REPAIR_BACK_GLASS", "Reparo já realizado: Tampa traseira", 3);
  }
  if (repList.includes("rear_camera")) {
    addDeflator("REPAIR_REAR_CAMERA", "Reparo já realizado: Câmera traseira", 5);
  }
  if (repList.includes("front_camera")) {
    addDeflator("REPAIR_FRONT_CAMERA", "Reparo já realizado: Câmera frontal", 5);
  }
  if (repList.includes("charging_port")) {
    addDeflator("REPAIR_CHARGING_PORT", "Reparo já realizado: Conector de carga", 4);
  }
  if (repList.includes("speaker")) {
    addDeflator("REPAIR_SPEAKER", "Reparo já realizado: Alto-falante", 3);
  }
  if (repList.includes("microphone")) {
    addDeflator("REPAIR_MIC", "Reparo já realizado: Microfone", 3);
  }
  if (repList.includes("motherboard") || answers.boardProblem) {
    addDeflator("REPAIR_MOTHERBOARD", "Reparo em placa-mãe (Avaliação técnica)", 20);
    manualReview = true;
  }
  if (repList.includes("other")) {
    manualReview = true;
    addDeflator("REPAIR_OTHER", "Outro reparo já realizado (Avaliação manual)", 0);
  }

  // Legacy direct flags
  if (answers.liquidDamage) {
    addDeflator("LIQUID_DAMAGE", "Contato com líquido / oxidação", 25);
    manualReview = true;
  }

  // Calculate total percentage discount
  const totalPercentageDeduction = appliedDeflators.reduce((sum, item) => sum + item.value, 0);

  // Regra Geral: Se ultrapassar 60% de abatimentos, direcionar para avaliação manual
  if (totalPercentageDeduction >= 60) {
    manualReview = true;
  }

  // Formula: Valor Final = Valor Base * (1 - Total de Abatimentos / 100)
  const discountMultiplier = Math.max(0, 1 - totalPercentageDeduction / 100);
  const calculatedPrice = Math.round(basePrice * discountMultiplier);
  const finalPrice = Math.max(0, minimumPrice > 0 ? Math.max(calculatedPrice, minimumPrice) : calculatedPrice);
  const totalDiscountAmount = basePrice - finalPrice;

  return {
    basePrice,
    minimumPrice,
    calculatedPrice,
    percentageDiscountTotal: totalDiscountAmount,
    fixedDiscountTotal: 0,
    finalPrice,
    deflatorsApplied: appliedDeflators,
    manualReview,
    blocked: false,
    blockReason: "",
  };
}
