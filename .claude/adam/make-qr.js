const QRCode = require('qrcode');
const jsQR = require('jsqr');
const { PNG } = require('pngjs');
const fs = require('fs');

// FIX (2026-09-17): was 'https://sipai-legal.web.app/qa/' -- 'sipai-legal'
// is the GitHub repo name, not a real Firebase Hosting site. No such site
// exists in this project's firebase.json/.firebaserc (no multi-site
// config anywhere), and there is no '/qa/' route in sipai-legal's actual
// React app (src/App.jsx only defines '/affiliate-program' and
// '/assessor'). The only real, confirmed-live Firebase project is
// solar-install-pinoy (STATUS_AND_BLOCKERS.md, deploy.yml's PROJECT_ID),
// and the only real affiliate-signup route is /affiliate-program.
// The decode check below only ever verified the QR encodes this exact
// string -- it has never made an HTTP request, so it could not have
// caught this: a URL that doesn't resolve to anything decodes back fine.
const URL = 'https://solar-install-pinoy.web.app/affiliate-program';
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
