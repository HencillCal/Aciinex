/**
 * Session Authenticator — Gifted-Session Compatible
 *
 * Supports the following SESSION formats:
 *   GIFTED-MD~<base64>       — from gifted-session website
 *   BLACKDEMON~<base64>      — generic prefix variant
 *   GAAJU-MD:<base64>        — GAAJU-XMD website format
 *   <plain base64>           — raw base64-encoded creds.json
 *
 * How to get a session ID:
 *   1. Deploy gifted-session (or use the public link).
 *   2. Open the /pair page and enter your phone number.
 *   3. Enter the pairing code in WhatsApp.
 *   4. Copy the SESSION_ID shown and paste it into your .env file.
 */

const fs   = require('fs');
const path = require('path');

const SESSION_FILE = './session/creds.json';
const SESSION_DIR  = './session';

/**
 * Decode a session string to a valid creds.json object.
 * Returns null when decoding fails.
 */
function decodeSession(rawSession) {
  if (!rawSession || rawSession.trim() === '') return null;

  let base64Part = rawSession.trim();

  // Strip known prefixes (case-insensitive)
  const prefixes = ['ACIINEX-M~', 'JINWIIL-MD~', 'Gifted~', 'JINWIIL-XMD:', 'SESSION~'];
  for (const p of prefixes) {
    if (base64Part.toUpperCase().startsWith(p.toUpperCase())) {
      base64Part = base64Part.slice(p.length).replace(/^~+/, '');
      break;
    }
  }

  // Try base64 decode → JSON parse
  try {
    const decoded = Buffer.from(base64Part, 'base64').toString('utf-8');
    const parsed  = JSON.parse(decoded);
    if (parsed && typeof parsed === 'object') return parsed;
  } catch (_) {}

  // Maybe it's already plain JSON (no encoding)
  try {
    const parsed = JSON.parse(base64Part);
    if (parsed && typeof parsed === 'object') return parsed;
  } catch (_) {}

  return null;
}

async function authentication() {
  const rawSession = process.env.SESSION || '';

  if (!rawSession || rawSession.trim() === '') {
    // No session string — bot will generate QR code
    if (!fs.existsSync(SESSION_DIR)) fs.mkdirSync(SESSION_DIR, { recursive: true });
    if (!fs.existsSync(SESSION_FILE)) {
      console.log('📱 No SESSION set — QR code will appear in the terminal. Scan with WhatsApp.');
    }
    return;
  }

  const creds = decodeSession(rawSession);

  if (!creds) {
    console.error('❌ SESSION is set but could not be decoded. Check your SESSION format.');
    console.error('   Expected: GIFTED-MD~<base64> or raw base64 of creds.json');
    return;
  }

  // Ensure session directory exists
  if (!fs.existsSync(SESSION_DIR)) fs.mkdirSync(SESSION_DIR, { recursive: true });

  // Write creds.json (overwrite if already exists so env always takes priority)
  try {
    fs.writeFileSync(SESSION_FILE, JSON.stringify(creds, null, 2), 'utf-8');
    console.log('✅ Session restored from SESSION env variable.');
  } catch (err) {
    console.error('❌ Failed to write session file:', err.message);
  }
}

module.exports = authentication;
