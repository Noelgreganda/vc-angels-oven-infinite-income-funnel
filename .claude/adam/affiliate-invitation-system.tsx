/**
 * Solar Install Pinoy - Affiliate Invitation System
 * Generates proper QR codes with correct URLs (no placeholders)
 * Can be deployed standalone or integrated into Next.js app
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode.react';

interface AffiliateConfig {
  domain: string;
  affiliatePath: string;
  companyName: string;
  description: string;
  contactEmail: string;
}

const AFFILIATE_CONFIG: AffiliateConfig = {
  domain: 'https://solarinstallpinoy.com',
  affiliatePath: '/affiliate-sign-up',
  companyName: 'Solar Install Pinoy',
  description: 'Join Our Affiliate Program',
  contactEmail: 'affiliate@solarinstallpinoy.com',
};

export default function AffiliateInvitation() {
  const [affiliateUrl, setAffiliateUrl] = useState('');
  const qrRef = useRef<any>(null);

  useEffect(() => {
    // Construct proper URL without placeholders
    const fullUrl = `${AFFILIATE_CONFIG.domain}${AFFILIATE_CONFIG.affiliatePath}`;
    setAffiliateUrl(fullUrl);
  }, []);

  const downloadQRCode = () => {
    if (qrRef.current) {
      const canvas = qrRef.current.querySelector('canvas');
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${AFFILIATE_CONFIG.companyName}-affiliate-qr.png`;
      link.href = url;
      link.click();
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(affiliateUrl);
      alert('Affiliate link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <p className="text-sm text-blue-400">Thought for 6s</p>
          <h1 className="text-4xl font-bold">{AFFILIATE_CONFIG.description}</h1>
        </div>

        {/* QR Code Section */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 space-y-6">
          <div className="flex flex-col items-center space-y-4">
            {/* QR Code Container */}
            <div
              ref={qrRef}
              className="bg-white p-4 rounded-lg shadow-lg"
            >
              {affiliateUrl && (
                <QRCode
                  value={affiliateUrl}
                  size={256}
                  level="H"
                  includeMargin={true}
                  renderAs="canvas"
                />
              )}
            </div>

            {/* Description */}
            <p className="text-center text-slate-300">
              Scan to sign up as a {AFFILIATE_CONFIG.companyName} affiliate
            </p>

            {/* Download Button */}
            <button
              onClick={downloadQRCode}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors flex items-center gap-2"
            >
              <span>⬇</span> Download QR Code
            </button>
          </div>
        </div>

        {/* Requirements Section */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 space-y-4">
          <h2 className="text-xl font-semibold">What you need to sign up:</h2>
          <ul className="space-y-2 text-slate-300">
            <li className="flex items-start gap-3">
              <span className="text-blue-400 mt-1">•</span>
              <span>Full name</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-400 mt-1">•</span>
              <span>Phone number</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-400 mt-1">•</span>
              <span>Email address</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-400 mt-1">•</span>
              <span>Messenger profile link</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-400 mt-1">•</span>
              <span>Facebook group membership</span>
            </li>
          </ul>
        </div>

        {/* Direct Link Section */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 space-y-4">
          <h2 className="text-lg font-semibold">Or use this link:</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={affiliateUrl}
              readOnly
              className="flex-1 bg-slate-700 text-white px-4 py-2 rounded-lg font-mono text-sm"
            />
            <button
              onClick={copyToClipboard}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              title="Copy to clipboard"
            >
              📋
            </button>
          </div>
        </div>

        {/* Action Section */}
        <div className="text-center space-y-4">
          <p className="text-lg font-semibold">Ready to train affiliates! 🚀</p>
          <p className="text-slate-400">You can now:</p>
          <ul className="space-y-2 text-slate-300 text-sm">
            <li>✓ Print this page to share with potential affiliates</li>
            <li>✓ Download the QR code as a PNG image</li>
            <li>✓ Copy the affiliate link to share digitally</li>
            <li>✓ Display on your website or marketing materials</li>
          </ul>
        </div>

        {/* Contact Section */}
        <div className="text-center text-slate-400 text-sm border-t border-slate-700 pt-6">
          <p>Questions? Email: <span className="text-blue-400">{AFFILIATE_CONFIG.contactEmail}</span></p>
        </div>
      </div>
    </div>
  );
}

/**
 * Configuration Notes:
 *
 * 1. DOMAIN: Set to actual domain (no ~~ placeholders)
 * 2. AFFILIATE_PATH: The signup route
 * 3. EMAIL: Contact for affiliate inquiries
 *
 * To use in Next.js:
 * - Import this component in a page
 * - Install: npm install qrcode.react
 *
 * To deploy:
 * - Add to app/affiliate/page.tsx or pages/affiliate.tsx
 * - Ensure domain config matches your actual domain
 * - Test QR code scans to verify URL
 */
