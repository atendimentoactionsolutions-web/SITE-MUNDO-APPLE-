import { db, Deflator, saveDatabaseState } from "./db";

export function runSeed() {
  const now = new Date().toISOString();

  // 1. Seed Brand (Apple) if not exists
  let appleBrand = db.brands.find((b) => b.slug === "apple");
  if (!appleBrand) {
    appleBrand = {
      id: "brand-apple",
      name: "Apple",
      slug: "apple",
      active: true,
      createdAt: now,
      updatedAt: now,
    };
    db.brands.push(appleBrand);
  }

  // 2. Seed Storage Options
  const capacities = [
    { gb: 64, name: "64GB" },
    { gb: 128, name: "128GB" },
    { gb: 256, name: "256GB" },
    { gb: 512, name: "512GB" },
    { gb: 1024, name: "1TB" },
    { gb: 2048, name: "2TB" },
  ];

  capacities.forEach((c) => {
    const id = `storage-${c.gb}gb`;
    if (!db.storageOptions.some((s) => s.id === id)) {
      db.storageOptions.push({
        id,
        capacityGb: c.gb,
        displayName: c.name,
        createdAt: now,
      });
    }
  });

  // 3. Define iPhone Catalog Models to seed
  const iphoneModels = [
    // Linha 11
    { name: "iPhone 11", family: "iPhone", gen: "11" },
    { name: "iPhone 11 Pro", family: "iPhone", gen: "11" },
    { name: "iPhone 11 Pro Max", family: "iPhone", gen: "11" },
    // Linha 12
    { name: "iPhone 12", family: "iPhone", gen: "12" },
    { name: "iPhone 12 mini", family: "iPhone", gen: "12" },
    { name: "iPhone 12 Pro", family: "iPhone", gen: "12" },
    { name: "iPhone 12 Pro Max", family: "iPhone", gen: "12" },
    // Linha 13
    { name: "iPhone 13", family: "iPhone", gen: "13" },
    { name: "iPhone 13 mini", family: "iPhone", gen: "13" },
    { name: "iPhone 13 Pro", family: "iPhone", gen: "13" },
    { name: "iPhone 13 Pro Max", family: "iPhone", gen: "13" },
    // Linha 14
    { name: "iPhone 14", family: "iPhone", gen: "14" },
    { name: "iPhone 14 Plus", family: "iPhone", gen: "14" },
    { name: "iPhone 14 Pro", family: "iPhone", gen: "14" },
    { name: "iPhone 14 Pro Max", family: "iPhone", gen: "14" },
    // Linha 15
    { name: "iPhone 15", family: "iPhone", gen: "15" },
    { name: "iPhone 15 Plus", family: "iPhone", gen: "15" },
    { name: "iPhone 15 Pro", family: "iPhone", gen: "15" },
    { name: "iPhone 15 Pro Max", family: "iPhone", gen: "15" },
    // Linha 16
    { name: "iPhone 16", family: "iPhone", gen: "16" },
    { name: "iPhone 16e", family: "iPhone", gen: "16" },
    { name: "iPhone 16 Plus", family: "iPhone", gen: "16" },
    { name: "iPhone 16 Pro", family: "iPhone", gen: "16" },
    { name: "iPhone 16 Pro Max", family: "iPhone", gen: "16" },
    // Linha 17
    { name: "iPhone 17", family: "iPhone", gen: "17" },
    { name: "iPhone 17 Air", family: "iPhone", gen: "17" },
    { name: "iPhone 17 Pro", family: "iPhone", gen: "17" },
    { name: "iPhone 17 Pro Max", family: "iPhone", gen: "17" },
  ];

  iphoneModels.forEach((m) => {
    const slug = m.name.toLowerCase().replace(/\s+/g, "-");
    const id = `model-${slug}`;
    if (!db.deviceModels.some((dm) => dm.id === id)) {
      // Default image path resolution
      let imageUrl = "";
      if (slug === "iphone-17-pro-max") {
        imageUrl = "/images/products/iphone/iphone-17-pro-max.png";
      } else if (slug === "iphone-16-pro-max") {
        imageUrl = "/images/products/iphone/iphone-17-pro-max.png"; // Fallback to matching uploaded files
      }

      db.deviceModels.push({
        id,
        brandId: appleBrand!.id,
        name: m.name,
        slug,
        family: m.family,
        generation: m.gen,
        active: true,
        imageUrl,
        createdAt: now,
        updatedAt: now,
      });
    }
  });

  // 4. Seed Price Book
  let primaryPriceBook = db.priceBooks.find((pb) => pb.id === "pb-main");
  if (!primaryPriceBook) {
    primaryPriceBook = {
      id: "pb-main",
      name: "Mundo Apple Principal",
      active: true,
      priority: 100,
      createdAt: now,
      updatedAt: now,
    };
    db.priceBooks.push(primaryPriceBook);
  }

  // 5. Seed exact pricing from user specifications
  const exactPrices: { modelSlug: string; storageDisplayName: string; basePrice: number }[] = [
    // iPhone 11
    { modelSlug: "iphone-11", storageDisplayName: "64GB", basePrice: 510 },
    { modelSlug: "iphone-11", storageDisplayName: "128GB", basePrice: 700 },
    { modelSlug: "iphone-11", storageDisplayName: "256GB", basePrice: 799 },
    // iPhone 11 Pro
    { modelSlug: "iphone-11-pro", storageDisplayName: "64GB", basePrice: 850 },
    // iPhone 11 Pro Max
    { modelSlug: "iphone-11-pro-max", storageDisplayName: "128GB", basePrice: 1145 },
    // iPhone 12
    { modelSlug: "iphone-12", storageDisplayName: "64GB", basePrice: 720 },
    { modelSlug: "iphone-12", storageDisplayName: "128GB", basePrice: 830 },
    { modelSlug: "iphone-12", storageDisplayName: "256GB", basePrice: 999 },
    // iPhone 12 mini
    { modelSlug: "iphone-12-mini", storageDisplayName: "128GB", basePrice: 650 },
    { modelSlug: "iphone-12-mini", storageDisplayName: "256GB", basePrice: 699 },
    // iPhone 12 Pro
    { modelSlug: "iphone-12-pro", storageDisplayName: "128GB", basePrice: 1145 },
    { modelSlug: "iphone-12-pro", storageDisplayName: "256GB", basePrice: 1280 },
    { modelSlug: "iphone-12-pro", storageDisplayName: "512GB", basePrice: 1330 },
    // iPhone 12 Pro Max
    { modelSlug: "iphone-12-pro-max", storageDisplayName: "128GB", basePrice: 1360 },
    { modelSlug: "iphone-12-pro-max", storageDisplayName: "256GB", basePrice: 1550 },
    // iPhone 13
    { modelSlug: "iphone-13", storageDisplayName: "128GB", basePrice: 1050 },
    { modelSlug: "iphone-13", storageDisplayName: "256GB", basePrice: 1299 },
    // iPhone 13 mini
    { modelSlug: "iphone-13-mini", storageDisplayName: "128GB", basePrice: 850 },
    // iPhone 13 Pro
    { modelSlug: "iphone-13-pro", storageDisplayName: "128GB", basePrice: 1400 },
    { modelSlug: "iphone-13-pro", storageDisplayName: "256GB", basePrice: 1600 },
    { modelSlug: "iphone-13-pro", storageDisplayName: "512GB", basePrice: 2000 },
    { modelSlug: "iphone-13-pro", storageDisplayName: "1TB", basePrice: 1950 },
    // iPhone 13 Pro Max
    { modelSlug: "iphone-13-pro-max", storageDisplayName: "128GB", basePrice: 1880 },
    { modelSlug: "iphone-13-pro-max", storageDisplayName: "256GB", basePrice: 1600 },
    { modelSlug: "iphone-13-pro-max", storageDisplayName: "512GB", basePrice: 2400 },
    { modelSlug: "iphone-13-pro-max", storageDisplayName: "1TB", basePrice: 2300 },
    // iPhone 14
    { modelSlug: "iphone-14", storageDisplayName: "128GB", basePrice: 1230 },
    { modelSlug: "iphone-14", storageDisplayName: "256GB", basePrice: 1450 },
    // iPhone 14 Plus
    { modelSlug: "iphone-14-plus", storageDisplayName: "128GB", basePrice: 1400 },
    { modelSlug: "iphone-14-plus", storageDisplayName: "256GB", basePrice: 1600 },
    // iPhone 14 Pro
    { modelSlug: "iphone-14-pro", storageDisplayName: "128GB", basePrice: 2050 },
    { modelSlug: "iphone-14-pro", storageDisplayName: "256GB", basePrice: 2100 },
    { modelSlug: "iphone-14-pro", storageDisplayName: "512GB", basePrice: 2500 },
    { modelSlug: "iphone-14-pro", storageDisplayName: "1TB", basePrice: 3050 },
    // iPhone 14 Pro Max
    { modelSlug: "iphone-14-pro-max", storageDisplayName: "128GB", basePrice: 2300 },
    { modelSlug: "iphone-14-pro-max", storageDisplayName: "256GB", basePrice: 2530 },
    { modelSlug: "iphone-14-pro-max", storageDisplayName: "512GB", basePrice: 2900 },
    { modelSlug: "iphone-14-pro-max", storageDisplayName: "1TB", basePrice: 3050 },
    // iPhone 15
    { modelSlug: "iphone-15", storageDisplayName: "128GB", basePrice: 1820 },
    { modelSlug: "iphone-15", storageDisplayName: "256GB", basePrice: 2000 },
    { modelSlug: "iphone-15", storageDisplayName: "512GB", basePrice: 2390 },
    // iPhone 15 Plus
    { modelSlug: "iphone-15-plus", storageDisplayName: "128GB", basePrice: 2000 },
    { modelSlug: "iphone-15-plus", storageDisplayName: "256GB", basePrice: 2200 },
    { modelSlug: "iphone-15-plus", storageDisplayName: "512GB", basePrice: 2350 },
    // iPhone 15 Pro
    { modelSlug: "iphone-15-pro", storageDisplayName: "128GB", basePrice: 2450 },
    { modelSlug: "iphone-15-pro", storageDisplayName: "256GB", basePrice: 2745 },
    { modelSlug: "iphone-15-pro", storageDisplayName: "512GB", basePrice: 3000 },
    // iPhone 15 Pro Max
    { modelSlug: "iphone-15-pro-max", storageDisplayName: "256GB", basePrice: 3000 },
    { modelSlug: "iphone-15-pro-max", storageDisplayName: "512GB", basePrice: 3390 },
    { modelSlug: "iphone-15-pro-max", storageDisplayName: "1TB", basePrice: 3500 },
    // iPhone 16
    { modelSlug: "iphone-16", storageDisplayName: "128GB", basePrice: 2580 },
    { modelSlug: "iphone-16", storageDisplayName: "256GB", basePrice: 3250 },
    { modelSlug: "iphone-16", storageDisplayName: "512GB", basePrice: 3450 },
    // iPhone 16e
    { modelSlug: "iphone-16e", storageDisplayName: "128GB", basePrice: 1890 },
    // iPhone 16 Plus
    { modelSlug: "iphone-16-plus", storageDisplayName: "128GB", basePrice: 2950 },
    { modelSlug: "iphone-16-plus", storageDisplayName: "256GB", basePrice: 3450 },
    // iPhone 16 Pro
    { modelSlug: "iphone-16-pro", storageDisplayName: "128GB", basePrice: 3100 },
    { modelSlug: "iphone-16-pro", storageDisplayName: "256GB", basePrice: 3700 },
    { modelSlug: "iphone-16-pro", storageDisplayName: "512GB", basePrice: 3920 },
    { modelSlug: "iphone-16-pro", storageDisplayName: "1TB", basePrice: 4000 },
    // iPhone 16 Pro Max
    { modelSlug: "iphone-16-pro-max", storageDisplayName: "128GB", basePrice: 4250 },
    { modelSlug: "iphone-16-pro-max", storageDisplayName: "256GB", basePrice: 3950 },
    { modelSlug: "iphone-16-pro-max", storageDisplayName: "512GB", basePrice: 4480 },
    { modelSlug: "iphone-16-pro-max", storageDisplayName: "1TB", basePrice: 4150 },
    // iPhone 17
    { modelSlug: "iphone-17", storageDisplayName: "256GB", basePrice: 3600 },
    // iPhone 17 Air
    { modelSlug: "iphone-17-air", storageDisplayName: "256GB", basePrice: 4200 },
    // iPhone 17 Pro
    { modelSlug: "iphone-17-pro", storageDisplayName: "256GB", basePrice: 5150 },
    { modelSlug: "iphone-17-pro", storageDisplayName: "512GB", basePrice: 6150 },
    // iPhone 17 Pro Max
    { modelSlug: "iphone-17-pro-max", storageDisplayName: "256GB", basePrice: 5780 },
    { modelSlug: "iphone-17-pro-max", storageDisplayName: "512GB", basePrice: 6550 },
    { modelSlug: "iphone-17-pro-max", storageDisplayName: "1TB", basePrice: 8200 },
    { modelSlug: "iphone-17-pro-max", storageDisplayName: "2TB", basePrice: 8600 },
  ];

  // Empty existing purchasePrices / variants to ensure idempotency and prevent duplicates
  db.deviceVariants = [];
  db.purchasePrices = [];

  exactPrices.forEach((ep) => {
    const model = db.deviceModels.find((dm) => dm.slug === ep.modelSlug);
    const storage = db.storageOptions.find((so) => so.displayName === ep.storageDisplayName);

    if (model && storage) {
      const variantId = `variant-${model.id}-${storage.id}`;
      // Upsert Variant
      if (!db.deviceVariants.some((dv) => dv.id === variantId)) {
        db.deviceVariants.push({
          id: variantId,
          deviceModelId: model.id,
          storageOptionId: storage.id,
          active: true,
          createdAt: now,
          updatedAt: now,
        });
      }

      // Upsert Purchase Price (no manual modification/correction applied)
      const priceId = `price-${primaryPriceBook!.id}-${variantId}`;
      db.purchasePrices.push({
        id: priceId,
        priceBookId: primaryPriceBook!.id,
        deviceVariantId: variantId,
        basePrice: ep.basePrice,
        minimumPrice: 0, // default minimum price
        active: true,
        effectiveFrom: "2026-01-01T00:00:00.000Z",
        createdAt: now,
        updatedAt: now,
      });
    }
  });

  // 6. Seed Deflators matching exact 13-criteria official specifications
  db.deflators = [];

  const deflatorList: Omit<Deflator, "createdAt" | "updatedAt">[] = [
    // 1. FUNCIONAMENTO INICIAL
    { id: "def-power-normal", code: "POWER_NORMAL", name: "Liga e funciona normalmente", category: "POWER", description: "Aparelho liga e opera sem instabilidades.", type: "PERCENTAGE", value: 0, active: true },
    { id: "def-power-glitches", code: "POWER_GLITCHES", name: "Liga com falhas / reinicia", category: "POWER", description: "Aparelho apresenta falhas ou reinicializações constantes.", type: "PERCENTAGE", value: 25, active: true },
    { id: "def-power-recovery", code: "POWER_RECOVERY", name: "Travado na tela Apple / Recovery", category: "POWER", description: "Travado em loop de boot ou modo recuperação.", type: "PERCENTAGE", value: 35, active: true },
    { id: "def-power-no-power", code: "POWER_NO_POWER", name: "Não liga (Avaliação manual)", category: "POWER", description: "Aparelho não reage ao carregador ou botão power.", type: "PERCENTAGE", value: 0, active: true },

    // 2. CONDIÇÃO DA TELA — Vidro
    { id: "def-screen-glass-perfect", code: "SCREEN_GLASS_PERFECT", name: "Vidro da tela perfeito, sem riscos", category: "SCREEN_GLASS", description: "Sem qualquer arranhão no vidro frontal.", type: "PERCENTAGE", value: 0, active: true },
    { id: "def-screen-glass-light", code: "SCREEN_GLASS_LIGHT_SCRATCHES", name: "Vidro com arranhões leves", category: "SCREEN_GLASS", description: "Riscos superficiais visíveis apenas sob luz direta.", type: "PERCENTAGE", value: 2, active: true },
    { id: "def-screen-glass-mod", code: "SCREEN_GLASS_MODERATE_SCRATCHES", name: "Vidro com arranhões moderados", category: "SCREEN_GLASS", description: "Marcas de uso moderadas no vidro.", type: "PERCENTAGE", value: 4, active: true },
    { id: "def-screen-glass-deep", code: "SCREEN_GLASS_DEEP_SCRATCHES", name: "Vidro com arranhões profundos (unha)", category: "SCREEN_GLASS", description: "Riscos profundos perceptíveis ao passar a unha.", type: "PERCENTAGE", value: 7, active: true },
    { id: "def-screen-glass-cracked", code: "SCREEN_GLASS_CRACKED", name: "Vidro trincado ou quebrado", category: "SCREEN_GLASS", description: "Trincas, rachaduras ou fissuras no vidro frontal.", type: "PERCENTAGE", value: 18, active: true },

    // 2. CONDIÇÃO DA TELA — Display
    { id: "def-screen-display-perfect", code: "SCREEN_DISPLAY_PERFECT", name: "Display com imagem perfeita", category: "SCREEN_DISPLAY", description: "Sem qualquer defeito na exibição de imagem.", type: "PERCENTAGE", value: 0, active: true },
    { id: "def-screen-display-spots", code: "SCREEN_DISPLAY_SPOTS", name: "Display com manchas", category: "SCREEN_DISPLAY", description: "Manchas pretas, brancas ou coloridas no painel.", type: "PERCENTAGE", value: 15, active: true },
    { id: "def-screen-display-lines", code: "SCREEN_DISPLAY_LINES", name: "Display com linhas / listras", category: "SCREEN_DISPLAY", description: "Linhas verticais ou horizontais no display.", type: "PERCENTAGE", value: 20, active: true },
    { id: "def-screen-display-dead-pixels", code: "SCREEN_DISPLAY_DEAD_PIXELS", name: "Display com pixels mortos", category: "SCREEN_DISPLAY", description: "Pontos pretos fixos na tela.", type: "PERCENTAGE", value: 10, active: true },
    { id: "def-screen-display-burn-in", code: "SCREEN_DISPLAY_BURN_IN", name: "Display com burn-in / imagem marcada", category: "SCREEN_DISPLAY", description: "Sombras fixas ou retenção de imagem no display OLED.", type: "PERCENTAGE", value: 12, active: true },
    { id: "def-screen-display-no-image", code: "SCREEN_DISPLAY_NO_IMAGE", name: "Display não apresenta imagem", category: "SCREEN_DISPLAY", description: "Tela totalmente preta / sem imagem.", type: "PERCENTAGE", value: 30, active: true },

    // 3. ESTADO DA CARCAÇA — Tampa Traseira
    { id: "def-body-back-perfect", code: "BODY_BACK_PERFECT", name: "Tampa traseira perfeita", category: "BODY_BACK", description: "Sem qualquer marca ou risco.", type: "PERCENTAGE", value: 0, active: true },
    { id: "def-body-back-light", code: "BODY_BACK_LIGHT_MARKS", name: "Tampa traseira marcas leves", category: "BODY_BACK", description: "Marcas suaves de uso cotidiana ou capinha.", type: "PERCENTAGE", value: 1, active: true },
    { id: "def-body-back-heavy", code: "BODY_BACK_HEAVY_MARKS", name: "Tampa com marcas fortes / descascados", category: "BODY_BACK", description: "Arranhões fortes ou tintas descascadas.", type: "PERCENTAGE", value: 3, active: true },
    { id: "def-body-back-cracked", code: "BODY_BACK_CRACKED", name: "Tampa traseira trincada", category: "BODY_BACK", description: "Fissuras ou trincados no vidro traseiro.", type: "PERCENTAGE", value: 8, active: true },
    { id: "def-body-back-broken", code: "BODY_BACK_BROKEN", name: "Tampa quebrada com perda de material", category: "BODY_BACK", description: "Vidro estilhaçado ou buracos no vidro traseiro.", type: "PERCENTAGE", value: 12, active: true },

    // 3. ESTADO DA CARCAÇA — Laterais
    { id: "def-body-sides-perfect", code: "BODY_SIDES_PERFECT", name: "Laterais perfeitas", category: "BODY_SIDES", description: "Bordas intactas sem qualquer marca.", type: "PERCENTAGE", value: 0, active: true },
    { id: "def-body-sides-light", code: "BODY_SIDES_LIGHT_SCRATCHES", name: "Laterais com pequenos arranhões", category: "BODY_SIDES", description: "Pequenos arranhões ou descascados nas quinas.", type: "PERCENTAGE", value: 1, active: true },
    { id: "def-body-sides-impact", code: "BODY_SIDES_IMPACT_MARKS", name: "Laterais com marcas de impacto", category: "BODY_SIDES", description: "Marcas fortes de batidas na lateral.", type: "PERCENTAGE", value: 3, active: true },
    { id: "def-body-sides-dents", code: "BODY_SIDES_DENTS", name: "Laterais com amassados visíveis", category: "BODY_SIDES", description: "Amassados ou quinas batidas visíveis.", type: "PERCENTAGE", value: 7, active: true },
    { id: "def-body-sides-bent", code: "BODY_SIDES_BENT", name: "Estrutura empenada ou torta", category: "BODY_SIDES", description: "Chassi torto ou empenado.", type: "PERCENTAGE", value: 15, active: true },

    // 4. CÂMERAS — Câmera Frontal
    { id: "def-cam-front-perfect", code: "CAMERA_FRONT_PERFECT", name: "Câmera frontal perfeita", category: "CAMERAS", description: "Fotos nítidas e foco normal.", type: "PERCENTAGE", value: 0, active: true },
    { id: "def-cam-front-spots", code: "CAMERA_FRONT_SPOTS", name: "Câmera frontal com manchas", category: "CAMERAS", description: "Manchas escuras ou névoa na câmera frontal.", type: "PERCENTAGE", value: 5, active: true },
    { id: "def-cam-front-focus", code: "CAMERA_FRONT_FOCUS", name: "Câmera frontal com problema de foco", category: "CAMERAS", description: "Não foca ou fica embaçada.", type: "PERCENTAGE", value: 7, active: true },
    { id: "def-cam-front-broken", code: "CAMERA_FRONT_BROKEN", name: "Câmera frontal não funciona / tela preta", category: "CAMERAS", description: "Câmera de selfie apagada.", type: "PERCENTAGE", value: 10, active: true },

    // 4. CÂMERAS — Câmeras Traseiras
    { id: "def-cam-rear-perfect", code: "CAMERA_REAR_PERFECT", name: "Câmeras traseiras perfeitas", category: "CAMERAS", description: "Todas as lentes operando normalmente.", type: "PERCENTAGE", value: 0, active: true },
    { id: "def-cam-rear-spots", code: "CAMERA_REAR_SPOTS", name: "Câmeras traseiras com manchas", category: "CAMERAS", description: "Pontos pretos ou manchas nas fotos traseiras.", type: "PERCENTAGE", value: 6, active: true },
    { id: "def-cam-rear-focus", code: "CAMERA_REAR_FOCUS", name: "Câmeras traseiras com falha de foco", category: "CAMERAS", description: "Dificuldade ou incapacidade de focar.", type: "PERCENTAGE", value: 8, active: true },
    { id: "def-cam-rear-shaking", code: "CAMERA_REAR_SHAKING", name: "Câmera traseira tremendo ao abrir", category: "CAMERAS", description: "Falha mecânica no estabilizador OIS.", type: "PERCENTAGE", value: 10, active: true },
    { id: "def-cam-rear-one-broken", code: "CAMERA_REAR_ONE_BROKEN", name: "Uma das câmeras traseiras não funciona", category: "CAMERAS", description: "Modo 0.5x, 1x ou zoom inativo.", type: "PERCENTAGE", value: 12, active: true },
    { id: "def-cam-rear-all-broken", code: "CAMERA_REAR_ALL_BROKEN", name: "Nenhuma câmera traseira funciona", category: "CAMERAS", description: "Módulo traseiro completamente inativo.", type: "PERCENTAGE", value: 20, active: true },

    // 4. CÂMERAS — Vidro Externo das Câmeras
    { id: "def-cam-glass-perfect", code: "CAMERA_GLASS_PERFECT", name: "Vidro das câmeras perfeito", category: "CAMERAS", description: "Lentes externas sem qualquer dano.", type: "PERCENTAGE", value: 0, active: true },
    { id: "def-cam-glass-scratches", code: "CAMERA_GLASS_SCRATCHES", name: "Vidro das câmeras com riscos leves", category: "CAMERAS", description: "Pequenos riscos na lente externa.", type: "PERCENTAGE", value: 2, active: true },
    { id: "def-cam-glass-cracked", code: "CAMERA_GLASS_CRACKED", name: "Vidro das câmeras trincado ou quebrado", category: "CAMERAS", description: "Lente externa trincada ou estilhaçada.", type: "PERCENTAGE", value: 5, active: true },

    // 5. RECONHECIMENTO FACIAL (FACE ID)
    { id: "def-face-id-perfect", code: "FACE_ID_PERFECT", name: "Face ID funciona normalmente", category: "FACE_ID", description: "Desbloqueio biométrico facial ágil e preciso.", type: "PERCENTAGE", value: 0, active: true },
    { id: "def-face-id-glitches", code: "FACE_ID_GLITCHES", name: "Face ID com falhas intermitentes", category: "FACE_ID", description: "Falha frequentemente ao tentar cadastrar ou desbloquear.", type: "PERCENTAGE", value: 10, active: true },
    { id: "def-face-id-broken", code: "FACE_ID_BROKEN", name: "Face ID não funciona", category: "FACE_ID", description: "Mensagem de erro ou câmera TrueDepth desativada.", type: "PERCENTAGE", value: 20, active: true },

    // 6. SAÚDE DA BATERIA
    { id: "def-bat-health-good", code: "BATTERY_HEALTH_85_PLUS", name: "Saúde de 85% a 100%", category: "BATTERY_HEALTH", description: "Bateria com excelente autonomia.", type: "PERCENTAGE", value: 0, active: true },
    { id: "def-bat-health-below-85", code: "BATTERY_HEALTH_BELOW_85", name: "Saúde abaixo de 85%", category: "BATTERY_HEALTH", description: "Bateria desgastada que necessitará de troca em breve.", type: "PERCENTAGE", value: 5, active: true },
    { id: "def-bat-health-service", code: "BATTERY_HEALTH_SERVICE", name: "Mensagem de manutenção / não consulta saúde", category: "BATTERY_HEALTH", description: "Aviso de manutenção ou peça não genuína.", type: "PERCENTAGE", value: 8, active: true },

    // 7. SISTEMA DE ÁUDIO — Alto-Falantes
    { id: "def-audio-spk-perfect", code: "AUDIO_SPEAKER_PERFECT", name: "Alto-falantes som claro e normal", category: "AUDIO", description: "Som estéreo limpo e sem ruídos.", type: "PERCENTAGE", value: 0, active: true },
    { id: "def-audio-spk-distorted", code: "AUDIO_SPEAKER_DISTORTED", name: "Alto-falante baixo, chiando ou distorcido", category: "AUDIO", description: "Áudio abafado, rouco ou com estalos.", type: "PERCENTAGE", value: 4, active: true },
    { id: "def-audio-spk-broken", code: "AUDIO_SPEAKER_BROKEN", name: "Alto-falante não sai som", category: "AUDIO", description: "Nenhum som é emitido.", type: "PERCENTAGE", value: 7, active: true },

    // 7. SISTEMA DE ÁUDIO — Microfones
    { id: "def-audio-mic-perfect", code: "AUDIO_MIC_PERFECT", name: "Microfone captação perfeita", category: "AUDIO", description: "Áudio claro em ligações, áudios e vídeos.", type: "PERCENTAGE", value: 0, active: true },
    { id: "def-audio-mic-glitches", code: "AUDIO_MIC_GLITCHES", name: "Microfone com falhas na gravação ou ligação", category: "AUDIO", description: "Voz baixa, cortando ou com ruídos.", type: "PERCENTAGE", value: 4, active: true },
    { id: "def-audio-mic-broken", code: "AUDIO_MIC_BROKEN", name: "Microfone não funciona", category: "AUDIO", description: "Outra pessoa não escuta nada.", type: "PERCENTAGE", value: 7, active: true },

    // 8. REDE E CONECTIVIDADE — Wi-Fi
    { id: "def-net-wifi-perfect", code: "NETWORK_WIFI_PERFECT", name: "Wi-Fi conecta normalmente", category: "NETWORK", description: "Navegação estável em redes 2.4 e 5GHz.", type: "PERCENTAGE", value: 0, active: true },
    { id: "def-net-wifi-glitches", code: "NETWORK_WIFI_GLITCHES", name: "Wi-Fi com quedas frequentes / sinal fraco", category: "NETWORK", description: "Desconecta sozinho ou sinal muito baixo perto do roteador.", type: "PERCENTAGE", value: 10, active: true },
    { id: "def-net-wifi-broken", code: "NETWORK_WIFI_BROKEN", name: "Wi-Fi não ativa ou não conecta", category: "NETWORK", description: "Botão Wi-Fi acinzentado ou não localiza redes.", type: "PERCENTAGE", value: 20, active: true },

    // 8. REDE E CONECTIVIDADE — Celular / eSIM
    { id: "def-net-cell-perfect", code: "NETWORK_CELL_PERFECT", name: "Rede celular sinal normal", category: "NETWORK", description: "4G/5G operando perfeitamente.", type: "PERCENTAGE", value: 0, active: true },
    { id: "def-net-cell-glitches", code: "NETWORK_CELL_GLITCHES", name: "Rede celular com falhas de sinal frequentes", category: "NETWORK", description: "Perda constante de sinal de operadora.", type: "PERCENTAGE", value: 12, active: true },
    { id: "def-net-cell-no-sim", code: "NETWORK_CELL_NO_SIM", name: "Não reconhece chip físico ou eSIM", category: "NETWORK", description: "Mensagem Sem SIM ou erro de ativação de linha.", type: "PERCENTAGE", value: 18, active: true },
    { id: "def-net-cell-no-signal", code: "NETWORK_CELL_NO_SIGNAL", name: "Sem sinal de operadora constante", category: "NETWORK", description: "Sempre Sem Serviço / Buscando.", type: "PERCENTAGE", value: 25, active: true },

    // 9. CARREGAMENTO E CONECTOR
    { id: "def-charge-perfect", code: "CHARGING_PERFECT", name: "Carrega normalmente", category: "CHARGING", description: "Conector Lightning/USB-C firme e carregando rápido.", type: "PERCENTAGE", value: 0, active: true },
    { id: "def-charge-positions", code: "CHARGING_POSITIONS", name: "Carrega apenas em posições específicas", category: "CHARGING", description: "Cabo precisa ficar inclinado para carregar.", type: "PERCENTAGE", value: 5, active: true },
    { id: "def-charge-bad-contact", code: "CHARGING_BAD_CONTACT", name: "Apresenta mau contato frequente", category: "CHARGING", description: "Fica conectando e desconectando da tomada.", type: "PERCENTAGE", value: 7, active: true },
    { id: "def-charge-broken", code: "CHARGING_BROKEN", name: "Não carrega", category: "CHARGING", description: "Nenhuma resposta ao plugar o carregador.", type: "PERCENTAGE", value: 12, active: true },

    // 10. HISTÓRICO DA TELA
    { id: "def-scr-hist-orig", code: "SCREEN_HIST_ORIGINAL", name: "Tela original de fábrica", category: "SCREEN_HISTORY", description: "Display genuíno que veio de fábrica.", type: "PERCENTAGE", value: 0, active: true },
    { id: "def-scr-hist-apple", code: "SCREEN_HIST_APPLE_GENUINE", name: "Tela trocada genuína Apple (autorizada)", category: "SCREEN_HISTORY", description: "Substituída em centro autorizado Apple.", type: "PERCENTAGE", value: 2, active: true },
    { id: "def-scr-hist-pulled", code: "SCREEN_HIST_ORIGINAL_PULLED", name: "Tela original retirada de outro aparelho", category: "SCREEN_HISTORY", description: "Display original Apple retirado de outro aparelho.", type: "PERCENTAGE", value: 5, active: true },
    { id: "def-scr-hist-parallel", code: "SCREEN_HIST_PARALLEL", name: "Tela paralela / primeira linha", category: "SCREEN_HISTORY", description: "Display paralelo sem selo original Apple.", type: "PERCENTAGE", value: 15, active: true },
    { id: "def-scr-hist-unknown", code: "SCREEN_HIST_UNKNOWN", name: "Não sabe informar histórico da tela", category: "SCREEN_HISTORY", description: "Histórico da tela não informado.", type: "PERCENTAGE", value: 5, active: true },

    // 11. HISTÓRICO DA BATERIA
    { id: "def-bat-hist-never", code: "BATTERY_HIST_NEVER", name: "Bateria nunca trocada", category: "BATTERY_HISTORY", description: "Bateria original de fábrica.", type: "PERCENTAGE", value: 0, active: true },
    { id: "def-bat-hist-apple", code: "BATTERY_HIST_APPLE_GENUINE", name: "Bateria trocada por genuína Apple", category: "BATTERY_HISTORY", description: "Trocada em autorizada oficial Apple.", type: "PERCENTAGE", value: 0, active: true },
    { id: "def-bat-hist-pulled", code: "BATTERY_HIST_ORIGINAL_PULLED", name: "Bateria original retirada", category: "BATTERY_HISTORY", description: "Bateria original retirada de outro aparelho.", type: "PERCENTAGE", value: 3, active: true },
    { id: "def-bat-hist-parallel", code: "BATTERY_HIST_PARALLEL", name: "Bateria paralela", category: "BATTERY_HISTORY", description: "Bateria paralela não genuína.", type: "PERCENTAGE", value: 7, active: true },
    { id: "def-bat-hist-unknown", code: "BATTERY_HIST_UNKNOWN", name: "Não sabe informar histórico da bateria", category: "BATTERY_HISTORY", description: "Histórico da bateria desconhecido.", type: "PERCENTAGE", value: 3, active: true },

    // 12. OUTROS REPAROS JÁ REALIZADOS
    { id: "def-rep-none", code: "REPAIR_NONE", name: "Nenhum reparo", category: "OTHER_REPAIRS", description: "Aparelho nunca foi aberto para outros reparos.", type: "PERCENTAGE", value: 0, active: true },
    { id: "def-rep-back-glass", code: "REPAIR_BACK_GLASS", name: "Tampa traseira já reparada", category: "OTHER_REPAIRS", description: "Tampa traseira já foi substituída anteriormente.", type: "PERCENTAGE", value: 3, active: true },
    { id: "def-rep-rear-cam", code: "REPAIR_REAR_CAMERA", name: "Câmera traseira já reparada", category: "OTHER_REPAIRS", description: "Módulo de câmera traseira já trocado.", type: "PERCENTAGE", value: 5, active: true },
    { id: "def-rep-front-cam", code: "REPAIR_FRONT_CAMERA", name: "Câmera frontal já reparada", category: "OTHER_REPAIRS", description: "Câmera frontal já trocada.", type: "PERCENTAGE", value: 5, active: true },
    { id: "def-rep-charge", code: "REPAIR_CHARGING_PORT", name: "Conector de carga já reparado", category: "OTHER_REPAIRS", description: "Flex de carga já trocado.", type: "PERCENTAGE", value: 4, active: true },
    { id: "def-rep-spk", code: "REPAIR_SPEAKER", name: "Alto-falante já reparado", category: "OTHER_REPAIRS", description: "Alto-falante já substituído.", type: "PERCENTAGE", value: 3, active: true },
    { id: "def-rep-mic", code: "REPAIR_MIC", name: "Microfone já reparado", category: "OTHER_REPAIRS", description: "Microfone já reparado.", type: "PERCENTAGE", value: 3, active: true },
    { id: "def-rep-board", code: "REPAIR_MOTHERBOARD", name: "Placa-mãe já reparada", category: "OTHER_REPAIRS", description: "Reparo em circuito integrado ou micro-solda na placa.", type: "PERCENTAGE", value: 20, active: true },
    { id: "def-rep-other", code: "REPAIR_OTHER", name: "Outro reparo não listado (Avaliação manual)", category: "OTHER_REPAIRS", description: "Reparo não especificado.", type: "PERCENTAGE", value: 0, active: true },

    // 13. BLOQUEIO DE ICLOUD
    { id: "def-icloud-unlocked", code: "ICLOUD_UNLOCKED", name: "Aparelho totalmente desbloqueado", category: "ICLOUD", description: "Pronto para restauração limpa.", type: "PERCENTAGE", value: 0, active: true },
    { id: "def-icloud-locked", code: "ICLOUD_LOCKED", name: "Aparelho bloqueado no iCloud (NÃO COMPRAR)", category: "ICLOUD", description: "Bloqueio de ativação ativo.", type: "PERCENTAGE", value: 100, active: true },
  ];

  deflatorList.forEach((d) => {
    db.deflators.push({
      ...d,
      createdAt: now,
      updatedAt: now,
    } as Deflator);
  });

  saveDatabaseState();
  console.log("Database seeded and persisted successfully with 13-criteria official evaluation table.");
}
