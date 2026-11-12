import { ProductVariant } from "@/types/product";

export interface ParsedListResult {
  success: boolean;
  sectionsCount: number;
  configsCount: number;
  variantsCount: number;
  activeProductIds: string[];
  productOverrides: Record<
    string,
    {
      active: boolean;
      priceFrom?: number;
      variants?: ProductVariant[];
    }
  >;
  error?: string;
}

function formatColor(raw: string): string {
  const words = raw.trim().split(/\s+/);
  return words
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

export function parseCatalogText(
  text: string,
  existingProductIds: string[]
): ParsedListResult {
  const lines = text.split(/\r?\n/);

  let start = 0;
  let end = lines.length;

  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    if (l.includes("INÍCIO DA LISTA OFICIAL") || (l.includes("IN") && l.includes("CIO DA LISTA OFICIAL"))) {
      start = i + 1;
    }
    if (l.includes("FIM DA LISTA OFICIAL")) {
      end = i;
    }
  }

  let currentSection: string | null = null;
  let currentConfigName: string | null = null;

  interface RawConfig {
    section: string;
    configName: string;
    variants: Array<{ rawColor: string; price: number }>;
  }

  const configs: RawConfig[] = [];
  const variantLineRe = /^(.*?)\s*[•\u2022\u2013\u2014\-]\s*R\$\s*([\d\.\,]+)$/;

  for (let idx = start; idx < end; idx++) {
    const line = lines[idx].trim();
    if (!line) continue;

    if (line.startsWith("---")) continue;

    // Check if next non-empty line is divider
    if (idx + 1 < lines.length && lines[idx + 1].trim().startsWith("---")) {
      currentSection = line;
      continue;
    }

    const match = line.match(variantLineRe);
    if (match) {
      const color = match[1].trim();
      const priceStr = match[2].replace(/\./g, "").replace(",", ".");
      const price = parseFloat(priceStr);

      if (configs.length > 0) {
        configs[configs.length - 1].variants.push({
          rawColor: color,
          price,
        });
      }
    } else {
      currentConfigName = line;
      configs.push({
        section: currentSection || "GERAL",
        configName: currentConfigName,
        variants: [],
      });
    }
  }

  if (configs.length === 0) {
    return {
      success: false,
      sectionsCount: 0,
      configsCount: 0,
      variantsCount: 0,
      activeProductIds: [],
      productOverrides: {},
      error: "Nenhuma configuração encontrada no texto enviado. Verifique o formato.",
    };
  }

  const productVariants: Record<string, ProductVariant[]> = {};

  for (const c of configs) {
    const cfg = c.configName.toUpperCase();
    const sec = c.section.toUpperCase();
    const vars = c.variants;

    let pid: string | null = null;

    // IPHONES
    if (sec.includes("IPHONE")) {
      if (cfg.startsWith("IPHONE DUO")) pid = "iphone-duo";
      else if (cfg.startsWith("IPHONE 18 PRO MAX")) pid = "iphone-18-pro-max";
      else if (cfg.startsWith("IPHONE 18 PRO")) pid = "iphone-18-pro";
      else if (cfg.startsWith("IPHONE 17 PRO MAX")) pid = "iphone-17-pro-max";
      else if (cfg.startsWith("IPHONE 17 PRO")) pid = "iphone-17-pro";
      else if (cfg.startsWith("IPHONE 17 AIR")) pid = "iphone-17-air";
      else if (cfg.startsWith("IPHONE 17E")) pid = "iphone-17e";
      else if (cfg.startsWith("IPHONE 17")) pid = "iphone-17";
      else if (cfg.startsWith("IPHONE 16 PRO MAX")) pid = "iphone-16-pro-max";
      else if (cfg.startsWith("IPHONE 16 PRO")) pid = "iphone-16-pro";
      else if (cfg.startsWith("IPHONE 16 PLUS")) pid = "iphone-16-plus";
      else if (cfg.startsWith("IPHONE 16E")) pid = "iphone-16e";
      else if (cfg.startsWith("IPHONE 16")) pid = "iphone-16";
      else if (cfg.startsWith("IPHONE 15 PRO MAX")) pid = "iphone-15-pro-max";
      else if (cfg.startsWith("IPHONE 15 PLUS")) pid = "iphone-15-plus";
      else if (cfg.startsWith("IPHONE 15")) pid = "iphone-15";
      else if (cfg.startsWith("IPHONE 14 PLUS")) pid = "iphone-14-plus";
      else if (cfg.startsWith("IPHONE 13")) pid = "iphone-13";

      const storageMatch = cfg.match(/(128GB|256GB|512GB|1TB|2TB)/);
      const storage = storageMatch ? storageMatch[1] : undefined;

      if (pid) {
        if (!productVariants[pid]) productVariants[pid] = [];
        for (const v of vars) {
          productVariants[pid].push({
            storage,
            color: formatColor(v.rawColor),
            price: v.price,
            available: true,
          });
        }
      }
    }
    // IPADS
    else if (sec.includes("IPAD")) {
      if (cfg.startsWith("SMART FOLIO")) {
        pid = "smart-folio-ipad-air-13";
        if (!productVariants[pid]) productVariants[pid] = [];
        for (const v of vars) {
          productVariants[pid].push({
            color: formatColor(v.rawColor),
            price: v.price,
            available: true,
          });
        }
      } else {
        if (cfg.startsWith("IPAD PRO M5")) pid = "ipad-pro-m5";
        else if (cfg.startsWith("IPAD PRO M4")) pid = "ipad-pro-m4";
        else if (cfg.startsWith("IPAD AIR M4")) pid = "ipad-air-m4";
        else if (cfg.startsWith("IPAD AIR M3")) pid = "ipad-air-m3";
        else if (cfg.startsWith("IPAD MINI 7")) pid = "ipad-mini-7";
        else if (cfg.startsWith("IPAD MINI 6")) pid = "ipad-mini-6";
        else if (cfg.startsWith("IPAD 11")) pid = "ipad-11";
        else if (cfg.startsWith("IPAD PRO M2")) pid = "ipad-pro-m2-12-9";

        const szMatch = cfg.match(/(11"|13")/);
        const screenSize = szMatch ? szMatch[1] : undefined;
        const chip = cfg.includes("CELULAR") || cfg.includes("CELLULAR") ? "Wi-Fi + Cellular" : "Wi-Fi";
        const stMatch = cfg.match(/(128GB|256GB|512GB|1TB|2TB)/);
        const storage = stMatch ? stMatch[1] : undefined;

        if (pid) {
          if (!productVariants[pid]) productVariants[pid] = [];
          for (const v of vars) {
            productVariants[pid].push({
              storage,
              screenSize,
              chip,
              color: formatColor(v.rawColor),
              price: v.price,
              available: true,
            });
          }
        }
      }
    }
    // MACBOOKS & MACS
    else if (sec.includes("MAC")) {
      if (cfg.startsWith("MACBOOK PRO M5 PRO")) pid = "macbook-pro-m5-pro";
      else if (cfg.startsWith("MACBOOK PRO M5 MAX")) pid = "macbook-pro-m5-max";
      else if (cfg.startsWith("MACBOOK PRO M5")) pid = "macbook-pro-m5";
      else if (cfg.startsWith("MACBOOK AIR M5")) pid = "macbook-air-m5";
      else if (cfg.startsWith("MAC STUDIO M5 MAX")) pid = "mac-studio-m5-max";
      else if (cfg.startsWith("MACBOOK PRO M4 PRO")) pid = "macbook-pro-m4-pro";
      else if (cfg.startsWith("MACBOOK PRO M4 MAX")) pid = "macbook-pro-m4-max";
      else if (cfg.startsWith("MAC MINI M4 PRO")) pid = "mac-mini-m4-pro";
      else if (cfg.startsWith("MAC MINI M4")) pid = "mac-mini-m4";
      else if (cfg.startsWith("MAC STUDIO M4 MAX")) pid = "mac-studio-m4-max";
      else if (cfg.startsWith("MACBOOK AIR M4")) pid = "macbook-air-m4";
      else if (cfg.startsWith("IMAC M4 24")) pid = "imac-24-m4";
      else if (cfg.startsWith("MACBOOK NEO 13")) pid = "macbook-neo-13";
      else if (cfg.startsWith("MAC MINI M6")) pid = "mac-mini-m6";

      const szMatch = cfg.match(/(13"|14"|15"|16"|24")/);
      const screenSize = szMatch ? szMatch[1] : undefined;
      const ramMatch = cfg.match(/(\d+GB)\s+(\d+(?:GB|TB))/);
      const ram = ramMatch ? ramMatch[1] : undefined;
      const storage = ramMatch ? ramMatch[2] : cfg.match(/(\d+(?:GB|TB))$/)?.[1];

      let chip: string | undefined = undefined;
      if (cfg.includes("M5 PRO")) chip = "M5 Pro";
      else if (cfg.includes("M5 MAX")) chip = "M5 Max";
      else if (cfg.includes("M5")) chip = "M5";
      else if (cfg.includes("M4 PRO")) chip = "M4 Pro";
      else if (cfg.includes("M4 MAX")) chip = "M4 Max";
      else if (cfg.includes("M4")) chip = "M4";
      else if (cfg.includes("M6")) chip = "M6";
      else if (cfg.includes("NEO")) chip = "A18 Pro";

      if (pid) {
        if (!productVariants[pid]) productVariants[pid] = [];
        for (const v of vars) {
          productVariants[pid].push({
            screenSize,
            chip,
            ram,
            storage,
            color: formatColor(v.rawColor),
            price: v.price,
            available: true,
          });
        }
      }
    }
    // APPLE WATCH
    else if (sec.includes("WATCH")) {
      if (cfg.startsWith("APPLE WATCH ULTRA 4")) pid = "apple-watch-ultra-4";
      else if (cfg.startsWith("APPLE WATCH ULTRA 3")) pid = "apple-watch-ultra-3";
      else if (cfg.startsWith("APPLE WATCH ULTRA 2")) pid = "apple-watch-ultra-2";
      else if (cfg.startsWith("APPLE WATCH S12")) pid = "apple-watch-s12";
      else if (cfg.startsWith("APPLE WATCH S11")) pid = "apple-watch-s11";
      else if (cfg.startsWith("APPLE WATCH S10")) pid = "apple-watch-s10";
      else if (cfg.startsWith("APPLE WATCH S9")) pid = "apple-watch-s9";
      else if (cfg.startsWith("APPLE WATCH SE 3")) pid = "apple-watch-se-3";
      else if (cfg.startsWith("APPLE WATCH SE 2")) pid = "apple-watch-se-2";

      const szMatch = cfg.match(/(40mm|41mm|42mm|44mm|45mm|46mm|49mm)/i);
      const size = szMatch ? szMatch[1].toLowerCase() : undefined;
      const conn = cfg.includes("CELULAR") || cfg.includes("CELLULAR") ? "GPS + Cellular" : "GPS";

      if (pid) {
        if (!productVariants[pid]) productVariants[pid] = [];
        for (const v of vars) {
          const item: ProductVariant = {
            size,
            color: formatColor(v.rawColor),
            price: v.price,
            available: true,
          };
          if (cfg.includes("SE") || cfg.startsWith("APPLE WATCH S9")) {
            item.chip = conn;
          }
          productVariants[pid].push(item);
        }
      }
    }
    // AIRPODS
    else if (sec.includes("AIRPOD")) {
      if (cfg.includes("MAX 2")) pid = "airpods-max-2";
      else if (cfg.includes("MAX SMART CASE")) pid = "airpods-max-smart-case";
      else if (cfg.includes("PRO 3")) pid = "airpods-pro-3";
      else if (cfg.includes("PRO 2")) pid = "airpods-pro-2";
      else if (cfg.includes("PRO LIGHTNING")) pid = "airpods-pro-lightning";
      else if (cfg.includes("5 WIRELESS")) pid = "airpods-5-wireless";
      else if (cfg.includes("AIRPODS 5")) pid = "airpods-5";
      else if (cfg.includes("4 ANC")) pid = "airpods-4-anc";
      else if (cfg.includes("AIRPODS 4")) pid = "airpods-4";
      else if (cfg.includes("AIRPODS 3")) pid = "airpods-3";
      else if (cfg.includes("AIRPODS 2")) pid = "airpods-2";

      if (pid) {
        if (!productVariants[pid]) productVariants[pid] = [];
        for (const v of vars) {
          productVariants[pid].push({
            color: formatColor(v.rawColor),
            price: v.price,
            available: true,
          });
        }
      }
    }
    // ACESSÓRIOS
    else {
      if (cfg.includes("APPLE PENCIL PRO")) pid = "apple-pencil-pro";
      else if (cfg.includes("APPLE PENCIL 2")) pid = "apple-pencil-2";
      else if (cfg.includes("ADAPTADOR")) pid = "apple-pencil-com-adaptador";
      else if (cfg.includes("APPLE PENCIL USB-C")) pid = "apple-pencil-usbc";
      else if (cfg.includes("MAGIC KEYBOARD 11")) pid = "magic-keyboard-11";
      else if (cfg.includes("MAGIC KEYBOARD 12.9")) pid = "magic-keyboard-12-9";
      else if (cfg.includes("MAGIC KEYBOARD 13")) pid = "magic-keyboard-13";
      else if (cfg.includes("MAGIC KEYBOARD FOLIO")) pid = "magic-keyboard-folio";
      else if (cfg.includes("TOUCH ID + NUMERICO") || cfg.includes("NUMÉRICO")) pid = "magic-keyboard-touch-id-numeric";
      else if (cfg.includes("TOUCH ID")) pid = "magic-keyboard-touch-id";
      else if (cfg.includes("MAGIC MOUSE 2")) pid = "magic-mouse-2";
      else if (cfg.includes("MAGIC MOUSE 3")) pid = "magic-mouse-3";
      else if (cfg.includes("MAGIC TRACKPAD")) pid = "magic-trackpad";
      else if (cfg.includes("AIRTAG 2 4 PACK")) pid = "airtag-2-4pack";
      else if (cfg.includes("AIRTAG 2 1 PACK")) pid = "airtag-2-1pack";
      else if (cfg.includes("AIRTAG 1 PACK")) pid = "airtag-1pack";
      else if (cfg.includes("AIRTAG 4 PACK")) pid = "airtag-4pack";
      else if (cfg.includes("APPLE TV 4K 64GB")) pid = "apple-tv-4k-64gb";
      else if (cfg.includes("APPLE TV 4K 128GB")) pid = "apple-tv-4k-128gb";
      else if (cfg.includes("SMART KEYBOARD")) pid = "smart-keyboard";

      if (pid) {
        if (!productVariants[pid]) productVariants[pid] = [];
        for (const v of vars) {
          productVariants[pid].push({
            color: formatColor(v.rawColor),
            price: v.price,
            available: true,
          });
        }
      }
    }
  }

  // Generate overrides dictionary for all existing products
  const productOverrides: Record<string, { active: boolean; priceFrom?: number; variants?: ProductVariant[] }> = {};
  const activeProductIds = Object.keys(productVariants);

  // Active products in list
  for (const pid of activeProductIds) {
    const vars = productVariants[pid];
    const minPrice = vars.length > 0 ? Math.min(...vars.map((v) => v.price)) : 0;
    productOverrides[pid] = {
      active: true,
      priceFrom: minPrice,
      variants: vars,
    };
  }

  // Deactivate all existing products that are NOT in the list
  for (const pid of existingProductIds) {
    if (!productOverrides[pid]) {
      productOverrides[pid] = {
        active: false,
      };
    }
  }

  const distinctSections = new Set(configs.map((c) => c.section));
  const totalVariants = configs.reduce((acc, c) => acc + c.variants.length, 0);

  return {
    success: true,
    sectionsCount: distinctSections.size,
    configsCount: configs.length,
    variantsCount: totalVariants,
    activeProductIds,
    productOverrides,
  };
}
