import { NextResponse } from 'next/server';

export default function NotFound() {
  return (
    <html>
      <head>
        <title>404 - Page Not Found</title>
      </head>
      <body>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Inter, sans-serif',
          backgroundColor: '#FFFDF9'
        }}>
          <h1 style={{ fontSize: '6rem', fontWeight: 'bold', color: '#111111', margin: 0 }}>404</h1>
          <p style={{ fontSize: '1.5rem', color: '#6B7280', marginTop: '1rem' }}>Page not found</p>
          <a
            href="/"
            style={{
              marginTop: '2rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#2EE6A6',
              color: '#111111',
              borderRadius: '0.75rem',
              textDecoration: 'none',
              fontWeight: '600'
            }}
          >
            Go Home
          </a>
        </div>
      </body>
    </html>
  );
}