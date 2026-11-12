import type { Product, ProductVariant } from '@/types/product';
import type { ProductOverrideData } from './products-store';
import { normalizeProductColor } from '@/utils/product-colors';

type Overrides = Record<string, ProductOverrideData>;
const dimensions = ['storage', 'size', 'screenSize', 'chip', 'ram'] as const;

/** Apply explicit configuration matches only; preserve catalog entries and availability. */
export function updateExistingCatalogPrices(products: Product[], previous: Overrides, incoming: Overrides) {
  const overrides: Overrides = { ...previous };
  let matchedVariants = 0;
  let updatedVariants = 0;
  let updatedProducts = 0;
  for (const product of products) {
    const current = { ...product, ...previous[product.id] };
    const prices = incoming[product.id]?.variants;
    if (!prices?.length || !current.variants?.length) continue;
    const normalizeColor = (color?: string) => {
      const normalized = normalizeProductColor(color);
      return product.id === 'airtag-2-1pack' && normalized === 'white' ? 'padrao' : normalized;
    };
    const matchesConfiguration = (price: ProductVariant, variant: ProductVariant) =>
      normalizeColor(price.color) === normalizeColor(variant.color)
      && dimensions.every(key => !price[key] || price[key]?.trim().toLowerCase() === variant[key]?.trim().toLowerCase());
    for (const price of prices) {
      if (current.variants.filter(variant => matchesConfiguration(price, variant)).length > 1) {
        throw new Error(`Configuração incompleta ou ambígua para ${product.name}. Informe capacidade, tamanho, conexão e memória.`);
      }
    }
    let changed = false;
    const variants = current.variants.map(variant => {
      const matches = prices.filter(price => matchesConfiguration(price, variant));
      if (!matches.length) return variant;
      // Conflicting entries must never silently pick an arbitrary price.
      const amounts = new Set(matches.map(match => match.price));
      if (amounts.size !== 1) throw new Error(`Preços conflitantes para ${product.name}, ${variant.storage || ''}, ${variant.color || ''}.`);
      const price = matches[0].price;
      if (!Number.isFinite(price) || price <= 0) throw new Error(`Preço inválido para ${product.name}.`);
      matchedVariants++;
      if (variant.price === price) return variant;
      changed = true;
      updatedVariants++;
      return { ...variant, price };
    });
    if (!changed) continue;
    updatedProducts++;
    overrides[product.id] = { ...previous[product.id], variants, priceFrom: Math.min(...variants.map(variant => variant.price)) };
  }
  return { overrides, matchedVariants, updatedVariants, updatedProducts };
}
