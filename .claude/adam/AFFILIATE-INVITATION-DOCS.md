# Solar Install Pinoy - Affiliate Invitation System

## 🎯 Issue Fixed

**Problem:** Affiliate invitation QR code was displaying with `~~` placeholder instead of actual domain  
**Cause:** URL template not properly populated with domain value  
**Solution:** Rebuilt system with hardcoded correct domain - no placeholders

---

## ✅ What's Included

### 1. **Standalone HTML Version** (`affiliate-invitation.html`)
- **Use Case:** Deploy directly to any web server, share with trainees immediately
- **Features:**
  - Self-contained (no dependencies except QRCode.js from CDN)
  - Full QR code generation
  - Copy-to-clipboard functionality
  - Download QR code as PNG
  - Print-friendly design
  - Mobile responsive

**Quick Deploy:**
```bash
# Copy file to your web server
cp affiliate-invitation.html /path/to/solarinstallpinoy.com/affiliate

# Access at: https://solarinstallpinoy.com/affiliate/affiliate-invitation.html
```

### 2. **React/Next.js Component** (`affiliate-invitation-system.tsx`)
- **Use Case:** Integrate into SIP Next.js application
- **Features:**
  - TypeScript support
  - Tailwind CSS styling
  - QRCode.react library
  - Production-ready

**Installation:**
```bash
npm install qrcode.react

# Add to your app/affiliate/page.tsx or pages/affiliate.tsx
import AffiliateInvitation from '@/.claude/adam/affiliate-invitation-system'

export default function AffiliatePage() {
  return <AffiliateInvitation />
}
```

---

## 🔧 Configuration

### Current Settings
```
Domain: https://solarinstallpinoy.com
Path: /affiliate-sign-up
Full URL: https://solarinstallpinoy.com/affiliate-sign-up
Contact: affiliate@solarinstallpinoy.com
Company: Solar Install Pinoy
```

### To Modify
Edit the `AFFILIATE_CONFIG` object in either file:

**HTML Version:**
```javascript
// Line 37 in affiliate-invitation.html
const CONFIG = {
    domain: 'https://solarinstallpinoy.com',
    path: '/affiliate-sign-up',
    email: 'affiliate@solarinstallpinoy.com'
};
```

**React Version:**
```typescript
// Lines 11-18 in affiliate-invitation-system.tsx
const AFFILIATE_CONFIG: AffiliateConfig = {
  domain: 'https://solarinstallpinoy.com',
  affiliatePath: '/affiliate-sign-up',
  // ... other config
};
```

---

## 📋 Features

✅ **Correct URL** - No `~~` placeholders  
✅ **QR Code Generation** - Dynamic, linkable  
✅ **Download QR** - Save as PNG image  
✅ **Copy Link** - One-click copy to clipboard  
✅ **Print-Friendly** - Optimized for printing  
✅ **Mobile Responsive** - Works on all devices  
✅ **Accessibility** - Proper semantic HTML  
✅ **No Dependencies (HTML)** - Only CDN QRCode.js  

---

## 🚀 Deployment Options

### Option 1: Direct HTML Deploy (Fastest)
```bash
# Upload affiliate-invitation.html to your server
# Access at: https://solarinstallpinoy.com/affiliate/invitation.html
# Share link with trainees immediately
```

### Option 2: Integrate into Next.js SIP App
```bash
1. Copy affiliate-invitation-system.tsx to your app
2. npm install qrcode.react
3. Create app/affiliate/page.tsx
4. Import and use the component
5. Deploy as part of your app
```

### Option 3: Host Both
- HTML version for quick sharing and printing
- React version for website integration

---

## ✨ What Trainees Will See

1. **Page Title:** "Join Our Affiliate Program"
2. **QR Code:** Scannable, links to `https://solarinstallpinoy.com/affiliate-sign-up`
3. **Direct Link:** Copyable affiliate URL
4. **Requirements List:** What info they need to provide
5. **Download Option:** QR code as PNG
6. **Contact Info:** affiliate@solarinstallpinoy.com

---

## 🧪 Testing

### Test QR Code
1. Open `affiliate-invitation.html` in browser
2. Scan QR code with phone
3. Verify it navigates to `https://solarinstallpinoy.com/affiliate-sign-up`
4. Test copy-to-clipboard functionality
5. Test QR download

### Test React Component
1. Integrate into your app
2. Navigate to affiliate page
3. Verify QR code displays correctly
4. Test all interactive features

---

## 📱 How Trainees Use It

1. **Scan QR Code** - Phone camera reads QR
2. **Opens Signup Link** - Navigates to affiliate signup form
3. **Fill Form** - Enters required info
4. **Becomes Affiliate** - Completes registration

### Signup Requirements Collected
- Full name
- Phone number
- Email address
- Messenger profile link
- Facebook group membership

---

## 🔐 Security Notes

- ✅ No sensitive data in QR code (just URL)
- ✅ HTTPS only (secure link)
- ✅ No hardcoded credentials
- ✅ Email contact for support

---

## 📊 Usage Analytics

To track affiliate signups, add tracking to the signup form:
- Track QR code scans
- Monitor affiliate signups
- A/B test different messaging
- Measure training effectiveness

---

## ✉️ Support & Troubleshooting

**QR Code not scanning?**
- Ensure device has good lighting
- Try different QR scanner app
- Test direct URL: `https://solarinstallpinoy.com/affiliate-sign-up`

**Link not working?**
- Verify domain is accessible
- Check /affiliate-sign-up route exists
- Confirm HTTPS is enabled

**Download QR Code failing?**
- Check browser permissions
- Clear browser cache
- Try different browser

**Contact:** affiliate@solarinstallpinoy.com

---

## 📝 Version History

**v1.0 - 2026-09-13**
- ✅ Fixed URL placeholder issue (removed `~~`)
- ✅ Created HTML standalone version
- ✅ Created React component version
- ✅ Added comprehensive documentation
- ✅ Production-ready for deployment

---

**Last Updated:** 2026-09-13  
**Status:** ✅ Ready for Deployment
