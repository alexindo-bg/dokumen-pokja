import { createClient } from '@libsql/client';
import crypto from 'node:crypto';

export const db = createClient({ url: process.env.TURSO_DATABASE_URL, authToken: process.env.TURSO_AUTH_TOKEN });

let ready;
export function init() {
  return (ready ||= (async () => {
    await db.batch([
      'CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY, email TEXT UNIQUE, name TEXT, salt TEXT, hash TEXT, ref TEXT, admin INTEGER DEFAULT 0)',
      'CREATE TABLE IF NOT EXISTS refs(code TEXT PRIMARY KEY, max INTEGER DEFAULT 1, used INTEGER DEFAULT 0)',
      'CREATE TABLE IF NOT EXISTS ws(id INTEGER PRIMARY KEY, v INTEGER, json TEXT)',
      'CREATE TABLE IF NOT EXISTS kv(k TEXT PRIMARY KEY, v TEXT)',
    ]);
    for (const c of (process.env.REFERRAL_CODES || '').split(',').map((s) => s.trim().toUpperCase()).filter(Boolean))
      await db.execute({ sql: 'INSERT OR IGNORE INTO refs(code,max) VALUES(?,100)', args: [c] });
  })());
}

const secret = () => process.env.SESSION_SECRET || '';
const mac = (b) => crypto.createHmac('sha256', secret()).update(b).digest('base64url');
export const sign = (o) => { const b = Buffer.from(JSON.stringify(o)).toString('base64url'); return b + '.' + mac(b); };

export function unsign(t) {
  const [b, s] = String(t || '').split('.');
  if (!b || !s || !secret() || mac(b) !== s) return null;
  try { const o = JSON.parse(Buffer.from(b, 'base64url').toString()); return o.exp > Date.now() ? o : null; } catch { return null; }
}

export function me(req) {
  const m = /(?:^|;\s*)sid=([^;]+)/.exec(req.headers.cookie || '');
  const o = m && unsign(m[1]);
  return o && !o.k ? o : null; // token khusus (state OAuth) tidak boleh dipakai sebagai sesi
}

export const hashPw = (pw, salt) => crypto.scryptSync(pw, salt, 32).toString('hex');
export const send = (res, code, o) => res.status(code).json(o);
export const cookie = (v, age) => `sid=${v}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${age}`;
