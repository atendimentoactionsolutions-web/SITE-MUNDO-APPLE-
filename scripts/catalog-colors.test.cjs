const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const ts=require('typescript');
function load(file,imports={}){
 const module={exports:{}};
 const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
 vm.runInNewContext(code,{module,exports:module.exports,require:name=>{assert.ok(name in imports,name);return imports[name]}});
 return module.exports;
}
const colors=load('src/utils/product-colors.ts');
const {updateExistingCatalogPrices}=load('src/lib/catalog-price-update.ts',{'@/utils/product-colors':colors});
const {parseCatalogText}=load('src/lib/catalog-parser.ts');
const phone={id:'iphone-16-pro-max',name:'iPhone 16 Pro Max',active:false,variants:[
 {storage:'256GB',color:'Titânio Natural',price:7200,available:true},
 {storage:'512GB',color:'Titânio Natural',price:7649,available:false},
 {storage:'512GB',color:'Titânio Preto',price:7649,available:true},
 {storage:'256GB',color:'White Titanium',price:5800,available:true},
]};
test('table import translates colors and changes only exact existing configurations',()=>{
 const parsed=parseCatalogText('IPHONES NOVOS\n---\nIPHONE 16 PRO MAX 256GB\nNatural titanium • R$ 7.500,00\nIPHONE 16 PRO MAX 512GB\nNatural titanium • R$ 7.850,00\nBlack titanium • R$ 7.695,00\nIPHONE 18 PRO 2TB\nBlack • R$ 17.600,00',['iphone-16-pro-max']);
 const previous={'iphone-16-pro-max':{active:false,featured:true}};
 const snapshot=JSON.stringify(previous);
 const result=updateExistingCatalogPrices([phone],previous,parsed.productOverrides);
 assert.equal(JSON.stringify(previous),snapshot);
 assert.equal(result.matchedVariants,3);
 assert.equal(Object.keys(result.overrides).length,1);
 const p=result.overrides[phone.id];
 assert.equal(p.active,false);assert.equal(p.featured,true);
 assert.equal(p.variants.length,4);
 assert.equal(p.variants[0].price,7500);assert.equal(p.variants[1].price,7850);assert.equal(p.variants[2].price,7695);
 assert.equal(p.variants[1].available,false);assert.equal(p.variants[3].price,5800);
});
test('partial, empty and unknown lists preserve products and omitted options',()=>{
 const old={phone:{active:true,priceFrom:1000,variants:[{color:'Black',storage:'128GB',price:1000,available:true}]}};
 for(const incoming of [{},{unknown:{active:true,variants:[{color:'Black',price:2000,available:true}]}},{phone:{active:false}}]){
  const result=updateExistingCatalogPrices([{...phone,id:'phone'}],old,incoming);
  assert.equal(JSON.stringify(result.overrides),JSON.stringify(old));
 }
});
test('ambiguous and conflicting prices are rejected before saving',()=>{
 const p={...phone,id:'phone',variants:[{color:'Black',storage:'128GB',price:1000,available:true},{color:'Black',storage:'256GB',price:2000,available:true}]};
 assert.throws(()=>updateExistingCatalogPrices([p],{}, {phone:{variants:[{color:'Black',price:1500,available:true}]}}),/ambígua/);
 assert.throws(()=>updateExistingCatalogPrices([p],{}, {phone:{variants:[{color:'Black',storage:'128GB',price:1500,available:true},{color:'Black',storage:'128GB',price:1600,available:true}]}}),/conflitantes/);
});
test('parser retains 41/45mm watch sizes and Mac Studio capacity',()=>{
 const parsed=parseCatalogText('APPLE WATCHES\n---\nAPPLE WATCH S9 41MM\nRed • R$ 1.870,00\nAPPLE WATCH S9 GPS + CELULAR 45MM\nPink • R$ 2.450,00\nMACBOOKS & MACS\n---\nMAC STUDIO M5 MAX 512GB\nSem cor • R$ 24.600,00',[]);
 assert.equal(parsed.productOverrides['apple-watch-s9'].variants[0].size,'41mm');
 assert.equal(parsed.productOverrides['apple-watch-s9'].variants[1].size,'45mm');
 assert.equal(parsed.productOverrides['apple-watch-s9'].variants[1].chip,'GPS + Cellular');
 assert.equal(parsed.productOverrides['mac-studio-m5-max'].variants[0].storage,'512GB');
});
