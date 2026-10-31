import fs from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
export async function syncOnce({ fetcher = fetch, endpoint = process.env.SYNC_ENDPOINT || 'http://127.0.0.1:3000/api/cron/sync-supplier', record = () => {} } = {}) {
  const lastAttemptAt = new Date().toISOString();
  try {
    const response = await fetcher(endpoint, { signal: AbortSignal.timeout(25000), cache: 'no-store' });
    const result = await response.json();
    if (!response.ok || !result.success) throw new Error(result.errors?.join(', ') || `HTTP ${response.status}`);
    record({ lastAttemptAt, success: true });
    console.log(JSON.stringify({ event: 'supplier-sync', ...result }));
    return true;
  } catch (error) {
    record({ lastAttemptAt, success: false, error: error.message });
    console.error(JSON.stringify({ event: 'supplier-sync-failed', lastAttemptAt, error: error.message }));
    return false;
  }
}
async function main() {
  let busy = false;
  let lastAttempt = 0;
  let previousSuccess = false;
  const record = state => {
    fs.mkdirSync('/app/data', { recursive: true });
    fs.writeFileSync('/app/data/price-worker.json.tmp', JSON.stringify(state));
    fs.renameSync('/app/data/price-worker.json.tmp', '/app/data/price-worker.json');
  };
  const tick = async () => {
    if (busy || Date.now() - lastAttempt < (previousSuccess ? 60000 : 10000)) return;
    busy = true;
    lastAttempt = Date.now();
    try { previousSuccess = await syncOnce({ record }); }
    finally { busy = false; }
  };
  await tick();
  setInterval(() => tick().catch(error => console.error(error.message)), 1000);
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) main().catch(error => { console.error(error); process.exitCode = 1; });
