export function formatBRL(value: number): string {
  if (value === null || value === undefined || isNaN(value)) return "R$ 0,00";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export const formatCurrency = formatBRL;

export function formatConditionLabel(condition: "new" | "used"): string {
  return condition === "new" ? "Novo Lacrado" : "Seminovo Certificado";
}

export function formatAvailabilityLabel(availability?: "available" | "out_of_stock" | "on_request"): string {
  switch (availability) {
    case "available":
      return "Pronta Entrega";
    case "out_of_stock":
      return "Indisponível";
    case "on_request":
      return "Sob Consulta";
    default:
      return "Pronta Entrega";
  }
}
