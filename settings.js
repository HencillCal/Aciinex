/**
 * settings.js — compatibility shim for WA commands
 * WA commands do: require('../settings')
 * This file provides the same API they expect.
 */
require('dotenv').config();

const settings = {
  packname:    process.env.STICKER_PACKNAME || 'AciiNex-M',
  author:      process.env.STICKER_AUTHOR   || 'Jinwiil Onginjo',
  botName:     process.env.BOTNAME          || 'AciiNex-M',
  botOwner:    process.env.BOT_OWNER        || 'Jinwiil Onginjo',
  timezone:    process.env.TIMEZONE         || 'Africa/Nairobi',
  prefix:      process.env.PREFIX           || '.',
  ownerNumber: process.env.DEV              || '254769365617',
  giphyApiKey: process.env.GIPHY_API_KEY    || '',
  commandMode: (process.env.MODE || 'PUBLIC').toLowerCase(),
  maxStoreMessages: 20,
  storeWriteInterval: 10000,
  description: 'AciiNex-M WhatsApp Bot with Best Commands',
  version:     '3.0.0',
  ytChannel:   process.env.YT_CHANNEL       || '',
  updateZipUrl: 'https://github.com/HencillCal/Aciinex/archive/refs/heads/main.zip',
};

global.sessionid = process.env.SESSION;
module.exports = settings;
