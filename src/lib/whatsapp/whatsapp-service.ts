import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
  WASocket,
  fetchLatestBaileysVersion,
} from "@whiskeysockets/baileys";
import QRCode from "qrcode";
import path from "path";
import fs from "fs";
import pino from "pino";

// Global singleton to persist across Next.js serverless/dev module reloads
declare global {
  var __waSocket: WASocket | null | undefined;
  var __waQrCode: string | null | undefined;
  var __waStatus: "DISCONNECTED" | "SCAN_QR" | "CONNECTED" | "CONNECTING" | undefined;
  var __waUser: string | null | undefined;
  var __waInitPromise: Promise<WASocket> | null | undefined;
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

export async function initWhatsApp(forceReset = false): Promise<WASocket> {
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
      const { state, saveCreds } = await useMultiFileAuthState(SESSION_DIR);
      const { version } = await fetchLatestBaileysVersion();

      const sock = makeWASocket({
        version,
        logger: pino({ level: "silent" }),
        printQRInTerminal: false,
        auth: state,
        browser: ["Mundo Apple Delivery", "Chrome", "1.0.0"],
        syncFullHistory: false,
      });

      global.__waSocket = sock;

      sock.ev.on("creds.update", saveCreds);

      sock.ev.on("connection.update", async (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
          try {
            const qrDataUrl = await QRCode.toDataURL(qr, {
              margin: 2,
              width: 320,
              color: {
                dark: "#000000",
                light: "#ffffff",
              },
            });
            global.__waQrCode = qrDataUrl;
            global.__waStatus = "SCAN_QR";
          } catch (err) {
            console.error("Erro ao gerar QR Code WhatsApp:", err);
          }
        }

        if (connection === "close") {
          const shouldReconnect =
            (lastDisconnect?.error as any)?.output?.statusCode !== DisconnectReason.loggedOut;

          global.__waStatus = "DISCONNECTED";
          global.__waQrCode = null;
          global.__waUser = null;
          global.__waSocket = null;
          global.__waInitPromise = null;

          if (shouldReconnect) {
            console.log("Reconectando WhatsApp...");
            setTimeout(() => {
              initWhatsApp();
            }, 3000);
          } else {
            console.log("WhatsApp desconectado/logout realizado.");
            try {
              fs.rmSync(SESSION_DIR, { recursive: true, force: true });
            } catch (e) {}
          }
        } else if (connection === "open") {
          global.__waStatus = "CONNECTED";
          global.__waQrCode = null;
          global.__waUser = sock.user?.id ? sock.user.id.split(":")[0] : "Conectado";
          console.log("WhatsApp Conectado com sucesso:", global.__waUser);
        }
      });

      return sock;
    } catch (error) {
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

    const jid = `${clean}@s.whatsapp.net`;

    if (!global.__waSocket || global.__waStatus !== "CONNECTED") {
      const sock = await initWhatsApp();
      if (global.__waStatus !== "CONNECTED") {
        return { success: false, error: "WhatsApp da loja não está conectado. Escaneie o QR Code no painel." };
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
