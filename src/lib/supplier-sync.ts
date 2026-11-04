export interface SupplierSyncResult {
  success: boolean;
  timestamp: string;
  totalSupplierItems: number;
  matchedProductsCount: number;
  updatedVariantsCount: number;
  errors?: string[];
  lastSuccessfulAt?: string;
  intervalMs?: number;
}

export function getLastSupplierSync(): SupplierSyncResult | undefined {
  return undefined;
}

export async function syncSupplierPrices(): Promise<SupplierSyncResult> {
  return {
    success: true,
    timestamp: new Date().toISOString(),
    totalSupplierItems: 0,
    matchedProductsCount: 0,
    updatedVariantsCount: 0,
    errors: ["Sincronização externa desativada. Modo manual ativo."],
  };
}
