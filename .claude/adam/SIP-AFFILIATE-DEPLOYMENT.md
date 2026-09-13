# SIP Affiliate Program - QR Code & Signup Link

**Status:** Verified working (2026-09-13)

## The one link that works

```
https://sipai-legal.web.app/qa/
```

Firebase Hosting project `sipai-legal`. This is the affiliate signup form
trainees fill in (name, phone, email, Messenger profile, FB group membership).

`solarinstallpinoy.com` is NOT registered (DNS_PROBE_FINISHED_NXDOMAIN) and
there's no plan to buy it, so the QR and every link below point straight at
the Firebase URL. Don't reintroduce a `solarinstallpinoy.com` redirect for
this project unless that decision changes.

## The QR code

File: `public/sip-affiliate-signup-qr.png` (1024x1024, error correction H)

Generated with the `qrcode` library and decoded back with `jsqr` to confirm
it encodes exactly `https://sipai-legal.web.app/qa/`.

Regenerate/verify (from the repo root; `qrcode`, `jsqr`, `pngjs` are devDependencies):
```
npm install
node .claude/adam/make-qr.js public/sip-affiliate-signup-qr.png
```
The script exits non-zero if the image cannot be decoded or decodes to a different URL.

## Distribution

- Print the PNG on flyers / training slides
- Share the link directly in Messenger / FB group
- `affiliate-invitation.html` in this folder is a standalone landing page —
  the QR image is embedded in it as a base64 data URI (byte-identical to
  `public/sip-affiliate-signup-qr.png`, checked by script, not by eye), so
  it has zero external dependencies: no CDN script, no client-side QR
  library, nothing that can silently fail or drift out of sync with the
  verified PNG. Open it in a browser or host it anywhere as a single file.

## Outstanding: contact email

`affiliate-invitation.html` has a placeholder — `[SET REAL CONTACT EMAIL -
solarinstallpinoy.com is not owned]` — where a support email used to be.
The old one (`affiliate@solarinstallpinoy.com`) is dead since that domain
isn't owned. Replace the placeholder with a real inbox before distributing
this page.

## Notes

- No redirect routes live in this Next.js app for this — it isn't deployed
  at any domain tied to the affiliate program, so a route here would never
  run. The Firebase URL is the canonical link; share it directly.
- The earlier React component (`affiliate-invitation-system.tsx`) has been
  deleted: it imported `qrcode.react`, a package never installed in this
  project, and lived outside `app/` so no route could render it. It was
  dead code from the moment it was written. The HTML page above is now the
  single implementation.
