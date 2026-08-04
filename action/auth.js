/**
 * Session Authenticator — AciiNex-M Compatible
 *
 * Supports the following SESSION formats:
 *   GIFTED-MD~<base64>    — gifted-session website (gzip-compressed JSON)
 *   Gifted~<base64>       — gifted-session newer/short format
 *   ACIINEX~<base64>      — AciiNex-M generic prefix
 *   BLACKDEMON~<base64>   — legacy prefix variant
 *   GAAJU-MD:<base64>     — GAAJU-XMD website format
 *   SESSION~<base64>      — plain session prefix
 *   <plain base64>        — raw base64-encoded creds.json
 *
 * How to get a session ID:
 *   1. Deploy gifted-session (or use the public link).
 *   2. Open the /pair page and enter your phone number.
 *   3. Enter the pairing code in WhatsApp.
 *   4. Copy the SESSION_ID shown and paste it into your .env or .env file.
 *      Works on Heroku (config vars), VPS (.env), panel, or any host that
 *      supports environment variables.
 */

const fs   = require('fs');
const path = require('path');
const zlib = require('zlib');

const SESSION_FILE = './session/creds.json';
const SESSION_DIR  = './session';

/**
 * Decode a session string to a valid creds.json object.
 * Handles gzip-compressed payloads (GIFTED-MD~ format) automatically.
 * Returns null when decoding fails.
 */
function decodeSession(rawSession) {
  if (!rawSession || rawSession.trim() === '') return null;

  let base64Part = rawSession.trim();

  // Strip known prefixes (case-insensitive, with or without trailing ~)
  const prefixes = [
    'GIFTED-MD~', 'Gifted~', 'GIFTED~',
    'ACIINEX~', 'ACIINEX-M~',
    'JINWIIL-MD~', 'JINWIIL-XMD:',
    'BLACKDEMON~',
    'GAAJU-MD:', 'SESSION~',
  ];
  for (const p of prefixes) {
    if (base64Part.toUpperCase().startsWith(p.toUpperCase())) {
      base64Part = base64Part.slice(p.length).replace(/^~+/, '');
      break;
    }
  }

  // Try base64 decode → (gunzip if gzipped) → JSON parse
  // GIFTED-MD~ sessions are gzip-compressed — base64 starts with H4sI
  try {
    const buf = Buffer.from(base64Part, 'base64');
    let text;
    try {
      // Attempt gzip decompression first
      text = zlib.gunzipSync(buf).toString('utf-8');
    } catch (_) {
      // Not gzipped — treat as plain UTF-8
      text = buf.toString('utf-8');
    }
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed === 'object') return parsed;
  } catch (_) {}

  // Maybe it's already plain JSON (no encoding at all)
  try {
    const parsed = JSON.parse(base64Part);
    if (parsed && typeof parsed === 'object') return parsed;
  } catch (_) {}

  return null;
}

async function authentication() {
  const rawSession = process.env.SESSION || '';

  if (!rawSession || rawSession.trim() === '') {
    // ── IMPORTANT: why is SESSION empty? ────────────────────────────────────
    // app.json env vars are a ONE-TIME template used ONLY when someone clicks
    // the "Deploy to Heroku" button for the first time.  They are NOT re-read
    // on every git push or dyno restart.
    //
    // To set SESSION on an existing Heroku app you MUST do ONE of:
    //   A) Heroku dashboard → your app → Settings → Config Vars → add SESSION
    //   B) Heroku CLI: heroku config:set SESSION="GIFTED-MD~xxxx" -a <app-name>
    //
    // Removing SESSION from .env and expecting app.json to fill it in will NOT work.
    // ─────────────────────────────────────────────────────────────────────────
    if (!fs.existsSync(SESSION_DIR)) fs.mkdirSync(SESSION_DIR, { recursive: true });
    if (!fs.existsSync(SESSION_FILE)) {
      console.log('⚠️  SESSION env var is not set.');
      console.log('   ➜ Heroku: go to your app → Settings → Config Vars → set SESSION');
      console.log('   ➜ VPS / local: set SESSION=GIFTED-MD~xxx in your .env file');
      console.log('   ➜ app.json DOES NOT set config vars on re-deploys — only on first "Deploy to Heroku" click.');
      console.log('📱 Falling back to QR code — scan with WhatsApp to authenticate.');
    }
    return;
  }

  const creds = decodeSession(rawSession);

  if (!creds) {
    console.error('❌ SESSION is set but could not be decoded. Check your SESSION format.');
    console.error('   Accepted formats: GIFTED-MD~<base64>, Gifted~<base64>, ACIINEX~<base64>, or raw base64 of creds.json');
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
