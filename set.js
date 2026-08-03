/**
 * BLACK DEMON Bot Configuration
 * Edit this file OR set environment variables.
 * 
 * SESSION SETUP (choose one method):
 *  1. Gifted-Session: go to the gifted-session website, pair your number,
 *     copy the SESSION_ID it gives you, and paste it below or set as env var.
 *  2. QR Code: leave SESSION blank and scan the QR code in the terminal.
 */

require('dotenv').config();

// ── Session ────────────────────────────────────────────────────────────────────
// Paste the session ID from gifted-session here, or set SESSION env var.
// Accepted formats:
//   GIFTED-MD~<base64>   (gifted-session website format)
//   BLACKDEMON~<base64>  (any base64-encoded creds.json)
//   <raw base64>         (plain base64 of creds.json)
const session    = process.env.SESSION    || '';
const sessionName = 'session';

// ── Bot settings ───────────────────────────────────────────────────────────────
const prefix        = process.env.PREFIX          || '.';
const mode          = process.env.MODE            || 'PUBLIC';    // PUBLIC | PRIVATE
const botname       = process.env.BOTNAME         || 'BLACK-DEMON';
const dev           = process.env.DEV             || '254769365617';
const DevRaven      = dev.split(',');

// ── Feature toggles ────────────────────────────────────────────────────────────
const autobio       = process.env.AUTOBIO          || 'FALSE';
const autolike      = process.env.AUTOLIKE_STATUS  || 'TRUE';
const autoviewstatus = process.env.AUTOVIEW_STATUS || 'TRUE';
const autoread      = process.env.AUTOREAD         || 'FALSE';
const anticall      = process.env.AUTOREJECT_CALL  || 'TRUE';
const antidel       = process.env.ANTIDELETE       || 'TRUE';
const antibot       = process.env.ANTIBOT          || 'FALSE';
const antitag       = process.env.ANTITAG          || 'TRUE';
const antilink      = process.env.ANTILINK         || 'TRUE';
const antilinkall   = process.env.ANTILINK_ALL     || 'FALSE';
const antiforeign   = process.env.ANTIFOREIGN      || 'FALSE';
const welcomegoodbye = process.env.WELCOMEGOODBYE  || 'FALSE';
const gptdm         = process.env.GPT_INBOX        || 'FALSE';
const badwordkick   = process.env.BAD_WORD_KICK    || 'FALSE';
const bad           = process.env.BAD_WORD         || 'fuck';
const wapresence    = process.env.WA_PRESENCE      || 'online';   // online | typing | recording | unavailable

// ── Sticker metadata ───────────────────────────────────────────────────────────
const packname      = process.env.STICKER_PACKNAME  || 'BLACK-DEMON';
const author        = process.env.STICKER_AUTHOR    || 'Jinwiil Onginjo';

// ── UI / Menu ──────────────────────────────────────────────────────────────────
const menu          = process.env.MENU_TYPE         || 'IMAGE';   // IMAGE | VIDEO | TEXT | LINK
const menulink      = process.env.MENU_LINK         || 'https://files.catbox.moe/m38sqm.jpg';

// ── Anti-foreign (blocks numbers not starting with mycode) ────────────────────
const mycode        = process.env.CODE              || '254';

// ── Group management messages ─────────────────────────────────────────────────
const admin         = process.env.ADMIN_MSG         || '𝗖𝗼𝗺𝗺𝗮𝗻𝗱 𝗿𝗲𝘀𝗲𝗿𝘃𝗲𝗱 𝗳𝗼𝗿 𝗔𝗱𝗺𝗶𝗻𝘀!';
const group         = process.env.GROUP_ONLY_MSG    || '𝗖𝗼𝗺𝗺𝗮𝗻𝗱 𝗺𝗲𝗮𝗻𝘁 𝗳𝗼𝗿 𝗚𝗿𝗼𝘂𝗽𝘀!';
const botAdmin      = process.env.BOT_ADMIN_MSG     || '𝗜 𝗻𝗲𝗲𝗱 𝗔𝗱𝗺𝗶𝗻 𝗽𝗿𝗶𝘃𝗶𝗹𝗲𝗴𝗲𝘀!';
const NotOwner      = process.env.NOT_OWNER_MSG     || '𝗖𝗼𝗺𝗺𝗮𝗻𝗱 𝗺𝗲𝗮𝗻𝘁 𝗳𝗼𝗿 𝘁𝗵𝗲 𝗼𝘄𝗻𝗲𝗿!';

// ── Heroku (for redeploy command) ─────────────────────────────────────────────
const appname       = process.env.APP_NAME          || '';
const herokuapi     = process.env.HEROKU_API        || '';

// ── Server ─────────────────────────────────────────────────────────────────────
const port          = process.env.PORT              || 3000;

module.exports = {
  session, sessionName,
  prefix, mode, botname,
  dev, DevRaven,
  autobio, autolike, autoviewstatus, autoread,
  anticall, antidel, antibot, antitag, antilink, antilinkall, antiforeign,
  welcomegoodbye, gptdm, badwordkick, bad, wapresence,
  packname, author,
  menu, menulink, mycode,
  admin, group, botAdmin, NotOwner,
  appname, herokuapi, port,
};
