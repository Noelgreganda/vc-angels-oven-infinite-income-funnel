# SIP Affiliate Program - QR Code & Signup Link

**Status:** Fixed 2026-09-17 -- the 2026-09-13 version pointed at a URL that
does not exist. See "2026-09-17 correction" below before trusting anything
else in this file's history.

## The one link that works

```
https://solar-install-pinoy.web.app/affiliate-program
```

This is the real, live affiliate signup form trainees fill in (name, phone,
email, Messenger profile, FB group membership) -- `src/pages/affiliate/AffiliateSignup.jsx`
in the `sipai-legal` repo, routed at `/affiliate-program` (`src/App.jsx`),
served by the `solar-install-pinoy` Firebase project (the only real one --
confirmed against `firebase.json`, `.github/workflows/deploy.yml`'s
`PROJECT_ID`, and `docs/STATUS_AND_BLOCKERS.md` in that repo).

### 2026-09-17 correction

The previous version of this file and QR code pointed at
`https://sipai-legal.web.app/qa/` -- **`sipai-legal` is the GitHub repo
name, not a real Firebase Hosting site**, and there was never a `/qa/`
route anywhere in the actual app. This was live and printed for the
2026-09-17 affiliate training before being caught. Root cause: the
verification script (`make-qr.js`) only ever confirmed the QR image
*decodes back to the intended URL string* -- it never made an HTTP
request, so a URL that doesn't resolve to anything decodes back
identically to one that does. "Verified working" described the encoding
pipeline, not the destination. Fixed by pointing at the independently-
confirmed-live URL above; if outbound HTTP is available when this is
next touched, actually curl the URL before trusting it again, not just
decode the QR.

**If any printed/physical copies of the old QR code are already in
trainees' hands, they need to be told the correct link directly
(`https://solar-install-pinoy.web.app/affiliate-program`) -- fixing this
file does not fix paper already handed out.**

`solarinstallpinoy.com` is NOT registered (DNS_PROBE_FINISHED_NXDOMAIN) and
there's no plan to buy it, so the QR and every link below point straight at
the Firebase URL. Don't reintroduce a `solarinstallpinoy.com` redirect for
this project unless that decision changes.

## The QR code

File: `public/sip-affiliate-signup-qr.png` (1024x1024, error correction H)

Generated with the `qrcode` library and decoded back with `jsqr` to confirm
it encodes exactly `https://solar-install-pinoy.web.app/affiliate-program`.
Decoding only proves the image encodes this string correctly -- it does
NOT prove the URL resolves to a real page. See the 2026-09-17 correction
above.

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

## Contact email

`affiliate-invitation.html` shows `solarinstall.pinoy@gmail.com` as the
support contact (set 2026-09-13). The old `affiliate@solarinstallpinoy.com`
was dropped since that domain isn't owned. If this inbox changes, it's a
one-line edit in that file (`mailto:` link + visible text).

## Notes

- No redirect routes live in this Next.js app for this — it isn't deployed
  at any domain tied to the affiliate program, so a route here would never
  run. The Firebase URL is the canonical link; share it directly.
- The earlier React component (`affiliate-invitation-system.tsx`) has been
  deleted: it imported `qrcode.react`, a package never installed in this
  project, and lived outside `app/` so no route could render it. It was
  dead code from the moment it was written. The HTML page above is now the
  single implementation.
