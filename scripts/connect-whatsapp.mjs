import makeWASocket, { useMultiFileAuthState, DisconnectReason } from '@whiskeysockets/baileys';
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';
import pino from 'pino';

const sessionDir = path.join(process.cwd(), '.whatsapp-session');
const artifactQrPath = '/Users/imac27/.gemini/antigravity/brain/a92056d9-8946-4812-86db-032400178d1f/whatsapp_qr.png';

async function start() {
  console.log('Iniciando conexao WhatsApp...');
  const { state, saveCreds } = await useMultiFileAuthState(sessionDir);

  const sock = makeWASocket({
    auth: state,
    logger: pino({ level: 'silent' }),
    browser: ['Mundo Apple Delivery', 'Chrome', '1.0.0'],
    syncFullHistory: false,
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log('--- NOVO QR CODE RECEBIDO ---');
      try {
        // 1. Save PNG to artifact directory
        await QRCode.toFile(artifactQrPath, qr, {
          width: 400,
          margin: 2,
          color: { dark: '#000000', light: '#ffffff' }
        });
        console.log('Imagem do QR Code salva com sucesso em:', artifactQrPath);

        // 2. Output small ASCII QR to terminal
        const ascii = await QRCode.toString(qr, { type: 'terminal', small: true });
        console.log(ascii);
      } catch (e) {
        console.error('Erro ao renderizar QR:', e);
      }
    }

    if (connection === 'open') {
      console.log('====================================================');
      console.log('🎉 WHATSAPP CONECTADO COM SUCESSO!');
      console.log('Usuario:', sock.user?.id);
      console.log('====================================================');
    }

    if (connection === 'close') {
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      console.log('Conexao fechada, codigo:', statusCode);
      if (statusCode !== DisconnectReason.loggedOut) {
        console.log('Tentando reconectar em 3s...');
        setTimeout(start, 3000);
      }
    }
  });
}

start();
