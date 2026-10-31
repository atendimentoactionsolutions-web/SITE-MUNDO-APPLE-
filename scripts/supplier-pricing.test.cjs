const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const ts=require('typescript');
function load(file, imports={}) {
 imports = { './supplier-feed': { fetchSupplierItems: async () => [{name:'iPhone 17',storage:'256GB',color:'BLACK',price:4000.25,category:'IPH'}] }, './supplier-status': { readSyncStatus: () => null, writeSyncStatus() {} }, ...imports };
 const module={exports:{}};
 const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
 vm.runInNewContext(code,{module,exports:module.exports,require:n=>imports[n],console,global:{},process,fetch:async()=>({ok:true,json:async()=>({data:[{name:'iPhone 17',storage:'256GB',color:'BLACK',price:4000.25,category:'IPH'}]})}),setTimeout,clearTimeout,AbortController});
 return module.exports;
}
const product={id:'phone',name:'iPhone 17',slug:'iphone-17',category:'iphone',condition:'new',priceFrom:4750,variants:[{storage:'256GB',color:'BLACK',price:4750,available:true}]};
test('live prices preserve exact supplier price including cents',()=>{
 const {applyLivePrices}=load('src/lib/pricing/live-pricing.ts');
 const [p]=applyLivePrices([product],[{name:'IPHONE 17',category:'IPH',storage:'256GB',color:'BLACK',price:4000.25}]);
 assert.equal(p.priceFrom,4000.25);assert.equal(p.variants[0].price,4000.25);
});
test('synchronization replaces old marked-up prices with supplier prices',async()=>{
 let saved;
 const {syncSupplierPrices}=load('src/lib/supplier-sync.ts',{'@/data/products':{products:[product]},'./products-store':{getProductOverrides:()=>({}),saveOverrides:x=>saved=x}});
 const result=await syncSupplierPrices();
 assert.equal(result.success,true);assert.equal(saved.phone.priceFrom,4000.25);assert.equal(saved.phone.variants[0].price,4000.25);
});
test('used products keep valuation prices',()=>{
 const {applyLivePrices}=load('src/lib/pricing/live-pricing.ts');const used={...product,condition:'used'};
 assert.equal(applyLivePrices([used],[{name:'IPHONE 17',category:'IPH',price:100}])[0],used);
});

test('empty morning supplier list leaves the saved prices untouched',async()=>{
 const previous={phone:{priceFrom:4100,variants:[{storage:'256GB',color:'BLACK',price:4100,available:true}],supplierUpdatedAt:'2026-10-01T10:00:00Z'}};
 let saves=0;
 const {syncSupplierPrices}=load('src/lib/supplier-sync.ts',{
  '@/data/products':{products:[product]},
  './supplier-feed':{fetchSupplierItems:async()=>[]},
  './products-store':{getProductOverrides:()=>previous,saveOverrides:()=>saves++},
 });
 const result=await syncSupplierPrices();
 assert.equal(result.success,false); assert.equal(saves,0); assert.equal(previous.phone.priceFrom,4100); assert.equal(previous.phone.variants[0].price,4100);
});
test('missing product preserves its last price and timestamp',async()=>{
 const previous={phone:{priceFrom:4100,variants:[{storage:'256GB',color:'BLACK',price:4100,available:true}],supplierUpdatedAt:'2026-10-01T10:00:00Z'}};
 let saved;
 const {syncSupplierPrices}=load('src/lib/supplier-sync.ts',{
  '@/data/products':{products:[product]},
  './supplier-feed':{fetchSupplierItems:async()=>[{name:'iPhone 16',storage:'128GB',price:2000}]},
  './products-store':{getProductOverrides:()=>previous,saveOverrides:x=>saved=x},
 });
 await syncSupplierPrices();
 assert.equal(saved.phone.priceFrom,4100); assert.equal(saved.phone.supplierUpdatedAt,previous.phone.supplierUpdatedAt); assert.equal(saved.phone.variants,previous.phone.variants);
});
test('partial list updates the found variant and retains missing capacities',async()=>{
 const variants=[{storage:'256GB',color:'BLACK',price:3900,available:true},{storage:'512GB',color:'BLACK',price:6000,available:true}];
 let saved;
 const {syncSupplierPrices}=load('src/lib/supplier-sync.ts',{
  '@/data/products':{products:[{...product,variants}]},
  './products-store':{getProductOverrides:()=>({phone:{priceFrom:3900,variants}}),saveOverrides:x=>saved=x},
 });
 await syncSupplierPrices();
 assert.equal(saved.phone.variants[0].price,4000.25); assert.equal(saved.phone.variants[1].price,6000); assert.equal(saved.phone.priceFrom,4000.25);
});
test('supplier failure never writes over the price snapshot',async()=>{
 let saves=0;
 const {syncSupplierPrices}=load('src/lib/supplier-sync.ts',{
  '@/data/products':{products:[product]},
  './supplier-feed':{fetchSupplierItems:async()=>{throw new Error('offline')}},
  './products-store':{getProductOverrides:()=>({}),saveOverrides:()=>saves++},
 });
 assert.equal((await syncSupplierPrices()).success,false); assert.equal(saves,0);
});
test('saved prices remain visible after restart even with old timestamps',()=>{
 const old={phone:{priceFrom:4100,supplierUpdatedAt:'2020-01-01T00:00:00Z',variants:[{storage:'256GB',color:'BLACK',price:4100,available:true,supplierUpdatedAt:'2020-01-01T00:00:00Z'}]}};
 const imports={fs:{default:{existsSync:()=>true,readFileSync:()=>JSON.stringify(old)}},path:{default:require('node:path')},'@/data/products':{products:[product]},'./site-settings':{getSiteSettings:()=>({hideAllPrices:false})}};
 for(let restart=0;restart<2;restart++){
  const {getAllProductsWithOverrides}=load('src/lib/products-store.ts',imports);
  const p=getAllProductsWithOverrides()[0]; assert.equal(p.priceFrom,4100);assert.equal(p.variants[0].price,4100);assert.equal(p.variants[0].available,true);
 }
});
