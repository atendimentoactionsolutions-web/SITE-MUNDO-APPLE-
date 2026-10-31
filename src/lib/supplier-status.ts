import fs from "node:fs";
import path from "node:path";

export const SYNC_INTERVAL_MS = 60_000;
export const PRICE_MAX_AGE_MS = 120_000;
export function readSyncStatus(): any {
  try { return JSON.parse(fs.readFileSync(process.env.SUPPLIER_STATUS_FILE || path.join(process.cwd(), "supplier_sync_status.json"), "utf8")); }
  catch { return null; }
}
export function writeSyncStatus(result: object): void {
  const file = process.env.SUPPLIER_STATUS_FILE || path.join(process.cwd(), "supplier_sync_status.json");
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const temporary = file + ".tmp";
  fs.writeFileSync(temporary, JSON.stringify(result, null, 2), "utf8");
  fs.renameSync(temporary, file);
}
export function isFreshPrice(timestamp?: string): boolean {
  const age = Date.now() - Date.parse(timestamp || "");
  return Number.isFinite(age) && age >= 0 && age <= PRICE_MAX_AGE_MS;
}
