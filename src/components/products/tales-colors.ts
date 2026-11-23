const colors: Record<string, string> = {
  white: '#f4f3ef', branco: '#f4f3ef', black: '#242426', preto: '#242426', 'jet black': '#161618',
  orange: '#e68b55', laranja: '#e68b55', 'cosmic orange': '#dc7845', purple: '#b8aacb', roxo: '#b8aacb',
  starlight: '#e5dfd0', estelar: '#e5dfd0', midnight: '#303540', 'meia-noite': '#303540',
  blue: '#8ba8bf', azul: '#8ba8bf', natural: '#bab5ab', 'titânio natural': '#bab5ab',
  'rose gold': '#d8afa2', 'ouro rosa': '#d8afa2', 'space gray': '#777b80', 'cinza-espacial': '#777b80',
  silver: '#d9dcdf', prateado: '#d9dcdf', prata: '#d9dcdf',
  'light gold': '#decca5', 'dark bronze': '#77604c', 'space black': '#323437', 'preto-espacial': '#323437',
  pink: '#e8c2ce', rosa: '#e8c2ce', yellow: '#f2df8b', amarelo: '#f2df8b',
  'night sky': '#23394e', 'star white': '#efefeb',
  glacier: '#b8cfdd', burgundy: '#742a42', 'deep blue': '#354762', 'sky blue': '#b4d0e2',
  'cloud white': '#f1eee8', sage: '#aab8a5', lavender: '#c5b5d7', lavanda: '#c5b5d7',
  'mist blue': '#adbdce', 'soft pink': '#efd5dc', teal: '#7eaaa7', ultramarine: '#697bc4',
  ultramarino: '#697bc4', green: '#95b9a0', verde: '#95b9a0', blush: '#dfb8bb', citrus: '#e2dc83',
  indigo: '#57668d', grafite: '#55575c', graphite: '#55575c', 'titânio preto': '#2d2d2d',
  'titânio branco': '#f1f1f1', 'titânio deserto': '#bda68c', 'desert titanium': '#bda68c',
  dourado: '#fae7cf', gold: '#fae7cf', red: '#e11c2a', vermelho: '#e11c2a'
};

export function swatchColor(value: string): string | undefined {
  if (!value) return undefined;
  const key = value.toLowerCase().trim();
  return colors[key] || '#999999';
}
