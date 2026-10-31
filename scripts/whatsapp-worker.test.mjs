import { test } from 'node:test';
import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createSession } from './whatsapp-worker.mjs';
async function harness(t, auth = async () => ({ state: {}, saveCreds() {} })) {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'wa-test-'));
  const sockets = [];
  const session = createSession({ sessionDir: dir, useMultiFileAuthState: auth, makeWASocket: () => { const sock = { ev: new EventEmitter(), end() {}, async logout() {}, user: { id: '551100000000:1@s.whatsapp.net' } }; sockets.push(sock); return sock; }, DisconnectReason: { loggedOut: 401 }, Browsers: { ubuntu: () => ['Ubuntu', 'Chrome', '22.04'] }, QRCode: { toDataURL: async text => 'data:image/png;base64,' + text }, logger: {} });
  t.after(async () => { await session.disconnect(); await rm(dir, { recursive: true, force: true }); });
  return { session, sockets };
}
const tick = () => new Promise(resolve => setImmediate(resolve));
test('QR and connected status come from the same session', async t => {
  const { session, sockets } = await harness(t);
  await session.connect();
  assert.equal(session.snapshot().status, 'CONNECTING');
  sockets[0].ev.emit('connection.update', { qr: 'test-qr' }); await tick();
  assert.equal(session.snapshot().status, 'SCAN_QR');
  assert.ok(session.snapshot().qrCodeDataUrl.startsWith('data:image/png;base64,'));
  sockets[0].ev.emit('connection.update', { connection: 'open' });
  assert.equal(session.snapshot().status, 'CONNECTED');
  assert.equal(session.snapshot().qrCodeDataUrl, null);
});
test('old socket events cannot erase a new QR after reset', async t => {
  const { session, sockets } = await harness(t);
  await session.connect(); await session.connect(true);
  sockets[1].ev.emit('connection.update', { qr: 'new' }); await tick();
  sockets[0].ev.emit('connection.update', { connection: 'close' });
  assert.equal(session.snapshot().status, 'SCAN_QR');
});
test('initialization errors are visible and disconnected sends fail', async t => {
  const { session } = await harness(t, async () => { throw new Error('auth failed'); });
  await assert.rejects(session.connect(), /auth failed/);
  assert.equal(session.snapshot().error, 'auth failed');
  await assert.rejects(session.send('551100000000', 'test'), /desconectado/);
});
