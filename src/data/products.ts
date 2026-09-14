import { Product } from "@/types/product";

export const products: Product[] = [
  // ====================================================
  // 1. LINHA IPHONE (Novos Lacrados & Lançamentos)
  // ====================================================
  {
    id: "iphone-duo",
    slug: "iphone-duo",
    name: "iPhone Duo",
    category: "iphone",
    subcategory: "iPhone Duo",
    image: "/images/products/iphone/iphone-duo-official.png",
    priceFrom: 0,
    condition: "new",
    availability: "pre_order",
    storage: ["256GB", "512GB", "1TB"],
    colors: ["Branco-Estrela", "Céu Noturno"],
    variants: [
      { storage: "256GB", color: "Branco-Estrela", price: 0, available: true },
      { storage: "256GB", color: "Céu Noturno", price: 0, available: true },
      { storage: "512GB", color: "Branco-Estrela", price: 0, available: true },
      { storage: "512GB", color: "Céu Noturno", price: 0, available: true },
      { storage: "1TB", color: "Branco-Estrela", price: 0, available: true },
      { storage: "1TB", color: "Céu Noturno", price: 0, available: true },
    ],
    description: "Design revolucionário com duas telas e expansão contínua. Equipado com Apple Intelligence e o silício A20 Pro para uma nova era de produtividade.",
    warranty: "1 ano de garantia oficial Apple",
    featured: true,
    active: true,
  },
  {
    id: "iphone-18-pro-max",
    slug: "iphone-18-pro-max",
    name: "iPhone 18 Pro Max",
    category: "iphone",
    subcategory: "iPhone 18 Series",
    image: "/images/products/iphone/iphone-18-pro-official.png",
    colorImages: {
      "Preto": "/images/products/iphone/iphone-18-pro-black.jpg",
      "Bordô": "/images/products/iphone/iphone-18-pro-burgundy.jpg",
      "Glacier": "/images/products/iphone/iphone-18-pro-glacier.jpg",
      "Prateado": "/images/products/iphone/iphone-18-pro-silver.jpg",
    },
    priceFrom: 0,
    condition: "new",
    availability: "pre_order",
    storage: ["256GB", "512GB", "1TB", "2TB"],
    colors: ["Preto", "Bordô", "Glacier", "Prateado"],
    variants: [
      { storage: "256GB", color: "Preto", price: 0, available: true },
      { storage: "256GB", color: "Bordô", price: 0, available: true },
      { storage: "256GB", color: "Glacier", price: 0, available: true },
      { storage: "256GB", color: "Prateado", price: 0, available: true },
      { storage: "512GB", color: "Preto", price: 0, available: true },
      { storage: "512GB", color: "Bordô", price: 0, available: true },
      { storage: "512GB", color: "Glacier", price: 0, available: true },
      { storage: "512GB", color: "Prateado", price: 0, available: true },
      { storage: "1TB", color: "Preto", price: 0, available: true },
      { storage: "1TB", color: "Bordô", price: 0, available: true },
      { storage: "1TB", color: "Glacier", price: 0, available: true },
      { storage: "1TB", color: "Prateado", price: 0, available: true },
      { storage: "2TB", color: "Preto", price: 0, available: true },
      { storage: "2TB", color: "Bordô", price: 0, available: true },
      { storage: "2TB", color: "Glacier", price: 0, available: true },
      { storage: "2TB", color: "Prateado", price: 0, available: true },
    ],
    description: "O ápice do titânio grau 5 com o novo chip A20 Pro e o sistema de teleobjetiva periscópica mais avançado já criado pela engenharia Apple.",
    warranty: "1 ano de garantia oficial Apple",
    featured: true,
    active: true,
  },
  {
    id: "iphone-18-pro",
    slug: "iphone-18-pro",
    name: "iPhone 18 Pro",
    category: "iphone",
    subcategory: "iPhone 18 Series",
    image: "/images/products/iphone/iphone-18-pro-official.png",
    colorImages: {
      "Preto": "/images/products/iphone/iphone-18-pro-black.jpg",
      "Bordô": "/images/products/iphone/iphone-18-pro-burgundy.jpg",
      "Glacier": "/images/products/iphone/iphone-18-pro-glacier.jpg",
      "Prateado": "/images/products/iphone/iphone-18-pro-silver.jpg",
    },
    priceFrom: 0,
    condition: "new",
    availability: "pre_order",
    storage: ["256GB", "512GB", "1TB", "2TB"],
    colors: ["Preto", "Bordô", "Glacier", "Prateado"],
    variants: [
      { storage: "256GB", color: "Preto", price: 0, available: true },
      { storage: "256GB", color: "Bordô", price: 0, available: true },
      { storage: "256GB", color: "Glacier", price: 0, available: true },
      { storage: "256GB", color: "Prateado", price: 0, available: true },
      { storage: "512GB", color: "Preto", price: 0, available: true },
      { storage: "512GB", color: "Bordô", price: 0, available: true },
      { storage: "512GB", color: "Glacier", price: 0, available: true },
      { storage: "512GB", color: "Prateado", price: 0, available: true },
      { storage: "1TB", color: "Preto", price: 0, available: true },
      { storage: "1TB", color: "Bordô", price: 0, available: true },
      { storage: "1TB", color: "Glacier", price: 0, available: true },
      { storage: "1TB", color: "Prateado", price: 0, available: true },
      { storage: "2TB", color: "Preto", price: 0, available: true },
      { storage: "2TB", color: "Bordô", price: 0, available: true },
      { storage: "2TB", color: "Glacier", price: 0, available: true },
      { storage: "2TB", color: "Prateado", price: 0, available: true },
    ],
    description: "Poder de nível profissional em tamanho ergonômico. Tela Super Retina XDR com ProMotion dinâmico e autonomia estendida para criadores.",
    warranty: "1 ano de garantia oficial Apple",
    featured: true,
    active: true,
  },
  {
    id: "iphone-17-pro-max",
    slug: "iphone-17-pro-max",
    name: "iPhone 17 Pro Max",
    category: "iphone",
    subcategory: "iPhone 17 Series",
    image: "/images/products/iphone/iphone-17-pro-max.png",
    priceFrom: 7590,
    condition: "new",
    storage: ["256GB", "512GB", "1TB", "2TB"],
    colors: ["Deep Blue", "Silver", "Cosmic Orange"],
    variants: [
      // 256GB
      { storage: "256GB", color: "Deep Blue", price: 7590, available: true },
      { storage: "256GB", color: "Silver", price: 7690, available: true },
      { storage: "256GB", color: "Cosmic Orange", price: 7790, available: true },
      // 512GB
      { storage: "512GB", color: "Silver", price: 8990, available: true },
      { storage: "512GB", color: "Deep Blue", price: 9090, available: true },
      { storage: "512GB", color: "Cosmic Orange", price: 9190, available: true },
      // 1TB
      { storage: "1TB", color: "Silver", price: 9790, available: true },
      { storage: "1TB", color: "Deep Blue", price: 9890, available: true },
      { storage: "1TB", color: "Cosmic Orange", price: 9990, available: true },
      // 2TB
      { storage: "2TB", color: "Cosmic Orange", price: 11990, available: true },
      { storage: "2TB", color: "Deep Blue", price: 12290, available: true },
      { storage: "2TB", color: "Silver", price: 12590, available: true },
    ],
    description: "O suprassumo da tecnologia Apple. Construído em titânio de grau aeroespacial com o revolucionário chip A19 Pro e o sistema de câmeras mais avançado já criado.",
    warranty: "1 ano de garantia oficial Apple",
    active: true
  },
  {
    id: "iphone-17-pro",
    slug: "iphone-17-pro",
    name: "iPhone 17 Pro",
    category: "iphone",
    subcategory: "iPhone 17 Series",
    image: "/images/products/iphone/iphone-17-pro-max.png",
    priceFrom: 7090,
    condition: "new",
    storage: ["256GB", "512GB", "1TB"],
    colors: ["Deep Blue", "Silver", "Cosmic Orange"],
    variants: [
      // 256GB
      { storage: "256GB", color: "Deep Blue", price: 7090, available: true },
      { storage: "256GB", color: "Silver", price: 7090, available: true },
      { storage: "256GB", color: "Cosmic Orange", price: 7090, available: true },
      // 512GB
      { storage: "512GB", color: "Cosmic Orange", price: 8390, available: true },
      { storage: "512GB", color: "Silver", price: 8490, available: true },
      { storage: "512GB", color: "Deep Blue", price: 8790, available: true },
      // 1TB
      { storage: "1TB", color: "Cosmic Orange", price: 9790, available: true },
      { storage: "1TB", color: "Deep Blue", price: 10090, available: true },
      { storage: "1TB", color: "Silver", price: 10090, available: true },
    ],
    description: "Desempenho profissional em tamanho ergonômico. Titânio escovado, chip A19 Pro e a nova lente teleobjetiva avançada.",
    warranty: "1 ano de garantia oficial Apple",
    active: true
  },
  {
    id: "iphone-17-air",
    slug: "iphone-17-air",
    name: "iPhone 17 Air",
    category: "iphone",
    subcategory: "iPhone 17 Series",
    image: "/images/products/iphone/iphone-17-air.png",
    priceFrom: 5890,
    condition: "new",
    storage: ["256GB", "512GB", "1TB"],
    colors: ["Sky Blue", "Light Gold", "Space Black", "Cloud White"],
    variants: [
      // 256GB
      { storage: "256GB", color: "Sky Blue", price: 5890, available: true },
      { storage: "256GB", color: "Light Gold", price: 5990, available: true },
      { storage: "256GB", color: "Space Black", price: 5990, available: true },
      { storage: "256GB", color: "Cloud White", price: 6090, available: true },
      // 512GB
      { storage: "512GB", color: "Light Gold", price: 6990, available: true },
      { storage: "512GB", color: "Sky Blue", price: 6990, available: true },
      { storage: "512GB", color: "Space Black", price: 7190, available: true },
      // 1TB
      { storage: "1TB", color: "Light Gold", price: 7990, available: true },
      { storage: "1TB", color: "Sky Blue", price: 7990, available: true },
      { storage: "1TB", color: "Cloud White", price: 8090, available: true },
      { storage: "1TB", color: "Space Black", price: 8090, available: true },
    ],
    description: "O iPhone mais fino e leve já feito pela Apple. Elegância absoluta unida ao poder computacional de ponta.",
    warranty: "1 ano de garantia oficial Apple",
    active: true
  },
  {
    id: "iphone-17e",
    slug: "iphone-17e",
    name: "iPhone 17e",
    category: "iphone",
    subcategory: "iPhone 17 Series",
    image: "/images/products/iphone/iphone-17-generic.png",
    priceFrom: 3990,
    condition: "new",
    storage: ["128GB", "256GB"],
    colors: ["Soft Pink", "Black", "White"],
    variants: [
      // 128GB
      { storage: "128GB", color: "Soft Pink", price: 3990, available: true },
      { storage: "128GB", color: "Black", price: 3990, available: true },
      { storage: "128GB", color: "White", price: 4090, available: true },
      // 256GB
      { storage: "256GB", color: "Soft Pink", price: 4390, available: true },
      { storage: "256GB", color: "Black", price: 4490, available: true },
      { storage: "256GB", color: "White", price: 4490, available: true },
    ],
    description: "A essência da linha iPhone 17 combinada com excelente custo-benefício e tela espetacular.",
    warranty: "1 ano de garantia oficial Apple",
    active: true
  },
  {
    id: "iphone-17",
    slug: "iphone-17",
    name: "iPhone 17",
    category: "iphone",
    subcategory: "iPhone 17 Series",
    image: "/images/products/iphone/iphone-17-normal.png",
    priceFrom: 5490,
    condition: "new",
    storage: ["256GB", "512GB"],
    colors: ["Sage", "Mist Blue", "Black", "Lavender", "White"],
    variants: [
      // 256GB
      { storage: "256GB", color: "Sage", price: 5490, available: true },
      { storage: "256GB", color: "Mist Blue", price: 5590, available: true },
      { storage: "256GB", color: "Black", price: 5590, available: true },
      { storage: "256GB", color: "Lavender", price: 5690, available: true },
      { storage: "256GB", color: "White", price: 5690, available: true },
      // 512GB
      { storage: "512GB", color: "Black", price: 7090, available: true },
      { storage: "512GB", color: "Lavender", price: 7090, available: true },
      { storage: "512GB", color: "Mist Blue", price: 7090, available: true },
      { storage: "512GB", color: "White", price: 7090, available: true },
    ],
    description: "Tela espetacular com ProMotion, chip A19 e cores incríveis para o seu dia a dia.",
    warranty: "1 ano de garantia oficial Apple",
    active: true
  },
  {
    id: "iphone-16",
    slug: "iphone-16",
    name: "iPhone 16",
    category: "iphone",
    subcategory: "iPhone 16 Series",
    image: "/images/products/iphone/iphone-16-black.png",
    colorImages: {
      "Teal": "/images/products/iphone/iphone-16-teal.png",
      "Black": "/images/products/iphone/iphone-16-black.png",
      "Ultramarine": "/images/products/iphone/iphone-16-ultramarine.png",
      "Pink": "/images/products/iphone/iphone-16-pink.png",
      "White": "/images/products/iphone/iphone-16-white.png"
    },
    priceFrom: 4890,
    condition: "new",
    storage: ["128GB", "256GB", "512GB"],
    colors: ["Teal", "Black", "Ultramarine", "Pink", "White"],
    variants: [
      // 128GB
      { storage: "128GB", color: "Teal", price: 4890, available: true },
      { storage: "128GB", color: "Black", price: 4890, available: true },
      { storage: "128GB", color: "Ultramarine", price: 4890, available: true },
      { storage: "128GB", color: "Pink", price: 4890, available: true },
      { storage: "128GB", color: "White", price: 4990, available: true },
      // 256GB
      { storage: "256GB", color: "Teal", price: 5490, available: true },
      { storage: "256GB", color: "Black", price: 5490, available: true },
      { storage: "256GB", color: "Ultramarine", price: 5490, available: true },
      { storage: "256GB", color: "Pink", price: 5490, available: true },
      { storage: "256GB", color: "White", price: 5590, available: true },
      // 512GB
      { storage: "512GB", color: "Teal", price: 6390, available: true },
      { storage: "512GB", color: "Black", price: 6390, available: true },
      { storage: "512GB", color: "Ultramarine", price: 6390, available: true },
      { storage: "512GB", color: "Pink", price: 6390, available: true },
      { storage: "512GB", color: "White", price: 6490, available: true },
    ],
    description: "Chip A18 super veloz, botão Controle de Câmera, cores vibrantes em alumínio aeroespacial e bateria de longa duração.",
    warranty: "1 ano de garantia oficial Apple",
    active: true
  },
  {
    id: "iphone-15",
    slug: "iphone-15",
    name: "iPhone 15",
    category: "iphone",
    subcategory: "iPhone 15 Series",
    image: "/images/products/iphone/iphone-15-black.png",
    colorImages: {
      "Black": "/images/products/iphone/iphone-15-black.png",
      "Blue": "/images/products/iphone/iphone-15-blue.png"
    },
    priceFrom: 4290,
    condition: "new",
    storage: ["128GB", "256GB"],
    colors: ["Black", "Blue"],
    variants: [
      // 128GB
      { storage: "128GB", color: "Black", price: 4290, available: true },
      { storage: "128GB", color: "Blue", price: 4290, available: true },
      // 256GB
      { storage: "256GB", color: "Black", price: 4990, available: true },
      { storage: "256GB", color: "Blue", price: 4990, available: true },
    ],
    description: "Ilha Dinâmica inovadora, câmera de 48 MP com alta resolução, design resistente em vidro colorido infusão e entrada USB-C.",
    warranty: "1 ano de garantia oficial Apple",
    active: true
  },

  // ====================================================
  // 2. LINHA MACBOOK & MAC (M5 / M4)
  // ====================================================

    // ==========================================
  // --- PRODUTOS MAC UNIFICADOS (COM SELETORES DINÂMICOS) ---
  // ==========================================

  // --- MACBOOK PRO M5 (14" / CHIP M5) ---
  {
    id: "macbook-pro-m5",
    slug: "macbook-pro-m5",
    name: "MacBook Pro M5",
    category: "mac",
    subcategory: 'Liquid Retina XDR 14" • Chip Apple M5',
    image: "/images/products/mac/macbook-pro-space-black.png",
    colorImages: {
      "Space Black": "/images/products/mac/macbook-pro-space-black.png",
      "Silver": "/images/products/mac/macbook-pro-silver.png"
    },
    priceFrom: 12800,
    condition: "new",
    screenSizes: ["14\""],
    chips: ["M5"],
    ramOptions: ["16GB", "24GB", "32GB"],
    storage: ["512GB", "1TB", "2TB"],
    colors: ["Space Black", "Silver"],
    variants: [
      { screenSize: "14\"", chip: "M5", ram: "16GB", storage: "512GB", color: "Space Black", price: 12800, available: true },
      { screenSize: "14\"", chip: "M5", ram: "16GB", storage: "1TB", color: "Space Black", price: 13060, available: true },
      { screenSize: "14\"", chip: "M5", ram: "16GB", storage: "1TB", color: "Silver", price: 13150, available: true },
      { screenSize: "14\"", chip: "M5", ram: "24GB", storage: "1TB", color: "Space Black", price: 15050, available: true },
      { screenSize: "14\"", chip: "M5", ram: "24GB", storage: "1TB", color: "Silver", price: 15300, available: true },
      { screenSize: "14\"", chip: "M5", ram: "32GB", storage: "1TB", color: "Space Black", price: 17550, available: true },
      { screenSize: "14\"", chip: "M5", ram: "32GB", storage: "1TB", color: "Silver", price: 19300, available: true },
      { screenSize: "14\"", chip: "M5", ram: "24GB", storage: "2TB", color: "Silver", price: 18900, available: true },
      { screenSize: "14\"", chip: "M5", ram: "24GB", storage: "2TB", color: "Space Black", price: 19100, available: true }
    ],
    description: "Tela Liquid Retina XDR de 14 polegadas com ProMotion, portas Thunderbolt, HDMI e MagSafe 3. Potência incrível com o chip M5.",
    warranty: "1 ano de garantia oficial Apple",
    featured: true,
    active: true
  },

  // --- MACBOOK PRO M5 PRO (14" & 16" / CHIP M5 PRO) ---
  {
    id: "macbook-pro-m5-pro",
    slug: "macbook-pro-m5-pro",
    name: "MacBook Pro M5 Pro",
    category: "mac",
    subcategory: "Liquid Retina XDR • Chip Apple M5 Pro",
    image: "/images/products/mac/macbook-pro-space-black.png",
    colorImages: {
      "Space Black": "/images/products/mac/macbook-pro-space-black.png",
      "Silver": "/images/products/mac/macbook-pro-silver.png"
    },
    priceFrom: 16700,
    condition: "new",
    screenSizes: ["14\"", "16\""],
    chips: ["M5 Pro"],
    ramOptions: ["24GB", "48GB"],
    storage: ["1TB", "2TB"],
    colors: ["Space Black", "Silver"],
    variants: [
      // 14"
      { screenSize: "14\"", chip: "M5 Pro", ram: "24GB", storage: "1TB", color: "Silver", price: 16700, available: true },
      { screenSize: "14\"", chip: "M5 Pro", ram: "24GB", storage: "1TB", color: "Space Black", price: 16700, available: true },
      { screenSize: "14\"", chip: "M5 Pro", ram: "24GB", storage: "2TB", color: "Space Black", price: 17799, available: true },
      { screenSize: "14\"", chip: "M5 Pro", ram: "24GB", storage: "2TB", color: "Silver", price: 18800, available: true },
      // 16"
      { screenSize: "16\"", chip: "M5 Pro", ram: "24GB", storage: "1TB", color: "Silver", price: 19700, available: true },
      { screenSize: "16\"", chip: "M5 Pro", ram: "24GB", storage: "1TB", color: "Space Black", price: 19800, available: true },
      { screenSize: "16\"", chip: "M5 Pro", ram: "48GB", storage: "1TB", color: "Space Black", price: 25200, available: true },
      { screenSize: "16\"", chip: "M5 Pro", ram: "48GB", storage: "1TB", color: "Silver", price: 26800, available: true }
    ],
    description: "Desempenho extremo para fluxos de trabalho profissionais pesados com o chip M5 Pro em telas de 14 ou 16 polegadas.",
    warranty: "1 ano de garantia oficial Apple",
    featured: true,
    active: true
  },

  // --- MACBOOK PRO M5 MAX (14" & 16" / CHIP M5 MAX) ---
  {
    id: "macbook-pro-m5-max",
    slug: "macbook-pro-m5-max",
    name: "MacBook Pro M5 Max",
    category: "mac",
    subcategory: "Liquid Retina XDR • Chip Apple M5 Max",
    image: "/images/products/mac/macbook-pro-space-black.png",
    colorImages: {
      "Space Black": "/images/products/mac/macbook-pro-space-black.png",
      "Silver": "/images/products/mac/macbook-pro-silver.png"
    },
    priceFrom: 25300,
    condition: "new",
    screenSizes: ["14\"", "16\""],
    chips: ["M5 Max"],
    ramOptions: ["36GB", "48GB"],
    storage: ["2TB"],
    colors: ["Space Black", "Silver"],
    variants: [
      // 14"
      { screenSize: "14\"", chip: "M5 Max", ram: "36GB", storage: "2TB", color: "Silver", price: 25300, available: true },
      { screenSize: "14\"", chip: "M5 Max", ram: "36GB", storage: "2TB", color: "Space Black", price: 26800, available: true },
      // 16"
      { screenSize: "16\"", chip: "M5 Max", ram: "36GB", storage: "2TB", color: "Space Black", price: 26750, available: true },
      { screenSize: "16\"", chip: "M5 Max", ram: "36GB", storage: "2TB", color: "Silver", price: 28300, available: true },
      { screenSize: "16\"", chip: "M5 Max", ram: "48GB", storage: "2TB", color: "Space Black", price: 31300, available: true },
      { screenSize: "16\"", chip: "M5 Max", ram: "48GB", storage: "2TB", color: "Silver", price: 31799, available: true }
    ],
    description: "O ápice do poder de processamento gráfico e computacional da Apple. Chip M5 Max com até 48GB de memória unificada.",
    warranty: "1 ano de garantia oficial Apple",
    featured: true,
    active: true
  },

  // --- MACBOOK AIR M5 (13" & 15") ---
  {
    id: "macbook-air-m5",
    slug: "macbook-air-m5",
    name: "MacBook Air M5",
    category: "mac",
    subcategory: 'Ultrafino • Display 13.6" ou 15.3"',
    image: "/images/products/mac/macbook-air-midnight.png",
    colorImages: {
      "Midnight": "/images/products/mac/macbook-air-midnight.png",
      "Starlight": "/images/products/mac/macbook-air-starlight.png",
      "Silver": "/images/products/mac/macbook-air-silver.png",
      "Sky Blue": "/images/products/mac/macbook-air-spacegray.png"
    },
    priceFrom: 9188.50,
    condition: "new",
    screenSizes: ["13\"", "15\""],
    ramOptions: ["16GB", "24GB"],
    storage: ["512GB", "1TB"],
    colors: ["Midnight", "Starlight", "Silver", "Sky Blue"],
    variants: [
      // 13" 512GB / 16GB
      { screenSize: "13\"", ram: "16GB", storage: "512GB", color: "Starlight", price: 9188.50, available: true },
      { screenSize: "13\"", ram: "16GB", storage: "512GB", color: "Sky Blue", price: 9200, available: true },
      { screenSize: "13\"", ram: "16GB", storage: "512GB", color: "Midnight", price: 9246, available: true },
      { screenSize: "13\"", ram: "16GB", storage: "512GB", color: "Silver", price: 9476, available: true },

      // 13" 1TB / 16GB
      { screenSize: "13\"", ram: "16GB", storage: "1TB", color: "Midnight", price: 10269.50, available: true },
      { screenSize: "13\"", ram: "16GB", storage: "1TB", color: "Silver", price: 10350, available: true },
      { screenSize: "13\"", ram: "16GB", storage: "1TB", color: "Sky Blue", price: 10350, available: true },
      { screenSize: "13\"", ram: "16GB", storage: "1TB", color: "Starlight", price: 10465, available: true },

      // 13" 1TB / 24GB
      { screenSize: "13\"", ram: "24GB", storage: "1TB", color: "Silver", price: 13512.50, available: true },
      { screenSize: "13\"", ram: "24GB", storage: "1TB", color: "Midnight", price: 13800, available: true },
      { screenSize: "13\"", ram: "24GB", storage: "1TB", color: "Starlight", price: 13800, available: true },

      // 15" 512GB / 16GB
      { screenSize: "15\"", ram: "16GB", storage: "512GB", color: "Starlight", price: 10522.50, available: true },
      { screenSize: "15\"", ram: "16GB", storage: "512GB", color: "Silver", price: 10787, available: true },
      { screenSize: "15\"", ram: "16GB", storage: "512GB", color: "Midnight", price: 10925, available: true },
      { screenSize: "15\"", ram: "16GB", storage: "512GB", color: "Sky Blue", price: 11038.85, available: true },

      // 15" 1TB / 16GB
      { screenSize: "15\"", ram: "16GB", storage: "1TB", color: "Midnight", price: 12305, available: true },
      { screenSize: "15\"", ram: "16GB", storage: "1TB", color: "Silver", price: 12362.50, available: true },
      { screenSize: "15\"", ram: "16GB", storage: "1TB", color: "Sky Blue", price: 12362.50, available: true },
      { screenSize: "15\"", ram: "16GB", storage: "1TB", color: "Starlight", price: 12362.50, available: true },

      // 15" 1TB / 24GB
      { screenSize: "15\"", ram: "24GB", storage: "1TB", color: "Midnight", price: 14605, available: true },
      { screenSize: "15\"", ram: "24GB", storage: "1TB", color: "Silver", price: 14605, available: true },
      { screenSize: "15\"", ram: "24GB", storage: "1TB", color: "Starlight", price: 14605, available: true },
      { screenSize: "15\"", ram: "24GB", storage: "1TB", color: "Sky Blue", price: 14892.50, available: true }
    ],
    description: "Design ultrafino e 100% silencioso com chip M5, tela Liquid Retina brilhante e bateria para até 18 horas de uso.",
    warranty: "1 ano de garantia oficial Apple",
    featured: true,
    active: true
  },

  // --- MACBOOK NEO 13" ---
  {
    id: "macbook-neo-13",
    slug: "macbook-neo-13",
    name: 'MacBook Neo 13"',
    category: "mac",
    subcategory: "Apple A18 Pro • 4 Cores Exclusivas",
    image: "/images/products/mac/macbook-neo-citrus.png",
    colorImages: {
      "Citrus": "/images/products/mac/macbook-neo-citrus.png",
      "Indigo": "/images/products/mac/macbook-neo-indigo.png",
      "Blush": "/images/products/mac/macbook-neo-blush.png",
      "Silver": "/images/products/mac/macbook-neo-silver.png"
    },
    priceFrom: 5740,
    condition: "new",
    screenSizes: ["13\""],
    ramOptions: ["8GB"],
    storage: ["256GB", "512GB"],
    colors: ["Citrus", "Indigo", "Blush", "Silver"],
    variants: [
      // 256GB / 8GB
      { screenSize: "13\"", storage: "256GB", ram: "8GB", color: "Citrus", price: 5740, available: true },
      { screenSize: "13\"", storage: "256GB", ram: "8GB", color: "Blush", price: 5749, available: true },
      { screenSize: "13\"", storage: "256GB", ram: "8GB", color: "Indigo", price: 5750, available: true },
      { screenSize: "13\"", storage: "256GB", ram: "8GB", color: "Silver", price: 5900, available: true },

      // 512GB / 8GB
      { screenSize: "13\"", storage: "512GB", ram: "8GB", color: "Citrus", price: 6450, available: true },
      { screenSize: "13\"", storage: "512GB", ram: "8GB", color: "Blush", price: 6490, available: true },
      { screenSize: "13\"", storage: "512GB", ram: "8GB", color: "Indigo", price: 6490, available: true },
      { screenSize: "13\"", storage: "512GB", ram: "8GB", color: "Silver", price: 6490, available: true }
    ],
    description: "Design moderno e expressivo com tela de 13 polegadas, chip A18 Pro e 4 opções de cores exclusivas para o seu estilo.",
    warranty: "1 ano de garantia oficial Apple",
    featured: true,
    active: true
  },

  // --- MAC MINI M4 ---
  {
    id: "mac-mini-m4",
    slug: "mac-mini-m4",
    name: "Mac mini M4",
    category: "mac",
    subcategory: "Design Ultracompacto • Chip M4",
    image: "/images/products/mac/mac-mini-m4-clean.png",
    priceFrom: 5635,
    condition: "new",
    chips: ["M4"],
    ramOptions: ["16GB", "24GB"],
    storage: ["256GB", "512GB"],
    colors: ["Silver"],
    variants: [
      { chip: "M4", ram: "16GB", storage: "256GB", color: "Silver", price: 5635, available: true },
      { chip: "M4", ram: "16GB", storage: "512GB", color: "Silver", price: 6325, available: true },
      { chip: "M4", ram: "24GB", storage: "512GB", color: "Silver", price: 9890, available: true }
    ],
    description: "Menor, mais rápido e mais poderoso com chip M4, portas frontais USB-C e conexão Thunderbolt traseira.",
    warranty: "1 ano de garantia oficial Apple",
    active: true
  },

  // --- IMAC 24" M4 ---
  {
    id: "imac-24-m4",
    slug: "imac-24-m4",
    name: 'iMac 24" M4',
    category: "mac",
    subcategory: "Tela Retina 4.5K • Cores Vibrantes",
    image: "/images/products/mac/imac-24-blue.png",
    colorImages: {
      "Blue": "/images/products/mac/imac-24-blue.png",
      "Green": "/images/products/mac/imac-24-green.png",
      "Pink": "/images/products/mac/imac-24-pink.png",
      "Silver": "/images/products/mac/imac-24-silver.png"
    },
    priceFrom: 13108.85,
    condition: "new",
    screenSizes: ["24\""],
    chips: ["2 Portas", "4 Saídas"],
    ramOptions: ["16GB", "24GB"],
    storage: ["256GB", "512GB"],
    colors: ["Blue", "Green", "Pink", "Silver"],
    variants: [
      // 2 Portas — 256GB / 16GB
      { screenSize: "24\"", chip: "2 Portas", ram: "16GB", storage: "256GB", color: "Blue", price: 13108.85, available: true },
      { screenSize: "24\"", chip: "2 Portas", ram: "16GB", storage: "256GB", color: "Green", price: 13108.85, available: true },
      { screenSize: "24\"", chip: "2 Portas", ram: "16GB", storage: "256GB", color: "Silver", price: 13570, available: true },

      // 4 Saídas — 512GB / 16GB
      { screenSize: "24\"", chip: "4 Saídas", ram: "16GB", storage: "512GB", color: "Silver", price: 18630, available: true },
      { screenSize: "24\"", chip: "4 Saídas", ram: "16GB", storage: "512GB", color: "Pink", price: 18848.50, available: true },

      // 4 Saídas — 512GB / 24GB
      { screenSize: "24\"", chip: "4 Saídas", ram: "24GB", storage: "512GB", color: "Silver", price: 20642.50, available: true }
    ],
    description: "Computador tudo-em-um ultrafino com tela Retina 4.5K de 24 polegadas, câmera Center Stage de 12MP e áudio espacial.",
    warranty: "1 ano de garantia oficial Apple",
    active: true
  },
// --- IPAD PRO M5 (11" & 13") ---
  {
    id: "ipad-pro-m5",
    slug: "ipad-pro-m5",
    name: "iPad Pro M5",
    category: "ipad",
    subcategory: "iPad Pro M5",
    image: "/images/products/ipad/ipad-pro-spaceblack.png",
    colorImages: {
      "Space Black": "/images/products/ipad/ipad-pro-spaceblack.png",
      "Silver": "/images/products/ipad/ipad-pro-silver.png"
    },
    priceFrom: 8140,
    condition: "new",
    screenSizes: ["11\"", "13\""],
    chips: ["Wi-Fi", "Wi-Fi + Cellular"],
    storage: ["256GB", "512GB", "1TB", "2TB"],
    colors: ["Space Black", "Silver"],
    variants: [
      // 11" Wi-Fi
      { screenSize: "11\"", chip: "Wi-Fi", storage: "256GB", color: "Space Black", price: 8140, available: true },
      { screenSize: "11\"", chip: "Wi-Fi", storage: "256GB", color: "Silver", price: 8150, available: true },
      { screenSize: "11\"", chip: "Wi-Fi", storage: "512GB", color: "Space Black", price: 9100, available: true },
      { screenSize: "11\"", chip: "Wi-Fi", storage: "1TB", color: "Silver", price: 12050, available: true },

      // 11" Wi-Fi + Cellular
      { screenSize: "11\"", chip: "Wi-Fi + Cellular", storage: "256GB", color: "Silver", price: 9400, available: true },
      { screenSize: "11\"", chip: "Wi-Fi + Cellular", storage: "256GB", color: "Space Black", price: 9400, available: true },

      // 13" Wi-Fi
      { screenSize: "13\"", chip: "Wi-Fi", storage: "256GB", color: "Space Black", price: 8840, available: true },
      { screenSize: "13\"", chip: "Wi-Fi", storage: "256GB", color: "Silver", price: 8850, available: true },
      { screenSize: "13\"", chip: "Wi-Fi", storage: "512GB", color: "Space Black", price: 10000, available: true },
      { screenSize: "13\"", chip: "Wi-Fi", storage: "512GB", color: "Silver", price: 10299, available: true },
      { screenSize: "13\"", chip: "Wi-Fi", storage: "1TB", color: "Silver", price: 13490, available: true },
      { screenSize: "13\"", chip: "Wi-Fi", storage: "1TB", color: "Space Black", price: 13490, available: true },
      { screenSize: "13\"", chip: "Wi-Fi", storage: "2TB", color: "Space Black", price: 12900, available: true },

      // 13" Wi-Fi + Cellular
      { screenSize: "13\"", chip: "Wi-Fi + Cellular", storage: "256GB", color: "Space Black", price: 9900, available: true },
      { screenSize: "13\"", chip: "Wi-Fi + Cellular", storage: "256GB", color: "Silver", price: 9990, available: true },
      { screenSize: "13\"", chip: "Wi-Fi + Cellular", storage: "2TB", color: "Silver", price: 14700, available: true }
    ],
    description: "Chip M5 revolucionário, tela Ultra Retina XDR OLED tandem de 11 ou 13 polegadas, acabamento ultrafino e conexão Wi-Fi 6E ou 5G Cellular.",
    warranty: "1 ano de garantia oficial Apple",
    featured: true,
    active: true
  },

  // --- IPAD 11ª GERAÇÃO ---
  {
    id: "ipad-11",
    slug: "ipad-11",
    name: "iPad 11ª Geração",
    category: "ipad",
    subcategory: "iPad 11",
    image: "/images/products/ipad/ipad-11-blue.png",
    colorImages: {
      "Blue": "/images/products/ipad/ipad-11-blue.png",
      "Pink": "/images/products/ipad/ipad-11-pink.png",
      "Silver": "/images/products/ipad/ipad-11-silver.png",
      "Yellow": "/images/products/ipad/ipad-11-yellow.png"
    },
    priceFrom: 2960,
    condition: "new",
    storage: ["128GB", "256GB"],
    colors: ["Yellow", "Blue", "Pink", "Silver"],
    variants: [
      // 128GB
      { storage: "128GB", color: "Yellow", price: 2960, available: true },
      { storage: "128GB", color: "Blue", price: 3050, available: true },
      { storage: "128GB", color: "Pink", price: 3060, available: true },
      { storage: "128GB", color: "Silver", price: 3090, available: true },
      // 256GB
      { storage: "256GB", color: "Pink", price: 3725, available: true },
      { storage: "256GB", color: "Silver", price: 3800, available: true },
      { storage: "256GB", color: "Blue", price: 3850, available: true }
    ],
    description: "Design moderno com tela Liquid Retina de 11 polegadas de ponta a ponta, suporte ao Apple Pencil, opções de 128GB e 256GB e 4 cores vibrantes.",
    warranty: "1 ano de garantia oficial Apple",
    active: true
  },

  // ====================================================
  // 4. LINHA APPLE WATCH
  // ====================================================
  {
    id: "apple-watch-ultra-4",
    slug: "apple-watch-ultra-4",
    name: "Apple Watch Ultra 4",
    category: "watch",
    subcategory: "Apple Watch Ultra",
    image: "/images/apple-showcase/watch-ultra-4.jpg",
    colorImages: {
      "Titânio Natural": "/images/products/watch/apple-watch-ultra-natural.png",
      "Titânio Preto": "/images/products/watch/apple-watch-ultra-black.png",
    },
    priceFrom: 0,
    condition: "new",
    availability: "pre_order",
    sizes: ["49mm"],
    colors: ["Titânio Natural", "Titânio Preto"],
    variants: [
      { size: "49mm", storage: "", color: "Titânio Natural", price: 0, available: true },
      { size: "49mm", storage: "", color: "Titânio Preto", price: 0, available: true },
    ],
    description: "Caixa reforçada em titânio aeroespacial de 49mm, tela de 3000 nits com cristal de safira, GPS de dupla precisão e até 72h em modo de economia.",
    warranty: "1 ano de garantia oficial Apple",
    featured: true,
    active: true,
  },
  {
    id: "apple-watch-s12",
    slug: "apple-watch-s12",
    name: "Apple Watch Series 12",
    category: "watch",
    subcategory: "Apple Watch Series",
    image: "/images/products/watch/apple-watch-s12-official.png",
    priceFrom: 0,
    condition: "new",
    availability: "pre_order",
    sizes: ["42mm", "46mm"],
    colors: ["Preta", "Bronze-escura", "Dourada-clara", "Cinza-espacial", "Titânio Natural"],
    variants: [
      { size: "42mm", storage: "", color: "Preta", price: 0, available: true },
      { size: "42mm", storage: "", color: "Bronze-escura", price: 0, available: true },
      { size: "42mm", storage: "", color: "Dourada-clara", price: 0, available: true },
      { size: "42mm", storage: "", color: "Cinza-espacial", price: 0, available: true },
      { size: "42mm", storage: "", color: "Titânio Natural", price: 0, available: true },
      { size: "46mm", storage: "", color: "Preta", price: 0, available: true },
      { size: "46mm", storage: "", color: "Bronze-escura", price: 0, available: true },
      { size: "46mm", storage: "", color: "Dourada-clara", price: 0, available: true },
      { size: "46mm", storage: "", color: "Cinza-espacial", price: 0, available: true },
      { size: "46mm", storage: "", color: "Titânio Natural", price: 0, available: true },
    ],
    description: "Perfil ultrafino, display OLED de alta eficiência e novos sensores com inteligência avançada para monitoramento contínuo de saúde.",
    warranty: "1 ano de garantia oficial Apple",
    featured: true,
    active: true,
  },
  {
    id: "apple-watch-s11",
    slug: "apple-watch-s11",
    name: "Apple Watch Series 11",
    category: "watch",
    subcategory: "Apple Watch Series 11",
    image: "/images/products/watch/apple-watch-s11-black.png",
    colorImages: {
      "Jet Black": "/images/products/watch/apple-watch-s11-black.png",
      "Black": "/images/products/watch/apple-watch-s11-black.png",
      "Rose Gold": "/images/products/watch/apple-watch-s11-rosegold.png",
      "Silver": "/images/products/watch/apple-watch-s11-silver.png",
      "Space Gray": "/images/products/watch/apple-watch-s11-black.png"
    },
    priceFrom: 2445,
    condition: "new",
    sizes: ["42mm", "46mm"],
    colors: ["Rose Gold", "Space Gray", "Jet Black", "Silver"],
    variants: [
      // 42mm
      { size: "42mm", storage: "", color: "Rose Gold", price: 2445, available: true },
      { size: "42mm", storage: "", color: "Space Gray", price: 2480, available: true },
      { size: "42mm", storage: "", color: "Jet Black", price: 2495, available: true },
      { size: "42mm", storage: "", color: "Silver", price: 2499, available: true },
      // 46mm
      { size: "46mm", storage: "", color: "Rose Gold", price: 2645, available: true },
      { size: "46mm", storage: "", color: "Space Gray", price: 2649, available: true },
      { size: "46mm", storage: "", color: "Jet Black", price: 2680, available: true },
      { size: "46mm", storage: "", color: "Silver", price: 2690, available: true }
    ],
    description: "Caixas de 42mm e 46mm com tela OLED de ângulo amplo ultrabrilhante, design mais fino e leve, carregamento rápido e novos sensores avançados de saúde.",
    warranty: "1 ano de garantia oficial Apple",
    featured: true,
    active: true
  },
  {
    id: "apple-watch-ultra-3",
    slug: "apple-watch-ultra-3",
    name: "Apple Watch Ultra 3 (49mm)",
    category: "watch",
    subcategory: "Apple Watch Ultra 3",
    image: "/images/products/watch/apple-watch-ultra-natural.png",
    colorImages: {
      "Natural Titanium": "/images/products/watch/apple-watch-ultra-natural.png",
      "Black Titanium": "/images/products/watch/apple-watch-ultra-black.png",
      "Natural": "/images/products/watch/apple-watch-ultra-natural.png",
      "Black": "/images/products/watch/apple-watch-ultra-black.png"
    },
    priceFrom: 4930,
    condition: "new",
    sizes: ["49mm"],
    colors: ["Natural", "Black"],
    variants: [
      { size: "49mm", storage: "", color: "Black", price: 4930, available: true },
      { size: "49mm", storage: "", color: "Natural", price: 5000, available: true }
    ],
    description: "O relógio de aventura definitivo. Caixa robusta de titânio de 49mm, GPS de dupla frequência, tela de 3.000 nits e até 72 horas de bateria.",
    warranty: "1 ano de garantia oficial Apple",
    featured: true,
    active: true
  },
  {
    id: "apple-watch-se-3",
    slug: "apple-watch-se-3",
    name: "Apple Watch SE 3",
    category: "watch",
    subcategory: "Apple Watch SE 3",
    image: "/images/products/watch/apple-watch-se-midnight.png",
    colorImages: {
      "Midnight": "/images/products/watch/apple-watch-se-midnight.png",
      "Starlight": "/images/products/watch/apple-watch-se-starlight.png",
      "Silver": "/images/products/watch/apple-watch-se-silver.png"
    },
    priceFrom: 1900,
    condition: "new",
    sizes: ["40mm", "44mm"],
    colors: ["Midnight", "Starlight"],
    variants: [
      // 40mm
      { size: "40mm", storage: "", color: "Midnight", price: 1900, available: true },
      { size: "40mm", storage: "", color: "Starlight", price: 2000, available: true },
      // 44mm
      { size: "44mm", storage: "", color: "Midnight", price: 2050, available: true },
      { size: "44mm", storage: "", color: "Starlight", price: 2140, available: true }
    ],
    description: "Tudo o que você precisa por um valor imperdível. Notificações cardíacas, Detecção de Acidente e monitoramento de treinos em 40mm ou 44mm.",
    warranty: "1 ano de garantia oficial Apple",
    active: true
  },

  // ====================================================
  // 5. AIRPODS (Novos Lacrados)
  // ====================================================
  {
    id: "airpods-5",
    slug: "airpods-5",
    name: "AirPods 5",
    category: "airpods",
    subcategory: "AirPods",
    image: "/images/apple-showcase/airpods-5.jpg",
    priceFrom: 0,
    condition: "new",
    availability: "pre_order",
    storage: ["Padrão", "Com Cancelamento Ativo de Ruído (ANC)"],
    colors: ["Branco"],
    variants: [
      { storage: "Padrão", color: "Branco", price: 0, available: true },
      { storage: "Com Cancelamento Ativo de Ruído (ANC)", color: "Branco", price: 0, available: true },
    ],
    description: "Nova engenharia acústica com graves profundos e agudos cristalinos. Áudio Espacial personalizado com rastreamento dinâmico e opção com cancelamento ativo de ruído.",
    warranty: "1 ano de garantia oficial Apple",
    featured: true,
    active: true,
  },
  {
    id: "airpods-4",
    slug: "airpods-4",
    name: "AirPods 4",
    category: "airpods",
    subcategory: "AirPods",
    image: "/images/products/airpods/airpods-4.png",
    priceFrom: 1164,
    condition: "new",
    description: "Áudio Espacial Personalizado com rastreamento dinâmico da cabeça, estojo de recarga USB-C e até 30 horas de áudio.",
    warranty: "1 ano de garantia oficial Apple",
    active: true
  },
  {
    id: "airpods-4-anc",
    slug: "airpods-4-anc",
    name: "AirPods 4 ANC",
    category: "airpods",
    subcategory: "AirPods",
    image: "/images/products/airpods/airpods-4-anc.png",
    priceFrom: 1520,
    condition: "new",
    description: "Cancelamento Ativo de Ruído de última geração, Modo Ambiente, Áudio Adaptativo e estojo com alto-falante integrado para o recurso Buscar.",
    warranty: "1 ano de garantia oficial Apple",
    active: true
  },
  {
    id: "airpods-pro-3",
    slug: "airpods-pro-3",
    name: "AirPods Pro 3",
    category: "airpods",
    subcategory: "AirPods Pro",
    image: "/images/products/airpods/airpods-pro-3.png",
    priceFrom: 1780,
    condition: "new",
    description: "Cancelamento de ruído profissional avançado, isolamento acústico aprimorado com pontas de silicone e estojo MagSafe USB-C.",
    warranty: "1 ano de garantia oficial Apple",
    active: true
  },
  {
    id: "airpods-max-2",
    slug: "airpods-max-2",
    name: "AirPods Max 2",
    category: "airpods",
    subcategory: "AirPods Max",
    image: "/images/products/airpods/airpods-max-midnight.png",
    colorImages: {
      "Midnight": "/images/products/airpods/airpods-max-midnight.png",
      "Starlight": "/images/products/airpods/airpods-max-starlight.png",
      "Blue": "/images/products/airpods/airpods-max-blue.png",
      "Purple": "/images/products/airpods/airpods-max-purple.png",
      "Orange": "/images/products/airpods/airpods-max-orange.png"
    },
    priceFrom: 3450,
    condition: "new",
    colors: ["Blue", "Purple", "Orange", "Starlight", "Midnight"],
    variants: [
      { storage: "", color: "Blue", price: 3450, available: true },
      { storage: "", color: "Purple", price: 3450, available: true },
      { storage: "", color: "Orange", price: 3530, available: true },
      { storage: "", color: "Starlight", price: 3600, available: true },
      { storage: "", color: "Midnight", price: 3630, available: true },
    ],
    description: "O ápice da alta fidelidade acústica. Drivers dinâmicos desenvolvidos pela Apple, Cancelamento Ativo de Ruído profissional e novas cores com conector USB-C.",
    warranty: "1 ano de garantia oficial Apple",
    active: true
  },

  // ====================================================
  // 6. ACESSÓRIOS APPLE ORIGINAIS (Novos Lacrados)
  // ====================================================
  {
    id: "magic-mouse-3",
    slug: "magic-mouse-3",
    name: "Magic Mouse 3",
    category: "accessories",
    subcategory: "Magic Mouse",
    image: "/images/products/accessories/magic-mouse-white.png",
    colorImages: {
      "White": "/images/products/accessories/magic-mouse-white.png",
      "Black": "/images/products/accessories/magic-mouse-3-black.png"
    },
    priceFrom: 690,
    condition: "new",
    colors: ["White", "Black"],
    variants: [
      { storage: "", color: "White", price: 690, available: true },
      { storage: "", color: "Black", price: 890, available: true }
    ],
    description: "Design sem fio e recarregável via USB-C com superfície Multi-Touch para gestos intuitivos.",
    warranty: "1 ano de garantia oficial Apple",
    featured: true,
    active: true
  },
  {
    id: "magic-mouse-2",
    slug: "magic-mouse-2",
    name: "Magic Mouse 2",
    category: "accessories",
    subcategory: "Magic Mouse",
    image: "/images/products/accessories/magic-mouse-white.png",
    colorImages: {
      "White": "/images/products/accessories/magic-mouse-white.png",
      "Black": "/images/products/accessories/magic-mouse-black.png"
    },
    priceFrom: 690,
    condition: "new",
    colors: ["White", "Black"],
    variants: [
      { storage: "", color: "White", price: 690, available: true },
      { storage: "", color: "Black", price: 890, available: true }
    ],
    description: "Superfície Multi-Touch contínua, conexão Bluetooth e recarga via conector Lightning.",
    warranty: "1 ano de garantia oficial Apple",
    active: true
  },
  {
    id: "apple-pencil-pro",
    slug: "apple-pencil-pro",
    name: "Apple Pencil Pro",
    category: "accessories",
    subcategory: "Apple Pencil",
    image: "/images/products/accessories/apple-pencil-pro.png",
    priceFrom: 890,
    condition: "new",
    description: "Sensor de apertar inovador, resposta tátil precisa, giroscópio para controle de rotação e suporte ao recurso Buscar.",
    warranty: "1 ano de garantia oficial Apple",
    featured: true,
    active: true
  },
  {
    id: "apple-pencil-2",
    slug: "apple-pencil-2",
    name: "Apple Pencil (2ª Geração)",
    category: "accessories",
    subcategory: "Apple Pencil",
    image: "/images/products/accessories/apple-pencil-2.png",
    priceFrom: 690,
    condition: "new",
    description: "Precisão absoluta com fixação e recarga magnética na lateral do iPad, sensível à inclinação e pressão.",
    warranty: "1 ano de garantia oficial Apple",
    active: true
  },
  {
    id: "apple-pencil-usbc",
    slug: "apple-pencil-usbc",
    name: "Apple Pencil (USB-C)",
    category: "accessories",
    subcategory: "Apple Pencil",
    image: "/images/products/accessories/apple-pencil-usbc.png",
    priceFrom: 690,
    condition: "new",
    description: "Emparelhamento e recarga prática via porta USB-C retrátil, fixação magnética e precisão de pixel perfeito.",
    warranty: "1 ano de garantia oficial Apple",
    active: true
  },
  {
    id: "airtag-2-1pack",
    slug: "airtag-2-1pack",
    name: "AirTag 2 — 1 Pack",
    category: "accessories",
    subcategory: "AirTag",
    image: "/images/products/accessories/airtag-1pack.png",
    priceFrom: 290,
    condition: "new",
    description: "Rastreie suas chaves, carteira, mala e pertences com máxima precisão pelo app Buscar.",
    warranty: "1 ano de garantia oficial Apple",
    featured: true,
    active: true
  },
  {
    id: "airtag-2-4pack",
    slug: "airtag-2-4pack",
    name: "AirTag 2 — 4 Pack",
    category: "accessories",
    subcategory: "AirTag",
    image: "/images/products/accessories/airtag-4pack.png",
    priceFrom: 890,
    condition: "new",
    description: "Pacote com 4 unidades para proteger todos os seus itens mais importantes com a rede Buscar da Apple.",
    warranty: "1 ano de garantia oficial Apple",
    active: true
  },

  // ====================================================
  // 7. LINHA IPHONE SEMINOVOS (Do iPhone 11 ao 16 Pro Max)
  // ====================================================
  {
    id: "seminovo-iphone-16-pro-max",
    slug: "seminovo-iphone-16-pro-max",
    name: "iPhone 16 Pro Max (Seminovo)",
    category: "iphone",
    subcategory: "Seminovos Premium",
    image: "/images/products/iphone/iphone-16-generic.png",
    priceFrom: 0,
    condition: "used",
    storage: ["256GB", "512GB", "1TB"],
    description: "Seminovo em estado impecável. Tela de 6.9 polegadas, chip A18 Pro, corpo em titânio e bateria com excelente saúde.",
    warranty: "90 dias de garantia com suporte especializado",
    active: true
  },
  {
    id: "seminovo-iphone-16-pro",
    slug: "seminovo-iphone-16-pro",
    name: "iPhone 16 Pro (Seminovo)",
    category: "iphone",
    subcategory: "Seminovos Premium",
    image: "/images/products/iphone/iphone-16-generic.png",
    priceFrom: 0,
    condition: "used",
    storage: ["128GB", "256GB", "512GB", "1TB"],
    description: "Seminovo certificado. Titânio escovado, chip A18 Pro, botão Controle de Câmera e 100% testado.",
    warranty: "90 dias de garantia com suporte especializado",
    active: true
  },
  {
    id: "seminovo-iphone-16-plus",
    slug: "seminovo-iphone-16-plus",
    name: "iPhone 16 Plus (Seminovo)",
    category: "iphone",
    subcategory: "Seminovos Premium",
    image: "/images/products/iphone/iphone-16-normal.png",
    priceFrom: 0,
    condition: "used",
    storage: ["128GB", "256GB", "512GB"],
    description: "Seminovo selecionado. Tela grande de 6.7 polegadas, bateria super duradoura e chip A18.",
    warranty: "90 dias de garantia com suporte especializado",
    active: true
  },
  {
    id: "seminovo-iphone-16",
    slug: "seminovo-iphone-16",
    name: "iPhone 16 (Seminovo)",
    category: "iphone",
    subcategory: "Seminovos Premium",
    image: "/images/products/iphone/iphone-16-normal.png",
    priceFrom: 0,
    condition: "used",
    storage: ["128GB", "256GB", "512GB"],
    description: "Seminovo verificado. Câmera de 48 MP com fusão, chip A18 super rápido e cores modernas.",
    warranty: "90 dias de garantia com suporte especializado",
    active: true
  },
  {
    id: "seminovo-iphone-16e",
    slug: "seminovo-iphone-16e",
    name: "iPhone 16e (Seminovo)",
    category: "iphone",
    subcategory: "Seminovos Premium",
    image: "/images/products/iphone/iphone-16e.png",
    priceFrom: 0,
    condition: "used",
    storage: ["128GB", "256GB"],
    description: "Seminovo com ótimo custo-benefício. Chip A18 e excelente autonomia.",
    warranty: "90 dias de garantia com suporte especializado",
    active: true
  },
  {
    id: "seminovo-iphone-15-pro-max",
    slug: "seminovo-iphone-15-pro-max",
    name: "iPhone 15 Pro Max (Seminovo)",
    category: "iphone",
    subcategory: "Seminovos Premium",
    image: "/images/products/iphone/iphone-15-generic.png",
    priceFrom: 0,
    condition: "used",
    storage: ["256GB", "512GB", "1TB"],
    description: "Seminovo topo de linha em titânio natural e escuro. Chip A17 Pro, zoom óptico 5x e entrada USB-C.",
    warranty: "90 dias de garantia com suporte especializado",
    active: true
  },
  {
    id: "seminovo-iphone-15-pro",
    slug: "seminovo-iphone-15-pro",
    name: "iPhone 15 Pro (Seminovo)",
    category: "iphone",
    subcategory: "Seminovos Premium",
    image: "/images/products/iphone/iphone-15-generic.png",
    priceFrom: 0,
    condition: "used",
    storage: ["128GB", "256GB", "512GB", "1TB"],
    description: "Seminovo compacto e potente. Acabamento em titânio, botão de Ação e porta USB-C com velocidade Pro.",
    warranty: "90 dias de garantia com suporte especializado",
    active: true
  },
  {
    id: "seminovo-iphone-15-plus",
    slug: "seminovo-iphone-15-plus",
    name: "iPhone 15 Plus (Seminovo)",
    category: "iphone",
    subcategory: "Seminovos Premium",
    image: "/images/products/iphone/iphone-15-normal.png",
    priceFrom: 0,
    condition: "used",
    storage: ["128GB", "256GB", "512GB"],
    description: "Seminovo com tela ampla de 6.7\", Ilha Dinâmica, porta USB-C e bateria de alta duração.",
    warranty: "90 dias de garantia com suporte especializado",
    active: true
  },
  {
    id: "seminovo-iphone-15",
    slug: "seminovo-iphone-15",
    name: "iPhone 15 (Seminovo)",
    category: "iphone",
    subcategory: "Seminovos Premium",
    image: "/images/products/iphone/iphone-15-normal.png",
    priceFrom: 0,
    condition: "used",
    storage: ["128GB", "256GB", "512GB"],
    description: "Seminovo em estado de novo. Ilha Dinâmica, câmera de 48 MP, USB-C e vidro colorido por infusão.",
    warranty: "90 dias de garantia com suporte especializado",
    active: true
  },
  {
    id: "seminovo-iphone-14-pro-max",
    slug: "seminovo-iphone-14-pro-max",
    name: "iPhone 14 Pro Max (Seminovo)",
    category: "iphone",
    subcategory: "Seminovos",
    image: "/images/products/iphone/iphone-15-generic.png",
    priceFrom: 0,
    condition: "used",
    storage: ["128GB", "256GB", "512GB", "1TB"],
    description: "Seminovo muito procurado. Ilha Dinâmica, tela Always-On de 6.7\", chip A16 Bionic e câmeras Pro.",
    warranty: "90 dias de garantia com suporte especializado",
    active: true
  },
  {
    id: "seminovo-iphone-14-pro",
    slug: "seminovo-iphone-14-pro",
    name: "iPhone 14 Pro (Seminovo)",
    category: "iphone",
    subcategory: "Seminovos",
    image: "/images/products/iphone/iphone-15-generic.png",
    priceFrom: 0,
    condition: "used",
    storage: ["128GB", "256GB", "512GB", "1TB"],
    description: "Seminovo certificado. Tela ProMotion 120Hz, Ilha Dinâmica e câmera principal de 48 MP.",
    warranty: "90 dias de garantia com suporte especializado",
    active: true
  },
  {
    id: "seminovo-iphone-14-plus",
    slug: "seminovo-iphone-14-plus",
    name: "iPhone 14 Plus (Seminovo)",
    category: "iphone",
    subcategory: "Seminovos",
    image: "/images/products/iphone/iphone-15-normal.png",
    priceFrom: 0,
    condition: "used",
    storage: ["128GB", "256GB", "512GB"],
    description: "Seminovo com tela de 6.7 polegadas e bateria gigantesca para múltiplos dias de uso moderado.",
    warranty: "90 dias de garantia com suporte especializado",
    active: true
  },
  {
    id: "seminovo-iphone-14",
    slug: "seminovo-iphone-14",
    name: "iPhone 14 (Seminovo)",
    category: "iphone",
    subcategory: "Seminovos",
    image: "/images/products/iphone/iphone-15-normal.png",
    priceFrom: 0,
    condition: "used",
    storage: ["128GB", "256GB", "512GB"],
    description: "Seminovo moderno com modo Ação nas gravações, Detecção de Acidente e chip A15 Bionic.",
    warranty: "90 dias de garantia com suporte especializado",
    active: true
  },
  {
    id: "seminovo-iphone-13-pro-max",
    slug: "seminovo-iphone-13-pro-max",
    name: "iPhone 13 Pro Max (Seminovo)",
    category: "iphone",
    subcategory: "Seminovos",
    image: "/images/products/iphone/iphone-15-generic.png",
    priceFrom: 0,
    condition: "used",
    storage: ["128GB", "256GB", "512GB", "1TB"],
    description: "Seminovo campeão de bateria. Tela ProMotion de 120Hz, câmeras macro e Modo Cinema.",
    warranty: "90 dias de garantia com suporte especializado",
    active: true
  },
  {
    id: "seminovo-iphone-13-pro",
    slug: "seminovo-iphone-13-pro",
    name: "iPhone 13 Pro (Seminovo)",
    category: "iphone",
    subcategory: "Seminovos",
    image: "/images/products/iphone/iphone-15-generic.png",
    priceFrom: 0,
    condition: "used",
    storage: ["128GB", "256GB", "512GB", "1TB"],
    description: "Seminovo com display Super Retina XDR ProMotion de 120Hz, acabamento em aço inoxidável cirúrgico.",
    warranty: "90 dias de garantia com suporte especializado",
    active: true
  },
  {
    id: "seminovo-iphone-13",
    slug: "seminovo-iphone-13",
    name: "iPhone 13 (Seminovo)",
    category: "iphone",
    subcategory: "Seminovos",
    image: "/images/products/iphone/iphone-15-normal.png",
    priceFrom: 0,
    condition: "used",
    storage: ["128GB", "256GB", "512GB"],
    description: "Seminovo de maior sucesso. Câmeras na diagonal com estabilização óptica por deslocamento de sensor.",
    warranty: "90 dias de garantia com suporte especializado",
    active: true
  },
  {
    id: "seminovo-iphone-13-mini",
    slug: "seminovo-iphone-13-mini",
    name: "iPhone 13 mini (Seminovo)",
    category: "iphone",
    subcategory: "Seminovos",
    image: "/images/products/iphone/iphone-15-normal.png",
    priceFrom: 0,
    condition: "used",
    storage: ["128GB", "256GB", "512GB"],
    description: "Seminovo super compacto de 5.4 polegadas com toda a potência do chip A15 Bionic.",
    warranty: "90 dias de garantia com suporte especializado",
    active: true
  },
  {
    id: "seminovo-iphone-12-pro-max",
    slug: "seminovo-iphone-12-pro-max",
    name: "iPhone 12 Pro Max (Seminovo)",
    category: "iphone",
    subcategory: "Seminovos",
    image: "/images/products/iphone/iphone-15-generic.png",
    priceFrom: 0,
    condition: "used",
    storage: ["128GB", "256GB", "512GB"],
    description: "Seminovo com tela ampla de 6.7 polegadas, conexão 5G, scanner LiDAR e lente teleobjetiva.",
    warranty: "90 dias de garantia com suporte especializado",
    active: true
  },
  {
    id: "seminovo-iphone-12-pro",
    slug: "seminovo-iphone-12-pro",
    name: "iPhone 12 Pro (Seminovo)",
    category: "iphone",
    subcategory: "Seminovos",
    image: "/images/products/iphone/iphone-15-generic.png",
    priceFrom: 0,
    condition: "used",
    storage: ["128GB", "256GB", "512GB"],
    description: "Seminovo em aço inoxidável com 3 câmeras, sensor LiDAR e suporte MagSafe.",
    warranty: "90 dias de garantia com suporte especializado",
    active: true
  },
  {
    id: "seminovo-iphone-12",
    slug: "seminovo-iphone-12",
    name: "iPhone 12 (Seminovo)",
    category: "iphone",
    subcategory: "Seminovos",
    image: "/images/products/iphone/iphone-15-normal.png",
    priceFrom: 0,
    condition: "used",
    storage: ["64GB", "128GB", "256GB"],
    description: "Seminovo com tela OLED Super Retina XDR, bordas retas modernas e compatibilidade MagSafe.",
    warranty: "90 dias de garantia com suporte especializado",
    active: true
  },
  {
    id: "seminovo-iphone-12-mini",
    slug: "seminovo-iphone-12-mini",
    name: "iPhone 12 mini (Seminovo)",
    category: "iphone",
    subcategory: "Seminovos",
    image: "/images/products/iphone/iphone-15-normal.png",
    priceFrom: 0,
    condition: "used",
    storage: ["64GB", "128GB", "256GB"],
    description: "Seminovo ultraleve e compacto com tela OLED de 5.4\" e conectividade 5G.",
    warranty: "90 dias de garantia com suporte especializado",
    active: true
  },
  {
    id: "seminovo-iphone-11-pro-max",
    slug: "seminovo-iphone-11-pro-max",
    name: "iPhone 11 Pro Max (Seminovo)",
    category: "iphone",
    subcategory: "Seminovos",
    image: "/images/products/iphone/iphone-15-generic.png",
    priceFrom: 0,
    condition: "used",
    storage: ["64GB", "256GB", "512GB"],
    description: "Seminovo com tela OLED de 6.5 polegadas, sistema de câmera tripla e excelente ergonomia.",
    warranty: "90 dias de garantia com suporte especializado",
    active: true
  },
  {
    id: "seminovo-iphone-11-pro",
    slug: "seminovo-iphone-11-pro",
    name: "iPhone 11 Pro (Seminovo)",
    category: "iphone",
    subcategory: "Seminovos",
    image: "/images/products/iphone/iphone-15-generic.png",
    priceFrom: 0,
    condition: "used",
    storage: ["64GB", "256GB", "512GB"],
    description: "Seminovo compacto de 5.8 polegadas com acabamento em vidro fosco e aço cirúrgico.",
    warranty: "90 dias de garantia com suporte especializado",
    active: true
  },
  {
    id: "seminovo-iphone-11",
    slug: "seminovo-iphone-11",
    name: "iPhone 11 (Seminovo)",
    category: "iphone",
    subcategory: "Seminovos",
    image: "/images/products/iphone/iphone-15-normal.png",
    priceFrom: 0,
    condition: "used",
    storage: ["64GB", "128GB", "256GB"],
    description: "O seminovo de entrada mais acessível da Apple. Câmera dupla com Modo Noturno e chip A13 Bionic.",
    warranty: "90 dias de garantia com suporte especializado",
    active: true
  }
];
