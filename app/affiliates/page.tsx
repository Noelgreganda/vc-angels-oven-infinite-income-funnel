'use client';

import { useEffect } from 'react';

export default function AffiliatesPage() {
  useEffect(() => {
    // Redirect directly to Firebase affiliate form
    window.location.href = 'https://sipai-legal.web.app/qa/';
  }, []);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: 'linear-gradient(to bottom right, #0f172a, #1e293b)',
      color: '#ffffff',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '20px'
    }}>
      <div style={{ textAlign: 'center', maxWidth: '500px' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '20px' }}>Join Our Affiliate Program</h1>
        <p style={{ fontSize: '16px', marginBottom: '30px', color: '#cbd5e1' }}>
          Redirecting you to the affiliate signup form...
        </p>

        <div style={{ marginBottom: '30px' }}>
          <div style={{
            width: '100px',
            height: '4px',
            backgroundColor: '#60a5fa',
            margin: '0 auto',
            borderRadius: '2px',
            animation: 'pulse 1.5s infinite'
          }}></div>
        </div>

        <p style={{ color: '#94a3b8', marginBottom: '30px' }}>
          If you&apos;re not redirected automatically, click the button below:
        </p>

        <a
          href="https://sipai-legal.web.app/qa/"
          style={{
            display: 'inline-block',
            backgroundColor: '#2563eb',
            color: 'white',
            padding: '12px 32px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: '600',
            transition: 'background-color 0.2s',
            cursor: 'pointer'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
        >
          Go to Affiliate Signup →
        </a>

        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}</style>
      </div>
    </div>
  );
}
