import fs from "fs";
import path from "path";

const SETTINGS_FILE = path.join(process.cwd(), "site_settings.json");

export interface SiteSettings {
  hideAllPrices: boolean; // When true, all prices across the site become "Sob Consulta"
  categoryMargins: CategoryMargins;
}

const DEFAULT_SETTINGS: SiteSettings = {
  hideAllPrices: false,
  categoryMargins: {
    iphone: 300,
    mac: 300,
    ipad: 200,
    watch: 200,
    airpods: 150,
    accessories: 100,
  },
};

declare global {
  var __siteSettings: SiteSettings | undefined;
}

export function getSiteSettings(): SiteSettings {
  if (global.__siteSettings) {
    return global.__siteSettings;
  }
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const data = fs.readFileSync(SETTINGS_FILE, "utf-8");
      const parsed = JSON.parse(data);
      global.__siteSettings = {
        hideAllPrices: typeof parsed.hideAllPrices === "boolean" ? parsed.hideAllPrices : false,
      };
      return global.__siteSettings!;
    }
  } catch (err) {
    console.error("Error reading site_settings.json:", err);
  }
  global.__siteSettings = { ...DEFAULT_SETTINGS };
  return global.__siteSettings;
}

export function updateSiteSettings(settings: Partial<SiteSettings>): SiteSettings {
  const current = getSiteSettings();
  const updated: SiteSettings = {
    hideAllPrices: settings.hideAllPrices ?? current.hideAllPrices,
  };
  global.__siteSettings = updated;
  try {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(updated, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing site_settings.json:", err);
  }
  return updated;
}
