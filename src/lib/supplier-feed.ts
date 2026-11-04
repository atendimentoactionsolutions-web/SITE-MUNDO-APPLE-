import { SupplierSyncResult } from "./supplier-sync";

/**
 * Supplier feed desativado: agora o site trabalha 100% com valores manuais.
 */
export interface SupplierItem {
  name: string;
  category: string;
  price: number;
  condition: string;
  description: string;
  storage?: string;
  color?: string;
  battery?: string;
  isSeminovo: boolean;
}

export async function fetchSupplierItems(): Promise<SupplierItem[]> {
  // Retorna vazio para que nenhum feed externo sobrescreva os valores manuais
  return [];
}
