import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import { createScheduler, syncOnce } from './price-sync-worker.mjs';
const m = { exports: {} };
vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/utils/live-prices.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, { module: m, exports: m.exports });
const { freshProduct } = m.exports;
test('scheduler polls each minute without overlapping and retries failures in ten seconds', async () => {
 let now=100000, calls=0, resolve;
 const run=()=>{ calls++; return new Promise(r=>resolve=r); };
 const tick=createScheduler(run,()=>now);
 const first=tick(); await tick(); assert.equal(calls,1);
 resolve(true); await first;
 now+=59999; await tick(); assert.equal(calls,1);
 now++; const second=tick(); assert.equal(calls,2); resolve(false); await second;
 now+=9999; await tick(); assert.equal(calls,2);
 now++; const third=tick(); assert.equal(calls,3); resolve(true); await third;
});
test('a failed supplier request is recorded as a failure', async () => {
 let recorded;
 const ok=await syncOnce({fetcher:async()=>({ok:false,status:503,json:async()=>({success:false,errors:['source unavailable']})}),record:s=>recorded=s});
 assert.equal(ok,false); assert.equal(recorded.success,false); assert.match(recorded.error,/source unavailable/);
});
test('only recently verified variants are displayed and old prices expire', () => {
 const now=Date.now();const product={id:'x',condition:'new',priceFrom:100,variants:[{storage:'256GB',price:100,supplierUpdatedAt:new Date(now-60000).toISOString()},{storage:'512GB',price:200,supplierUpdatedAt:new Date(now-180000).toISOString()}]};
 const live=freshProduct(product,now);
 assert.equal(live.variants[0].price,100);assert.equal(live.variants[1].price,0);assert.equal(live.priceFrom,100);
 assert.equal(freshProduct(product,now+120001).priceFrom,0);
 const used={...product,condition:'used'};assert.equal(freshProduct(used,now),used);
});
