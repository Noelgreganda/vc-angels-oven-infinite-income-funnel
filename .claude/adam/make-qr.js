const QRCode = require('qrcode');
const jsQR = require('jsqr');
const { PNG } = require('pngjs');
const fs = require('fs');

const URL = 'https://sipai-legal.web.app/qa/';
const OUT = process.argv[2];

(async () => {
  await QRCode.toFile(OUT, URL, {
    width: 1024,
    margin: 4,
    errorCorrectionLevel: 'H',
    color: { dark: '#000000', light: '#ffffff' },
  });

  const png = PNG.sync.read(fs.readFileSync(OUT));
  const decoded = jsQR(new Uint8ClampedArray(png.data), png.width, png.height);

  if (!decoded) throw new Error('DECODE FAILED: QR image could not be read back');
  if (decoded.data !== URL) throw new Error(`MISMATCH: decoded "${decoded.data}" != "${URL}"`);

  console.log('Generated:', OUT, `${png.width}x${png.height}`);
  console.log('Decoded back as:', decoded.data);
  console.log('VERIFIED: QR encodes exactly', URL);
})().catch((e) => { console.error(e.message); process.exit(1); });
