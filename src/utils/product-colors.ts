export const colorMap: Record<string, string> = {
  "Padrão": "#E3E4E6",
  "Night Sky": "#1C1F26",
  "Star White": "#F0EBE3",
  "Dark Bronze": "#4A3B32",
  "Charcoal Gray": "#36454F",
  "White Titanium": "#E6E2D9",
  "Black": "#1D1D1F",
  "Space Black": "#18181A",
  "Midnight": "#1B212C",
  "White": "#F5F5F7",
  "Cloud White": "#FAFAFC",
  "Starlight": "#F0EBE3",
  "Silver": "#E3E4E6",
  "Space Gray": "#535150",
  "Natural": "#8E8B82",
  "Natural Titanium": "#8E8B82",
  "Black Titanium": "#1E1E20",
  "Desert Titanium": "#C5B49E",
  "Deep Blue": "#223854",
  "Dark Blue": "#223854",
  "Blue": "#3B6B96",
  "Mist Blue": "#6E93B2",
  "Sky Blue": "#7EA2C6",
  "Teal": "#43828A",
  "Ultramarine": "#38529A",
  "Pink": "#E8B2C0",
  "Soft Pink": "#EAC2CE",
  "Sage": "#829383",
  "Lavender": "#B1A1C6",
  "Light Gold": "#E5D4B3",
  "Gold": "#E5D4B3",
  "Cosmic Orange": "#D85E30",
  "Citrus": "#D9E24C",
  "Indigo": "#3B485A",
  "Blush": "#E8CBCB",
  "Green": "#4C8A68",
  "Yellow": "#F2D358",
  "Jet Black": "#121214",
  "Rose Gold": "#E5B09E",
  "Orange": "#D85E30",
  "Purple": "#A594B8",
  "Red": "#D32F2F",
  "Preto": "#1D1D1F",
  "Titânio Preto": "#1E1E20",
  "Prateado": "#E3E4E6",
  "Titânio Natural": "#8E8B82",
  "Bordô": "#5A1827",
  "Burgundy": "#5A1827",
  "Glacier": "#B5C8D5",
  "Céu Noturno": "#1C1F26",
  "Branco-Estrela": "#F0EBE3",
  "Branco": "#F5F5F7",
  "Bronze-escura": "#4A3B32",
  "Dourada-clara": "#E5D4B3",
  "Cinza-espacial": "#535150",
  "Preta": "#1D1D1F",
  "Charcoal gray": "#36454F",
};

// Explicit translations only: different finishes such as Black and Space Black stay distinct.
const colorAliases: Record<string, string> = {
  'preto': 'black', 'preta': 'black', 'branco': 'white', 'prateado': 'silver', 'prateada': 'silver',
  'titanio preto': 'black titanium', 'titanio natural': 'natural titanium',
  'titanio branco': 'white titanium', 'titanio deserto': 'desert titanium',
  'ceu noturno': 'night sky', 'branco estrela': 'star white',
  'bronze escura': 'dark bronze', 'dourada clara': 'light gold', 'cinza espacial': 'space gray',
  'bordo': 'burgundy', 'azul': 'blue', 'rosa': 'pink', 'verde': 'green',
  'amarelo': 'yellow', 'laranja': 'orange', 'roxo': 'purple', 'vermelho': 'red',
  'lavanda': 'lavender', 'indigo': 'indigo', 'meia noite': 'midnight',
  'estelar': 'starlight', 'sem cor': 'padrao',
};

function cleanColor(color: string): string {
  return color.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/[-_]/g, ' ').trim().replace(/\s+/g, ' ');
}

export function normalizeProductColor(color = ''): string {
  const key = cleanColor(color);
  return colorAliases[key] || key;
}

const normalizedPalette = Object.fromEntries(Object.entries(colorMap).map(([name, hex]) => [normalizeProductColor(name), hex]));

export function getProductColorHex(color: string): string {
  return normalizedPalette[normalizeProductColor(color)] || '#8E8E93';
}

export function getProductColorImage(product: { image: string; colorImages?: Record<string, string> }, color: string, variantImage?: string): string {
  if (variantImage) return variantImage;
  const key = normalizeProductColor(color);
  const match = Object.entries(product.colorImages || {}).find(([name]) => normalizeProductColor(name) === key);
  return match?.[1] || product.image;
}
