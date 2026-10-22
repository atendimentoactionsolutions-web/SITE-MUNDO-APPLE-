import express from "express";
import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
} from "@whiskeysockets/baileys";
import pino from "pino";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
import QRCode from "qrcode";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SESSION_DIR = path.join(__dirname, ".wa-session");
const PORT = process.env.PORT || 3001;
const API_SECRET = process.env.WA_API_SECRET || "mundoapple2024";

const logger = pino({ level: "silent" });

// ─── Cache em Memória para Retry Receipts (Evita "Aguardando mensagem") ───
const messageStore = new Map();

function saveMessageToStore(msg) {
  if (!msg || !msg.key || !msg.key.id) return;
  const key = `${msg.key.remoteJid}:${msg.key.id}`;
  messageStore.set(key, msg.message);
  messageStore.set(msg.key.id, msg.message);
  // Manter no máximo 1000 mensagens em cache
  if (messageStore.size > 2000) {
    const firstKey = messageStore.keys().next().value;
    if (firstKey) messageStore.delete(firstKey);
  }
}

class SimpleNodeCache {
  constructor() {
    this.map = new Map();
  }
  get(k) {
    return this.map.get(k);
  }
  set(k, v) {
    this.map.set(k, v);
    if (this.map.size > 5000) {
      const firstKey = this.map.keys().next().value;
      if (firstKey) this.map.delete(firstKey);
    }
    return true;
  }
  del(k) {
    this.map.delete(k);
    return 1;
  }
  flushAll() {
    this.map.clear();
  }
}

const msgRetryCounterCache = new SimpleNodeCache();

// ─── Estado Global ─────────────────────────────────────────────
let waSocket = null;
let waStatus = "DISCONNECTED";
let waQrCode = null;
let waUser = null;
let waInitPromise = null;

// ─── Init WhatsApp ─────────────────────────────────────────────
async function initWhatsApp(forceReset = false) {
  if (forceReset) {
    if (waSocket) {
      try {
        waSocket.end(undefined);
      } catch (e) {}
    }
    waSocket = null;
    waInitPromise = null;
    waStatus = "DISCONNECTED";
    waQrCode = null;
    waUser = null;
    try {
      if (fs.existsSync(SESSION_DIR)) fs.rmSync(SESSION_DIR, { recursive: true, force: true });
    } catch (e) {}
  }

  if (waSocket && waStatus === "CONNECTED") return waSocket;
  if (waInitPromise) return waInitPromise;

  waInitPromise = (async () => {
    try {
      if (!fs.existsSync(SESSION_DIR)) fs.mkdirSync(SESSION_DIR, { recursive: true });

      waStatus = "CONNECTING";
      console.log("🔄 Iniciando WhatsApp...");

      const { state, saveCreds } = await useMultiFileAuthState(SESSION_DIR);
      let version = [2, 3000, 1043857760];
      try {
        const v = await fetchLatestBaileysVersion();
        if (v?.version) version = v.version;
      } catch (e) {}

      const sock = makeWASocket({
        version,
        logger,
        auth: {
          creds: state.creds,
          keys: makeCacheableSignalKeyStore(state.keys, logger),
        },
        msgRetryCounterCache,
        browser: ["Mundo Apple", "Chrome", "1.0.0"],
        syncFullHistory: false,
        markOnlineOnConnect: true,
        generateHighQualityLinkPreview: false,
        getMessage: async (key) => {
          const fullKey = `${key.remoteJid}:${key.id}`;
          return messageStore.get(fullKey) || messageStore.get(key.id) || { conversation: "" };
        },
      });

      waSocket = sock;
      sock.ev.on("creds.update", saveCreds);

      sock.ev.on("messages.upsert", ({ messages }) => {
        if (Array.isArray(messages)) {
          for (const m of messages) {
            saveMessageToStore(m);
          }
        }
      });

      sock.ev.on("connection.update", async (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
          try {
            waQrCode = await QRCode.toDataURL(qr, { margin: 2, width: 340 });
            waStatus = "SCAN_QR";
            console.log("📱 QR Code gerado — acesse /qr para escanear");
          } catch (e) {}
        }

        if (connection === "close") {
          const code = lastDisconnect?.error?.output?.statusCode;
          const reconnect = code !== DisconnectReason.loggedOut;
          waSocket = null;
          waInitPromise = null;
          waStatus = "DISCONNECTED";
          waQrCode = null;
          waUser = null;

          if (reconnect) {
            console.log("⚠️  Desconectado. Reconectando em 5s...");
            setTimeout(() => initWhatsApp(), 5000);
          } else {
            console.log("🚫 Logout detectado. Sessão apagada.");
            try {
              fs.rmSync(SESSION_DIR, { recursive: true, force: true });
            } catch (e) {}
          }
        } else if (connection === "open") {
          waStatus = "CONNECTED";
          waQrCode = null;
          waUser = (sock.user?.id || "").split(":")[0];
          console.log("✅ WhatsApp conectado:", waUser);
        }
      });

      return sock;
    } catch (err) {
      console.error("Erro init WhatsApp:", err);
      waStatus = "DISCONNECTED";
      waInitPromise = null;
      throw err;
    }
  })();

  return waInitPromise;
}

// Inicia automaticamente ao subir o servidor
initWhatsApp().catch(() => {});

// ─── Express App ───────────────────────────────────────────────
const app = express();
app.use(express.json());

// Middleware de autenticação
function auth(req, res, next) {
  const key = req.headers["x-api-key"] || req.query.key;
  if (key !== API_SECRET) return res.status(401).json({ error: "Unauthorized" });
  next();
}

// GET /status — retorna status da conexão
app.get("/status", auth, (req, res) => {
  res.json({ status: waStatus, user: waUser, hasQr: !!waQrCode, qrCodeDataUrl: waQrCode });
});

// POST /disconnect — desconecta e reseta sessão
app.post("/disconnect", auth, async (req, res) => {
  await initWhatsApp(true).catch(() => {});
  res.json({ success: true, message: "Desconectado com sucesso." });
});

// GET /qr — retorna página HTML com QR Code para escanear
app.get("/qr", auth, async (req, res) => {
  if (waStatus === "CONNECTED") {
    return res.send(`<html><body style="font-family:sans-serif;text-align:center;padding:40px">
      <h2>✅ WhatsApp Conectado!</h2>
      <p>Número: <strong>${waUser}</strong></p>
    </body></html>`);
  }

  if (!waQrCode) {
    await initWhatsApp().catch(() => {});
    await new Promise((r) => setTimeout(r, 3000));
  }

  if (waQrCode) {
    return res.send(`<html><body style="font-family:sans-serif;text-align:center;padding:40px;background:#f5f5f5">
      <h2>📱 Escaneie o QR Code com seu WhatsApp</h2>
      <p>Abra o WhatsApp → Dispositivos Vinculados → Vincular Dispositivo</p>
      <img src="${waQrCode}" style="border:4px solid #25d366;border-radius:12px;margin:20px auto;display:block" />
      <p><small>Esta página atualiza automaticamente em 30 segundos</small></p>
      <script>setTimeout(() => location.reload(), 30000)</script>
    </body></html>`);
  }

  res.send(`<html><body style="font-family:sans-serif;text-align:center;padding:40px">
    <h2>⏳ Aguarde...</h2>
    <p>Gerando QR Code, por favor aguarde...</p>
    <script>setTimeout(() => location.reload(), 5000)</script>
  </body></html>`);
});

// POST /send — envia mensagem
app.post("/send", auth, async (req, res) => {
  const { phone, message } = req.body;

  if (!phone || !message) {
    return res.status(400).json({ success: false, error: "phone e message são obrigatórios" });
  }

  let clean = phone.replace(/\D/g, "");
  if (clean.length === 10 || clean.length === 11) clean = "55" + clean;

  try {
    if (waStatus !== "CONNECTED" || !waSocket) {
      const sock = await initWhatsApp().catch(() => null);
      if (!sock || waStatus !== "CONNECTED") {
        return res.status(503).json({ success: false, error: "WhatsApp não conectado. Acesse /qr para conectar." });
      }
    }

    // Resolução inteligente do JID para números do Brasil (com ou sem 9º dígito)
    let targetJid = `${clean}@s.whatsapp.net`;
    try {
      const check1 = await waSocket.onWhatsApp(clean);
      if (check1 && check1.length > 0 && check1[0].exists) {
        targetJid = check1[0].jid;
        console.log(`[WA] JID oficial verificado para ${clean}: ${targetJid}`);
      } else if (clean.startsWith("55") && clean.length === 13) {
        const withoutNine = clean.slice(0, 4) + clean.slice(5);
        const check2 = await waSocket.onWhatsApp(withoutNine);
        if (check2 && check2.length > 0 && check2[0].exists) {
          targetJid = check2[0].jid;
          console.log(`[WA] JID oficial verificado SEM 9º dígito para ${withoutNine}: ${targetJid}`);
        }
      } else if (clean.startsWith("55") && clean.length === 12) {
        const withNine = clean.slice(0, 4) + "9" + clean.slice(4);
        const check3 = await waSocket.onWhatsApp(withNine);
        if (check3 && check3.length > 0 && check3[0].exists) {
          targetJid = check3[0].jid;
          console.log(`[WA] JID oficial verificado COM 9º dígito para ${withNine}: ${targetJid}`);
        }
      }
    } catch (checkErr) {
      console.warn("[WA] Aviso ao consultar onWhatsApp:", checkErr.message);
    }

    const sentMsg = await waSocket.sendMessage(targetJid, { text: message });
    saveMessageToStore(sentMsg);

    console.log(`✅ Mensagem enviada para ${clean} (JID: ${targetJid})`);
    return res.json({ success: true, jid: targetJid });
  } catch (err) {
    console.error("Erro ao enviar:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /reconnect — força reconexão
app.post("/reconnect", auth, async (req, res) => {
  await initWhatsApp(true).catch(() => {});
  res.json({ message: "Reconexão iniciada. Acesse /qr para escanear." });
});

// GET / — health check
app.get("/", (req, res) => {
  res.json({ service: "Mundo Apple WhatsApp Server", status: waStatus, user: waUser, version: "1.1.0" });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor WhatsApp rodando na porta ${PORT}`);
});
