/**
 * lib/sticker-worker.js
 * Runs in an isolated child_process.fork() so that if sharp / wa-sticker-formatter
 * triggers a native glibc malloc crash (SIGABRT), only THIS child dies — the main
 * bot process keeps running.
 *
 * Protocol:
 *   parent → child  : JSON in process.argv[2]: { filePath, pack, author }
 *   child → parent  : process.send({ success, outPath?, error? })
 */
'use strict';
const { Sticker, StickerTypes } = require('wa-sticker-formatter');
const fs = require('fs');

async function main() {
  let args;
  try {
    args = JSON.parse(process.argv[2] || '{}');
  } catch (e) {
    process.send({ success: false, error: 'Bad args: ' + e.message });
    process.exit(1);
  }

  const { filePath, pack = 'AciiNex-M', author = 'AciiNex-M' } = args;

  if (!filePath || !fs.existsSync(filePath)) {
    process.send({ success: false, error: 'File not found: ' + filePath });
    process.exit(1);
  }

  try {
    const sticker = new Sticker(filePath, {
      pack,
      author,
      type: StickerTypes.FULL,
      categories: ['🤩', '🎉'],
      id: '12345',
      quality: 70,
      background: 'transparent',
    });
    const buffer = await sticker.toBuffer();
    const outPath = filePath + '.webp';
    fs.writeFileSync(outPath, buffer);
    process.send({ success: true, outPath });
    process.exit(0);
  } catch (e) {
    process.send({ success: false, error: e.message });
    process.exit(1);
  }
}

main();
