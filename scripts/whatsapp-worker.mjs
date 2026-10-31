import http from 'node:http';
import path from 'node:path';
import fs from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

export function createSession({ makeWASocket, useMultiFileAuthState, DisconnectReason, Browsers, QRCode, logger, sessionDir }) {
  let socket, pending, retry, generation = 0;
  let status = { status: 'DISCONNECTED', qrCodeDataUrl: null, phoneNumber: null, error: null };
  const snapshot = () => ({ ...status });
  async function stop(logout = false) {
    generation++;
    clearTimeout(retry);
    const old = socket;
    socket = null;
    pending = null;
    status = { status: 'DISCONNECTED', qrCodeDataUrl: null, phoneNumber: null, error: null };
    if (old) {
      if (logout) { try { await old.logout(); } catch {} }
      old.end(undefined);
    }
  }
  async function connect(forceReset = false) {
    if (forceReset) {
      await stop();
      await fs.rm(sessionDir, { recursive: true, force: true });
    }
    if (socket || pending) return pending;
    const current = ++generation;
    status = { status: 'CONNECTING', qrCodeDataUrl: null, phoneNumber: null, error: null };
    pending = (async () => {
      await fs.mkdir(sessionDir, { recursive: true });
      const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
      if (current !== generation) return;
      const sock = makeWASocket({ auth: state, logger, browser: Browsers.ubuntu('Chrome'), syncFullHistory: false, connectTimeoutMs: 20000 });
      socket = sock;
      sock.ev.on('creds.update', saveCreds);
      sock.ev.on('connection.update', async ({ qr, connection, lastDisconnect }) => {
        if (current !== generation) return;
        try {
          if (qr) {
            const image = await QRCode.toDataURL(qr, { width: 340, margin: 2 });
            if (current !== generation) return;
            status = { status: 'SCAN_QR', qrCodeDataUrl: image, phoneNumber: null, error: null };
          }
          if (connection === 'open') {
            status = { status: 'CONNECTED', qrCodeDataUrl: null, phoneNumber: (sock.user?.id || '').split(':')[0].split('@')[0], error: null };
          } else if (connection === 'close') {
            socket = null;
            pending = null;
            generation++;
            const code = lastDisconnect?.error?.output?.statusCode;
            status = { status: 'DISCONNECTED', qrCodeDataUrl: null, phoneNumber: null, error: code === DisconnectReason.loggedOut ? 'Sessao encerrada. Conecte novamente.' : 'Conexao interrompida. Tentando reconectar.' };
            if (code === DisconnectReason.loggedOut) await fs.rm(sessionDir, { recursive: true, force: true });
            else retry = setTimeout(() => connect().catch(() => {}), 5000);
          }
        } catch (err) { status.error = err.message; }
      });
    })().catch(err => {
      if (current === generation) { socket = null; pending = null; status = { status: 'DISCONNECTED', qrCodeDataUrl: null, phoneNumber: null, error: err.message }; }
      throw err;
    });
    return pending;
  }
  return {
    snapshot, connect,
    async disconnect() { await stop(true); await fs.rm(sessionDir, { recursive: true, force: true }); },
    async send(phone, message) {
      if (status.status !== 'CONNECTED' || !socket) throw new Error('WhatsApp desconectado. Escaneie o QR Code no painel.');
      let number = String(phone).replace(/\D/g, '');
      if (!number) throw new Error('Telefone invalido.');
      if (number.length === 10 || number.length === 11) number = '55' + number;
      let jid = number + '@s.whatsapp.net';
      const numbers = [number];
      if (number.startsWith('55') && number.length === 13) numbers.push(number.slice(0, 4) + number.slice(5));
      else if (number.startsWith('55') && number.length === 12) numbers.push(number.slice(0, 4) + '9' + number.slice(4));
      for (const candidate of numbers) {
        const found = await socket.onWhatsApp(candidate);
        if (found?.[0]?.exists) { jid = found[0].jid; break; }
      }
      await socket.sendMessage(jid, { text: message });
      return { success: true };
    },
  };
}

async function main() {
  const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, Browsers } = await import('@whiskeysockets/baileys');
  const { default: QRCode } = await import('qrcode');
  const { default: pino } = await import('pino');
  const session = createSession({ makeWASocket, useMultiFileAuthState, DisconnectReason, Browsers, QRCode, logger: pino({ level: 'warn' }), sessionDir: process.env.WA_SESSION_DIR || path.resolve('.whatsapp-session') });
  const secret = process.env.WA_API_SECRET || 'mundoapple2024';
  http.createServer(async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    const respond = (code, body) => { res.statusCode = code; res.end(JSON.stringify(body)); };
    if (req.url === '/health') return respond(200, { success: true });
    if (req.headers['x-api-key'] !== secret) return respond(401, { success: false, error: 'Unauthorized' });
    try {
      if (req.method === 'GET' && req.url === '/status') return respond(200, { success: true, ...session.snapshot() });
      let raw = '';
      for await (const chunk of req) { raw += chunk; if (raw.length > 65536) return respond(413, { success: false }); }
      const body = raw ? JSON.parse(raw) : {};
      if (req.method === 'POST' && req.url === '/connect') {
        await session.connect(Boolean(body.forceReset));
        return respond(200, { success: true, ...session.snapshot() });
      }
      if (req.method === 'POST' && req.url === '/disconnect') {
        await session.disconnect();
        return respond(200, { success: true, ...session.snapshot() });
      }
      if (req.method === 'POST' && req.url === '/send') {
        if (!body.phone || !body.message) return respond(400, { success: false, error: 'Telefone e mensagem obrigatorios.' });
        return respond(200, await session.send(body.phone, body.message));
      }
      respond(404, { success: false, error: 'Not found' });
    } catch (err) { respond(503, { success: false, error: err.message }); }
  }).listen(Number(process.env.PORT || 3001), '0.0.0.0');
  session.connect().catch(err => console.error('WhatsApp initialization:', err.message));
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) main().catch(err => { console.error(err); process.exitCode = 1; });
