export interface TechnicalService {
  id: string;
  title: string;
  category: "display" | "battery" | "board" | "camera" | "glass" | "connector" | "diagnostic" | "other";
  description: string;
  estimatedTime: string;
  warranty: string;
  featuredHome: boolean;
  priceStartingFrom?: number;
  iconName: string;
}
