export type ConditionType = "new" | "used";
export type AvailabilityType = "available" | "out_of_stock" | "on_request" | "pre_order";

export interface ProductVariant {
  storage: string;
  color: string;
  price: number;
  available: boolean;
  image?: string;
  screenSize?: string;
  size?: string;
  chip?: string;
  ram?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: "iphone" | "ipad" | "mac" | "watch" | "accessories" | "seminovos" | string;
  subcategory?: string;
  image: string;
  colorImages?: Record<string, string>;
  gallery?: string[];
  priceFrom: number;
  condition: ConditionType;
  screenSizes?: string[];
  sizes?: string[]; // For milimetragem (ex: 40mm, 44mm, 42mm, 46mm, 49mm)
  chips?: string[];
  ramOptions?: string[];
  storage?: string[];
  colors?: string[];
  description?: string;
  specs?: Record<string, string>;
  warranty?: string;
  invoice?: boolean;
  featured?: boolean;
  active: boolean;
  availability?: AvailabilityType;
  batteryHealth?: number; // For seminovos (e.g. 94%)
  gradeCondition?: "Excelente" | "Como Novo" | "Muito Bom"; // For seminovos
  variants?: ProductVariant[];
}
