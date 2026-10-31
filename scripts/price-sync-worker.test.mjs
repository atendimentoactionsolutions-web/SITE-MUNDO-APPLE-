import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createScheduler, syncOnce } from './price-sync-worker.mjs';
test('scheduler waits ten minutes after success or failure and does not overlap', async () => {
 let now=0, calls=0, resolve;
 const tick=createScheduler(()=>{ calls++; return new Promise(r=>resolve=r); },()=>now);
 const first=tick(); await tick(); assert.equal(calls,1);
 resolve(true); await first;
 now+=599999; await tick(); assert.equal(calls,1);
 now++; const second=tick(); assert.equal(calls,2); resolve(false); await second;
 now+=599999; await tick(); assert.equal(calls,2);
 now++; const third=tick(); assert.equal(calls,3); resolve(true); await third;
});
test('an unavailable supplier is recorded as a failure', async () => {
 let recorded;
 const ok=await syncOnce({fetcher:async()=>({ok:false,status:503,json:async()=>({success:false,errors:['source unavailable']})}),record:s=>recorded=s});
 assert.equal(ok,false); assert.equal(recorded.success,false); assert.match(recorded.error,/source unavailable/);
});
