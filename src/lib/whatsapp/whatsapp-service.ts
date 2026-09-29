import QRCode from "qrcode";
import path from "path";
import fs from "fs";

// Global singleton to persist across Next.js serverless/dev module reloads
declare global {
  var __waSocket: any | null | undefined;
  var __waQrCode: string | null | undefined;
  var __waStatus: "DISCONNECTED" | "SCAN_QR" | "CONNECTED" | "CONNECTING" | undefined;
  var __waUser: string | null | undefined;
  var __waInitPromise: Promise<any> | null | undefined;
}

const SESSION_DIR = path.join(process.cwd(), ".whatsapp-session");

export interface WhatsAppStatus {
  status: "DISCONNECTED" | "SCAN_QR" | "CONNECTED" | "CONNECTING";
  qrCodeDataUrl: string | null;
  phoneNumber: string | null;
}

export function getWhatsAppStatus(): WhatsAppStatus {
  return {
    status: global.__waStatus || "DISCONNECTED",
    qrCodeDataUrl: global.__waQrCode || null,
    phoneNumber: global.__waUser || null,
  };
}

export async function initWhatsApp(forceReset = false): Promise<any> {
  if (forceReset) {
    if (global.__waSocket) {
      try {
        global.__waSocket.end(undefined);
      } catch (e) {}
      global.__waSocket = null;
    }
    global.__waInitPromise = null;
    global.__waStatus = "DISCONNECTED";
    global.__waQrCode = null;
    global.__waUser = null;
    try {
      if (fs.existsSync(SESSION_DIR)) {
        fs.rmSync(SESSION_DIR, { recursive: true, force: true });
      }
    } catch (e) {}
  }

  if (global.__waSocket && global.__waStatus === "CONNECTED") {
    return global.__waSocket;
  }

  if (global.__waInitPromise) {
    return global.__waInitPromise;
  }

  global.__waInitPromise = (async () => {
    try {
      if (!fs.existsSync(SESSION_DIR)) {
        fs.mkdirSync(SESSION_DIR, { recursive: true });
      }

      global.__waStatus = "CONNECTING";

      // Dynamic import to prevent webpack resolution issues
      const {
        default: makeWASocket,
        useMultiFileAuthState,
        DisconnectReason,
        fetchLatestBaileysVersion,
      } = await import("@whiskeysockets/baileys");

      const pino = (await import("pino")).default;

      const { state, saveCreds } = await useMultiFileAuthState(SESSION_DIR);
      let version: [number, number, number] = [2, 3000, 1043857760];
      try {
        const v = await fetchLatestBaileysVersion();
        if (v?.version) version = v.version;
      } catch (err) {}

      const sock = makeWASocket({
        version,
        logger: pino({ level: "silent" }),
        auth: state,
        browser: ["Mundo Apple Delivery", "Chrome", "1.0.0"],
        syncFullHistory: false,
      });

      global.__waSocket = sock;

      sock.ev.on("creds.update", saveCreds);

      sock.ev.on("connection.update", async (update: any) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
          try {
            console.log("Gerando imagem do QR Code para WhatsApp...");
            const qrDataUrl = await QRCode.toDataURL(qr, {
              margin: 2,
              width: 340,
              color: {
                dark: "#000000",
                light: "#ffffff",
              },
            });
            global.__waQrCode = qrDataUrl;
            global.__waStatus = "SCAN_QR";
            console.log("QR Code gerado com sucesso!");
          } catch (err) {
            console.error("Erro ao gerar QR Code WhatsApp:", err);
          }
        }

        if (connection === "close") {
          const statusCode = (lastDisconnect?.error as any)?.output?.statusCode;
          const shouldReconnect = statusCode !== DisconnectReason?.loggedOut;

          global.__waStatus = "DISCONNECTED";
          global.__waQrCode = null;
          global.__waUser = null;
          global.__waSocket = null;
          global.__waInitPromise = null;

          if (shouldReconnect) {
            console.log("WhatsApp desconectado. Tentando reconectar em 3s...");
            setTimeout(() => {
              initWhatsApp();
            }, 3000);
          } else {
            console.log("WhatsApp desconectado (logout). Limpando sessão.");
            try {
              if (fs.existsSync(SESSION_DIR)) {
                fs.rmSync(SESSION_DIR, { recursive: true, force: true });
              }
            } catch (e) {}
          }
        } else if (connection === "open") {
          global.__waStatus = "CONNECTED";
          global.__waQrCode = null;
          const rawUser = sock.user?.id || "";
          global.__waUser = rawUser ? rawUser.split(":")[0] : "Conectado";
          console.log("WhatsApp Conectado com sucesso:", global.__waUser);
        }
      });

      return sock;
    } catch (error) {
      console.error("Erro na inicialização do WhatsApp:", error);
      global.__waStatus = "DISCONNECTED";
      global.__waInitPromise = null;
      throw error;
    }
  })();

  return global.__waInitPromise;
}

export async function disconnectWhatsApp() {
  if (global.__waSocket) {
    try {
      await global.__waSocket.logout();
    } catch (e) {
      try {
        global.__waSocket.end(undefined);
      } catch (err) {}
    }
  }
  global.__waSocket = null;
  global.__waInitPromise = null;
  global.__waStatus = "DISCONNECTED";
  global.__waQrCode = null;
  global.__waUser = null;

  try {
    if (fs.existsSync(SESSION_DIR)) {
      fs.rmSync(SESSION_DIR, { recursive: true, force: true });
    }
  } catch (e) {}
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

    // 1. Primary: Servidor WhatsApp gratuito (Render.com) via Baileys
    const waServerUrl = process.env.WA_SERVER_URL;
    const waApiSecret = process.env.WA_API_SECRET || "mundoapple2024";

    if (waServerUrl) {
      try {
        const res = await fetch(`${waServerUrl}/send`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": waApiSecret,
          },
          body: JSON.stringify({ phone: clean, message: text }),
        });

        const data = await res.json().catch(() => ({}));
        if (res.ok && data.success) {
          console.log("✅ Mensagem enviada via servidor WhatsApp gratuito");
          return { success: true };
        }
        console.warn("Servidor WhatsApp retornou erro, tentando Z-API:", data);
      } catch (serverErr) {
        console.warn("Erro ao chamar servidor WhatsApp, tentando Z-API:", serverErr);
      }
    }

    // 2. Fallback: Z-API Cloud
    const zapiUrl =
      process.env.ZAPI_SEND_URL ||
      "https://api.z-api.io/instances/3F9E51FF6AF2F1E0ED2E12D9859A8F8F/token/FEED870F6FB3C83895623031/send-text";
    const clientToken = process.env.ZAPI_CLIENT_TOKEN || "Fb9680364c5be42b4a0ebc8e523f3b443S";

    try {
      const zapiRes = await fetch(zapiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Client-Token": clientToken,
        },
        body: JSON.stringify({ phone: clean, message: text }),
      });

      const zapiData = await zapiRes.json().catch(() => ({}));
      if (zapiRes.ok && (zapiData.zaapId || zapiData.messageId || zapiData.id)) {
        console.log("✅ Mensagem enviada via Z-API:", zapiData);
        return { success: true };
      }
      console.warn("Z-API retorno não-200, tentando Baileys local:", zapiData);
    } catch (zapiErr) {
      console.warn("Erro ao chamar Z-API, tentando Baileys local:", zapiErr);
    }

    // 3. Último recurso: Baileys local (só funciona localmente)
    const jid = `${clean}@s.whatsapp.net`;

    if (!global.__waSocket || global.__waStatus !== "CONNECTED") {
      const sock = await initWhatsApp().catch(() => null);
      if (!sock || global.__waStatus !== "CONNECTED") {
        return { success: false, error: "Nenhum método de envio disponível." };
      }
      await sock.sendMessage(jid, { text });
      return { success: true };
    }

    await global.__waSocket.sendMessage(jid, { text });
    return { success: true };
  } catch (err: any) {
    console.error("Erro ao enviar mensagem WhatsApp:", err);
    return { success: false, error: err?.message || "Erro interno ao enviar mensagem" };
  }
}
