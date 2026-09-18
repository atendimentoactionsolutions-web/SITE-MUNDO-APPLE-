import fs from "fs";
import path from "path";
import { products as currentProducts } from "../src/data/products";
import { Product, ProductVariant } from "../src/types/product";

interface RenderSupplierItem {
  id: string;
  name: string;
  category: "IPH" | "MCB" | "IMAC" | "RLG" | "PODS" | "IPAD" | "ACSS" | "SEMI" | string;
  storage?: string;
  color?: string;
  price: number;
  description?: string;
  region?: string;
  isActive?: boolean;
}

const COLOR_MAP: Record<string, string[]> = {
  black: ["BLACK", "PRETO", "SPACE BLACK", "TITÂNIO PRETO", "BLACK TITANIUM"],
  preto: ["BLACK", "PRETO", "SPACE BLACK", "TITÂNIO PRETO", "BLACK TITANIUM"],
  glacier: ["GLACIER"],
  burgundy: ["BURGUNDY", "BORDO", "BORDÔ"],
  bordo: ["BURGUNDY", "BORDO", "BORDÔ"],
  "bordô": ["BURGUNDY", "BORDO", "BORDÔ"],
  silver: ["SILVER", "PRATEADO", "PRATA", "WHITE TITANIUM", "TITÂNIO BRANCO"],
  prateado: ["SILVER", "PRATEADO", "PRATA", "WHITE TITANIUM", "TITÂNIO BRANCO"],
  "cosmic orange": ["COSMIC ORANGE", "ORANGE", "LARANJA"],
  "deep blue": ["DEEP BLUE", "AZUL ESCURO", "BLUE", "AZUL"],
  "space black": ["SPACE BLACK", "BLACK", "PRETO"],
  "sky blue": ["SKY BLUE", "AZUL CEU", "AZUL"],
  "cloud white": ["CLOUD WHITE", "WHITE", "BRANCO"],
  "light gold": ["LIGHT GOLD", "GOLD", "DOURADO"],
  sage: ["SAGE", "VERDE SAGE"],
  "mist blue": ["MIST BLUE", "BLUE", "AZUL"],
  lavender: ["LAVENDER", "LAVANDA"],
  white: ["WHITE", "BRANCO", "STARLIGHT", "BRANCO-ESTRELA"],
  branco: ["WHITE", "BRANCO", "STARLIGHT", "BRANCO-ESTRELA"],
  "soft pink": ["SOFT PINK", "PINK", "ROSA"],
  teal: ["TEAL", "VERDE TEAL"],
  ultramarine: ["ULTRAMARINE", "ULTRAMARINO", "AZUL ULTRAMARINO"],
  pink: ["PINK", "ROSA", "SOFT PINK"],
  rosa: ["PINK", "ROSA", "SOFT PINK"],
  blue: ["BLUE", "AZUL"],
  azul: ["BLUE", "AZUL"],
  green: ["GREEN", "VERDE"],
  verde: ["GREEN", "VERDE"],
  yellow: ["YELLOW", "AMARELO"],
  amarelo: ["YELLOW", "AMARELO"],
  midnight: ["MIDNIGHT", "MEIA-NOITE", "BLACK"],
  "meia-noite": ["MIDNIGHT", "MEIA-NOITE", "BLACK"],
  starlight: ["STARLIGHT", "ESTELAR", "BRANCO-ESTRELA"],
  estelar: ["STARLIGHT", "ESTELAR", "BRANCO-ESTRELA"],
  "branco-estrela": ["STARLIGHT", "ESTELAR", "BRANCO-ESTRELA", "CLOUD WHITE"],
  "céu noturno": ["SPACE BLACK", "MIDNIGHT", "BLACK", "DEEP BLUE"],
  "space gray": ["SPACE GRAY", "CINZA ESPACIAL", "CINZA-ESPACIAL"],
  "cinza espacial": ["SPACE GRAY", "CINZA ESPACIAL", "CINZA-ESPACIAL"],
  "cinza-espacial": ["SPACE GRAY", "CINZA ESPACIAL", "CINZA-ESPACIAL"],
  purple: ["PURPLE", "ROXO"],
  roxo: ["PURPLE", "ROXO"],
  "jet black": ["JET BLACK", "BLACK", "PRETO"],
  "natural titanium": ["NATURAL", "TITÂNIO NATURAL", "NATURAL TITANIUM"],
  "titânio natural": ["NATURAL", "TITÂNIO NATURAL", "NATURAL TITANIUM"],
  "desert titanium": ["DESERT TITANIUM", "TITÂNIO DESERTO", "DESERT"],
  "titânio deserto": ["DESERT TITANIUM", "TITÂNIO DESERTO", "DESERT"],
  "rose gold": ["ROSE GOLD", "ROSE", "DOURADO"],
};

function normalizeStr(str?: string): string {
  if (!str) return "";
  return str.trim().toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, " ");
}

function matchColor(targetColor?: string, supplierColor?: string): boolean {
  if (!targetColor) return true;
  if (!supplierColor) return true; // Supplier didn't specify color, generic offer

  const normTarget = targetColor.trim().toLowerCase();
  const normSupplier = normalizeStr(supplierColor);

  const aliases = COLOR_MAP[normTarget];
  if (aliases) {
    return aliases.some(a => normSupplier.includes(normalizeStr(a)));
  }

  return normSupplier.includes(normalizeStr(targetColor));
}

function normalizeStorage(str?: string): string {
  if (!str) return "";
  return str.toUpperCase().replace(/\s+/g, "").replace(/["\']/g, "");
}

function matchStorage(targetStorage?: string, supplierStorage?: string): boolean {
  if (!targetStorage) return true;
  if (!supplierStorage) return false;

  const t = normalizeStorage(targetStorage);
  const s = normalizeStorage(supplierStorage);

  return s.includes(t) || t.includes(s);
}

async function runSync() {
  console.log("==================================================");
  console.log("🚀 Sincronizador de Preços — Loja Física Mundo Apple");
  console.log("==================================================");

  // 1. Fetch Supplier Catalog
  console.log("📥 Buscando dados de https://mundo-apple-buscador.onrender.com/api/products ...");
  let rawSupplierItems: RenderSupplierItem[] = [];
  try {
    const res = await fetch("https://mundo-apple-buscador.onrender.com/api/products");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    rawSupplierItems = data.data || [];
    console.log(`✅ ${rawSupplierItems.length} ofertas recebidas da API.`);
  } catch (err: any) {
    console.error("❌ Falha ao buscar produtos da API do buscador:", err.message);
    process.exit(1);
  }

  // Filter out CPO, AS IS, and price <= 0
  const supplierItems = rawSupplierItems.filter(p => {
    if (!p.price || p.price <= 0) return false;
    const name = normalizeStr(p.name);
    const desc = normalizeStr(p.description);
    const cat = normalizeStr(p.category);
    if (name.includes("AS IS") || desc.includes("AS IS") || cat.includes("AS IS")) return false;
    if (name.includes("CPO") || desc.includes("CPO") || cat.includes("CPO")) return false;
    return true;
  });

  // 2. Fetch Store Margins
  console.log("📥 Buscando margens de lucro oficiais...");
  let margins = {
    IPH18: 1100,
    IPH: 750,
    MCB_AIR: 1000,
    MCB_PRO: 1300,
    IPAD: 500,
    RLG: 500,
    IMAC: 1500,
    PODS: 200,
    ACSS: 100,
    SEMINOVOS: 600,
  };

  try {
    const marginsRes = await fetch("https://mundo-apple-buscador.onrender.com/api/margins");
    if (marginsRes.ok) {
      const marginsData = await marginsRes.json();
      if (marginsData.success && marginsData.margins?.categories) {
        margins = { ...margins, ...marginsData.margins.categories };
        console.log("✅ Margens dinâmicas carregadas do servidor:", margins);
      }
    }
  } catch (err: any) {
    console.warn("⚠️ Usando tabela de margens padrão:", margins);
  }

  function getMargin(product: Product): number {
    const name = normalizeStr(product.name);
    const cat = normalizeStr(product.category);

    if (name.includes("IPHONE 18") || name.includes("IPH 18")) return margins.IPH18 ?? 1100;
    if (cat === "IPHONE" || cat === "IPH" || name.includes("IPHONE")) return margins.IPH ?? 750;
    if (name.includes("MACBOOK AIR") || (cat === "MAC" && name.includes("AIR"))) return margins.MCB_AIR ?? 1000;
    if (cat === "MAC" || name.includes("MACBOOK") || name.includes("MAC MINI") || name.includes("IMAC")) {
      if (cat === "IMAC" || name.includes("IMAC")) return margins.IMAC ?? 1500;
      return margins.MCB_PRO ?? 1300;
    }
    if (cat === "IPAD" || name.includes("IPAD")) return margins.IPAD ?? 500;
    if (cat === "WATCH" || cat === "RLG" || name.includes("WATCH")) return margins.RLG ?? 500;
    if (cat === "AIRPODS" || cat === "PODS" || name.includes("AIRPOD")) return margins.PODS ?? 200;
    if (cat === "ACCESSORIES" || cat === "ACSS" || name.includes("PENCIL") || name.includes("AIRTAG") || name.includes("MAGIC")) return margins.ACSS ?? 100;
    return 500;
  }

  // 3. Match and Update Site Products
  console.log("\n🔄 Cruzando dados para os produtos do catálogo do site...\n");

  const updatedProducts: Product[] = currentProducts.map(prod => {
    // Only update new products; do not touch used (seminovos) or inactive products
    if (prod.condition === "used" || !prod.active) {
      return prod;
    }

    const margin = getMargin(prod);
    const prodSlug = prod.slug.toLowerCase();
    const prodCat = prod.category.toLowerCase();

    // 3.1 Matcher filter helper for each product
    function filterSupplierCandidates(variant?: ProductVariant): RenderSupplierItem[] {
      const vStorage = variant?.storage;
      const vColor = variant?.color;
      const vScreenSize = variant?.screenSize || (variant as any)?.size;
      const vChip = variant?.chip;
      const vRam = variant?.ram;

      return supplierItems.filter(item => {
        const itemName = normalizeStr(item.name);
        const itemCat = normalizeStr(item.category);

        // 1. IPHONES
        if (prodCat === "iphone") {
          if (itemCat !== "IPH") return false;

          if (prodSlug === "iphone-18-pro-max") {
            if (!itemName.includes("IPHONE 18 PRO MAX") && !itemName.includes("IPH 18 PRO MAX")) return false;
          } else if (prodSlug === "iphone-18-pro") {
            if ((!itemName.includes("IPHONE 18 PRO") && !itemName.includes("IPH 18 PRO")) || itemName.includes("MAX")) return false;
          } else if (prodSlug === "iphone-17-pro-max") {
            if (!itemName.includes("IPHONE 17 PRO MAX") && !itemName.includes("IPH 17 PRO MAX")) return false;
          } else if (prodSlug === "iphone-17-pro") {
            if ((!itemName.includes("IPHONE 17 PRO") && !itemName.includes("IPH 17 PRO")) || itemName.includes("MAX")) return false;
          } else if (prodSlug === "iphone-17-air") {
            if (!itemName.includes("IPHONE 17 AIR") && !itemName.includes("IPH 17 AIR")) return false;
          } else if (prodSlug === "iphone-17e") {
            if (!itemName.includes("IPHONE 17E") && !itemName.includes("IPH 17E")) return false;
          } else if (prodSlug === "iphone-17") {
            if ((!itemName.includes("IPHONE 17") && !itemName.includes("IPH 17")) || itemName.includes("PRO") || itemName.includes("AIR") || itemName.includes("17E")) return false;
          } else if (prodSlug === "iphone-16") {
            if ((!itemName.includes("IPHONE 16") && !itemName.includes("IPH 16")) || itemName.includes("PRO") || itemName.includes("16E") || itemName.includes("PLUS")) return false;
          } else if (prodSlug === "iphone-15") {
            if ((!itemName.includes("IPHONE 15") && !itemName.includes("IPH 15")) || itemName.includes("PRO") || itemName.includes("PLUS")) return false;
          } else if (prodSlug === "iphone-duo") {
            if (!itemName.includes("IPHONE DUO") && !itemName.includes("IPHONE FOLD")) return false;
          } else {
            return false;
          }

          if (vStorage && !matchStorage(vStorage, item.storage)) return false;
          if (vColor && !matchColor(vColor, item.color)) return false;

          return true;
        }

        // 2. MACS & MACBOOKS & IMAC
        if (prodCat === "mac") {
          if (itemCat !== "MCB" && itemCat !== "IMAC") return false;

          if (prodSlug === "macbook-air-m5") {
            if (!itemName.includes("MACBOOK AIR M5") && !itemName.includes("AIR M5")) return false;
            if (vScreenSize && !itemName.includes(normalizeStorage(vScreenSize))) return false;
            if (vRam && vRam !== "16GB" && !normalizeStr(item.description || item.name).includes(normalizeStorage(vRam))) return false;
          } else if (prodSlug === "macbook-pro-m5-pro") {
            if (!itemName.includes("MACBOOK PRO M5 PRO") && !itemName.includes("PRO M5 PRO")) return false;
            if (vScreenSize && !itemName.includes(normalizeStorage(vScreenSize))) return false;
            if (vRam && vRam !== "24GB" && !normalizeStr(item.description || item.name).includes(normalizeStorage(vRam))) return false;
          } else if (prodSlug === "macbook-pro-m5-max") {
            if (!itemName.includes("MACBOOK PRO M5 MAX") && !itemName.includes("PRO M5 MAX")) return false;
            if (vScreenSize && !itemName.includes(normalizeStorage(vScreenSize))) return false;
          } else if (prodSlug === "macbook-pro-m5") {
            if ((!itemName.includes("MACBOOK PRO M5") && !itemName.includes("PRO M5")) || itemName.includes("MAX") || itemName.includes("M5 PRO")) return false;
            if (vScreenSize && !itemName.includes(normalizeStorage(vScreenSize))) return false;
          } else if (prodSlug === "mac-mini-m4") {
            if (!itemName.includes("MAC MINI M4") && !itemName.includes("MINI M4")) return false;
          } else if (prodSlug === "imac-24-m4") {
            if (!itemName.includes("IMAC M4") && !itemName.includes("IMAC 24 M4")) return false;
          } else {
            return false;
          }

          if (vStorage && !matchStorage(vStorage, item.storage)) return false;
          if (vColor && item.color && !matchColor(vColor, item.color)) return false;

          return true;
        }

        // 3. IPAD
        if (prodCat === "ipad") {
          if (itemCat !== "IPAD" && itemCat !== "IPD") return false;

          if (prodSlug === "ipad-11") {
            if (!itemName.includes("IPAD 11")) return false;
          } else if (prodSlug === "ipad-pro-m5") {
            if (!itemName.includes("IPAD PRO M5") && !itemName.includes("PRO M5")) return false;
            if (vScreenSize && !itemName.includes(normalizeStorage(vScreenSize))) return false;
          } else {
            return false;
          }

          if (vStorage && !matchStorage(vStorage, item.storage)) return false;
          if (vColor && item.color && !matchColor(vColor, item.color)) return false;

          return true;
        }

        // 4. APPLE WATCH
        if (prodCat === "watch") {
          if (itemCat !== "RLG") return false;

          if (prodSlug === "apple-watch-s11") {
            if (!itemName.includes("WATCH S11") && !itemName.includes("SERIES 11")) return false;
            if (vScreenSize && !normalizeStorage(item.storage).includes(normalizeStorage(vScreenSize))) return false;
          } else if (prodSlug === "apple-watch-ultra-3") {
            if (!itemName.includes("WATCH ULTRA 3") && !itemName.includes("ULTRA 3")) return false;
          } else if (prodSlug === "apple-watch-se-3") {
            if (!itemName.includes("WATCH SE 3") && !itemName.includes("SE 3")) return false;
            if (vScreenSize && !normalizeStorage(item.storage).includes(normalizeStorage(vScreenSize))) return false;
          } else {
            return false;
          }

          if (vColor && item.color && !matchColor(vColor, item.color)) return false;

          return true;
        }

        // 5. AIRPODS
        if (prodCat === "airpods") {
          if (itemCat !== "PODS") return false;

          if (prodSlug === "airpods-4") {
            if (itemName !== "AIRPODS 4") return false;
          } else if (prodSlug === "airpods-4-anc") {
            if (itemName !== "AIRPODS 4 ANC") return false;
          } else if (prodSlug === "airpods-pro-3") {
            if (!itemName.includes("AIRPODS PRO 3") && !itemName.includes("PRO 3")) return false;
          } else if (prodSlug === "airpods-max-2") {
            if (!itemName.includes("AIRPODS MAX 2") && !itemName.includes("MAX 2")) return false;
          } else {
            return false;
          }

          if (vColor && item.color && !matchColor(vColor, item.color)) return false;

          return true;
        }

        // 6. ACCESSORIES
        if (prodCat === "accessories") {
          if (itemCat !== "ACSS") return false;

          if (prodSlug === "apple-pencil-pro") {
            if (!itemName.includes("PENCIL PRO")) return false;
          } else if (prodSlug === "apple-pencil-usbc") {
            if (!itemName.includes("PENCIL USB-C") && !itemName.includes("PENCIL TYPE C")) return false;
          } else if (prodSlug === "apple-pencil-2") {
            if (!itemName.includes("PENCIL 2") && !itemName.includes("PENCIL 2A")) return false;
          } else if (prodSlug === "airtag-2-1pack") {
            if (!itemName.includes("AIRTAG 1") && !itemName.includes("AIRTAG 1 PACK")) return false;
          } else if (prodSlug === "airtag-2-4pack") {
            if (!itemName.includes("AIRTAG 4") && !itemName.includes("AIRTAG 4 PACK")) return false;
          } else if (prodSlug.includes("magic-mouse")) {
            if (!itemName.includes("MAGIC MOUSE")) return false;
          } else {
            return false;
          }

          return true;
        }

        return false;
      });
    }

    const updated = { ...prod };

    if (prod.variants && prod.variants.length > 0) {
      let updatedVariantsCount = 0;
      const newVariants = prod.variants.map(v => {
        const candidates = filterSupplierCandidates(v);
        if (candidates.length > 0) {
          const minSupplierPrice = Math.min(...candidates.map(c => c.price));
          if (minSupplierPrice > 0) {
            const retailPrice = minSupplierPrice + margin;
            updatedVariantsCount++;
            return {
              ...v,
              price: retailPrice,
            };
          }
        }
        return v;
      });

      updated.variants = newVariants;

      const validPrices = newVariants.map(v => v.price).filter(p => p > 0);
      if (validPrices.length > 0) {
        updated.priceFrom = Math.min(...validPrices);
      }

      if (updatedVariantsCount > 0) {
        console.log(`📱 ${prod.name}: ${updatedVariantsCount}/${prod.variants.length} variantes atualizadas | Preço a partir de: R$ ${updated.priceFrom.toLocaleString('pt-BR')}`);
      }
    } else {
      const candidates = filterSupplierCandidates();
      if (candidates.length > 0) {
        const minSupplierPrice = Math.min(...candidates.map(c => c.price));
        if (minSupplierPrice > 0) {
          const retailPrice = minSupplierPrice + margin;
          updated.priceFrom = retailPrice;
          console.log(`🎧 ${prod.name}: atualizado para R$ ${updated.priceFrom.toLocaleString('pt-BR')}`);
        }
      }
    }

    return updated;
  });

  // 4. Save to src/data/products.ts
  const targetFile = path.join(process.cwd(), "src/data/products.ts");
  const fileContent = `import { Product } from "@/types/product";\n\nexport const products: Product[] = ${JSON.stringify(updatedProducts, null, 2)};\n`;

  fs.writeFileSync(targetFile, fileContent, "utf-8");
  console.log("\n💾 Catálogo src/data/products.ts salvo com sucesso!");
  console.log("✨ Sincronização concluída com 100% de sucesso.\n");
}

runSync();
