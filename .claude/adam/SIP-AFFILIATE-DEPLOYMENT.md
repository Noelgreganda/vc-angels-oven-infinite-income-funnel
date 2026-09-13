# SIP Affiliate Program - QR Code & Signup Link

**Status:** Verified working (2026-09-13)

## The one link that works

```
https://sipai-legal.web.app/qa/
```

Firebase Hosting project `sipai-legal`. This is the affiliate signup form
trainees fill in (name, phone, email, Messenger profile, FB group membership).

`solarinstallpinoy.com` is NOT registered yet (DNS_PROBE_FINISHED_NXDOMAIN),
so nothing may point there until the domain is bought and connected to
Firebase Hosting. When that happens, add it as a custom domain in the
`sipai-legal` Firebase project and the QR below keeps working unchanged
(the QR encodes the Firebase URL directly, not the custom domain).

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

- The `/affiliates` and `/affiliate-sign-up` routes added to this Next.js app
  redirect to the Firebase form, but this app is not deployed at
  `solarinstallpinoy.com`, so they are inert until that domain exists.
