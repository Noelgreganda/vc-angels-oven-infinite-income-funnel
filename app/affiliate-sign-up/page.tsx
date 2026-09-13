'use client';

import { useEffect } from 'react';

export default function AffiliateSignUpPage() {
  useEffect(() => {
    // Redirect to Firebase affiliate form
    window.location.href = 'https://sipai-legal.web.app/qa/';
  }, []);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#0f172a',
      color: '#ffffff',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1>Redirecting to affiliate signup...</h1>
        <p>If you&apos;re not redirected automatically, <a href="https://sipai-legal.web.app/qa/" style={{ color: '#60a5fa' }}>click here</a></p>
      </div>
    </div>
  );
}
