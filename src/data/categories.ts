import { Category } from "@/types/category";

export const categories: Category[] = [
  {
    id: "iphone",
    name: "iPhones",
    slug: "iphone",
    description: "iPhones novos lacrados de última geração com garantia oficial Apple.",
    subcategories: ["iPhone 15", "iPhone 16", "iPhone 17"]
  },
  {
    id: "watch",
    name: "Apple Watch",
    slug: "apple-watch",
    description: "Apple Watch Series 11, Ultra 3 e SE 3 para saúde, esportes e alta conectividade no seu pulso.",
    subcategories: ["Apple Watch Series 11", "Apple Watch Ultra 3", "Apple Watch SE 3"]
  },
  {
    id: "ipad",
    name: "iPads",
    slug: "ipad",
    description: "iPad Pro M5 e iPad 11ª Geração com tela Ultra Retina XDR e suporte ao Apple Pencil.",
    subcategories: ["iPad Pro M5 11\"", "iPad Pro M5 13\"", "iPad 11"]
  },
  {
    id: "mac",
    name: "Mac & MacBook",
    slug: "mac",
    description: "MacBook Pro, MacBook Air, iMac e Mac mini com a velocidade revolucionária dos chips Apple Silicon M5 e M4.",
    subcategories: ["MacBook Pro", "MacBook Air", "MacBook Neo", "Mac mini", "iMac"]
  },
  {
    id: "airpods",
    name: "AirPods",
    slug: "airpods",
    description: "Fones de ouvido sem fio Apple com cancelamento ativo de ruído, áudio espacial e som de alta fidelidade.",
    subcategories: ["AirPods 4", "AirPods Pro", "AirPods Max"]
  },
  {
    id: "accessories",
    name: "Acessórios",
    slug: "acessorios",
    description: "Magic Mouse, Apple Pencil, AirTags e acessórios 100% originais Apple com garantia oficial.",
    subcategories: ["Magic Mouse", "Apple Pencil", "AirTag"]
  }
];
