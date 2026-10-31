export interface WhatsAppStatus {
  status: "DISCONNECTED" | "SCAN_QR" | "CONNECTED" | "CONNECTING";
  qrCodeDataUrl: string | null;
  phoneNumber: string | null;
  error?: string | null;
}

async function requestWorker(endpoint: string, body?: object): Promise<WhatsAppStatus> {
  const url = process.env.WA_SERVER_URL || "http://127.0.0.1:3001";
  const response = await fetch(url + endpoint, {
    method: body === undefined ? "GET" : "POST",
    headers: { "Content-Type": "application/json", "x-api-key": process.env.WA_API_SECRET || "mundoapple2024" },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
  });
  const data = await response.json();
  if (!response.ok || data.success === false) throw new Error(data.error || "Servico WhatsApp indisponivel.");
  return { status: data.status, qrCodeDataUrl: data.qrCodeDataUrl || null, phoneNumber: data.phoneNumber || data.user || null, error: data.error || null };
}

export async function getWhatsAppStatus(): Promise<WhatsAppStatus> {
  return requestWorker("/status");
}
export async function initWhatsApp(forceReset = false): Promise<WhatsAppStatus> {
  return requestWorker("/connect", { forceReset });
}
export async function disconnectWhatsApp(): Promise<WhatsAppStatus> {
  return requestWorker("/disconnect", {});
}

export async function sendWhatsAppMessage(rawPhone: string, text: string): Promise<{ success: boolean; error?: string }> {
  try {
    let clean = rawPhone.replace(/\D/g, "");
    if (!clean) {
      return { success: false, error: "Número de telefone inválido" };
    }

    if (clean.length === 10 || clean.length === 11) {
      clean = "55" + clean;
    }

    // 1. Tentar Servidor WhatsApp Local da VPS ou Render via Baileys
    const waServerUrl = process.env.WA_SERVER_URL || "http://127.0.0.1:3001";
    const waApiSecret = process.env.WA_API_SECRET || "mundoapple2024";

    console.log(`[WHATSAPP] Tentando envio para ${clean} via ${waServerUrl}...`);


    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(`${waServerUrl}/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": waApiSecret,
        },
        body: JSON.stringify({ phone: clean, message: text }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        console.log(`[WHATSAPP] ✅ Mensagem entregue com sucesso via Render para ${clean}`);
        return { success: true };
      }
      console.warn(`[WHATSAPP] Render retornou erro ou não confirmou. Tentando Z-API...`, data);
    } catch (renderErr) {
      console.warn(`[WHATSAPP] Timeout ou indisponibilidade no Render. Tentando Z-API...`, renderErr);
    }

    // 2. Fallback: Z-API Cloud WhatsApp
    const zapiSendUrl = process.env.ZAPI_SEND_URL;
    const zapiClientToken = process.env.ZAPI_CLIENT_TOKEN;

    if (zapiSendUrl) {
      console.log(`[WHATSAPP] Tentando envio fallback via Z-API para ${clean}...`);
      try {
        const zapiRes = await fetch(zapiSendUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(zapiClientToken ? { "Client-Token": zapiClientToken } : {}),
          },
          body: JSON.stringify({
            phone: clean,
            message: text,
          }),
        });

        const zapiData = await zapiRes.json().catch(() => ({}));
        if (zapiRes.ok && (zapiData.zaapId || zapiData.messageId || zapiData.id || !zapiData.error)) {
          console.log(`[WHATSAPP] ✅ Mensagem entregue com sucesso via Z-API para ${clean}`);
          return { success: true };
        }
        console.error(`[WHATSAPP] ❌ Erro no fallback Z-API:`, zapiData);
      } catch (zapiErr) {
        console.error(`[WHATSAPP] ❌ Falha de conexão no fallback Z-API:`, zapiErr);
      }
    }

    return { success: false, error: "Falha no envio de WhatsApp (Render e Z-API)" };
  } catch (err: any) {
    console.error("[WHATSAPP] ❌ Exceção ao enviar mensagem:", err);
    return { success: false, error: err?.message || "Erro interno ao enviar mensagem" };
  }
}

