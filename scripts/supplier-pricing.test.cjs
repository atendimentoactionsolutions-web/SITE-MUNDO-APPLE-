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

test('used products keep valuation prices',()=>{
 const {applyLivePrices}=load('src/lib/pricing/live-pricing.ts');const used={...product,condition:'used'};
 assert.equal(applyLivePrices([used],[{name:'IPHONE 17',category:'IPH',price:100}])[0],used);
});





test('saved prices remain visible after restart even with old timestamps',()=>{
 const old={phone:{priceFrom:4100,supplierUpdatedAt:'2020-01-01T00:00:00Z',variants:[{storage:'256GB',color:'BLACK',price:4100,available:true,supplierUpdatedAt:'2020-01-01T00:00:00Z'}]}};
 const imports={fs:{default:{existsSync:()=>true,readFileSync:()=>JSON.stringify(old)}},path:{default:require('node:path')},'@/data/products':{products:[product]},'./site-settings':{getSiteSettings:()=>({hideAllPrices:false})}};
 for(let restart=0;restart<2;restart++){
  const {getAllProductsWithOverrides}=load('src/lib/products-store.ts',imports);
  const p=getAllProductsWithOverrides()[0]; assert.equal(p.priceFrom,4100);assert.equal(p.variants[0].price,4100);assert.equal(p.variants[0].available,true);
 }
});

test('manual mode never fetches supplier prices or overwrites the saved catalog',async()=>{
 let reads=0, saves=0;
 const previous={phone:{priceFrom:4100,variants:[{storage:'256GB',color:'BLACK',price:4100,available:true}]}};
 const snapshot=JSON.stringify(previous);
 const {syncSupplierPrices,getLastSupplierSync}=load('src/lib/supplier-sync.ts',{
  '@/data/products':{products:[product]},
  './supplier-feed':{fetchSupplierItems:async()=>{reads++;throw new Error('Supplier must not be called in manual mode')}},
  './products-store':{getProductOverrides:()=>previous,saveOverrides:()=>saves++},
 });
 const result=await syncSupplierPrices();
 assert.equal(reads,0);assert.equal(saves,0);assert.equal(JSON.stringify(previous),snapshot);
 assert.equal(result.updatedVariantsCount,0);assert.equal(result.matchedProductsCount,0);
 assert.ok(result.errors.some(message=>message.includes('Modo manual ativo')));
 assert.equal(getLastSupplierSync(),undefined);
});
