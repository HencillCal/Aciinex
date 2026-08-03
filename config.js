/**
 * config.js — compatibility shim for GAAJU commands
 * GAAJU commands do: require('../config') or require('./config')
 */
require('dotenv').config();

global.APIs = {
  xteam:    'https://api.xteam.xyz',
  dzx:      'https://api.dhamzxploit.my.id',
  lol:      'https://api.lolhuman.xyz',
  violetics: 'https://violetics.pw',
  neoxr:    'https://api.neoxr.my.id',
  zenzapis: 'https://zenzapis.xyz',
  akuari:   'https://api.akuari.my.id',
  nrtm:     'https://fg-nrtm.ddns.net',
};

global.APIKeys = {
  'https://api.xteam.xyz':       'd90a9e986e18778b',
  'https://api.lolhuman.xyz':    '85faf717d0545d14074659ad',
  'https://api.neoxr.my.id':     'yourkey',
  'https://violetics.pw':        'beta',
  'https://zenzapis.xyz':        'yourkey',
  'https://api-fgmods.ddns.net': 'fg-dylux',
};

module.exports = {
  WARN_COUNT: 3,
  APIs:       global.APIs,
  APIKeys:    global.APIKeys,
};
