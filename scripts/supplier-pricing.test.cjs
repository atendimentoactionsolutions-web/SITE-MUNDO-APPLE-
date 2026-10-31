const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const ts=require('typescript');
function load(file, imports={}) {
 const module={exports:{}};
 const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
 vm.runInNewContext(code,{module,exports:module.exports,require:n=>imports[n],console,global:{},fetch:async()=>({ok:true,json:async()=>({data:[{name:'iPhone 17',storage:'256GB',color:'BLACK',price:4000.25,category:'IPH'}]})}),setTimeout,clearTimeout,AbortController});
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
