const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const React = require('react');

function loadProductColors() {
  const module = { exports: {} };
  const source = fs.readFileSync(path.join(__dirname, '../src/utils/product-colors.ts'), 'utf8');
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  vm.runInNewContext(code, { module, exports: module.exports });
  return module.exports;
}

// Exercise client state and handlers without a browser or production data writes.
function componentHarness(file, exportName, extra = {}) {
  const state = [];
  let cursor = 0;
  const hooks = {
    ...React,
    useState(initial) {
      const index = cursor++;
      if (!(index in state)) state[index] = typeof initial === 'function' ? initial() : initial;
      return [state[index], value => { state[index] = typeof value === 'function' ? value(state[index]) : value; }];
    },
    useMemo: fn => fn(),
    useEffect() {},
    useRef: value => ({ current: value }),
  };
  const source = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  }).outputText;
  const mod = { exports: {} };
  const imports = {
    './LivePricesProvider': { useLiveProduct: p => p },
    '@/components/products/LivePricesProvider': { useLiveCatalog: p => p, useLivePrice: (_, p) => p },
    '@/utils/product-colors': loadProductColors(),
    react: hooks,
    'react-dom': { createPortal: (children, target) => ({ portal: children, target }) },
    'react/jsx-runtime': require('react/jsx-runtime'),
    'next/link': 'a',
    'next/image': 'img',
    'next/navigation': { useSearchParams: () => new URLSearchParams() },
    'lucide-react': new Proxy({}, { get: (_, key) => key === '__esModule' ? false : String(key) }),
    '@/utils/formatters': { formatCurrency: price => `BRL ${price}`, formatConditionLabel: x => x },
    '@/utils/whatsapp': { createWhatsAppLink: text => text },
    '@/utils/installments': { getMaxInstallment: price => ({ installmentValue: price / 18 }), calculateInstallments: () => [] },
    '@/data/products': { products: [] },
    '@/data/storeConfig': { storeConfig: { contact: {} } },
    './InstallmentsModal': { InstallmentsModal: 'installments-modal' },
    '@/components/ui/Button': { Button: 'button' },
    '@/components/ui/Badge': { Badge: 'span' },
  };
  vm.runInNewContext(compiled, {
    exports: mod.exports, module: mod,
    require: name => {
      assert.ok(name in imports, `Unexpected import: ${name}`);
      return imports[name];
    },
    window: { open() {} }, document: { body: {} },
    URLSearchParams, console: { ...console, error() {} },
    ...extra,
  }, { filename: file });
  return props => { cursor = 0; return mod.exports[exportName](props); };
}

function nodes(root) {
  if (!root || typeof root !== 'object') return [];
  if (Array.isArray(root)) return root.flatMap(nodes);
  return [root, ...nodes(root.props?.children)];
}

const product = {
  id: 'regression', slug: 'regression', name: 'Regression phone', category: 'iphone',
  condition: 'new', active: true, priceFrom: 1000, image: '/test.jpg', colors: ['Black', 'White'],
};

for (const name of ['ProductCard', 'ProductDetailOptions']) {
  test(`${name}: colors without variants remain selectable`, () => {
    const render = componentHarness(`src/components/products/${name}.tsx`, name);
    const props = { product };
    const isWhiteButton = n => n.type === 'button' && (n.props.title === 'White' || nodes(n.props.children).some(child => child.props?.children === 'White'));
    const button = nodes(render(props)).find(isWhiteButton);
    assert.ok(button, 'White selector exists');
    button.props.onClick();
    const selected = nodes(render(props)).find(isWhiteButton);
    assert.match(selected.props.className, /bg-apple-blue\/10|ring-2 ring-offset-2/);
  });

  test(`${name}: a zero-price variant never inherits another configuration's price`, () => {
    const render = componentHarness(`src/components/products/${name}.tsx`, name);
    const tree = render({ product: { ...product, variants: [{ color: 'Black', price: 0, available: true }] } });
    assert.ok(!JSON.stringify(tree).includes('BRL 1000'), 'Consultation variant must not advertise base price');
    assert.ok(!nodes(tree).some(n => n.type === 'button' && nodes(n.props.children).some(child => child.props?.children === 'Ver parcelas')));
  });
}

for (const [file, name] of [
  ['src/components/sell/SellWizard.tsx', 'SellWizard'],
  ['src/components/trade-in/TradeInCalculator.tsx', 'TradeInCalculator'],
]) {
  test(`${name}: unsuccessful quote responses cannot report success`, async () => {
    const source = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
    const start = source.indexOf('  const handleFinalSubmit =');
    const end = source.indexOf('\n  };', start) + '\n  };'.length;
    const handler = ts.transpileModule(source.slice(start, end), {
      compilerOptions: { module: ts.ModuleKind.CommonJS },
    }).outputText;
    for (const response of [
      { ok: false, json: async () => ({ success: false }) },
      { ok: true, json: async () => ({ success: true }) },
      new Error('Offline'),
      { ok: true, json: async () => ({ success: true, quote: { publicCode: 'COT-REAL' } }) },
    ]) {
      let success = false;
      let error = '';
      const context = {
        submitting: false, selectedModel: { id: 'model' }, selectedStorage: { id: 'storage' },
        customerName: 'Test', customerWhatsapp: '11999999999', boardStatus: 'board_ok', icloudStatus: 'unlocked',
        batteryHealth: '90_plus', screenCondition: 'perfect', backCondition: 'perfect', sidesCondition: 'perfect',
        replacedPartsStatus: 'no', selectedReplacedParts: [], selectedUpgradeCategory: 'iphone',
        selectedNewProduct: product, selectedNewStorage: '128GB', selectedNewColor: 'Black', selectedNewPrice: 1000,
        setSubmitError: value => { error = value; }, setSubmitting() {}, setQuotePublicCode() {},
        setQuoteSuccess: value => { success = value; }, setEstimatedPrice() {}, setCalculationData() {},
        fetch: async () => { if (response instanceof Error) throw response; return response; },
        console: { error() {} },
      };
      await vm.runInNewContext(`${handler}\nhandleFinalSubmit()`, context);
      const expectedSuccess = response.ok && !!(await response.json()).quote?.publicCode;
      assert.equal(success, !!expectedSuccess);
      assert.equal(!!error, !expectedSuccess);
    }
  });
}

for (const name of ['ProductCard', 'ProductDetailOptions']) {
  test(`${name}: only stored capacities and colors for the selected configuration are offered`, () => {
    const render = componentHarness(`src/components/products/${name}.tsx`, name);
    const tree = render({ product: { ...product, storage: ['128GB', '256GB', '512GB'], colors: ['Black', 'White', 'Red'], variants: [
      { storage: '128GB', color: 'Black', price: 1000, available: true },
      { storage: '256GB', color: 'White', price: 2000, available: true },
    ] } });
    const buttons = nodes(tree).filter(n => n.type === 'button');
    assert.ok(buttons.some(n => n.props.children === '256GB'));
    assert.ok(!buttons.some(n => n.props.children === '512GB'));
    assert.ok(!buttons.some(n => n.props['aria-label'] === 'Selecionar cor White' || nodes(n.props.children).some(c => c.props?.children === 'White')));
  });
}

test('translated finishes resolve to the same color and image without merging distinct colors', () => {
  const { normalizeProductColor, getProductColorHex, getProductColorImage } = loadProductColors();
  for (const [pt, en] of [['Titânio Natural', 'Natural Titanium'], ['Titânio Preto', 'Black Titanium'], ['Titânio Branco', 'White Titanium'], ['Titânio Deserto', 'Desert Titanium'], ['Bronze-escura', 'Dark Bronze']]) {
    assert.equal(normalizeProductColor(pt), normalizeProductColor(en));
    assert.equal(getProductColorHex(pt), getProductColorHex(en));
    assert.equal(getProductColorImage({ image: '/default.png', colorImages: { [en]: '/finish.png' } }, pt), '/finish.png');
  }
  assert.notEqual(normalizeProductColor('Black'), normalizeProductColor('Space Black'));
  assert.notEqual(normalizeProductColor('Blue'), normalizeProductColor('Sky Blue'));
  assert.notEqual(normalizeProductColor('White'), normalizeProductColor('Star White'));
  assert.equal(getProductColorHex('  NIGHT   SKY '), '#1C1F26');
  assert.equal(getProductColorHex('DARK BRONZE'), '#4A3B32');
  assert.equal(getProductColorHex('Charcoal gray'), '#36454F');
  assert.equal(getProductColorImage({ image: '/default.png' }, 'Black', '/variant.png'), '/variant.png');
});

test('every catalog finish has a defined swatch, including inactive products', () => {
  const { colorMap, normalizeProductColor } = loadProductColors();
  const module = { exports: {} };
  const source = fs.readFileSync(path.join(__dirname, '../src/data/products.ts'), 'utf8');
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  vm.runInNewContext(code, { module, exports: module.exports });
  const overrides = JSON.parse(fs.readFileSync(path.join(__dirname, '../products_override.json'), 'utf8'));
  const known = new Set(Object.keys(colorMap).map(normalizeProductColor));
  for (const initial of module.exports.products) {
    const product = { ...initial, ...overrides[initial.id] };
    for (const variant of product.variants || []) {
      if (variant.color) assert.ok(known.has(normalizeProductColor(variant.color)), `${product.id}: unmapped finish ${variant.color}`);
    }
  }
});
