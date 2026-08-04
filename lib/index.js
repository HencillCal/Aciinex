/**
 * lib/index.js — AciiNex-M Central Data Store
 * Provides persistent JSON-file-backed storage for:
 *  - Sudo users
 *  - Antilink settings + warning counts
 *  - Welcome / Goodbye messages
 */

const fs   = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

// ── Generic helpers ──────────────────────────────────────────────────────────
function readJson(file, def = {}) {
  const p = path.join(DATA_DIR, file);
  try { return JSON.parse(fs.readFileSync(p, 'utf-8')); } catch (_) { return def; }
}
function writeJson(file, data) {
  fs.writeFileSync(path.join(DATA_DIR, file), JSON.stringify(data, null, 2));
}

// ══════════════════════════════════════════════════════════════
// SUDO
// ══════════════════════════════════════════════════════════════
function getSudoList() {
  const d = readJson('sudo.json', { sudo: [] });
  return d.sudo || [];
}
function addSudo(jid) {
  const list = getSudoList();
  if (!list.includes(jid)) { list.push(jid); writeJson('sudo.json', { sudo: list }); }
}
function removeSudo(jid) {
  const list = getSudoList().filter(j => j !== jid);
  writeJson('sudo.json', { sudo: list });
}
async function isSudo(jid) {
  if (!jid) return false;
  const clean = jid.split(':')[0].split('@')[0];
  return getSudoList().some(j => j.includes(clean));
}

// ══════════════════════════════════════════════════════════════
// ANTILINK
// ══════════════════════════════════════════════════════════════
function getAntilink(groupId) {
  const d = readJson('antilink.json', {});
  return d[groupId] || null;
}
function setAntilink(groupId, config = {}) {
  const d = readJson('antilink.json', {});
  d[groupId] = { enabled: true, action: 'delete', ...config };
  writeJson('antilink.json', d);
}
function removeAntilink(groupId) {
  const d = readJson('antilink.json', {});
  delete d[groupId];
  writeJson('antilink.json', d);
}
function incrementWarningCount(groupId, userId) {
  const d = readJson('antilink_warnings.json', {});
  if (!d[groupId]) d[groupId] = {};
  d[groupId][userId] = (d[groupId][userId] || 0) + 1;
  writeJson('antilink_warnings.json', d);
  return d[groupId][userId];
}
function resetWarningCount(groupId, userId) {
  const d = readJson('antilink_warnings.json', {});
  if (d[groupId]) { d[groupId][userId] = 0; writeJson('antilink_warnings.json', d); }
}

// ══════════════════════════════════════════════════════════════
// WELCOME
// ══════════════════════════════════════════════════════════════
function getWelcome(groupId) {
  const d = readJson('welcome.json', {});
  return d[groupId] || null;
}
function isWelcomeOn(groupId) {
  const w = getWelcome(groupId);
  return !!(w && w.enabled);
}
function addWelcome(groupId, message = '', image = '') {
  const d = readJson('welcome.json', {});
  d[groupId] = { enabled: true, message, image };
  writeJson('welcome.json', d);
}
function delWelcome(groupId) {
  const d = readJson('welcome.json', {});
  if (d[groupId]) { d[groupId].enabled = false; writeJson('welcome.json', d); }
}

// ══════════════════════════════════════════════════════════════
// GOODBYE
// ══════════════════════════════════════════════════════════════
function getGoodbye(groupId) {
  const d = readJson('goodbye.json', {});
  return d[groupId] || null;
}
function isGoodByeOn(groupId) {
  const g = getGoodbye(groupId);
  return !!(g && g.enabled);
}
function addGoodbye(groupId, message = '') {
  const d = readJson('goodbye.json', {});
  d[groupId] = { enabled: true, message };
  writeJson('goodbye.json', d);
}
function delGoodBye(groupId) {
  const d = readJson('goodbye.json', {});
  if (d[groupId]) { d[groupId].enabled = false; writeJson('goodbye.json', d); }
}

module.exports = {
  // sudo
  isSudo, addSudo, removeSudo, getSudoList,
  // antilink
  setAntilink, getAntilink, removeAntilink,
  incrementWarningCount, resetWarningCount,
  // welcome
  isWelcomeOn, getWelcome, addWelcome, delWelcome,
  // goodbye
  isGoodByeOn, getGoodbye, addGoodbye, delGoodBye,
};
