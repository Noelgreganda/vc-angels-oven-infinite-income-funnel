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
- `affiliate-invitation.html` in this folder is a hostable landing page
  that renders the same QR plus the requirements list

## Notes

- No redirect routes live in this Next.js app for this — it isn't deployed
  at any domain tied to the affiliate program, so a route here would never
  run. The Firebase URL is the canonical link; share it directly.
