/**
 * ╔══════════════════════════════════════════════╗
 * ║         AciiNex-M WhatsApp Bot               ║
 * ║   Multi-Device | WA-XMD Commands             ║
 * ║   Compatible | Anti-Ban                      ║
 * ╚══════════════════════════════════════════════╝
 *
 * Fixed: Stable connection, multi-device support,
 *        anti-ban browser fingerprinting, memory management
 */

require('events').EventEmitter.defaultMaxListeners = 500;

const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  downloadContentFromMessage,
  jidDecode,
  proto,
  Browsers,
  getContentType,
  makeCacheableSignalKeyStore,
  jidNormalizedUser,
  delay,
} = require('@whiskeysockets/baileys');

const pino       = require('pino');
const { Boom }   = require('@hapi/boom');
const fs         = require('fs');
const path       = require('path');
const axios      = require('axios');
const express    = require('express');
const chalk      = require('chalk');
const FileType   = require('file-type');
const figlet     = require('figlet');
const NodeCache  = require('node-cache');
const PhoneNumber = require('awesome-phonenumber');

const { smsg, isUrl, generateMessageTag, getBuffer, getSizeMedia, fetchJson, sleep, runtime } = require('./lib/ravenfunc');
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('./lib/ravenexif');
const {
  sessionName, session, autobio, autolike, port, mycode, anticall,
  mode, prefix, antiforeign, packname, autoviewstatus
} = require('./set.js');

const Events         = require('./action/events');
const authenticationn = require('./action/auth');
// Cache blacks module once at startup — do NOT require() inside the message handler
// (Node does cache modules, but any load error inside the handler causes a silent try/catch
//  swallow on every single message, killing response times)
let raven;
try { raven = require('./blacks'); } catch (e) { console.error('⚠️  Failed to load blacks.js:', e.message); }

const app    = express();
const logger = pino({ level: 'silent' });

// ── Memory management ─────────────────────────────────────────────────────────
setInterval(() => {
  const used = process.memoryUsage();
  if (used.heapUsed > 400 * 1024 * 1024 && global.gc) global.gc();
}, 60000);

setInterval(() => {
  const used = process.memoryUsage();
  if (used.heapUsed > 700 * 1024 * 1024) {
    console.log(chalk.red('⚠️  Memory limit reached — restarting'));
    process.exit(1);
  }
}, 5 * 60 * 1000);

// ── Express keep-alive server ─────────────────────────────────────────────────
app.use(express.static('pixel'));
app.get('/', (req, res) => {
  const file = path.join(__dirname, 'pixel', 'index.html');
  if (fs.existsSync(file)) return res.sendFile(file);
  res.send('<h1>AciiNex-M Bot is Running ✅</h1>');
});
app.get('/health', (req, res) => res.status(200).json({ status: 'alive', uptime: process.uptime() }));
app.listen(port, () => console.log(chalk.cyan(`📡 Server running on port ${port}`)));

// ── Self-ping to prevent sleeping on free hosts ───────────────────────────────
setInterval(async () => {
  try {
    const http = require('http');
    http.get(`http://localhost:${port}/health`, () => {});
  } catch (_) {}
}, 240000);

// ── Inline store (lightweight) ────────────────────────────────────────────────
let store;
try {
  const makeInMemoryStore = require('./store/store.js');
  store = makeInMemoryStore({ logger: logger.child({ stream: 'store' }) });
} catch (e) {
  // Fallback lightweight store
  store = {
    contacts: {},
    chats: {},
    messages: {},
    bind: () => {},
    loadMessage: async () => null,
  };
}

// ── Reconnect tracking ────────────────────────────────────────────────────────
let reconnectAttempts = 0;
const MAX_RECONNECTS  = 10;

const color = (text, c) => !c ? chalk.green(text) : chalk.keyword(c)(text);

// ═════════════════════════════════════════════════════════════════════════════
// MAIN BOT FUNCTION
// ═════════════════════════════════════════════════════════════════════════════
async function startAciiNex() {
  try {
    // ── Restore session from env ( compatible) ──────────────────
    await authenticationn();

    const { state, saveCreds } = await useMultiFileAuthState('session');
    const { version, isLatest } = await fetchLatestBaileysVersion();

    console.log(chalk.green(`Using WA v${version.join('.')}, isLatest: ${isLatest}`));
    console.log(
      color(
        figlet.textSync('AciiNex-M', {
          font: 'Standard',
          horizontalLayout: 'default',
          whitespaceBreak: false,
        }),
        'green'
      )
    );

    const msgRetryCounterCache = new NodeCache();

    // ── Anti-ban: mimic a real browser / device ───────────────────────────────
    const client = makeWASocket({
      version,
      logger: pino({ level: 'silent' }),
      printQRInTerminal: true,
      // "WhatsApp Inc" fingerprint — reduces ban risk vs custom strings
      browser: Browsers.ubuntu('Chrome'),
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'fatal' }).child({ level: 'fatal' })),
      },
      markOnlineOnConnect: true,
      generateHighQualityLinkPreview: true,
      syncFullHistory: false,
      keepAliveIntervalMs: 15000,
      connectTimeoutMs: 60000,
      defaultQueryTimeoutMs: 60000,
      msgRetryCounterCache,
      getMessage: async (key) => {
        const jid = jidNormalizedUser(key.remoteJid);
        const msg = await store.loadMessage(jid, key.id);
        return msg?.message || { conversation: '' };
      },
    });

    store.bind(client.ev);

    // ── Auto-bio ───────────────────────────────────────────────────────────────
    if (autobio === 'TRUE') {
      setInterval(() => {
        const date = new Date();
        client.updateProfileStatus(
          `📅 DATE/TIME ⌚️ ${date.toLocaleString('en-US', { timeZone: 'Africa/Nairobi' })} ⏰ DAY ⏰ ${date.toLocaleString('en-US', { weekday: 'long', timeZone: 'Africa/Nairobi' })}. AciiNex-M IS LIVE⚡.`
        );
      }, 60 * 1000);
    }

    // ── Contacts update ────────────────────────────────────────────────────────
    client.ev.on('contacts.update', (update) => {
      for (const contact of update) {
        const id = client.decodeJid(contact.id);
        if (store && store.contacts) store.contacts[id] = { id, name: contact.notify };
      }
    });

    // ── Group participant events ───────────────────────────────────────────────
    client.ev.on('group-participants.update', async (update) => {
      try {
        if (antiforeign === 'TRUE' && update.action === 'add') {
          for (const participant of update.participants) {
            const jid         = client.decodeJid(participant);
            const phoneNumber = jid.split('@')[0];
            if (!phoneNumber.startsWith(mycode)) {
              await client.sendMessage(update.id, {
                text: '⚠️ Your country code is not allowed in this group!',
                mentions: [jid],
              });
              await client.groupParticipantsUpdate(update.id, [jid], 'remove');
            }
          }
        }
        await Events(client, update);
      } catch (err) {
        console.log('Group event error:', err.message);
      }
    });

    // ── Anti-call ─────────────────────────────────────────────────────────────
    client.ev.on('call', async (callData) => {
      if (anticall === 'TRUE') {
        try {
          const callId   = callData[0].id;
          const callerId = callData[0].from;
          await client.rejectCall(callId, callerId);
          await client.sendMessage(callerId, {
            text: '🚫 Anticall is active. Only text messages are allowed.',
          });
        } catch (_) {}
      }
    });

    // ── Credential save ────────────────────────────────────────────────────────
    client.ev.on('creds.update', saveCreds);

    // ── Message handler ────────────────────────────────────────────────────────
    client.ev.on('messages.upsert', async (chatUpdate) => {
      try {
        const mek = chatUpdate.messages[0];
        if (!mek.message) return;

        // Unwrap ephemeral messages
        mek.message =
          Object.keys(mek.message)[0] === 'ephemeralMessage'
            ? mek.message.ephemeralMessage.message
            : mek.message;

        // Status viewing / liking
        if (mek.key && mek.key.remoteJid === 'status@broadcast') {
          if (autoviewstatus === 'TRUE') {
            await client.readMessages([mek.key]);
          }
          if (autoviewstatus === 'TRUE' && autolike === 'TRUE') {
            try {
              const nickk  = await client.decodeJid(client.user.id);
              const emojis = ['🗿','⌚️','💠','👣','💔','🤍','❤️‍🔥','💣','🦅','🌻','🧊','🧸','👑','🎉','💯','🔥','💫','💗','👁️','👀','🌟','💧','🦄','✅','🌚'];
              const emoji  = emojis[Math.floor(Math.random() * emojis.length)];
              await client.sendMessage(
                mek.key.remoteJid,
                { react: { text: emoji, key: mek.key } },
                { statusJidList: [mek.key.participant, nickk] }
              );
            } catch (_) {}
          }
          return;
        }

        // Skip non-public messages in private mode
        if (!client.public && !mek.key.fromMe && chatUpdate.type === 'notify') return;
        // Skip bot-generated messages
        if (mek.key.id && mek.key.id.startsWith('BAE5') && mek.key.id.length === 16) return;

        const m = smsg(client, mek, store);
        if (raven) raven(client, m, chatUpdate, store);
      } catch (err) {
        console.log('Message handler error:', err.message);
      }
    });

    // ── Connection state handler ───────────────────────────────────────────────
    client.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) console.log(chalk.cyan('📱 QR Code generated — scan with WhatsApp'));

      if (connection === 'close') {
        const statusCode = new Boom(lastDisconnect?.error)?.output?.statusCode;
        const reason     = lastDisconnect?.error?.output?.statusCode;

        console.log(chalk.yellow(`Connection closed. Reason: ${statusCode}`));

        if (
          statusCode === DisconnectReason.loggedOut ||
          statusCode === 401
        ) {
          console.log(chalk.red('❌ Device logged out. Deleting session...'));
          try { require('fs').rmSync('./session', { recursive: true, force: true }); } catch (_) {}
          process.exit(0);
        }

        if (
          statusCode === DisconnectReason.badSession ||
          statusCode === DisconnectReason.connectionReplaced
        ) {
          console.log(chalk.red('❌ Bad session or replaced. Delete session and re-scan.'));
          process.exit(0);
        }

        // Reconnect with exponential backoff
        if (reconnectAttempts < MAX_RECONNECTS) {
          reconnectAttempts++;
          const waitMs = Math.min(5000 * reconnectAttempts, 30000);
          console.log(chalk.yellow(`🔄 Reconnecting in ${waitMs / 1000}s (attempt ${reconnectAttempts}/${MAX_RECONNECTS})...`));
          setTimeout(startAciiNex, waitMs);
        } else {
          console.log(chalk.red('❌ Max reconnect attempts reached. Restarting process...'));
          process.exit(1);
        }
      }

      if (connection === 'connecting') {
        console.log(chalk.cyan('🔌 Connecting to WhatsApp...'));
      }

      if (connection === 'open') {
        reconnectAttempts = 0;

        // Extract the connected phone number from the JID (e.g. 254769365617@s.whatsapp.net → 254769365617)
        const botJid    = client.decodeJid(client.user.id);
        const botNumber = botJid.split('@')[0];
        const botName   = client.user.name || 'AciiNex-M';

        console.log(color('✅ AciiNex-M connected successfully!', 'green'));
        console.log(color(`📞 Connected number : +${botNumber}`, 'green'));
        console.log(color(`👤 WhatsApp name    : ${botName}`, 'green'));
        console.log(color(`🌐 Mode: ${mode}  |  Prefix: ${prefix}`, 'cyan'));

        // Join support channel/group silently
        try { await client.newsletterFollow('120363388529450317@newsletter'); } catch (_) {}
        try { await client.groupAcceptInvite('KoK02NUGIdsL0vqY7U9DjY'); } catch (_) {}

        // Send startup message to self (the connected number)
        try {
          const startMsg =
            `╔══════════════════════════╗\n` +
            `║   ✅ *AciiNex-M Bot is ON*  ║\n` +
            `╚══════════════════════════╝\n\n` +
            `📞 *Number:* +${botNumber}\n` +
            `👤 *Name:* ${botName}\n` +
            `🌐 *Mode:* ${mode}\n` +
            `🔑 *Prefix:* ${prefix}\n` +
            `📦 *Version:* 3.0.0\n\n` +
            `Type *${prefix}menu* for the full command list.`;
          await client.sendMessage(botJid, { text: startMsg });
        } catch (_) {}
      }
    });

    // ── Helper methods ─────────────────────────────────────────────────────────

    client.decodeJid = (jid) => {
      if (!jid) return jid;
      if (/:\d+@/gi.test(jid)) {
        const decode = jidDecode(jid) || {};
        return (decode.user && decode.server && decode.user + '@' + decode.server) || jid;
      }
      return jid;
    };

    client.getName = (jid, withoutContact = false) => {
      const id = client.decodeJid(jid);
      withoutContact = client.withoutContact || withoutContact;
      let v;
      if (id.endsWith('@g.us')) {
        return new Promise(async (resolve) => {
          v = (store.contacts && store.contacts[id]) || {};
          if (!(v.name || v.subject)) v = (await client.groupMetadata(id).catch(() => {})) || {};
          resolve(v.name || v.subject || PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international'));
        });
      } else {
        v = id === '0@s.whatsapp.net'
          ? { id, name: 'WhatsApp' }
          : id === client.decodeJid(client.user.id)
          ? client.user
          : (store.contacts && store.contacts[id]) || {};
      }
      return (withoutContact ? '' : v.name) || v.subject || v.verifiedName ||
        PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international');
    };

    client.public       = mode !== 'PRIVATE';
    client.serializeM   = (m) => smsg(client, m, store);

    client.sendText = (jid, text, quoted = '', options) =>
      client.sendMessage(jid, { text, ...options }, { quoted });

    client.sendImage = async (jid, filePath, caption = '', quoted = '', options) => {
      let buffer = Buffer.isBuffer(filePath)
        ? filePath
        : /^data:.*?\/.*?;base64,/i.test(filePath)
        ? Buffer.from(filePath.split(',')[1], 'base64')
        : /^https?:\/\//.test(filePath)
        ? await getBuffer(filePath)
        : fs.existsSync(filePath)
        ? fs.readFileSync(filePath)
        : Buffer.alloc(0);
      return client.sendMessage(jid, { image: buffer, caption, ...options }, { quoted });
    };

    client.sendImageAsSticker = async (jid, filePath, quoted, options = {}) => {
      let buff = Buffer.isBuffer(filePath)
        ? filePath
        : /^data:.*?\/.*?;base64,/i.test(filePath)
        ? Buffer.from(filePath.split(',')[1], 'base64')
        : /^https?:\/\//.test(filePath)
        ? await getBuffer(filePath)
        : fs.existsSync(filePath)
        ? fs.readFileSync(filePath)
        : Buffer.alloc(0);
      const buffer = options && (options.packname || options.author)
        ? await writeExifImg(buff, options)
        : await imageToWebp(buff);
      await client.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted });
      return buffer;
    };

    client.sendVideoAsSticker = async (jid, filePath, quoted, options = {}) => {
      let buff = Buffer.isBuffer(filePath)
        ? filePath
        : /^data:.*?\/.*?;base64,/i.test(filePath)
        ? Buffer.from(filePath.split(',')[1], 'base64')
        : /^https?:\/\//.test(filePath)
        ? await getBuffer(filePath)
        : fs.existsSync(filePath)
        ? fs.readFileSync(filePath)
        : Buffer.alloc(0);
      const buffer = options && (options.packname || options.author)
        ? await writeExifVid(buff, options)
        : await videoToWebp(buff);
      await client.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted });
      return buffer;
    };

    client.downloadMediaMessage = async (message) => {
      const mime        = (message.msg || message).mimetype || '';
      const messageType = message.mtype
        ? message.mtype.replace(/Message/gi, '')
        : mime.split('/')[0];
      const stream = await downloadContentFromMessage(message, messageType);
      let buffer   = Buffer.from([]);
      for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
      return buffer;
    };

    client.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
      const quoted      = message.msg ? message.msg : message;
      const mime        = (message.msg || message).mimetype || '';
      const messageType = message.mtype
        ? message.mtype.replace(/Message/gi, '')
        : mime.split('/')[0];
      const stream = await downloadContentFromMessage(quoted, messageType);
      let buffer   = Buffer.from([]);
      for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
      const type         = await FileType.fromBuffer(buffer);
      const trueFileName = attachExtension ? `${filename}.${type.ext}` : filename;
      fs.writeFileSync(trueFileName, buffer);
      return trueFileName;
    };

    client.parseMention = async (text) =>
      [...text.matchAll(/@([0-9]{5,16}|0)/g)].map((v) => v[1] + '@s.whatsapp.net');

    client.cMod = (jid, copy, text = '', sender = client.user.id, options = {}) => {
      let mtype       = Object.keys(copy.message)[0];
      let isEphemeral = mtype === 'ephemeralMessage';
      if (isEphemeral) mtype = Object.keys(copy.message.ephemeralMessage.message)[0];
      let msg     = isEphemeral ? copy.message.ephemeralMessage.message : copy.message;
      let content = msg[mtype];
      if (typeof content === 'string') msg[mtype] = text || content;
      else if (content.caption) content.caption = text || content.caption;
      else if (content.text) content.text = text || content.text;
      if (typeof content !== 'string') msg[mtype] = { ...content, ...options };
      if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant;
      if (copy.key.remoteJid.includes('@s.whatsapp.net')) sender = sender || copy.key.remoteJid;
      else if (copy.key.remoteJid.includes('@broadcast')) sender = sender || copy.key.remoteJid;
      copy.key.remoteJid = jid;
      copy.key.fromMe    = sender === client.user.id;
      return proto.WebMessageInfo.fromObject(copy);
    };

    return client;
  } catch (error) {
    console.error(chalk.red('❌ Error starting bot:'), error.message);
    if (reconnectAttempts < MAX_RECONNECTS) {
      reconnectAttempts++;
      const waitMs = Math.min(5000 * reconnectAttempts, 30000);
      console.log(chalk.yellow(`🔄 Retrying in ${waitMs / 1000}s...`));
      setTimeout(startAciiNex, waitMs);
    } else {
      process.exit(1);
    }
  }
}

// ── Global error handlers ─────────────────────────────────────────────────────
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err.message);
});
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});
process.on('SIGINT', () => {
  console.log(chalk.yellow('\n👋 Shutting down AciiNex-M...'));
  process.exit(0);
});
process.on('SIGTERM', () => {
  console.log(chalk.yellow('\n👋 Shutting down AciiNex-M...'));
  process.exit(0);
});

// ── Boot ──────────────────────────────────────────────────────────────────────
startAciiNex();

// ── Hot reload ────────────────────────────────────────────────────────────────
const file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(chalk.redBright(`🔄 Update detected: ${__filename}`));
  delete require.cache[file];
  require(file);
});
