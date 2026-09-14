import { storeConfig } from "@/data/storeConfig";

export function createWhatsAppLink(message: string): string {
  const number = storeConfig.contact.whatsapp;
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${number}?text=${encodedMessage}`;
}

export function getWhatsAppProductUrl(
  productName: string,
  storage?: string,
  color?: string,
  price?: number
): string {
  let text = `Olá! Gostaria de mais informações sobre o *${productName}*`;
  
  if (storage || color) {
    const details = [storage, color].filter(Boolean).join(" - ");
    text += ` (${details})`;
  }
  
  text += `. Como posso prosseguir com o pedido?`;
  return createWhatsAppLink(text);
}

export function getWhatsAppTradeInUrl(details: {
  currentModel: string;
  storage: string;
  generalCondition: string;
  observations?: string;
  desiredModel: string;
  desiredStorage: string;
  desiredCondition?: string;
}): string {
  let text = `Olá! Gostaria de fazer uma avaliação para troca (Trade-in).\n\n` +
    `📱 MEU APARELHO ATUAL\n` +
    `Modelo: ${details.currentModel}\n` +
    `Armazenamento: ${details.storage}\n` +
    `Estado de conservação: ${details.generalCondition}\n`;

  if (details.observations && details.observations.trim().length > 0) {
    text += `Observações: ${details.observations.trim()}\n`;
  }

  text += `\n🚀 APARELHO DESEJADO NO UPGRADE\n` +
    `Modelo: ${details.desiredModel}\n` +
    `Condição: ${details.desiredCondition || "Novo e Lacrado"}\n` +
    `Armazenamento: ${details.desiredStorage}\n\n` +
    `Gostaria de receber uma cotação e proposta para a troca.`;

  return createWhatsAppLink(text);
}

export function getWhatsAppServiceUrl(serviceTitle: string): string {
  const text = `Olá! Gostaria de solicitar um orçamento para o serviço de assistência técnica: *${serviceTitle}*. Podem me ajudar?`;
  return createWhatsAppLink(text);
}

export function getWhatsAppGeneralUrl(customMessage?: string): string {
  const text = customMessage || `Olá! Vim pelo site da Mundo Apple Delivery e gostaria de tirar algumas dúvidas.`;
  return createWhatsAppLink(text);
}
